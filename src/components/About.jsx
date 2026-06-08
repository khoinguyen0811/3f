import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const coupons = [
  { code: 'PV5999K', title: '5% off', min: 'Min 999K' },
  { code: 'SENMOI', title: '50.000đ off', min: 'Min 399K', defaultSaved: true },
  { code: 'FREESHIP25K', title: '25.000đ off shipping', min: 'Min 300K' },
  { code: 'BOSS10K', title: '10.000đ off', min: 'Min 100K' },
  { code: '20KSNACK', title: '20.000đ off', min: 'Min 150K' },
];

const TicketIcon = () => (
  <svg className="h-6 w-6 text-[#FF3E44]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M4 5.25A2.25 2.25 0 0 1 6.25 3h11.5A2.25 2.25 0 0 1 20 5.25v3.08a2.17 2.17 0 0 0 0 4.34v3.08A2.25 2.25 0 0 1 17.75 18H6.25A2.25 2.25 0 0 1 4 15.75v-3.08a2.17 2.17 0 0 0 0-4.34V5.25Zm8.25-.5a.75.75 0 0 0-.75.75v2a.75.75 0 0 0 1.5 0v-2a.75.75 0 0 0-.75-.75Zm0 5a.75.75 0 0 0-.75.75v3a.75.75 0 0 0 1.5 0v-3a.75.75 0 0 0-.75-.75Zm0 6a.75.75 0 0 0-.75.75v2a.75.75 0 0 0 1.5 0v-2a.75.75 0 0 0-.75-.75Z" />
  </svg>
);

function CouponSlider() {
  const [showAll, setShowAll] = useState(false);
  const [savedCoupons, setSavedCoupons] = useState(() =>
    new Set(coupons.filter((coupon) => coupon.defaultSaved).map((coupon) => coupon.code)),
  );

  const handleSave = (code) => {
    navigator.clipboard?.writeText(code).catch(() => {});
    setSavedCoupons((current) => {
      const next = new Set(current);
      next.add(code);
      return next;
    });
    window.location.assign('/?view=auth');
  };

  const visibleCoupons = showAll ? coupons : coupons.slice(0, 4);

  return (
    <div className="about-anim bg-white py-4 sm:rounded-[28px] sm:border sm:border-gray-100 sm:p-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <TicketIcon />
          <h3 className="font-display text-[22px] font-extrabold leading-none text-[#11204A] sm:text-2xl">
            Coupons
          </h3>
        </div>
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="inline-flex items-center gap-2 text-sm font-medium text-primary sm:text-base"
        >
          See more
          <span className="text-xl leading-none">→</span>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
        {visibleCoupons.map((cur) => (
          <article
            key={cur.code}
            className="flex min-h-[158px] flex-col rounded-[18px] border border-primary border-dashed bg-white px-3 py-3 sm:min-h-[170px] sm:rounded-[20px] sm:px-4"
          >
            <h4 className="line-clamp-2 text-[12px] font-extrabold leading-tight text-[#FF3E44] sm:text-xl">
              {cur.title}
            </h4>
            <p className="mt-2 text-[10px] font-medium text-[#3E4A72] sm:text-sm">{cur.min}</p>

            <div className="mt-3 flex flex-wrap gap-1.5">
              <span className="rounded-[5px] bg-[#fff4e9] px-2 py-1 text-[8px] font-extrabold text-[#111947]">
                {cur.code}
              </span>
              <span className="rounded-[5px] border border-[#ffcb8fac] px-2 py-1 text-[8px] font-medium text-[#ff7700]">
                Store-wide
              </span>
            </div>

            <div className="mt-3 border-t border-dashed border-[#D7DCEB]" />

            <div className="mt-auto flex items-end justify-between pt-3">
              <span className="text-sm leading-none text-[#11204A]">∞</span>
              {savedCoupons.has(cur.code) ? (
                <button
                  type="button"
                  onClick={() => handleSave(cur.code)}
                  className="rounded-full bg-[#ffc37f] px-2 py-1 text-[10px] font-extrabold text-[#ffffff] transition-transform active:scale-95"
                >
                  Saved
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSave(cur.code)}
                  className="rounded-full bg-[#ff5c0a] px-2 py-1 text-[11px] font-extrabold text-white transition-transform active:scale-95"
                >
                  Save
                </button>
              )}
            </div>
          </article>
        ))}
      </div>

      {!showAll && coupons.length > 4 ? (
        <button
          type="button"
            onClick={() => setShowAll(true)}
            className="mt-4 w-full rounded-full border border-[#ebdad7] bg-white py-3 text-sm font-extrabold text-primary sm:hidden"
        >
          Xem thêm mã 
        </button>
      ) : null}
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
