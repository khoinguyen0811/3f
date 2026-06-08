// Shared compact product card — dùng cho mobile grid trang chủ, related products, v.v.
const Stars = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[...Array(5)].map((_, i) => (
      <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
        fill={i < Math.floor(rating) ? 'currentColor' : 'none'}
        stroke="currentColor" strokeWidth={i < Math.floor(rating) ? 0 : 1.5}
        className={`h-3 w-3 ${i < Math.floor(rating) ? 'text-amber-400' : 'text-gray-300'}`}>
        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005z" clipRule="evenodd" />
      </svg>
    ))}
  </div>
);

export default function ProductCard({ product, onAddToCart }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100/60 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <a href={`/?product=${product.slug}`} className="relative block overflow-hidden bg-gray-50" style={{ aspectRatio: '1' }}>
        <img
          src={product.img}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => { e.target.src = '/dog_about.png'; }}
        />
        <span className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-bold text-white ${product.badgeColor || 'bg-red-500'}`}>
          {product.badge}
        </span>
        {product.discountPercent ? (
          <span className="absolute right-2 top-2 rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-primary">
            {product.discountPercent}
          </span>
        ) : null}
      </a>

      <div className="flex flex-1 flex-col p-2.5">
        <span className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-primary">{product.category}</span>

        <a href={`/?product=${product.slug}`} className="flex-1">
          <h3 className="text-xs font-bold leading-snug text-secondary transition-colors hover:text-primary">
            {product.name}
          </h3>
        </a>

        <div className="mt-1 flex items-center gap-1">
          <Stars rating={product.rating} />
          <span className="text-[10px] text-muted">({product.reviews})</span>
        </div>

        <div className="mt-1.5">
          <span className="text-sm font-extrabold text-red-500">{product.price}</span>
          {product.oldPrice ? (
            <span className="ml-1 text-[10px] text-muted line-through">{product.oldPrice}</span>
          ) : null}
        </div>

        <div className="mt-2 grid grid-cols-2 gap-1.5">
          <button
            type="button"
            onClick={() => onAddToCart?.(product, { variant: product.defaultVariant })}
            disabled={product.stock != null && product.stock <= 0}
            className="rounded-lg bg-primary py-2 text-[11px] font-bold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Thêm
          </button>
          <a
            href={`/?product=${product.slug}`}
            className="rounded-lg border border-secondary/15 py-2 text-center text-[11px] font-bold text-secondary transition-colors hover:border-primary hover:text-primary"
          >
            Chi tiết
          </a>
        </div>
      </div>
    </article>
  );
}
