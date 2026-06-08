import { useEffect, useRef, useState } from 'react';

const navItems = [
  {
    label: 'Giới thiệu',
    href: '#categories',
    hasDropdown: true,
    items: [
      { label: 'Về 3F Store', href: '#categories' },
      { label: 'Dịch vụ', href: '#services' },
      { label: 'Tin tức', href: '#news' },
    ],
  },
  {
    label: 'Chó', href: '/?view=products&q=chó', hasDropdown: true, items: [
      { label: 'Tất cả sản phẩm chó', href: '/?view=products&q=chó' },
      { label: 'Thức ăn khô', href: '/?view=products&category=Th%E1%BB%A9c+%C4%83n+cho+ch%C3%B3&q=khô' },
      { label: 'Thức ăn ướt', href: '/?view=products&category=Th%E1%BB%A9c+%C4%83n+cho+ch%C3%B3&q=ướt' },
      { label: 'Snack cho chó', href: '/?view=products&q=snack+chó' },
      { label: 'Vệ sinh & Chăm sóc', href: '/?view=products&q=chó&category=Chăm+sóc+lông' },
    ],
  },
  {
    label: 'Mèo', href: '/?view=products&q=mèo', hasDropdown: true, items: [
      { label: 'Tất cả sản phẩm mèo', href: '/?view=products&q=mèo' },
      { label: 'Thức ăn khô', href: '/?view=products&category=Th%E1%BB%A9c+%C4%83n+cho+m%C3%A8o&q=khô' },
      { label: 'Thức ăn ướt', href: '/?view=products&category=Th%E1%BB%A9c+%C4%83n+cho+m%C3%A8o&q=ướt' },
      { label: 'Snack cho mèo', href: '/?view=products&q=snack+mèo' },
      { label: 'Khay & Bồn vệ sinh', href: '/?view=products&q=khay+mèo' },
    ],
  },
  { label: 'Shop', href: '/?view=products' },
  {
    label: 'Dịch vụ thú cưng',
    href: '#services',
    hasDropdown: true,
    items: [
      { label: 'Grooming', href: '#services' },
      { label: 'Chăm sóc sức khỏe', href: '/?view=products&q=sức khỏe' },
      { label: 'Phụ kiện thú cưng', href: '/?view=products&q=phụ kiện' },
    ],
  },
];

const ChevronIcon = ({ open }) => (
  <svg
    className={`h-4 w-4 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
    viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"
  >
    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z" clipRule="evenodd" />
  </svg>
);

const PhoneIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2a1.3 1.3 0 0 1 1.33-.31c1.46.49 3 .75 4.56.75.72 0 1.3.58 1.3 1.3v3.48c0 .72-.58 1.3-1.3 1.3C10.37 21.7 2.3 13.63 2.3 3.7c0-.72.58-1.3 1.3-1.3h3.5c.72 0 1.3.58 1.3 1.3 0 1.56.25 3.1.74 4.56.14.46.03.96-.32 1.32l-2.2 2.21Z" />
  </svg>
);

const CartIcon = () => (
  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l2.2 11.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 2-1.5L21 7H6" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 20.5a.7.7 0 1 1-1.4 0 .7.7 0 0 1 1.4 0ZM18 20.5a.7.7 0 1 1-1.4 0 .7.7 0 0 1 1.4 0Z" />
  </svg>
);

const SearchIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} aria-hidden="true">
    <circle cx="11" cy="11" r="7" />
    <path strokeLinecap="round" d="M20 20l-3.5-3.5" />
  </svg>
);

export default function Header({ cartCount = 0, onCartOpen }) {
  const [openMenu, setOpenMenu] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileOpenItem, setMobileOpenItem] = useState(null);

  // desktop search expand
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);
  const searchBoxRef = useRef(null);

  // mobile search (always visible in header bar)
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [mobileSearchQuery, setMobileSearchQuery] = useState('');
  const mobileSearchRef = useRef(null);

  useEffect(() => {
    if (isSearchOpen) setTimeout(() => searchInputRef.current?.focus(), 50);
  }, [isSearchOpen]);

  useEffect(() => {
    if (isMobileSearchOpen) setTimeout(() => mobileSearchRef.current?.focus(), 50);
  }, [isMobileSearchOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
    };
    if (isSearchOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSearchOpen]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    window.location.href = `/?view=products&q=${encodeURIComponent(q)}`;
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  const handleMobileSearchSubmit = (e) => {
    e.preventDefault();
    const q = mobileSearchQuery.trim();
    if (!q) return;
    window.location.href = `/?view=products&q=${encodeURIComponent(q)}`;
    setIsMobileSearchOpen(false);
    setIsMobileMenuOpen(false);
    setMobileSearchQuery('');
  };

  const toggleMobileItem = (label) =>
    setMobileOpenItem((prev) => (prev === label ? null : label));

  return (
    <header className="site-header fixed top-0 left-0 right-0 z-50 bg-white text-secondary shadow-[0_12px_35px_rgba(31,41,55,0.07)]">
      {/* color bar */}
      <div className="grid h-1.5 grid-cols-4">
        <span className="bg-primary" />
        <span className="bg-[#FFB84D]" />
        <span className="bg-[#0796A8]" />
        <span className="bg-[#62B44B]" />
      </div>

      <div className="mx-auto flex min-h-[86px] w-full max-w-[1360px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-10 xl:px-12">

        {/* Logo */}
        <a href="/" className="flex shrink-0 items-center" aria-label="3F Store">
          <img src="/logo-3f.png" alt="3F Store" className="h-auto w-[100px] object-contain sm:w-[136px]" />
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 text-[16px] font-bold text-[#6F6F6F] xl:flex">
          {navItems.map((item) => (
            <div
              key={item.label}
              className="relative py-8"
              onMouseEnter={() => item.items && setOpenMenu(item.label)}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <a
                href={item.href}
                onFocus={() => item.items && setOpenMenu(item.label)}
                onBlur={() => setTimeout(() => setOpenMenu(null), 120)}
                className="flex items-center gap-1 transition-colors hover:text-primary"
              >
                {item.label}
                {item.hasDropdown ? <ChevronIcon open={openMenu === item.label} /> : null}
              </a>
              {item.items && openMenu === item.label ? (
                <div className="absolute left-0 top-full z-50 w-[245px] overflow-hidden rounded-[18px] border border-black/8 bg-white py-2 shadow-[0_18px_44px_rgba(31,41,55,0.14)]">
                  {item.items.map((subItem) => (
                    <a key={subItem.label} href={subItem.href}
                      className="block px-4 py-3 text-sm font-bold text-secondary transition-colors hover:bg-primary hover:text-white">
                      {subItem.label}
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex shrink-0 items-center gap-2">

          {/* Desktop search expand */}
          <div ref={searchBoxRef} className="relative hidden xl:flex items-center">
            {isSearchOpen ? (
              <form onSubmit={handleSearchSubmit} className="flex items-center">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm sản phẩm..."
                  className="w-[220px] rounded-full border border-gray-200 bg-gray-50 py-2.5 pl-4 pr-10 text-sm outline-none transition-all focus:border-primary focus:bg-white"
                />
                <button type="submit" className="absolute right-3 text-muted hover:text-primary" aria-label="Tìm kiếm">
                  <SearchIcon />
                </button>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-secondary transition-colors hover:border-primary hover:text-primary"
                aria-label="Mở tìm kiếm"
              >
                <SearchIcon />
              </button>
            )}
          </div>

          {/* Mobile search icon (always visible, opens input below) */}
          <button
            type="button"
            onClick={() => {
              setIsMobileSearchOpen((v) => !v);
              setIsMobileMenuOpen(false);
            }}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-secondary transition-colors hover:border-primary hover:text-primary xl:hidden"
            aria-label="Tìm kiếm"
          >
            <SearchIcon />
          </button>

          {/* Phone */}
          <a
            href="tel:0869224692"
            className="hidden items-center gap-3 rounded-full bg-primary px-3 py-2 text-sm font-extrabold text-white shadow-[0_12px_28px_rgba(240,90,40,0.24)] transition-transform hover:-translate-y-0.5 sm:flex sm:pr-6"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-primary">
              <PhoneIcon />
            </span>
            <span className="hidden xl:inline">0869.224.692</span>
          </a>

          {/* Cart */}
          <button
            type="button"
            onClick={onCartOpen}
            className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white text-secondary transition-colors hover:text-primary"
            aria-label="Mở giỏ hàng"
          >
            <CartIcon />
            {cartCount > 0 ? (
              <span className="absolute right-0.5 top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-extrabold text-white">
                {cartCount}
              </span>
            ) : null}
          </button>

          {/* Hamburger */}
          <button
            type="button"
            onClick={() => { setIsMobileMenuOpen((v) => !v); setIsMobileSearchOpen(false); }}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-secondary xl:hidden"
            aria-label="Mở menu"
            aria-expanded={isMobileMenuOpen}
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" d={isMobileMenuOpen ? 'M6 6l12 12M18 6 6 18' : 'M4 7h16M4 12h16M4 17h16'} />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Mobile search bar (slides down when icon clicked) ── */}
      {isMobileSearchOpen && (
        <div className="border-t border-gray-100 bg-white px-4 py-3 xl:hidden">
          <form onSubmit={handleMobileSearchSubmit} className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2.5">
            <SearchIcon />
            <input
              ref={mobileSearchRef}
              type="text"
              value={mobileSearchQuery}
              onChange={(e) => setMobileSearchQuery(e.target.value)}
              placeholder="Tìm sản phẩm..."
              className="flex-1 bg-transparent text-sm text-secondary outline-none placeholder:text-muted"
            />
            <button type="submit" className="text-xs font-extrabold text-primary">
              Tìm
            </button>
          </form>
        </div>
      )}

      {/* ── Mobile nav menu ── */}
      {isMobileMenuOpen && (
        <div className="border-t border-gray-100 bg-white px-4 py-3 shadow-[0_18px_36px_rgba(31,41,55,0.08)] xl:hidden">
          <nav className="mx-auto flex max-w-[1360px] flex-col gap-1">
            {navItems.map((item) => {
              const isOpen = mobileOpenItem === item.label;
              return (
                <div key={item.label}>
                  {item.hasDropdown ? (
                    <>
                      {/* accordion header */}
                      <button
                        type="button"
                        onClick={() => toggleMobileItem(item.label)}
                        className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-extrabold text-secondary transition-colors hover:bg-gray-50"
                      >
                        <span>{item.label}</span>
                        <ChevronIcon open={isOpen} />
                      </button>

                      {/* accordion children */}
                      {isOpen && (
                        <div className="mb-1 ml-4 flex flex-col gap-0.5 border-l-2 border-primary/20 pl-3">
                          {item.items.map((sub) => (
                            <a
                              key={sub.label}
                              href={sub.href}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="rounded-xl px-3 py-2.5 text-sm font-semibold text-secondary transition-colors hover:bg-primary hover:text-white"
                            >
                              {sub.label}
                            </a>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <a
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block rounded-2xl px-4 py-3 text-sm font-extrabold text-secondary transition-colors hover:bg-primary hover:text-white"
                    >
                      {item.label}
                    </a>
                  )}
                </div>
              );
            })}

            <a
              href="tel:0869224692"
              className="mt-2 inline-flex items-center justify-center gap-3 rounded-full bg-primary px-5 py-3 text-sm font-extrabold text-white sm:hidden"
            >
              <PhoneIcon />
              0869.224.692
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
