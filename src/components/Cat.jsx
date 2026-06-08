import { useEffect, useState } from 'react';
import { getFeaturedProducts } from '../data/products';

const Stars = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[...Array(5)].map((_, i) => (
      <svg
        key={i}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={i < Math.floor(rating) ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={i < Math.floor(rating) ? 0 : 1.5}
        className={`h-3.5 w-3.5 ${i < Math.floor(rating) ? 'text-amber-400' : 'text-gray-300'}`}
      >
        <path
          fillRule="evenodd"
          d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005z"
          clipRule="evenodd"
        />
      </svg>
    ))}
  </div>
);

const defaultProducts = getFeaturedProducts().slice(0, 9);

const getProductsPerSlide = () => {
  if (typeof window === 'undefined') return 4;
  if (window.innerWidth < 640) return 1;
  if (window.innerWidth < 768) return 2;
  if (window.innerWidth < 1024) return 3;
  return 4;
};

export default function ProductCatSection({
  title = 'Sản phẩm nổi bật',
  products = defaultProducts,
  anchorId,
  onAddToCart,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [productsPerSlide, setProductsPerSlide] = useState(getProductsPerSlide);

  const totalSlides = Math.max(1, Math.ceil(products.length / productsPerSlide));
  const activeIndex = Math.min(currentIndex, totalSlides - 1);

  useEffect(() => {
    const handleResize = () => {
      setProductsPerSlide(getProductsPerSlide());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const slideNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const slidePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  return (
    <section id={anchorId} className="bg-white py-10 sm:py-12">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        <div className="w-full">
          <div className="mb-6 flex items-center justify-between gap-3">
            <h3 className="min-w-0 font-display text-xl font-extrabold text-secondary sm:text-2xl">{title}</h3>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={slidePrev}
                disabled={totalSlides <= 1}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-md transition-colors hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Sản phẩm trước"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
              <button
                type="button"
                onClick={slideNext}
                disabled={totalSlides <= 1}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-md transition-colors hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Sản phẩm kế tiếp"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
          </div>

          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                <div
                  key={slideIndex}
                  className="grid min-w-full gap-4 sm:gap-5"
                  style={{ gridTemplateColumns: `repeat(${productsPerSlide}, minmax(0, 1fr))` }}
                >
                  {products
                    .slice(slideIndex * productsPerSlide, (slideIndex + 1) * productsPerSlide)
                    .map((product, index) => (
                      <article
                        key={`${slideIndex}-${index}`}
                        className="group flex flex-col overflow-hidden rounded-3xl border border-gray-100/60 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                      >
                        <a href={`/?product=${product.slug}`} className="relative block aspect-square overflow-hidden bg-gray-50">
                          <img src={product.img} alt={product.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                          <span className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-bold text-white ${product.badgeColor || 'bg-red-500'}`}>
                            {product.badge}
                          </span>
                        </a>

                        <div className="flex flex-1 flex-col p-5">
                          <span className="mb-1 text-xs font-semibold uppercase tracking-wider text-primary">{product.category}</span>
                          <a href={`/?product=${product.slug}`} className="flex-1">
                            <h3 className="line-clamp-2 text-base font-bold leading-snug text-secondary transition-colors hover:text-primary">
                              {product.name}
                            </h3>
                          </a>
                          <div className="mb-3 mt-2 flex items-center gap-1.5">
                            <Stars rating={product.rating} />
                            <span className="text-xs text-muted">({product.reviews})</span>
                          </div>
                          <div className="flex flex-col gap-3">
                            <div>
                              <span className="font-display text-base font-extrabold text-red-500 sm:text-lg">{product.price}</span>
                              {product.oldPrice ? (
                                <span className="ml-2 text-xs text-muted line-through sm:text-sm">{product.oldPrice}</span>
                              ) : null}
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                type="button"
                                onClick={() => onAddToCart?.(product, { variant: product.defaultVariant })}
                                disabled={product.stock <= 0}
                                className="rounded-xl bg-primary px-3 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                Thêm
                              </button>
                              <a
                                href={`/?product=${product.slug}`}
                                className="rounded-xl border border-secondary/15 bg-white px-3 py-2.5 text-center text-sm font-bold text-secondary transition-colors hover:border-primary hover:text-primary"
                              >
                                Chi tiết
                              </a>
                            </div>
                          </div>
                        </div>
                      </article>
                    ))}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex justify-center gap-2">
            {Array.from({ length: totalSlides }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentIndex(i)}
                aria-label={`Tới slide ${i + 1}`}
                className={`h-3 rounded-full transition-all ${i === activeIndex ? 'w-8 bg-primary' : 'w-3 bg-gray-300'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
