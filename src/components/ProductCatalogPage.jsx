import { useEffect, useMemo, useState } from 'react';
import { getAllProducts, getCatalogMeta } from '../data/products';
import ProductCard from './ProductCard';

const sortOptions = [
  { value: 'popular', label: 'Bán chạy nhất' },
  { value: 'price-asc', label: 'Giá tăng dần' },
  { value: 'price-desc', label: 'Giá giảm dần' },
  { value: 'rating', label: 'Đánh giá cao' },
  { value: 'stock', label: 'Còn hàng nhiều' },
];

const priceBands = [
  { id: 'under100', label: 'Dưới 100.000đ', min: 0, max: 100000 },
  { id: '100to300', label: '100.000đ - 300.000đ', min: 100000, max: 300000 },
  { id: '300to700', label: '300.000đ - 700.000đ', min: 300000, max: 700000 },
  { id: '700plus', label: 'Trên 700.000đ', min: 700000, max: Infinity },
];

const PRODUCTS_PER_PAGE = 9;

// ── Category tree dropdown component ────────────────────────────────────────
function CategoryTree({ tree, selectedCategories, onToggle, allProducts }) {
  const [openGroups, setOpenGroups] = useState({});

  const toggleGroup = (name) =>
    setOpenGroups((prev) => ({ ...prev, [name]: !prev[name] }));

  const countForCategory = (catName) =>
    allProducts.filter((p) => p.category === catName || p.topCategory === catName).length;

  return (
    <div className="space-y-1">
      {tree.map((group) => {
        const hasChildren = group.children.length > 0;
        const isOpen = openGroups[group.name] ?? false;
        // parent is "selected" if all its children are selected, or if it has no children and is directly selected
        const parentSelected = hasChildren
          ? group.children.every((c) => selectedCategories.includes(c))
          : selectedCategories.includes(group.name);
        const someChildSelected = hasChildren && group.children.some((c) => selectedCategories.includes(c));

        return (
          <div key={group.name}>
            {/* Parent row */}
            <div className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-gray-50">
              {hasChildren ? (
                <>
                  {/* indeterminate-style checkbox for parent */}
                  <button
                    type="button"
                    onClick={() => {
                      if (parentSelected) {
                        // deselect all children
                        group.children.forEach((c) => {
                          if (selectedCategories.includes(c)) onToggle(c);
                        });
                      } else {
                        // select all children
                        group.children.forEach((c) => {
                          if (!selectedCategories.includes(c)) onToggle(c);
                        });
                      }
                    }}
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                      parentSelected
                        ? 'border-primary bg-primary text-white'
                        : someChildSelected
                        ? 'border-primary bg-primary/20 text-primary'
                        : 'border-gray-300 bg-white'
                    }`}
                    aria-label={`Chọn tất cả ${group.name}`}
                  >
                    {parentSelected ? (
                      <svg className="h-2.5 w-2.5" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : someChildSelected ? (
                      <span className="block h-0.5 w-2.5 rounded bg-primary" />
                    ) : null}
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleGroup(group.name)}
                    className="flex flex-1 items-center justify-between text-sm font-bold text-secondary"
                  >
                    <span>{group.name}</span>
                    <svg
                      className={`h-3.5 w-3.5 text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`}
                      viewBox="0 0 20 20" fill="currentColor"
                    >
                      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                    </svg>
                  </button>
                </>
              ) : (
                <label className="flex flex-1 cursor-pointer items-center gap-2 text-sm font-bold text-secondary">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(group.name)}
                    onChange={() => onToggle(group.name)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="flex-1">{group.name}</span>
                  <span className="text-xs text-muted">{countForCategory(group.name)}</span>
                </label>
              )}
            </div>

            {/* Children rows */}
            {hasChildren && isOpen && (
              <div className="mb-1 ml-6 space-y-0.5 border-l border-gray-100 pl-3">
                {group.children.map((child) => (
                  <label key={child} className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-secondary hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(child)}
                      onChange={() => onToggle(child)}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="flex-1">{child}</span>
                    <span className="text-xs text-muted">{countForCategory(child)}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}


const parseQuery = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    q: params.get('q') || '',
    category: params.get('category') || '',
  };
};

const buildPaginationItems = (currentPage, totalPages) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const items = new Set([1, totalPages, currentPage, currentPage - 1, currentPage + 1]);

  if (currentPage <= 3) {
    items.add(2);
    items.add(3);
    items.add(4);
  }

  if (currentPage >= totalPages - 2) {
    items.add(totalPages - 1);
    items.add(totalPages - 2);
    items.add(totalPages - 3);
  }

  const sortedPages = [...items]
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b);

  const result = [];
  for (let index = 0; index < sortedPages.length; index += 1) {
    const page = sortedPages[index];
    const previous = sortedPages[index - 1];

    if (index > 0 && page - previous > 1) {
      result.push(`ellipsis-${previous}-${page}`);
    }

    result.push(page);
  }

  return result;
};

export default function ProductCatalogPage({ onAddToCart }) {
  const allProducts = getAllProducts();
  const meta = getCatalogMeta();
  const initial = parseQuery();

  const [query, setQuery] = useState(initial.q);
  const [selectedCategories, setSelectedCategories] = useState(initial.category ? [initial.category] : []);
  const [selectedBadges, setSelectedBadges] = useState([]);
  const [selectedPriceBands, setSelectedPriceBands] = useState([]);
  const [sortBy, setSortBy] = useState('popular');
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [showOnSaleOnly, setShowOnSaleOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const toggleValue = (value, values, setter) => {
    setter(values.includes(value) ? values.filter((item) => item !== value) : [...values, value]);
  };

  const filteredProducts = useMemo(() => {
    let items = [...allProducts];

    if (query.trim()) {
      const lowered = query.trim().toLowerCase();
      items = items.filter(
        (product) =>
          product.name.toLowerCase().includes(lowered) ||
          product.category.toLowerCase().includes(lowered) ||
          product.shortDescription.toLowerCase().includes(lowered),
      );
    }

    if (selectedCategories.length > 0) {
      items = items.filter(
        (product) =>
          selectedCategories.includes(product.category) ||
          selectedCategories.includes(product.topCategory),
      );
    }

    if (selectedBadges.length > 0) {
      items = items.filter((product) => selectedBadges.includes(product.badge));
    }

    if (selectedPriceBands.length > 0) {
      items = items.filter((product) =>
        selectedPriceBands.some((bandId) => {
          const band = priceBands.find((entry) => entry.id === bandId);
          if (!band) return true;
          return product.priceValue >= band.min && product.priceValue < band.max;
        }),
      );
    }

    if (showInStockOnly) {
      items = items.filter((product) => product.stock > 0);
    }

    if (showOnSaleOnly) {
      items = items.filter((product) => product.isOnSale);
    }

    if (minRating > 0) {
      items = items.filter((product) => Number(product.rating) >= minRating);
    }

    switch (sortBy) {
      case 'price-asc':
        items.sort((a, b) => a.priceValue - b.priceValue);
        break;
      case 'price-desc':
        items.sort((a, b) => b.priceValue - a.priceValue);
        break;
      case 'rating':
        items.sort((a, b) => Number(b.rating) - Number(a.rating));
        break;
      case 'stock':
        items.sort((a, b) => b.stock - a.stock);
        break;
      case 'popular':
      default:
        items.sort((a, b) => b.sold - a.sold);
        break;
    }

    return items;
  }, [
    allProducts,
    minRating,
    query,
    selectedBadges,
    selectedCategories,
    selectedPriceBands,
    showInStockOnly,
    showOnSaleOnly,
    sortBy,
  ]);

  const MOBILE_PAGE_SIZE = 6;
  const [mobileCount, setMobileCount] = useState(MOBILE_PAGE_SIZE);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE));
  const activePage = Math.min(currentPage, totalPages);
  const paginationItems = useMemo(
    () => buildPaginationItems(activePage, totalPages),
    [activePage, totalPages],
  );
  const paginatedProducts = useMemo(() => {
    const start = (activePage - 1) * PRODUCTS_PER_PAGE;
    return filteredProducts.slice(start, start + PRODUCTS_PER_PAGE);
  }, [activePage, filteredProducts]);

  // mobile load-more list (resets when filters change)
  const mobileProducts = useMemo(
    () => filteredProducts.slice(0, mobileCount),
    [filteredProducts, mobileCount],
  );

  // reset mobile count khi filter thay đổi
  useEffect(() => {
    setMobileCount(MOBILE_PAGE_SIZE);
  }, [filteredProducts]);

  const clearFilters = () => {
    setQuery('');
    setSelectedCategories([]);
    setSelectedBadges([]);
    setSelectedPriceBands([]);
    setSortBy('popular');
    setShowInStockOnly(false);
    setShowOnSaleOnly(false);
    setMinRating(0);
    setCurrentPage(1);
    setMobileCount(MOBILE_PAGE_SIZE);
  };

  return (
    <main className="min-h-screen bg-[#FFF9F4] pb-20 pt-[106px]">
      <div className="mx-auto max-w-[1480px] px-6">
        <section className="mb-8 rounded-[30px] bg-white px-6 py-8 shadow-[0_20px_50px_rgba(31,41,55,0.06)] lg:px-10">
          <span className="text-sm font-bold uppercase tracking-wider text-primary">Trang sản phẩm</span>
          <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <h1 className="font-display text-4xl font-extrabold text-secondary lg:text-5xl">
                Chọn sản phẩm theo nhu cầu thật của boss
              </h1>
              <p className="mt-3 text-base leading-relaxed text-muted">
                Lọc nhanh theo danh mục, giá, đánh giá, khuyến mãi và trạng thái còn hàng để tìm đúng sản phẩm phù hợp.
              </p>
            </div>
            <div className="rounded-2xl bg-[#FFF7EF] px-5 py-4 text-center">
              <div className="font-display text-3xl font-extrabold text-primary">
                {filteredProducts.length}
              </div>
              <div className="text-sm text-muted">Sản phẩm phù hợp</div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-8 lg:grid-cols-[320px_1fr]">
          <aside className="space-y-5 lg:sticky lg:top-[100px] lg:self-start lg:max-h-[calc(100svh-120px)] lg:overflow-y-auto lg:pr-1">
            <div className="rounded-[28px] bg-white p-5 shadow-[0_18px_44px_rgba(31,41,55,0.06)]">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-2xl font-extrabold text-secondary">Bộ lọc</h2>
                <button onClick={clearFilters} className="text-sm font-bold text-primary">
                  Xóa hết
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-bold uppercase tracking-wider text-secondary">
                    Tìm kiếm
                  </label>
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Tên sản phẩm, mô tả..."
                    className="w-full rounded-2xl border border-gray-200 bg-[#FFFDF9] px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
                  />
                </div>

                <div>
                  <p className="mb-3 text-sm font-bold uppercase tracking-wider text-secondary">Danh mục</p>
                  <CategoryTree
                    tree={meta.categoryTree}
                    selectedCategories={selectedCategories}
                    onToggle={(cat) => toggleValue(cat, selectedCategories, setSelectedCategories)}
                    allProducts={allProducts}
                  />
                </div>

                <div>
                  <p className="mb-3 text-sm font-bold uppercase tracking-wider text-secondary">Khoảng giá</p>
                  <div className="space-y-2">
                    {priceBands.map((band) => (
                      <label key={band.id} className="flex cursor-pointer items-center gap-3 text-sm text-secondary">
                        <input
                          type="checkbox"
                          checked={selectedPriceBands.includes(band.id)}
                          onChange={() => toggleValue(band.id, selectedPriceBands, setSelectedPriceBands)}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <span>{band.label}</span>
                      </label>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-muted">
                    Giá cao nhất hiện có: {meta.maxPrice.toLocaleString('vi-VN')}đ
                  </p>
                </div>

                <div>
                  <p className="mb-3 text-sm font-bold uppercase tracking-wider text-secondary">Trạng thái</p>
                  <div className="space-y-2">
                    <label className="flex cursor-pointer items-center gap-3 text-sm text-secondary">
                      <input
                        type="checkbox"
                        checked={showInStockOnly}
                        onChange={() => setShowInStockOnly((value) => !value)}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span>Chỉ hiện sản phẩm còn hàng</span>
                    </label>
                    <label className="flex cursor-pointer items-center gap-3 text-sm text-secondary">
                      <input
                        type="checkbox"
                        checked={showOnSaleOnly}
                        onChange={() => setShowOnSaleOnly((value) => !value)}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span>Đang khuyến mãi</span>
                    </label>
                  </div>
                </div>

                <div>
                  <p className="mb-3 text-sm font-bold uppercase tracking-wider text-secondary">Đánh giá tối thiểu</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[0, 4, 4.5, 4.8].map((value) => (
                      <button
                        key={value}
                        onClick={() => setMinRating(value)}
                        className={`rounded-2xl px-3 py-2 text-sm font-semibold transition-colors ${
                          minRating === value
                            ? 'bg-primary text-white'
                            : 'bg-[#FFF7EF] text-secondary hover:text-primary'
                        }`}
                      >
                        {value === 0 ? 'Tất cả' : `${value}+ sao`}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-3 text-sm font-bold uppercase tracking-wider text-secondary">Nhãn sản phẩm</p>
                  <div className="flex flex-wrap gap-2">
                    {meta.badges.slice(0, 8).map((badge) => (
                      <button
                        key={badge}
                        onClick={() => toggleValue(badge, selectedBadges, setSelectedBadges)}
                        className={`rounded-full px-3 py-2 text-xs font-bold transition-colors ${
                          selectedBadges.includes(badge)
                            ? 'bg-primary text-white'
                            : 'bg-[#FFF7EF] text-secondary hover:text-primary'
                        }`}
                      >
                        {badge}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <div>
            <div className="mb-5 flex flex-col gap-4 rounded-[24px] bg-white p-5 shadow-[0_18px_44px_rgba(31,41,55,0.06)] md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap gap-2">
                {selectedCategories.map((category) => (
                  <span key={category} className="rounded-full bg-primary/10 px-3 py-2 text-xs font-bold text-primary">
                    {category}
                  </span>
                ))}
                {selectedPriceBands.map((bandId) => {
                  const band = priceBands.find((item) => item.id === bandId);
                  return (
                    <span key={bandId} className="rounded-full bg-primary/10 px-3 py-2 text-xs font-bold text-primary">
                      {band?.label}
                    </span>
                  );
                })}
                {showInStockOnly ? (
                  <span className="rounded-full bg-primary/10 px-3 py-2 text-xs font-bold text-primary">Còn hàng</span>
                ) : null}
                {showOnSaleOnly ? (
                  <span className="rounded-full bg-primary/10 px-3 py-2 text-xs font-bold text-primary">Khuyến mãi</span>
                ) : null}
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-muted">Sắp xếp</span>
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                  className="rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-secondary outline-none focus:border-primary"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-5 flex items-center justify-between text-sm text-muted">
              {/* desktop: trang x/y | mobile: tổng sản phẩm */}
              <span className="hidden sm:inline">
                Trang {activePage}/{totalPages}
              </span>
              <span className="sm:hidden">
                {filteredProducts.length} sản phẩm
              </span>
              <span>
                Hiển thị {' '}
                <span className="hidden sm:inline">
                  {(activePage - 1) * PRODUCTS_PER_PAGE + 1}
                  {' - '}
                  {Math.min(activePage * PRODUCTS_PER_PAGE, filteredProducts.length)}
                  {' / '}
                </span>
                {filteredProducts.length} sản phẩm
              </span>
            </div>

            {/* ── Mobile: load-more list ── */}
            <div className="sm:hidden">
              <div className="grid grid-cols-2 gap-2.5">
                {mobileProducts.map((product) => (
                  <ProductCard key={product.slug} product={product} onAddToCart={onAddToCart} />
                ))}
              </div>

              {mobileCount < filteredProducts.length && (
                <button
                  type="button"
                  onClick={() => setMobileCount((c) => c + MOBILE_PAGE_SIZE)}
                  className="mt-5 w-full rounded-full border-2 border-primary bg-white py-3.5 text-sm font-extrabold text-primary transition-colors hover:bg-primary hover:text-white"
                >
                  Xem thêm ({Math.min(MOBILE_PAGE_SIZE, filteredProducts.length - mobileCount)} sản phẩm)
                </button>
              )}
              {mobileCount >= filteredProducts.length && filteredProducts.length > MOBILE_PAGE_SIZE && (
                <p className="mt-5 text-center text-sm text-muted">Đã hiển thị tất cả {filteredProducts.length} sản phẩm</p>
              )}
            </div>

            {/* ── Desktop: pagination ── */}
            <div className="hidden sm:block">
              <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.slug} product={product} onAddToCart={onAddToCart} />
                ))}
              </div>

              {filteredProducts.length > 0 && totalPages > 1 && (
                <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, activePage - 1))}
                    disabled={activePage === 1}
                    className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-secondary transition-colors disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Trước
                  </button>
                  {paginationItems.map((item) => {
                    if (typeof item === 'string') {
                      return (
                        <span key={item} className="flex h-10 min-w-10 items-center justify-center px-1 text-sm font-bold text-muted">
                          ...
                        </span>
                      );
                    }
                    return (
                      <button
                        key={item}
                        onClick={() => setCurrentPage(item)}
                        className={`h-10 min-w-10 rounded-full px-3 text-sm font-bold transition-colors ${
                          activePage === item ? 'bg-primary text-white' : 'bg-white text-secondary hover:text-primary'
                        }`}
                      >
                        {item}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, activePage + 1))}
                    disabled={activePage === totalPages}
                    className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-secondary transition-colors disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Sau
                  </button>
                </div>
              )}
            </div>

            {filteredProducts.length === 0 && (
              <div className="rounded-[26px] bg-white p-10 text-center shadow-[0_18px_44px_rgba(31,41,55,0.06)]">
                <h3 className="font-display text-2xl font-extrabold text-secondary">Không có sản phẩm phù hợp</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  Hãy thử bỏ bớt một vài bộ lọc hoặc tìm với từ khóa khác.
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-6 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white"
                >
                  Xóa bộ lọc
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
