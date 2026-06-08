import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const coupons = [
  { code: 'PETLOVE10', desc: 'Giảm 10% toàn bộ đơn hàng', color: 'bg-primary', light: 'bg-primary/8', emoji: '🎁' },
  { code: 'FREESHIP', desc: 'Freeship toàn quốc', color: 'bg-[#0796A8]', light: 'bg-[#0796A8]/8', emoji: '🚚' },
  { code: 'BOSS20', desc: 'Giảm 20% cho đơn từ 500k', color: 'bg-amber-500', light: 'bg-amber-50', emoji: '⭐' },
  { code: 'NEWPET', desc: 'Khách mới giảm 15%', color: 'bg-emerald-500', light: 'bg-emerald-50', emoji: '🐾' },
  { code: 'SUMMER30', desc: 'Deal hè giảm 30% snack', color: 'bg-rose-500', light: 'bg-rose-50', emoji: '☀️' },
  { code: 'COMBO50', desc: 'Mua combo tiết kiệm 50k', color: 'bg-violet-500', light: 'bg-violet-50', emoji: '🛍️' },
];

function CouponSlider() {
  const [copied, setCopied] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const handleCopy = (code) => {
    navigator.clipboard?.writeText(code).catch(() => {});
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  const visibleCoupons = showAll ? coupons : coupons.slice(0, 4);

  return (
    <div className="about-anim rounded-[32px] bg-gray-50 border border-gray-100 p-6 sm:p-8">
      <div className="mb-5 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5 text-primary">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
        </svg>
        <h3 className="font-display text-lg font-extrabold text-secondary sm:text-xl">Mã giảm giá dành cho bạn</h3>
      </div>

      {/* Grid: mobile 1col, desktop 2col */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {visibleCoupons.map((cur) => (
          <div
            key={cur.code}
            className={`${cur.light} relative overflow-hidden rounded-2xl p-4`}
          >
            {/* Big emoji bg */}
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 select-none text-[60px] opacity-10">
              {cur.emoji}
            </span>

            <p className="text-xs font-semibold text-muted">{cur.desc}</p>
            <p className={`mt-0.5 font-display text-xl font-black tracking-widest ${cur.color.replace('bg-', 'text-')}`}>
              {cur.code}
            </p>

            <div className="mt-3 flex items-center justify-between gap-2">
              <p className="text-[10px] text-muted">Áp dụng có điều kiện</p>
              <button
                type="button"
                onClick={() => handleCopy(cur.code)}
                className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-bold text-white transition-all active:scale-95 ${cur.color}`}
              >
                {copied === cur.code ? '✓ Đã chép!' : 'Sao chép'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile: xem thêm nếu chưa show all */}
      {!showAll && coupons.length > 4 && (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="mt-4 w-full rounded-full border-2 border-primary bg-white py-2.5 text-sm font-extrabold text-primary transition-colors hover:bg-primary hover:text-white sm:hidden"
        >
          Xem thêm ({coupons.length - 4} mã nữa)
        </button>
      )}
    </div>
  );
}

const categories = [
  { title: 'Thức ăn cho chó', desc: 'Dinh dưỡng đầy đủ, vị hấp dẫn', img: '/dog_about.png', count: '320+ sản phẩm' },
  { title: 'Thức ăn cho mèo', desc: 'Cao cấp, giàu protein tự nhiên', img: '/cat_about.png', count: '280+ sản phẩm' },
  { title: 'Phụ kiện thú cưng', desc: 'Dây xích, vòng cổ an toàn', img: '/accessory.png', count: '120+ sản phẩm' },
  { title: 'Dụng cụ vệ sinh', desc: 'Sạch sẽ, khử mùi hiệu quả', img: '/cleaning.png', count: '90+ sản phẩm' },
  { title: 'Chăm sóc sức khỏe', desc: 'Vitamin, thực phẩm chức năng', img: '/health.png', count: '60+ sản phẩm' },
  { title: 'Sản phẩm on sale', desc: 'Giảm giá hấp dẫn', img: '/onsale.png', count: '150+ sản phẩm' },
];

export default function About() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.about-anim',
        { y: 50, opacity: 0 },
        {
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
            once: true,
          },
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power3.out',
        },
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} id="categories" className="overflow-hidden bg-white py-10 lg:py-28">
      <div className="mx-auto max-w-[1500px] px-6 lg:px-16">
        <div className="about-anim mb-5  flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="mb-3 block text-sm font-semibold uppercase tracking-wider text-primary">Danh mục nổi bật</span>
            <h2 className="max-w-xl font-display text-3xl font-extrabold leading-tight text-secondary sm:text-4xl lg:text-5xl">
              Đồ Dùng Thú Cưng
            </h2>
          </div>
        </div>

        <div className="mb-5 grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, i) => (
            <a key={i} href="#shop" className="about-anim group flex cursor-pointer items-center gap-5 rounded-3xl border border-gray-100 bg-beige p-5 transition-all duration-300 hover:bg-primary/5 hover:shadow-lg">
              <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl border-2 border-white bg-white shadow-sm sm:h-24 sm:w-24">
                <img src={cat.img} alt={cat.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="mb-1 font-display text-lg font-bold text-secondary transition-colors group-hover:text-primary sm:text-xl">{cat.title}</h3>
                <p className="mb-2 line-clamp-1 text-xs text-muted sm:text-sm">{cat.desc}</p>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary sm:text-xs">{cat.count}</span>
              </div>

              <div className="flex h-8 w-8 flex-shrink-0 translate-x-[-10px] items-center justify-center rounded-full bg-white opacity-0 shadow-sm transition-all group-hover:translate-x-0 group-hover:opacity-100">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-4 w-4 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </div>
            </a>
          ))}
        </div>

        <CouponSlider />
      </div>
    </section>
  );
}
