import { useEffect, useRef, useMemo, useState } from 'react';
import { getRelatedProducts } from '../data/products';

const benefitRows = [
  { title: 'Giao hỏa tốc 2H', value: 'Nội thành Tp.HCM' },
  { title: 'Freeship toàn quốc', value: 'Từ hạng Gold' },
  { title: 'Voucher thăng hạng', value: 'Đến 400.000đ mỗi cấp mới' },
  { title: '1.000 điểm = 1.000đ giảm', value: 'Hoàn đến 12% giá trị đơn' },
  { title: 'Đổi trả miễn phí', value: 'Trong 7 ngày' },
  { title: '100% chính hãng', value: '200+ thương hiệu' },
];

const reviewTemplates = [
  { name: 'Minh Anh', date: '12/05/2026', title: 'Sản phẩm đúng mô tả', content: 'Đóng gói chắc tay, giao nhanh và bé dùng hợp ngay từ lần đầu.' },
  { name: 'Quốc Huy', date: '28/04/2026', title: 'Mua lại lần thứ hai', content: 'Giá ổn, date mới và shop tư vấn khá kỹ trước khi chốt đơn.' },
  { name: 'Lan Phương', date: '16/04/2026', title: 'Rất tiện khi mua online', content: 'Mô tả rõ ràng, có đủ thông tin để chọn đúng loại phù hợp cho boss.' },
];

const tabLabels = [
  { key: 'description', label: 'Mô tả' },
  { key: 'ingredients', label: 'Thành phần' },
  { key: 'feedingGuide', label: 'Hướng dẫn cho ăn' },
];

const formatTabContent = (content) =>
  content.split('\n').map((line) => line.trim()).filter(Boolean);

// Group variants by their name (key), each key => array of values
const groupVariants = (variants) => {
  const map = {};
  variants.forEach(({ name, value }) => {
    if (!map[name]) map[name] = [];
    // avoid duplicates
    if (!map[name].includes(value)) map[name].push(value);
  });
  return map;
};

export default function ProductDetailPage({ product, onAddToCart, onBuyNow }) {
  const [activeTab, setActiveTab] = useState('description');
  const [quantity, setQuantity] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState({});
  const stickyRef = useRef(null);
  const [showSticky, setShowSticky] = useState(false);

  const relatedProducts = useMemo(() => getRelatedProducts(product, 4), [product]);
  const maxQuantity = Math.max(Number(product.stock) || 1, 1);

  const variantGroups = useMemo(() => groupVariants(product.variants), [product.variants]);

  // Initialize default selections
  useEffect(() => {
    const defaults = {};
    Object.entries(variantGroups).forEach(([name, values]) => {
      defaults[name] = values[0];
    });
    setSelectedVariants(defaults);
  }, [product.slug]);

  // Build images array — main + show same image in different "views" as thumbnails
  const images = useMemo(() => {
    const base = product.img;
    // If img is a valid URL use it, pad with same image for thumbnail UX
    if (base && base.startsWith('http')) {
      return [base];
    }
    return [base || '/dog_about.png'];
  }, [product.img]);

  // Sticky bar visibility: show after user scrolls past the buy buttons
  useEffect(() => {
    const handleScroll = () => {
      if (!stickyRef.current) return;
      const rect = stickyRef.current.getBoundingClientRect();
      setShowSticky(rect.bottom < 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const reviews = useMemo(
    () => reviewTemplates.map((review, index) => ({
      ...review,
      rating: Math.max(4, Math.round(Number(product.rating) - index * 0.2)),
    })),
    [product.rating],
  );

  const tabContent = {
    description: product.description,
    ingredients: product.ingredients,
    feedingGuide: product.feedingGuide,
  };

  const buildVariantForCart = () => {
    if (Object.keys(selectedVariants).length === 0) return product.defaultVariant;
    const label = Object.entries(selectedVariants).map(([k, v]) => `${k}: ${v}`).join(' / ');
    return { name: 'Phân loại', value: label };
  };

  const handleAddToCart = () => onAddToCart?.(product, { quantity, variant: buildVariantForCart() });
  const handleBuyNow = () => onBuyNow?.(product, { quantity, variant: buildVariantForCart() });

  return (
    <main className="bg-[#FFF9F4] pb-20 pt-[106px]">
      {/* ── Sticky bottom bar (mobile + desktop) ── */}
      {showSticky && (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-100 bg-white px-4 py-3 shadow-[0_-8px_24px_rgba(0,0,0,0.10)]">
          <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-muted sm:text-sm">{product.name}</p>
              <p className="font-display text-xl font-extrabold text-primary sm:text-2xl">{product.price}</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="rounded-full border border-primary px-5 py-2.5 text-sm font-extrabold text-primary transition-colors hover:bg-primary hover:text-white disabled:opacity-50"
              >
                Thêm giỏ
              </button>
              <button
                type="button"
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="rounded-full bg-primary px-5 py-2.5 text-sm font-extrabold text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                Mua ngay
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        {/* ── Breadcrumb — truncate on mobile ── */}
        <nav className="mb-6 flex items-center gap-0 text-sm text-muted" aria-label="Breadcrumb">
          <a href="/" className="shrink-0 transition-colors hover:text-primary">Trang chủ</a>
          <span className="mx-1.5 shrink-0">/</span>
          <a href="/?view=products" className="shrink-0 transition-colors hover:text-primary">Sản phẩm</a>
          <span className="mx-1.5 shrink-0">/</span>
          <a href={`/?view=products&category=${encodeURIComponent(product.category)}`}
            className="shrink-0 transition-colors hover:text-primary max-w-[80px] truncate sm:max-w-none">
            {product.category}
          </a>
          <span className="mx-1.5 shrink-0">/</span>
          <span className="truncate text-secondary font-medium max-w-[120px] sm:max-w-[320px]">
            {product.name}
          </span>
        </nav>

        <section className="grid grid-cols-1 gap-8 rounded-[30px] bg-white p-5 shadow-[0_24px_60px_rgba(31,41,55,0.08)] sm:p-6 lg:grid-cols-[1fr_0.95fr] lg:p-10">
          {/* ── LEFT: image gallery ── */}
          <div className="flex flex-col gap-3">
            {/* Main image */}
            <div className="overflow-hidden rounded-[24px] bg-[#FFF6ED]">
              <img
                src={images[activeImg] || '/dog_about.png'}
                alt={product.name}
                className="aspect-square w-full object-cover"
                onError={(e) => { e.target.src = '/dog_about.png'; }}
              />
            </div>

            {/* Thumbnails — always show at least 1, pad with copies if only 1 image */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {(images.length === 1 ? [images[0], images[0], images[0]] : images).map((src, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveImg(0)}
                  className={`shrink-0 overflow-hidden rounded-[14px] border-2 transition-colors ${
                    activeImg === 0 && i === 0
                      ? 'border-primary'
                      : 'border-gray-100 opacity-60 hover:opacity-100'
                  }`}
                  style={{ width: 72, height: 72 }}
                >
                  <img
                    src={src}
                    alt={`${product.name} ${i + 1}`}
                    className="h-full w-full object-cover"
                    onError={(e) => { e.target.src = '/dog_about.png'; }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* ── RIGHT: product info ── */}
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-3 py-1 text-xs font-bold text-white ${product.badgeColor}`}>
                {product.badge}
              </span>
              {product.discountPercent ? (
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                  {product.discountPercent}
                </span>
              ) : null}
            </div>

            {/* Product name — smaller on mobile */}
            <h1 className="font-display text-xl font-extrabold leading-tight text-secondary sm:text-2xl lg:text-3xl xl:text-4xl">
              {product.name}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-secondary">{product.rating}</span>
                <span className="text-amber-500">★★★★★</span>
              </div>
              <span>{product.reviews} đánh giá</span>
              <span>{product.sold.toLocaleString('vi-VN')} đã bán</span>
              <span>{product.stockLabel}</span>
            </div>

            {/* Price */}
            <div className="mt-5 flex items-end gap-3">
              <span className="font-display text-3xl font-extrabold text-primary sm:text-4xl">{product.price}</span>
              {product.oldPrice ? (
                <span className="pb-1 text-base text-muted line-through sm:text-lg">{product.oldPrice}</span>
              ) : null}
            </div>

            <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">{product.shortDescription}</p>

            {/* Coupon */}
            <div className="mt-5 rounded-2xl border border-primary/15 bg-primary/5 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-primary">Mã giảm giá</p>
                  <p className="mt-1 text-lg font-extrabold text-secondary">PETLOVE10</p>
                </div>
                <button type="button" className="shrink-0 rounded-full bg-primary px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-primary/90">
                  Sao chép
                </button>
              </div>
            </div>

            {/* ── Variants as selectable buttons grouped by key ── */}
            {Object.keys(variantGroups).length > 0 && (
              <div className="mt-6 space-y-4">
                {Object.entries(variantGroups).map(([groupName, values]) => (
                  <div key={groupName}>
                    <p className="mb-2 text-sm font-bold text-secondary">
                      {groupName}
                      {selectedVariants[groupName] ? (
                        <span className="ml-2 font-normal text-primary">{selectedVariants[groupName]}</span>
                      ) : null}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {values.map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setSelectedVariants((prev) => ({ ...prev, [groupName]: val }))}
                          className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors ${
                            selectedVariants[groupName] === val
                              ? 'border-primary bg-primary text-white'
                              : 'border-gray-200 bg-white text-secondary hover:border-primary hover:text-primary'
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quantity */}
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <span className="text-sm font-bold uppercase tracking-wider text-secondary">Số lượng</span>
              <div className="flex items-center rounded-full border border-gray-200 bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity((v) => Math.max(1, v - 1))}
                  disabled={quantity <= 1}
                  className="flex h-11 w-11 items-center justify-center text-lg font-bold text-secondary disabled:cursor-not-allowed disabled:opacity-35"
                  aria-label="Giảm số lượng"
                >−</button>
                <span className="min-w-10 text-center text-sm font-extrabold text-secondary">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((v) => Math.min(maxQuantity, v + 1))}
                  disabled={quantity >= maxQuantity}
                  className="flex h-11 w-11 items-center justify-center text-lg font-bold text-secondary disabled:cursor-not-allowed disabled:opacity-35"
                  aria-label="Tăng số lượng"
                >+</button>
              </div>
            </div>

            {/* CTA buttons — ref cho sticky */}
            <div ref={stickyRef} className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="inline-flex flex-1 items-center justify-center rounded-full bg-primary px-8 py-4 text-sm font-extrabold text-white shadow-[0_8px_20px_rgba(240,90,40,0.28)] transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Mua ngay
              </button>
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="inline-flex flex-1 items-center justify-center rounded-full border border-secondary/20 bg-white px-8 py-4 text-sm font-extrabold text-secondary transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                Thêm vào giỏ
              </button>
            </div>

            {/* Benefits table */}
            <div className="mt-8 overflow-hidden rounded-[24px] border border-gray-100">
              {benefitRows.map((row) => (
                <div key={row.title} className="grid grid-cols-[1.1fr_0.9fr] border-b border-gray-100 bg-white px-4 py-3 last:border-b-0 sm:px-5 sm:py-4">
                  <span className="text-sm font-semibold text-secondary sm:text-base">{row.title}</span>
                  <span className="text-right text-sm text-muted sm:text-base">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Tabs: description / ingredients / guide ── */}
        <section className="mt-8 rounded-[30px] bg-white p-5 shadow-[0_20px_50px_rgba(31,41,55,0.06)] sm:p-8">
          <div className="flex flex-wrap gap-2 border-b border-gray-100 pb-4">
            {tabLabels.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                  activeTab === tab.key ? 'bg-primary text-white' : 'bg-[#FFF7EF] text-secondary hover:text-primary'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="mt-5 space-y-3 text-sm leading-7 text-muted">
            {formatTabContent(tabContent[activeTab]).map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        </section>

        {/* ── Reviews ── */}
        <section className="mt-8 rounded-[30px] bg-white p-5 shadow-[0_20px_50px_rgba(31,41,55,0.06)] sm:p-8">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-display text-2xl font-extrabold text-secondary sm:text-3xl">Đánh giá sản phẩm</h2>
              <p className="mt-1 text-sm text-muted">{product.reviews} đánh giá · {product.rating}/5 sao</p>
            </div>
            <div className="rounded-2xl bg-[#FFF7EF] px-5 py-4 text-center">
              <div className="font-display text-3xl font-extrabold text-primary">{product.rating}</div>
              <div className="text-sm text-muted">Điểm trung bình</div>
            </div>
          </div>
          <div className="space-y-4">
            {reviews.map((review) => (
              <article key={`${review.name}-${review.date}`} className="rounded-[22px] border border-gray-100 bg-[#FFFCF8] p-5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-bold text-secondary">{review.name}</h3>
                    <p className="text-xs text-muted">{review.date}</p>
                  </div>
                  <div className="text-amber-500">{'★'.repeat(review.rating)}</div>
                </div>
                <h4 className="mt-3 font-display text-lg font-extrabold text-secondary">{review.title}</h4>
                <p className="mt-2 text-sm leading-7 text-muted">{review.content}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ── Related products ── */}
        {relatedProducts.length > 0 && (
          <section className="mt-8 mb-24">
            <div className="mb-5">
              <span className="text-sm font-bold uppercase tracking-wider text-primary">Liên quan</span>
              <h2 className="mt-1 font-display text-2xl font-extrabold text-secondary sm:text-3xl">Sản phẩm liên quan</h2>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {relatedProducts.map((item) => (
                <a
                  key={item.slug}
                  href={`/?product=${item.slug}`}
                  className="group overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                >
                  <div className="aspect-square overflow-hidden bg-gray-50">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => { e.target.src = '/dog_about.png'; }}
                    />
                  </div>
                  <div className="p-4">
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary">{item.category}</span>
                    <h3 className="mt-1 line-clamp-2 font-display text-base font-extrabold text-secondary sm:text-lg">{item.name}</h3>
                    <div className="mt-2 flex items-center gap-1.5 text-sm text-muted">
                      <span>{item.rating}</span>
                      <span className="text-amber-500">★★★★★</span>
                    </div>
                    <div className="mt-3 font-display text-lg font-extrabold text-primary sm:text-xl">{item.price}</div>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
