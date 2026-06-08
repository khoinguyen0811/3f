import { useState, useRef, useEffect } from 'react';
import { getSaleProducts } from '../data/products';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function FlashSale() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 45, seconds: 12 });
  const sliderRef = useRef(null);
  const containerRef = useRef(null);
  
  const saleProducts = getSaleProducts().slice(0, 8);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else {
          clearInterval(timer);
        }
        return { hours, minutes, seconds };
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const slideNext = () => {
    setCurrentIndex(prev => (prev + 1) % Math.ceil(saleProducts.length / 4));
  };

  const slidePrev = () => {
    setCurrentIndex(prev => (prev - 1 + Math.ceil(saleProducts.length / 4)) % Math.ceil(saleProducts.length / 4));
  };

  return (
    <section ref={containerRef} className="py-16 lg:py-24 bg-gradient-to-br from-rose-50 to-orange-50 relative overflow-hidden">
      
      {/* Decorative background patterns */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-rose-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>

      <div className="max-w-[1500px] mx-auto px-6 relative z-10">

        {/* Slide Navigation */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            <button 
              onClick={slidePrev}
              className="w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-red-50 transition-colors z-10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-secondary">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button 
              onClick={slideNext}
              className="w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-red-50 transition-colors z-10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-secondary">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
          <div className="hidden items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-extrabold text-red-500 shadow-sm sm:flex">
            <span>{String(timeLeft.hours).padStart(2, '0')}</span>
            <span>:</span>
            <span>{String(timeLeft.minutes).padStart(2, '0')}</span>
            <span>:</span>
            <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
          </div>
          <div className="flex gap-2">
            {Array.from({ length: Math.ceil(saleProducts.length / 4) }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-3 h-3 rounded-full transition-all ${i === currentIndex ? 'bg-red-500 w-8' : 'bg-gray-300'}`}
              />
            ))}
          </div>
        </div>

        {/* Product Slide Container */}
        <div 
          ref={sliderRef}
          className="overflow-hidden"
        >
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {Array.from({ length: Math.ceil(saleProducts.length / 4) }).map((_, slideIndex) => (
              <div key={slideIndex} className="min-w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 px-1">
                {saleProducts.slice(slideIndex * 4, (slideIndex + 1) * 4).map((p, i) => (
                  <div
                    key={`${slideIndex}-${i}`}
                    className="bg-white rounded-3xl overflow-hidden shadow-sm border border-red-100 hover:shadow-xl hover:shadow-red-500/10 hover:-translate-y-2 transition-all duration-300 flex flex-col group relative"
                  >
                    {/* Animated border effect */}
                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-red-400/50 rounded-3xl transition-colors duration-300 pointer-events-none z-20"></div>

                    {/* Image */}
                    <div className="relative overflow-hidden aspect-square bg-gray-50 p-4">
                      <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 rounded-2xl" />
                      
                      {/* Badge */}
                      <span className={`absolute top-4 left-4 ${p.badgeColor} text-white text-sm font-extrabold px-3.5 py-1.5 rounded-full shadow-md z-10 animate-pulse`}>
                        {p.badge}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="p-5 flex flex-col flex-1 relative z-10">
                      <span className="text-red-400 text-xs font-semibold uppercase tracking-wider mb-1">{p.category}</span>
                      <h3 className="font-display font-bold text-base text-secondary mb-2 leading-snug flex-1 line-clamp-2 group-hover:text-red-500 transition-colors">{p.name}</h3>
                      
                      {/* Stock progress bar */}
                      <div className="w-full bg-gray-100 rounded-full h-2 mb-4 overflow-hidden relative">
                        <div className="bg-gradient-to-r from-orange-400 to-red-500 h-2 rounded-full" style={{ width: `${Math.min(75 + Math.random() * 20, 95)}%` }}></div>
                        <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-white mix-blend-difference uppercase tracking-widest">
                          Đã bán {Math.floor(Math.random() * 30 + 70)}%
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex flex-col">
                          <span className="font-display font-extrabold text-xl text-red-500">{p.price}</span>
                          {p.oldPrice && <span className="text-muted line-through text-sm">{p.oldPrice}</span>}
                        </div>
                        <button className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white p-3 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-red-500/30">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
