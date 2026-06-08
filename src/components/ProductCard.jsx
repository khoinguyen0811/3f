// Shared compact product card — dùng cho mobile grid trang chủ, related products, v.v.
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
        <span className="mb-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">{product.category}</span>

        <a href={`/?product=${product.slug}`} className="flex-1 text-xs font-bold leading-snug text-secondary transition-colors hover:text-primary">
          {product.name}
        </a>

        {/* Stars */}
        <div className="mt-1.5 flex items-center gap-0.5">
          {[...Array(5)].map((_, i) => (
            <svg key={i} viewBox="0 0 24 24"
              fill={i < Math.floor(Number(product.rating)) ? 'currentColor' : 'none'}
              stroke="currentColor" strokeWidth={i < Math.floor(Number(product.rating)) ? 0 : 1.5}
              className={`h-2.5 w-2.5 ${i < Math.floor(Number(product.rating)) ? 'text-amber-400' : 'text-gray-300'}`}>
              <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005z" clipRule="evenodd" />
            </svg>
          ))}
          <span className="ml-0.5 text-[10px] text-muted">({product.reviews})</span>
        </div>

        <div className="mt-2 flex items-center justify-between gap-2">
          <div>
            <span className="text-sm font-extrabold text-red-500">{product.price}</span>
            {product.oldPrice ? <span className="ml-1 text-[10px] text-muted line-through">{product.oldPrice}</span> : null}
          </div>
          <button
            type="button"
            onClick={() => onAddToCart?.(product, { variant: product.defaultVariant })}
            disabled={product.stock != null && product.stock <= 0}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Thêm vào giỏ hàng"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l2.2 11.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 2-1.5L21 7H6" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 20.5a.7.7 0 1 1-1.4 0 .7.7 0 0 1 1.4 0ZM18 20.5a.7.7 0 1 1-1.4 0 .7.7 0 0 1 1.4 0Z" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}
