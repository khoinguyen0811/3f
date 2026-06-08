import { useMemo, useState } from 'react';
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
  {
    name: 'Minh Anh',
    date: '12/05/2026',
    title: 'Sản phẩm đúng mô tả',
    content: 'Đóng gói chắc tay, giao nhanh và bé dùng hợp ngay từ lần đầu.',
  },
  {
    name: 'Quốc Huy',
    date: '28/04/2026',
    title: 'Mua lại lần thứ hai',
    content: 'Giá ổn, date mới và shop tư vấn khá kỹ trước khi chốt đơn.',
  },
  {
    name: 'Lan Phương',
    date: '16/04/2026',
    title: 'Rất tiện khi mua online',
    content: 'Mô tả rõ ràng, có đủ thông tin để chọn đúng loại phù hợp cho boss.',
  },
];

const tabLabels = [
  { key: 'description', label: 'Mô tả' },
  { key: 'ingredients', label: 'Thành phần' },
  { key: 'feedingGuide', label: 'Hướng dẫn cho ăn' },
];

const formatTabContent = (content) =>
  content
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

export default function ProductDetailPage({ product, onAddToCart, onBuyNow }) {
  const [activeTab, setActiveTab] = useState('description');
  const [quantity, setQuantity] = useState(1);
  const relatedProducts = useMemo(() => getRelatedProducts(product, 4), [product]);
  const maxQuantity = Math.max(Number(product.stock) || 1, 1);

  const reviews = useMemo(
    () =>
      reviewTemplates.map((review, index) => ({
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

  const handleAddToCart = () => {
    onAddToCart?.(product, { quantity, variant: product.defaultVariant });
  };

  const handleBuyNow = () => {
    onBuyNow?.(product, { quantity, variant: product.defaultVariant });
  };

  return (
    <main className="bg-[#FFF9F4] pb-20 pt-10">
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="mb-6 text-sm text-muted">
          <a href="/" className="transition-colors hover:text-primary">Trang chủ</a>
          <span className="mx-2">/</span>
          <a href="/?view=products" className="transition-colors hover:text-primary">Sản phẩm</a>
          <span className="mx-2">/</span>
          <span>{product.category}</span>
          <span className="mx-2">/</span>
          <span className="text-secondary">{product.name}</span>
        </div>

        <section className="grid grid-cols-1 gap-10 rounded-[30px] bg-white p-6 shadow-[0_24px_60px_rgba(31,41,55,0.08)] lg:grid-cols-[1fr_0.95fr] lg:p-10">
          <div>
            <div className="overflow-hidden rounded-[28px] bg-[#FFF6ED]">
              <img src={product.img} alt={product.name} className="aspect-square w-full object-cover" />
            </div>
          </div>

          <div>
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className={`rounded-full px-3 py-1 text-xs font-bold text-white ${product.badgeColor}`}>
                {product.badge}
              </span>
              {product.discountPercent ? (
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                  {product.discountPercent}
                </span>
              ) : null}
            </div>

            <h1 className="font-display text-3xl font-extrabold leading-tight text-secondary lg:text-4xl">
              {product.name}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted">
              <div className="flex items-center gap-2">
                <span className="font-bold text-secondary">{product.rating}</span>
                <span className="text-amber-500">★★★★★</span>
              </div>
              <span>{product.reviews} đánh giá</span>
              <span>{product.sold.toLocaleString('vi-VN')} lượt đã bán</span>
              <span>{product.stockLabel}</span>
            </div>

            <div className="mt-6 flex items-end gap-3">
              <span className="font-display text-4xl font-extrabold text-primary">{product.price}</span>
              {product.oldPrice ? (
                <span className="pb-1 text-lg text-muted line-through">{product.oldPrice}</span>
              ) : null}
            </div>

            <p className="mt-6 text-base leading-relaxed text-muted">{product.shortDescription}</p>

            <div className="mt-6 rounded-2xl border border-primary/15 bg-primary/5 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-primary">Mã giảm giá có thể áp dụng</p>
                  <p className="mt-1 text-lg font-extrabold text-secondary">PETLOVE10</p>
                </div>
                <button type="button" className="rounded-full bg-primary px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-primary/90">
                  Sao chép mã
                </button>
              </div>
            </div>

            {product.variants.length > 0 && (
              <div className="mt-8">
                <p className="mb-3 text-sm font-bold uppercase tracking-wider text-secondary">Phân loại</p>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map((variant) => (
                    <span
                      key={`${variant.name}-${variant.value}`}
                      className="rounded-full border border-primary bg-primary/5 px-4 py-2 text-sm font-semibold text-secondary"
                    >
                      {variant.name}: {variant.value}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <span className="text-sm font-bold uppercase tracking-wider text-secondary">Số lượng</span>
              <div className="flex items-center rounded-full border border-gray-200 bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                  disabled={quantity <= 1}
                  className="flex h-11 w-11 items-center justify-center text-lg font-bold text-secondary disabled:cursor-not-allowed disabled:opacity-35"
                  aria-label="Giảm số lượng"
                >
                  -
                </button>
                <span className="min-w-10 text-center text-sm font-extrabold text-secondary">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((value) => Math.min(maxQuantity, value + 1))}
                  disabled={quantity >= maxQuantity}
                  className="flex h-11 w-11 items-center justify-center text-lg font-bold text-secondary disabled:cursor-not-allowed disabled:opacity-35"
                  aria-label="Tăng số lượng"
                >
                  +
                </button>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-4 text-sm font-extrabold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Mua ngay
              </button>
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="inline-flex items-center justify-center rounded-full border border-secondary/15 bg-white px-8 py-4 text-sm font-extrabold text-secondary transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                Thêm vào giỏ hàng
              </button>
              <button type="button" className="inline-flex items-center justify-center rounded-full border border-secondary/15 bg-white px-5 py-4 text-sm font-extrabold text-secondary transition-colors hover:border-primary hover:text-primary">
                Yêu thích
              </button>
            </div>

            <div className="mt-8 overflow-hidden rounded-[24px] border border-gray-100">
              {benefitRows.map((row) => (
                <div key={row.title} className="grid grid-cols-[1.1fr_0.9fr] border-b border-gray-100 bg-white px-5 py-4 last:border-b-0">
                  <span className="font-semibold text-secondary">{row.title}</span>
                  <span className="text-right text-muted">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-[30px] bg-white p-6 shadow-[0_20px_50px_rgba(31,41,55,0.06)] lg:p-8">
          <div className="flex flex-wrap gap-3 border-b border-gray-100 pb-4">
            {tabLabels.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`rounded-full px-5 py-2.5 text-sm font-bold transition-colors ${
                  activeTab === tab.key
                    ? 'bg-primary text-white'
                    : 'bg-[#FFF7EF] text-secondary hover:text-primary'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="mt-6 space-y-4 text-sm leading-7 text-muted">
            {formatTabContent(tabContent[activeTab]).map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-[30px] bg-white p-6 shadow-[0_20px_50px_rgba(31,41,55,0.06)] lg:p-8">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-display text-3xl font-extrabold text-secondary">Đánh giá sản phẩm</h2>
              <p className="mt-2 text-sm text-muted">
                {product.reviews} đánh giá với điểm trung bình {product.rating}/5
              </p>
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
                <h4 className="mt-3 font-display text-xl font-extrabold text-secondary">{review.title}</h4>
                <p className="mt-2 text-sm leading-7 text-muted">{review.content}</p>
              </article>
            ))}
          </div>
        </section>

        {relatedProducts.length > 0 && (
          <section className="mt-10">
            <div className="mb-6">
              <span className="text-sm font-bold uppercase tracking-wider text-primary">Liên quan</span>
              <h2 className="mt-2 font-display text-3xl font-extrabold text-secondary">Sản phẩm liên quan</h2>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {relatedProducts.map((item) => (
                <a
                  key={item.slug}
                  href={`/?product=${item.slug}`}
                  className="group overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                >
                  <div className="aspect-square overflow-hidden bg-gray-50">
                    <img src={item.img} alt={item.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary">{item.category}</span>
                    <h3 className="mt-2 line-clamp-2 font-display text-lg font-extrabold text-secondary">{item.name}</h3>
                    <div className="mt-3 flex items-center gap-2 text-sm text-muted">
                      <span>{item.rating}</span>
                      <span className="text-amber-500">★★★★★</span>
                    </div>
                    <div className="mt-4 font-display text-xl font-extrabold text-primary">{item.price}</div>
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
