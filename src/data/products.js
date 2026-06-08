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

export const transformProducts = (data) =>
  data.map((rawItem, index) => {
    const item = normalizeRecord(rawItem);
    const category = item['Danh mục sản phẩm'] || 'Sản phẩm';
    const categoryParts = category.split(' > ');
    const categoryName = categoryParts.at(-1) || category;
    const topCategory = categoryParts[0] || category;
    const originalPrice = Number(item['Giá bán'] || 0);
    const salePrice = Number(item['Giá khuyến mãi'] || 0);
    const sold = Number(item['Đã Bán'] || 0);
    const rawStock = item['Tồn kho'];
    const stockValue = Number(rawStock);
    const hasKnownStock =
      rawStock !== null &&
      rawStock !== undefined &&
      rawStock !== '' &&
      Number.isFinite(stockValue);
    const stock = hasKnownStock ? Math.max(stockValue, 0) : 99;
    const stockLabel = hasKnownStock ? `Còn ${stock.toLocaleString('vi-VN')}` : 'Có sẵn';
    const displayPriceValue = salePrice && salePrice < originalPrice ? salePrice : originalPrice;
    const compareAtPriceValue = salePrice && salePrice < originalPrice ? originalPrice : 0;
    const discountPercent = compareAtPriceValue
      ? `-${Math.round(((compareAtPriceValue - displayPriceValue) / compareAtPriceValue) * 100)}%`
      : '';
    const badge = item['Thẻ sản phẩm'] || discountPercent || 'Nổi bật';
    const cleanDescription = stripHtml(item['Mô tả chi tiết'] || '');
    const variants = buildVariants(item);
    const variantLabel = buildVariantLabel(variants);
    const shortDescription = makeShortDescription(item, cleanDescription);
    const reviewCount = Math.max(8, Math.round((sold || 12) * 0.32));

    let badgeColor = 'bg-primary';
    if (badge.includes('Hot') || badge.includes('Bán chạy') || discountPercent) {
      badgeColor = 'bg-red-500';
    } else if (badge.includes('Mới')) {
      badgeColor = 'bg-teal-500';
    } else if (badge.includes('Giảm')) {
      badgeColor = 'bg-amber-500';
    } else if (badge.includes('Yêu thích')) {
      badgeColor = 'bg-rose-500';
    }

    return {
      id: `${index + 1}`,
      slug: slugify(item['Tên sản phẩm *'] || `san-pham-${index + 1}`),
      name: item['Tên sản phẩm *'] || `Sản phẩm ${index + 1}`,
      category: categoryName,
      topCategory,
      fullCategory: category,
      price: formatCurrency(displayPriceValue),
      priceValue: displayPriceValue,
      oldPrice: compareAtPriceValue ? formatCurrency(compareAtPriceValue) : '',
      oldPriceValue: compareAtPriceValue,
      badge,
      badgeColor,
      rating: buildRating(sold, index),
      reviews: reviewCount,
      sold,
      stock,
      stockLabel,
      hasKnownStock,
      img: item['Ảnh sản phẩm'] || '/dog_about.png',
      shortDescription,
      description: cleanDescription || shortDescription,
      ingredients: buildIngredients(item, item['Mô tả chi tiết'] || '', variants),
      feedingGuide: buildFeedingGuide(item['Mô tả chi tiết'] || ''),
      variants,
      variantLabel,
      defaultVariant: variantLabel ? { name: 'Phân loại', value: variantLabel } : null,
      originalPrice: originalPrice || displayPriceValue,
      salePrice: displayPriceValue,
      discountPercent,
      isOnSale: Boolean(compareAtPriceValue),
    };
  });

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

  return { categories, badges, maxPrice };
};
