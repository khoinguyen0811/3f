import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Hero() {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const catRef = useRef(null);
  const bubbleRef = useRef(null);
  const foodRef = useRef(null);
  const bowlRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
      const header = document.querySelector('.site-header');

      gsap.set(textRef.current.children, { y: 42, opacity: 0 });
      gsap.set([bubbleRef.current, foodRef.current, bowlRef.current], { opacity: 0 });
      gsap.set(header, { y: -22, opacity: 0 });

      timeline
        .fromTo(
          catRef.current,
          {
            scale: 1.42,
            xPercent: -34,
            yPercent: -4,
            opacity: 1,
            transformOrigin: '50% 78%',
          },
          {
            scale: 1,
            xPercent: 0,
            yPercent: 0,
            duration: 1.28,
            ease: 'power3.inOut',
          },
        )
        .to(catRef.current, {
          y: -8,
          duration: 0.32,
          ease: 'sine.out',
        })
        .to(
          bubbleRef.current,
          {
            scale: 1,
            opacity: 1,
            transformOrigin: '70% 85%',
            duration: 0.74,
            ease: 'back.out(1.8)',
          },
          '-=0.08',
        )
        .to(
          foodRef.current,
          {
            scale: 1,
            opacity: 1,
            rotate: 0,
            duration: 0.62,
            ease: 'back.out(1.7)',
          },
          '-=0.28',
        )
        .to(header, {
          y: 0,
          opacity: 1,
          duration: 0.72,
        })
        .to(
          textRef.current.children,
          {
            y: 0,
            opacity: 1,
            duration: 0.85,
            stagger: 0.14,
          },
          '-=0.32',
        )
        .to(
          bowlRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
          },
          '-=0.34',
        );

      gsap.to(bubbleRef.current, {
        y: -8,
        duration: 2.4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      gsap.to(foodRef.current, {
        rotate: 0.4,
        scale: 1.005,
        duration: 4.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} id="home" className="relative min-h-[100svh] overflow-hidden bg-[#F6B65D] text-white">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[10vh] bg-white" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_76%_34%,rgba(255,255,255,0.34),transparent_28%),radial-gradient(circle_at_18%_76%,rgba(255,255,255,0.22),transparent_24%)]" />

      <div className="relative z-10 mx-auto grid min-h-[90svh] w-full max-w-[1500px] grid-cols-1 items-center gap-6 px-4 pb-8 pt-24 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:gap-8 lg:px-16 lg:pb-10 lg:pt-24">
        <div ref={textRef} className="max-w-xl text-left">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-md">
            <svg className="h-4 w-4 fill-current opacity-80" viewBox="0 0 24 24">
              <path d="M12 14c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm5.5-3c.83 0 1.5-.67 1.5-1.5S18.33 8 17.5 8 16 8.67 16 9.5s.67 1.5 1.5 1.5zM6.5 11c.83 0 1.5-.67 1.5-1.5S7.33 8 6.5 8 5 8.67 5 9.5s.67 1.5 1.5 1.5zM12 16c-2.21 0-4 1.79-4 4 0 .55.45 1 1 1h6c.55 0 1-.45 1-1 0-2.21-1.79-4-4-4z" />
            </svg>
            <span>3F Store Pet Food</span>
          </div>

          <h1 className="font-display text-4xl font-extrabold leading-[1.15] tracking-tight text-white sm:text-6xl xl:text-7xl">
            Bữa ăn ngon cho <span className="text-primary">boss</span> mỗi ngày
          </h1>

          <p className="mt-6 max-w-lg text-base font-normal leading-relaxed text-white/80 sm:text-lg">
            Chọn thức ăn, phụ kiện và dịch vụ chăm sóc thú cưng chất lượng, giao nhanh tận nhà. Ba mẹ an tâm, bé cưng hạnh phúc!
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <a
              href="#products"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-bold text-white transition-colors hover:bg-amber-700"
            >
              <svg className="h-5 w-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              Mua sắm ngay
            </a>

            <a
              href="#categories"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-transparent px-8 py-3.5 text-sm font-bold text-white transition-colors hover:bg-white/10"
            >
              <svg className="h-5 w-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              Xem danh mục
            </a>
          </div>

          <div className="mt-8 flex items-center gap-2 text-sm font-medium text-white/60">
            <svg className="h-4 w-4 fill-current opacity-80" viewBox="0 0 24 24">
              <path d="M12 14c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm5.5-3c.83 0 1.5-.67 1.5-1.5S18.33 8 17.5 8 16 8.67 16 9.5s.67 1.5 1.5 1.5zM6.5 11c.83 0 1.5-.67 1.5-1.5S7.33 8 6.5 8 5 8.67 5 9.5s.67 1.5 1.5 1.5zM12 16c-2.21 0-4 1.79-4 4 0 .55.45 1 1 1h6c.55 0 1-.45 1-1 0-2.21-1.79-4-4-4z" />
            </svg>
            <span>Hơn 1,000+ "boss" đã trải nghiệm</span>
          </div>
        </div>

        <div className="pointer-events-none relative min-h-[300px] sm:min-h-[430px] lg:min-h-[620px]">
          <div
            ref={bubbleRef}
            className="absolute right-[50%] top-[2%] z-20 w-[44%] max-w-[380px] min-w-[260px] scale-[0.35] opacity-0"
          >
            <img
              src="/tuongtuong-removebg.png"
              alt=""
              className="h-auto w-full drop-shadow-[0_18px_28px_rgba(67,38,10,0.18)]"
            />
            <img
              ref={foodRef}
              src="/food.png"
              alt="Thức ăn mèo"
              className="absolute left-[38%] top-[40%] w-[100%] -translate-x-1/2 -translate-y-1/2 -rotate-6 scale-[1] object-contain opacity-0"
            />
          </div>

          <img
            ref={catRef}
            src="/hero_cat.png"
            alt="Chú mèo đang nghĩ về bữa ăn"
            className="absolute bottom-[-28%] right-[-10%] z-10 w-[88%] max-w-[720px] object-contain drop-shadow-[0_28px_36px_rgba(74,39,8,0.22)] lg:bottom-[-39%]"
          />
        </div>
      </div>
    </section>
  );
}
