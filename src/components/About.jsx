import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const categories = [
  { title: 'Thức ăn cho chó', desc: 'Dinh dưỡng đầy đủ, vị hấp dẫn', img: '/dog_about.png', count: '320+ sản phẩm' },
  { title: 'Thức ăn cho mèo', desc: 'Cao cấp, giàu protein tự nhiên', img: '/cat_about.png', count: '280+ sản phẩm' },
  { title: 'Phụ kiện thú cưng', desc: 'Dây xích, vòng cổ an toàn', img: '/accessory.png', count: '120+ sản phẩm' },
  { title: 'Dụng cụ vệ sinh', desc: 'Sạch sẽ, khử mùi hiệu quả', img: '/cleaning.png', count: '90+ sản phẩm' },
  { title: 'Chăm sóc sức khỏe', desc: 'Vitamin, thực phẩm chức năng', img: '/health.png', count: '60+ sản phẩm' },
  { title: 'Sản phẩm on sale', desc: 'Giảm giá hấp dẫn', img: '/onsale.png', count: '150+ sản phẩm' },
];

const perks = ['Giao hàng miễn phí', 'Hàng chính hãng 100%', 'Đổi trả 30 ngày', 'Hỗ trợ 24/7'];

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
    <section ref={containerRef} id="categories" className="overflow-hidden bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-[1500px] px-6 lg:px-16">
        <div className="about-anim mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="mb-3 block text-sm font-semibold uppercase tracking-wider text-primary">Danh mục nổi bật</span>
            <h2 className="max-w-xl font-display text-3xl font-extrabold leading-tight text-secondary sm:text-4xl lg:text-5xl">
              Đồ Dùng Thú Cưng
            </h2>
          </div>
          <div className="mt-12 text-center">
            <a href="" className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-8 py-3.5 font-semibold text-secondary shadow-sm transition-all hover:border-primary hover:text-primary hover:shadow-md">
              Xem tất cả
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </a>
          </div>
        </div>

        <div className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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

        <div className="about-anim flex flex-col items-center justify-between gap-12 rounded-[40px] border border-gray-100 bg-gray-50 p-8 shadow-sm lg:flex-row lg:p-12">
          <div className="max-w-xl flex-1 text-center lg:text-left">
            <h3 className="mb-4 font-display text-2xl font-extrabold text-secondary lg:text-3xl">
              Chúng Tôi Cam Kết <br className="hidden lg:block" />Chất Lượng Hàng Đầu
            </h3>
            <p className="mb-8 leading-relaxed text-muted">
              Mang đến những sản phẩm an toàn, dinh dưỡng và chất lượng nhất cho thú cưng của bạn. Kèm theo dịch vụ chăm sóc khách hàng tận tâm.
            </p>

            <div className="mb-8 grid grid-cols-1 gap-5 text-left sm:grid-cols-2">
              {perks.map((perk, i) => (
                <div key={i} className="flex items-center gap-3 text-sm font-semibold text-secondary/80">
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-4 w-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </span>
                  {perk}
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200/60 pt-6 text-left">
              <h4 className="mb-4 flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-wider text-secondary lg:justify-start">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
                </svg>
                Mã Giảm Giá Tặng Bạn
              </h4>

              <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                {[
                  { code: 'PETLOVE10', desc: 'Giảm 10%' },
                  { code: 'FREESHIP', desc: 'Freeship 0đ' },
                ].map((coupon, idx) => (
                  <div
                    key={idx}
                    className="group relative flex cursor-pointer items-center overflow-hidden rounded-xl border-2 border-dashed border-primary/30 bg-white p-1.5 pr-4 shadow-sm transition-colors duration-300 hover:border-primary"
                    title="Nhấn để sao chép"
                  >
                    <div className="mr-3 rounded-lg bg-primary/10 px-3 py-1.5 text-sm font-bold text-primary">
                      {coupon.code}
                    </div>
                    <span className="whitespace-nowrap text-sm font-medium text-secondary/80">{coupon.desc}</span>

                    <div className="absolute inset-0 flex items-center justify-center bg-primary text-sm font-bold text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      Sao chép mã
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative w-full flex-shrink-0 lg:w-auto">
            <div className="mx-auto grid w-full max-w-[500px] grid-cols-2 gap-4 lg:w-[450px]">
              <div className="col-span-1 aspect-[3/4] overflow-hidden rounded-[32px] border-4 border-white shadow-md lg:rounded-[40px]">
                <img src="/dog_about.png" alt="Chú chó" className="h-full w-full object-cover" />
              </div>
              <div className="col-span-1 flex flex-col gap-4">
                <div className="aspect-square overflow-hidden rounded-[32px] border-4 border-white shadow-md lg:rounded-[40px]">
                  <img src="/cat_about.png" alt="Chú mèo" className="h-full w-full object-cover" />
                </div>
                <div className="flex flex-1 cursor-pointer flex-col items-center justify-center rounded-[24px] bg-primary p-5 text-center text-white shadow-md transition-transform duration-300 hover:scale-105 lg:rounded-[28px]">
                  <span className="mb-1 font-display text-3xl font-extrabold">40%</span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider sm:text-xs">Giảm giá<br />hôm nay</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
