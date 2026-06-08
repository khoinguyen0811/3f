import { useEffect, useRef, useState } from 'react';

/**
 * PageProgress — thanh tiến trình với con chó chạy ở đầu.
 * Hoạt động cho SPA dạng full-reload (dùng <a href> thật).
 * 
 * - Khi click link nội bộ → start + chạy đến 80% trong ~600ms → browser reload
 * - Khi trang mới mount → tự động chạy từ 80% → 100% rồi ẩn
 */
export default function PageProgress({ progressRef }) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef(null);
  const doneTimerRef = useRef(null);

  const clearAll = () => {
    clearInterval(timerRef.current);
    clearTimeout(doneTimerRef.current);
  };

  const start = () => {
    clearAll();
    setProgress(8);
    setVisible(true);
    timerRef.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 75) { clearInterval(timerRef.current); return p; }
        return p + (p < 30 ? 14 : p < 55 ? 7 : 3);
      });
    }, 90);
  };

  const finish = () => {
    clearAll();
    setProgress(100);
    doneTimerRef.current = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 380);
  };

  // Expose to parent
  useEffect(() => {
    if (progressRef) progressRef.current = { start, finish };
  }, []);

  useEffect(() => {
    // ── On mount: trang vừa load xong → finish nhanh ──
    // Nếu session storage có flag "navigating" thì nghĩa là user vừa click link
    const wasNavigating = sessionStorage.getItem('3f-navigating');
    if (wasNavigating) {
      sessionStorage.removeItem('3f-navigating');
      // Bắt đầu từ 70%, chạy đến 100%
      setProgress(70);
      setVisible(true);
      doneTimerRef.current = setTimeout(() => finish(), 120);
    }

    // ── Intercept all internal link clicks ──
    const handleClick = (e) => {
      const anchor = e.target.closest('a[href]');
      if (!anchor) return;
      const href = anchor.getAttribute('href') || '';
      if (
        href.startsWith('http') ||
        href.startsWith('tel:') ||
        href.startsWith('mailto:') ||
        href.startsWith('#') ||
        anchor.target === '_blank'
      ) return;

      // Mark that we're navigating so next page can pick up
      sessionStorage.setItem('3f-navigating', '1');
      start();
    };

    document.addEventListener('click', handleClick, { capture: true });
    return () => {
      clearAll();
      document.removeEventListener('click', handleClick, { capture: true });
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[9999]"
      style={{
        height: 3,
        width: `${progress}%`,
        background: 'var(--color-primary, #F05A28)',
        boxShadow: '0 0 12px rgba(240,90,40,0.75), 0 0 5px rgba(240,90,40,0.4)',
        transition:
          progress <= 10
            ? 'none'
            : progress >= 100
            ? 'width 0.18s ease-out'
            : 'width 0.09s linear',
      }}
    >
      {/* Con chó ở đầu thanh */}
      <img
        src="/dogrungif-ezgif.com-gif-maker.gif"
        alt=""
        style={{
          position: 'absolute',
          right: -17,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 34,
          height: 34,
          objectFit: 'contain',
          imageRendering: 'auto',
        }}
      />
    </div>
  );
}
