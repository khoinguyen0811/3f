import productsData from '../../products.json';

const MOJIBAKE_PATTERN = /Ã.|Ä.|Æ.|á»|áº|â€|Â/;

const maybeDecodeVietnamese = (value) => {
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  if (!trimmed || !MOJIBAKE_PATTERN.test(trimmed)) return trimmed;

  try {
    const bytes = Uint8Array.from(trimmed, (char) => char.charCodeAt(0));
    return new TextDecoder('utf-8').decode(bytes).trim();
  } catch {
    return trimmed;
  }
};

const normalizeRecord = (item) => {
  const normalized = {};
  Object.entries(item).forEach(([rawKey, rawValue]) => {
    const key = maybeDecodeVietnamese(rawKey);
    normalized[key] = typeof rawValue === 'string' ? maybeDecodeVietnamese(rawValue) : rawValue;
  });
  return normalized;
};

const stripHtml = (value = '') =>
  value
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

const slugify = (value = '') =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const formatCurrency = (value) => (value ? `${value.toLocaleString('vi-VN')}đ` : 'Liên hệ');

const makeShortDescription = (record, cleanDescription) => {
  if (record['Mô tả ngắn']) return stripHtml(record['Mô tả ngắn']);
  const firstParagraph = cleanDescription.split('\n').find((line) => line.trim().length > 30);
  return firstParagraph || 'Sản phẩm được chọn lọc cho nhu cầu chăm sóc thú cưng hằng ngày.';
};

const isSectionHeading = (line) =>
  /^[A-ZÀ-Ỹ0-9\s/&:.-]{4,}$/.test(line) && line === line.toUpperCase();

const extractSection = (text, heading) => {
  const lines = stripHtml(text)
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  const startIndex = lines.findIndex((line) => line.toUpperCase().includes(heading));
  if (startIndex === -1) return '';

  const collected = [];
  for (let index = startIndex + 1; index < lines.length; index += 1) {
    if (isSectionHeading(lines[index])) break;
    collected.push(lines[index]);
  }

  return collected.join('\n').trim();
};

const VARIANT_IGNORE_KEYS = new Set([
  'Danh mục sản phẩm',
  'Tên sản phẩm *',
  'Mô tả ngắn',
  'Mô tả chi tiết',
  'Ảnh sản phẩm',
  'Giá bán',
  'Giá khuyến mãi',
  'Đã Bán',
  'Tồn kho',
  'Thẻ sản phẩm',
  'Cân nặng (kg)',
  'Chiều dài (cm)',
  'Chiều rộng (cm)',
  'Chiều cao (cm)',
  'Mã ID Shopee',
  'Link Gốc',
  'Mã SKU',
]);

const buildVariants = (record) =>
  Object.entries(record)
    .filter(([key, value]) => {
      if (VARIANT_IGNORE_KEYS.has(key)) return false;
      if (value === null || value === undefined || value === '') return false;
      const stringValue = String(value).trim();
      if (!stringValue || stringValue.length > 80) return false;
      return true;
    })
    .map(([key, value]) => ({ name: key, value: String(value).trim() }))
    .slice(0, 6);

const buildVariantLabel = (variants) =>
  variants.map((variant) => `${variant.name}: ${variant.value}`).join(' / ');

const buildIngredients = (record, detailText, variants) => {
  const fromSection = extractSection(detailText, 'THÔNG TIN SẢN PHẨM');
  if (fromSection) return fromSection;

  if (variants.length > 0) {
    return variants.map((variant) => `${variant.name}: ${variant.value}`).join('\n');
  }

  return `Nhóm sản phẩm: ${record['Danh mục sản phẩm'] || 'Đang cập nhật'}\nPhù hợp cho nhu cầu sử dụng hằng ngày của thú cưng.`;
};

const buildFeedingGuide = (detailText) => {
  const fromSection = extractSection(detailText, 'HƯỚNG DẪN SỬ DỤNG');
  if (fromSection) return fromSection;
  return 'Sử dụng theo nhu cầu thực tế của thú cưng, theo dõi phản ứng trong những ngày đầu và tham khảo thêm tư vấn nếu cần.';
};

const buildRating = (sold, index) => {
  const base = sold > 100 ? 4.6 : sold > 20 ? 4.4 : 4.2;
  const offset = (index % 4) * 0.1;
  return Math.min(4.9, base + offset).toFixed(1);
};

// ── Group raw rows by Shopee ID, then transform each group into 1 product ──
export const transformProducts = (data) => {
  // 1. normalize all rows first
  const normalized = data.map(normalizeRecord);

  // 2. group by Shopee ID
  const groups = {};
  const order = []; // preserve insertion order
  normalized.forEach((item, index) => {
    const shopeeId = String(item['Mã ID Shopee'] || '').trim();
    const key = shopeeId || `__solo_${index}`;
    if (!groups[key]) {
      groups[key] = [];
      order.push(key);
    }
    groups[key].push({ item, originalIndex: index });
  });

  // 3. transform each group into 1 product
  return order.map((key, groupIndex) => {
    const rows = groups[key];
    // representative row = first row (has name, description, category)
    const { item: rep, originalIndex } = rows[0];

    const category = rep['Danh mục sản phẩm'] || 'Sản phẩm';
    const categoryParts = category.split(' > ');
    const categoryName = categoryParts.at(-1) || category;
    const topCategory = categoryParts[0] || category;

    // aggregate sold & stock across all variant rows
    const totalSold = rows.reduce((s, r) => s + Number(r.item['Đã Bán'] || 0), 0);
    const totalStock = rows.reduce((s, r) => {
      const v = Number(r.item['Tồn kho']);
      return Number.isFinite(v) ? s + v : s;
    }, 0);
    const anyKnownStock = rows.some((r) => {
      const v = r.item['Tồn kho'];
      return v !== null && v !== undefined && v !== '' && Number.isFinite(Number(v));
    });
    const stock = anyKnownStock ? Math.max(totalStock, 0) : 99;
    const stockLabel = anyKnownStock ? `Còn ${stock.toLocaleString('vi-VN')}` : 'Có sẵn';

    // price: use lowest sale/display price across variants
    const prices = rows.map((r) => {
      const orig = Number(r.item['Giá bán'] || 0);
      const sale = Number(r.item['Giá khuyến mãi'] || 0);
      return sale && sale < orig ? sale : orig;
    }).filter((p) => p > 0);
    const minPrice = prices.length ? Math.min(...prices) : 0;
    const maxOrigPrice = rows.reduce((m, r) => Math.max(m, Number(r.item['Giá bán'] || 0)), 0);
    const displayPriceValue = minPrice || maxOrigPrice;
    const compareAtPriceValue = displayPriceValue < maxOrigPrice ? maxOrigPrice : 0;

    const discountPercent = compareAtPriceValue
      ? `-${Math.round(((compareAtPriceValue - displayPriceValue) / compareAtPriceValue) * 100)}%`
      : '';

    const badge = rep['Thẻ sản phẩm'] || discountPercent || 'Nổi bật';
    const cleanDescription = stripHtml(rep['Mô tả chi tiết'] || '');
    const shortDescription = makeShortDescription(rep, cleanDescription);
    const reviewCount = Math.max(8, Math.round((totalSold || 12) * 0.32));

    let badgeColor = 'bg-primary';
    if (badge.includes('Hot') || badge.includes('Bán chạy') || discountPercent) badgeColor = 'bg-red-500';
    else if (badge.includes('Mới')) badgeColor = 'bg-teal-500';
    else if (badge.includes('Giảm')) badgeColor = 'bg-amber-500';
    else if (badge.includes('Yêu thích')) badgeColor = 'bg-rose-500';

    // ── Build structured variant options ──
    // Each row's non-ignored fields with values = its option combination
    // e.g. row has {Mùi: "Sữa", Combo: "1 gói"} → option {attrs: {Mùi:"Sữa",Combo:"1 gói"}, price, stock, img}
    const variantOptions = rows.map((r) => {
      const attrs = {};
      Object.entries(r.item).forEach(([k, v]) => {
        if (VARIANT_IGNORE_KEYS.has(k)) return;
        if (v === null || v === undefined || String(v).trim() === '') return;
        if (String(v).trim().length > 80) return;
        attrs[k] = String(v).trim();
      });
      const origP = Number(r.item['Giá bán'] || 0);
      const saleP = Number(r.item['Giá khuyến mãi'] || 0);
      const vPrice = saleP && saleP < origP ? saleP : origP;
      const vOldPrice = saleP && saleP < origP ? origP : 0;
      const vStock = r.item['Tồn kho'];
      const vStockVal = Number(vStock);
      return {
        attrs,
        price: vPrice,
        priceFormatted: formatCurrency(vPrice),
        oldPrice: vOldPrice,
        oldPriceFormatted: vOldPrice ? formatCurrency(vOldPrice) : '',
        stock: Number.isFinite(vStockVal) ? Math.max(vStockVal, 0) : 99,
        img: r.item['Ảnh sản phẩm'] || rep['Ảnh sản phẩm'] || '/dog_about.png',
      };
    });

    // Collect all unique option keys and their values
    const optionKeys = [];
    const optionValues = {}; // key => Set of values
    variantOptions.forEach((vo) => {
      Object.entries(vo.attrs).forEach(([k, v]) => {
        if (!optionValues[k]) { optionKeys.push(k); optionValues[k] = new Set(); }
        optionValues[k].add(v);
      });
    });
    const variantGroups = optionKeys.map((k) => ({
      name: k,
      values: [...optionValues[k]],
    }));

    // legacy variants field (flat, first row only) for backward compat
    const legacyVariants = buildVariants(rep);
    const variantLabel = buildVariantLabel(legacyVariants);

    // all images (deduplicated across variant rows)
    const imgSet = new Set();
    variantOptions.forEach((vo) => { if (vo.img) imgSet.add(vo.img); });
    const images = [...imgSet].filter(Boolean);

    return {
      id: `${groupIndex + 1}`,
      slug: slugify(rep['Tên sản phẩm *'] || `san-pham-${groupIndex + 1}`),
      name: rep['Tên sản phẩm *'] || `Sản phẩm ${groupIndex + 1}`,
      category: categoryName,
      topCategory,
      fullCategory: category,
      price: formatCurrency(displayPriceValue),
      priceValue: displayPriceValue,
      oldPrice: compareAtPriceValue ? formatCurrency(compareAtPriceValue) : '',
      oldPriceValue: compareAtPriceValue,
      badge,
      badgeColor,
      rating: buildRating(totalSold, groupIndex),
      reviews: reviewCount,
      sold: totalSold,
      stock,
      stockLabel,
      hasKnownStock: anyKnownStock,
      img: images[0] || '/dog_about.png',
      images, // all unique images
      shortDescription,
      description: cleanDescription || shortDescription,
      ingredients: buildIngredients(rep, rep['Mô tả chi tiết'] || '', legacyVariants),
      feedingGuide: buildFeedingGuide(rep['Mô tả chi tiết'] || ''),
      // structured variants
      variantGroups,   // [{name, values[]}]
      variantOptions,  // [{attrs, price, stock, img}]
      // legacy (for backward compat with cart)
      variants: legacyVariants,
      variantLabel,
      defaultVariant: variantLabel ? { name: 'Phân loại', value: variantLabel } : null,
      originalPrice: maxOrigPrice || displayPriceValue,
      salePrice: displayPriceValue,
      discountPercent,
      isOnSale: Boolean(compareAtPriceValue),
    };
  });
};

export const products = transformProducts(productsData);

const normalizedSearch = (value) =>
  slugify(maybeDecodeVietnamese(typeof value === 'string' ? value : String(value ?? '')));

export const getAllProducts = () => products;

export const getProductsByCategory = (categoryName) => {
  const target = normalizedSearch(categoryName);
  return products.filter((product) => normalizedSearch(product.category).includes(target));
};

export const getFeaturedProducts = () => products.slice(0, 8);

export const getSaleProducts = () =>
  products.filter((product) => product.originalPrice > product.salePrice).slice(0, 12);

export const getNewProducts = () =>
  products.filter((product) => product.badge && product.badge.includes('Mới')).slice(0, 8);

export const getDogProducts = () =>
  products
    .filter(
      (product) =>
        normalizedSearch(product.category).includes('cho') ||
        normalizedSearch(product.name).includes('cho'),
    )
    .slice(0, 8);

export const getCatProducts = () =>
  products
    .filter(
      (product) =>
        normalizedSearch(product.category).includes('meo') ||
        normalizedSearch(product.name).includes('meo'),
    )
    .slice(0, 8);

export const getProductBySlug = (slug) => products.find((product) => product.slug === slug);

export const getRelatedProducts = (product, limit = 4) => {
  if (!product) return [];
  return products
    .filter(
      (item) =>
        item.slug !== product.slug &&
        normalizedSearch(item.category) === normalizedSearch(product.category),
    )
    .slice(0, limit);
};

export const getCatalogMeta = () => {
  const categories = [...new Set(products.map((product) => product.category))].sort((a, b) =>
    a.localeCompare(b, 'vi'),
  );
  const badges = [...new Set(products.map((product) => product.badge))].sort((a, b) =>
    a.localeCompare(b, 'vi'),
  );
  const maxPrice = Math.max(...products.map((product) => product.priceValue), 0);

  // Build category tree from fullCategory paths (e.g. "Chó > Thức ăn cho chó")
  const treeMap = {};
  products.forEach((product) => {
    const parts = product.fullCategory.split(' > ').map((p) => p.trim());
    if (parts.length >= 2) {
      const parent = parts[0];
      const child = parts[parts.length - 1];
      if (!treeMap[parent]) treeMap[parent] = new Set();
      treeMap[parent].add(child);
    } else {
      const leaf = parts[0];
      if (!treeMap[leaf]) treeMap[leaf] = new Set();
    }
  });

  const categoryTree = Object.entries(treeMap)
    .map(([parent, childSet]) => ({
      name: parent,
      children: [...childSet].sort((a, b) => a.localeCompare(b, 'vi')),
    }))
    .sort((a, b) => a.name.localeCompare(b.name, 'vi'));

  return { categories, badges, maxPrice, categoryTree };
};
