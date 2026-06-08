import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const banners = [
  {
    title: 'Khuyến mãi cho boss',
    desc: 'Sản phẩm chất lượng với giá cả hấp dẫn, chỉ dành riêng cho những người bạn bốn chân của bạn.',
    image: '/onsale.png',
    href: '#products',
    accent: 'from-[#F05A28]/90 via-[#F48B3A]/75 to-[#FBD3A6]/15',
  },
  {
    title: 'Chăm sóc trọn gói',
    desc: 'Dịch vụ, phụ kiện và sản phẩm sức khỏe được gom trong một hành trình mua sắm liền mạch.',
    image: '/grooming_hero.png',
    href: '#services',
    accent: 'from-[#1F2937]/88 via-[#3B556A]/72 to-[#C9DDEA]/18',
  },
];

export default function HorizontalBanners() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      const track = trackRef.current;

      if (!section || !track) return;

      const matchMedia = gsap.matchMedia();

      matchMedia.add('(min-width: 768px)', () => {
        const tween = gsap.to(track, {
          x: () => -(track.scrollWidth - section.offsetWidth),
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${track.scrollWidth - section.offsetWidth}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
        };
      });

      const cards = track.children;
      gsap.fromTo(
        cards,
        { opacity: 0.85, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        },
      );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="banners" className="relative overflow-hidden bg-[#FFF7EF] py-12 md:h-screen md:py-0">
      <div className="absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(240,90,40,0.08),transparent)]" />

      <div ref={trackRef} className="relative z-10 flex flex-col gap-6 px-4 md:h-full md:w-[200vw] md:flex-row md:gap-0 md:px-0">
        {banners.map((banner) => (
          <article key={banner.title} className="flex w-full items-center justify-center md:h-full md:w-screen md:px-6 md:py-10 lg:px-16">
            <div className="relative flex min-h-[420px] w-full max-w-[1480px] overflow-hidden bg-white shadow-[0_24px_70px_rgba(31,41,55,0.12)] md:h-[76vh]" style={{ borderRadius: 28 }}>
              <img
                src={banner.image}
                alt={banner.title}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className={`absolute inset-0 bg-gradient-to-r ${banner.accent}`} />

              <div className="relative z-10 flex h-full max-w-[560px] flex-col justify-end p-6 text-white sm:p-10 lg:p-14">
                <h2 className="font-display text-3xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
                  {banner.title}
                </h2>
                <p className="mt-5 max-w-[44ch] text-sm leading-relaxed text-white/86 sm:text-base">
                  {banner.desc}
                </p>
                <a
                  href={banner.href}
                  className="mt-8 inline-flex w-fit items-center justify-center rounded-full bg-white px-7 py-3 text-sm font-extrabold text-secondary transition-transform hover:-translate-y-1"
                >
                  Khám phá ngay
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
