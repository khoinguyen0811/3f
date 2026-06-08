import { useEffect, useRef, useState } from 'react';

/**
 * PageProgress — thanh tiến trình ở đầu trang kiểu NProgress,
 * với con chó gif chạy ở đầu thanh.
 *
 * Cách dùng: mount 1 lần trong App, tự lắng nghe click vào <a> và popstate.
 */
export default function PageProgress() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  const clear = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const start = () => {
    clear();
    setProgress(0);
    setVisible(true);
    startTimeRef.current = Date.now();

    // Tăng nhanh lúc đầu rồi chậm dần khi gần 90%
    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) { clear(); return prev; }
        const increment = prev < 30 ? 8 : prev < 60 ? 4 : prev < 80 ? 2 : 0.5;
        return Math.min(prev + increment, 90);
      });
    }, 80);
  };

  const finish = () => {
    clear();
    setProgress(100);
    // Ẩn sau khi transition hoàn thành
    setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 400);
  };

  useEffect(() => {
    // Lắng nghe click vào tất cả link <a href> để trigger loading
    const handleClick = (e) => {
      const anchor = e.target.closest('a[href]');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      // Bỏ qua: external, tel, mailto, hash-only, target=_blank
      if (!href) return;
      if (href.startsWith('http') || href.startsWith('tel:') || href.startsWith('mailto:')) return;
      if (href.startsWith('#')) return;
      if (anchor.target === '_blank') return;
      start();
    };

    // Lắng nghe navigation hoàn thành (popstate)
    const handlePopState = () => finish();

    document.addEventListener('click', handleClick);
    window.addEventListener('popstate', handlePopState);

    // Finish khi trang đã load xong (sau mount)
    const onLoad = () => finish();
    if (document.readyState === 'complete') {
      finish();
    } else {
      window.addEventListener('load', onLoad);
    }

    return () => {
      clear();
      document.removeEventListener('click', handleClick);
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('load', onLoad);
    };
  }, []);

  // Cũng trigger khi React re-render trang (view change qua state)
  // App.jsx sẽ gọi start/finish qua ref nếu cần — nhưng click detection đã đủ

  if (!visible) return null;

  return (
    <>
      {/* Thanh tiến trình */}
      <div
        className="fixed left-0 top-0 z-[999] h-[3px] bg-primary"
        style={{
          width: `${progress}%`,
          transition: progress === 0 ? 'none' : progress === 100 ? 'width 0.15s ease-out' : 'width 0.08s linear',
          boxShadow: '0 0 8px rgba(240,90,40,0.6)',
        }}
      >
        {/* Con chó ở đầu thanh */}
        <img
          src="/dogrungif-ezgif.com-gif-maker.gif"
          alt=""
          aria-hidden="true"
          style={{
            position: 'absolute',
            right: -18,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 36,
            height: 36,
            objectFit: 'contain',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Glow overlay mờ ở top */}
      <div
        className="fixed left-0 top-0 z-[998] h-px w-full"
        style={{ background: 'rgba(240,90,40,0.15)' }}
      />
    </>
  );
}
