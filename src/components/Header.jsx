import { useMemo, useState } from 'react';

const searchSuggestions = [
  { label: 'Thức ăn cho mèo', href: '/?view=products&q=thức ăn mèo' },
  { label: 'Thức ăn cho chó', href: '/?view=products&q=thức ăn chó' },
  { label: 'Phụ kiện thú cưng', href: '/?view=products&q=phụ kiện' },
  { label: 'Chăm sóc sức khỏe', href: '/?view=products&q=sức khỏe' },
  { label: 'Sản phẩm on sale', href: '/?view=products&q=giảm giá' },
];

const infoMenu = [
  { label: 'Giới thiệu', href: '#info' },
  { label: 'Chính sách bảo mật', href: '#privacy' },
  { label: 'Chính sách giao hàng', href: '#shipping' },
  { label: 'Phương thức thanh toán', href: '#payment' },
  { label: 'Chính sách đổi hàng - trả hàng', href: '#returns' },
  { label: 'Điều khoản sử dụng', href: '#terms' },
];

const productMenu = [
  { label: 'Thức ăn dành cho chó', href: '/?view=products&category=Thức ăn cho chó' },
  { label: 'Thức ăn dành cho mèo', href: '/?view=products&category=Thức ăn cho mèo' },
  { label: 'Phụ kiện cho thú cưng', href: '/?view=products&category=Phụ kiện thú cưng' },
  { label: 'Chăm sóc sức khỏe', href: '/?view=products&category=Chăm sóc sức khỏe' },
  { label: 'Vệ sinh cho thú cưng', href: '/?view=products&category=Dụng cụ vệ sinh' },
  { label: 'Làm đẹp cho thú cưng', href: '/?view=products&q=grooming' },
  { label: '4PAWS', href: '/?view=products' },
];

export default function Header({
  forceVisible = false,
  solid = false,
  cartCount = 0,
  onCartOpen,
}) {
  const [query, setQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);

  const filteredSuggestions = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return searchSuggestions;
    return searchSuggestions.filter((item) => item.label.toLowerCase().includes(value));
  }, [query]);

  const handleMenuOpen = (menu) => setOpenMenu(menu);
  const handleMenuClose = () => setOpenMenu(null);

  return (
    <header
      className={`site-header left-0 top-0 z-50 flex w-full items-center justify-between px-6 py-5 lg:px-16 ${
        forceVisible
          ? `sticky opacity-100 ${solid ? 'bg-[#1F2937]/92 backdrop-blur-md' : 'bg-transparent'}`
          : 'absolute bg-transparent opacity-0'
      }`}
    >
      <a href="/" className="flex cursor-pointer items-center">
        <img
          src="/src/assets/logo (1).png"
          alt="Logo"
          className="h-auto w-full invert grayscale brightness-0 contrast-200 mix-blend-screen"
          style={{ maxWidth: '120px' }}
        />
      </a>

      <nav className="hidden items-center gap-8 text-sm font-medium text-white/90 xl:flex">
        <a href="/" className="py-3 font-semibold text-primary">
          Trang chủ
        </a>

        <div
          className="relative py-3"
          onMouseEnter={() => handleMenuOpen('info')}
          onMouseLeave={handleMenuClose}
        >
          <button
            type="button"
            onFocus={() => handleMenuOpen('info')}
            onBlur={() => setTimeout(handleMenuClose, 120)}
            className="flex items-center gap-1 transition-colors hover:text-primary"
          >
            Thông tin <span className="text-[10px]">▼</span>
          </button>

          {openMenu === 'info' && (
            <div className="absolute left-0 top-full z-50 w-[290px] overflow-hidden rounded-2xl border border-black/8 bg-white shadow-[0_18px_44px_rgba(0,0,0,0.18)]">
              {infoMenu.map((item, index) => (
                <a
                  key={item.label}
                  href={item.href}
                  className={`flex items-center justify-between px-4 py-3 text-[15px] text-secondary transition-colors hover:bg-primary hover:text-white ${
                    index !== infoMenu.length - 1 ? 'border-b border-black/8' : ''
                  }`}
                >
                  <span>{item.label}</span>
                </a>
              ))}
            </div>
          )}
        </div>

        <div
          className="relative py-3"
          onMouseEnter={() => handleMenuOpen('products')}
          onMouseLeave={handleMenuClose}
        >
          <a
            href="/?view=products"
            onFocus={() => handleMenuOpen('products')}
            onBlur={() => setTimeout(handleMenuClose, 120)}
            className="flex items-center gap-1 transition-colors hover:text-primary"
          >
            Sản phẩm <span className="text-[10px]">▼</span>
          </a>

          {openMenu === 'products' && (
            <div className="absolute left-0 top-full z-50 w-[320px] overflow-hidden rounded-2xl border border-black/8 bg-white shadow-[0_18px_44px_rgba(0,0,0,0.18)]">
              {productMenu.map((item, index) => (
                <a
                  key={item.label}
                  href={item.href}
                  className={`flex items-center justify-between px-4 py-3 text-[15px] text-secondary transition-colors hover:bg-primary hover:text-white ${
                    index !== productMenu.length - 1 ? 'border-b border-black/8' : ''
                  }`}
                >
                  <span>{item.label}</span>
                  {index < 3 ? <span className="text-[11px] text-black/35">▶</span> : null}
                </a>
              ))}
            </div>
          )}
        </div>

        <a href="#news" className="py-3 transition-colors hover:text-primary">
          Tin tức
        </a>
        <a href="#check-order" className="py-3 transition-colors hover:text-primary">
          Kiểm tra đơn hàng
        </a>
      </nav>

      <div className="flex items-center gap-4 sm:gap-5">
        <div className="relative hidden md:block">
          <label className="sr-only" htmlFor="site-search">
            Tìm kiếm
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/70">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" className="h-4.5 w-4.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35m1.1-5.15a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z" />
              </svg>
            </span>
            <input
              id="site-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsSearchOpen(true)}
              onBlur={() => setTimeout(() => setIsSearchOpen(false), 120)}
              placeholder="Tìm sản phẩm..."
              className="h-11 w-[240px] rounded-full border border-white/18 bg-white/12 px-11 pr-4 text-sm text-white placeholder:text-white/60 outline-none backdrop-blur-md transition-all focus:w-[280px] focus:border-white/35 focus:bg-white/18"
            />
          </div>

          {isSearchOpen && filteredSuggestions.length > 0 && (
            <div className="absolute left-0 top-[calc(100%+10px)] z-50 w-full overflow-hidden rounded-2xl border border-white/12 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.2)] backdrop-blur-xl">
              {filteredSuggestions.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-center justify-between px-4 py-3 text-sm text-black transition-colors hover:bg-primary hover:text-white"
                >
                  <span>{item.label}</span>
                  <span className="text-black/35">↗</span>
                </a>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onCartOpen}
          className="relative text-white transition-colors hover:text-primary"
          aria-label="Mở giỏ hàng"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-7 w-7">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
          {cartCount > 0 && (
            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
