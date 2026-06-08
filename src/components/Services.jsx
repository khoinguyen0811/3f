import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    title: 'Grooming',
    desc: 'Chăm sóc lông, tắm vệ sinh và làm sạch nhẹ nhàng cho thú cưng.',
    img: '/grooming_hero.png',
  },
  {
    title: 'Thức ăn dinh dưỡng',
    desc: 'Lựa chọn thức ăn phù hợp theo độ tuổi, cân nặng và giống.',
    img: '/food.png',
  },
  {
    title: 'Phụ kiện',
    desc: 'Đồ dùng hằng ngày, đồ chơi và phụ kiện an toàn, bền đẹp.',
    img: '/accessory.png',
  },
  {
    title: 'Sức khỏe',
    desc: 'Vitamin, sản phẩm chăm sóc và tư vấn nhu cầu cơ bản.',
    img: '/health.png',
  },
];

export default function Services() {
  const containerRef = useRef(null);
  const headingRef = useRef(null);
  const cardsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current.children,
        { y: 42, opacity: 0 },
        {
          scrollTrigger: {
            trigger: headingRef.current,
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

      gsap.fromTo(
        cardsRef.current.children,
        { y: 58, opacity: 0 },
        {
          scrollTrigger: {
            trigger: cardsRef.current,
            start: 'top 86%',
            toggleActions: 'play none none none',
            once: true,
          },
          y: 0,
          opacity: 1,
          duration: 0.82,
          stagger: 0.16,
          ease: 'power3.out',
        },
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} id="services" className="bg-white pb-20 lg:pb-28">
      <div className="mx-auto max-w-[1500px] px-6 lg:px-16">
        <div ref={headingRef} className="mx-auto mb-14 max-w-2xl text-center">
          <span className="mb-4 block text-sm font-bold uppercase tracking-wider text-primary">Dịch vụ</span>
          <h2 className="font-display text-4xl font-extrabold leading-tight text-secondary sm:text-5xl">
            Chăm sóc trọn gói cho thú cưng
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted">
            Mỗi dịch vụ được thiết kế để bạn dễ chọn, dễ đặt lịch và dễ chăm sóc boss mỗi ngày.
          </p>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <article
              key={service.title}
              className="group bg-[#FFF7EF] p-7 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              style={{ borderRadius: 24 }}
            >
              <div className="mx-auto mb-6 h-36 w-36 overflow-hidden rounded-full border-4 border-white bg-white shadow-md">
                <img
                  src={service.img}
                  alt={service.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <h3 className="font-display text-xl font-extrabold text-secondary">{service.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{service.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
