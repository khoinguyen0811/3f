import { useState } from 'react';

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
  { label: 'Chó', href: '/?view=products&q=chó' },
  { label: 'Mèo', href: '/?view=products&q=mèo' },
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

const ChevronIcon = () => (
  <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z" clipRule="evenodd" />
  </svg>
);

const PhoneIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2a1.3 1.3 0 0 1 1.33-.31c1.46.49 3 .75 4.56.75.72 0 1.3.58 1.3 1.3v3.48c0 .72-.58 1.3-1.3 1.3C10.37 21.7 2.3 13.63 2.3 3.7c0-.72.58-1.3 1.3-1.3h3.5c.72 0 1.3.58 1.3 1.3 0 1.56.25 3.1.74 4.56.14.46.03.96-.32 1.32l-2.2 2.21Z" />
  </svg>
);

const CartIcon = () => (
  <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l2.2 11.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 2-1.5L21 7H6" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 20.5a.7.7 0 1 1-1.4 0 .7.7 0 0 1 1.4 0ZM18 20.5a.7.7 0 1 1-1.4 0 .7.7 0 0 1 1.4 0Z" />
  </svg>
);

export default function Header({ cartCount = 0, onCartOpen }) {
  const [openMenu, setOpenMenu] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMenuOpen = (menu) => setOpenMenu(menu);
  const handleMenuClose = () => setOpenMenu(null);

  return (
    <header className="site-header sticky top-0 z-50 bg-white text-secondary shadow-[0_12px_35px_rgba(31,41,55,0.07)]">
      <div className="grid h-1.5 grid-cols-4">
        <span className="bg-primary" />
        <span className="bg-[#FFB84D]" />
        <span className="bg-[#0796A8]" />
        <span className="bg-[#62B44B]" />
      </div>

      <div className="mx-auto flex min-h-[86px] w-full max-w-[1360px] items-center justify-between gap-6 px-4 sm:px-6 lg:px-10 xl:px-12">
        <a href="/" className="flex shrink-0 items-center" aria-label="3F Store">
          <img
            src="/src/assets/logo (1).png"
            alt="3F Store"
            className="h-auto w-[118px] object-contain sm:w-[136px]"
          />
        </a>

        <nav className="hidden items-center gap-8 text-[16px] font-bold text-[#6F6F6F] xl:flex">
          {navItems.map((item) => (
            <div
              key={item.label}
              className="relative py-8"
              onMouseEnter={() => item.items && handleMenuOpen(item.label)}
              onMouseLeave={handleMenuClose}
            >
              <a
                href={item.href}
                onFocus={() => item.items && handleMenuOpen(item.label)}
                onBlur={() => setTimeout(handleMenuClose, 120)}
                className="flex items-center gap-1 transition-colors hover:text-primary"
              >
                {item.label}
                {item.hasDropdown ? <ChevronIcon /> : null}
              </a>

              {item.items && openMenu === item.label ? (
                <div className="absolute left-0 top-full z-50 w-[245px] overflow-hidden rounded-[18px] border border-black/8 bg-white py-2 shadow-[0_18px_44px_rgba(31,41,55,0.14)]">
                  {item.items.map((subItem) => (
                    <a
                      key={subItem.label}
                      href={subItem.href}
                      className="block px-4 py-3 text-sm font-bold text-secondary transition-colors hover:bg-primary hover:text-white"
                    >
                      {subItem.label}
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          <a
            href="tel:0869224692"
            className="hidden items-center gap-3 rounded-full bg-primary px-3 py-2 text-sm font-extrabold text-white shadow-[0_12px_28px_rgba(240,90,40,0.24)] transition-transform hover:-translate-y-0.5 sm:flex sm:pr-6"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary">
              <PhoneIcon />
            </span>
            <span>0869.224.692</span>
          </a>

          <button
            type="button"
            onClick={onCartOpen}
            className="relative flex h-12 w-12 items-center justify-center rounded-full bg-white text-secondary transition-colors hover:text-primary"
            aria-label="Mở giỏ hàng"
          >
            <CartIcon />
            {cartCount > 0 ? (
              <span className="absolute right-1 top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-extrabold text-white">
                {cartCount}
              </span>
            ) : null}
          </button>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((value) => !value)}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white text-secondary xl:hidden"
            aria-label="Mở menu"
            aria-expanded={isMobileMenuOpen}
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" d={isMobileMenuOpen ? 'M6 6l12 12M18 6 6 18' : 'M4 7h16M4 12h16M4 17h16'} />
            </svg>
          </button>
        </div>
      </div>

      {isMobileMenuOpen ? (
        <div className="border-t border-gray-100 bg-white px-4 py-4 shadow-[0_18px_36px_rgba(31,41,55,0.08)] xl:hidden">
          <nav className="mx-auto flex max-w-[1360px] flex-col gap-2">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-2xl px-4 py-3 text-sm font-extrabold text-secondary transition-colors hover:bg-primary hover:text-white"
              >
                {item.label}
              </a>
            ))}
            <a
              href="tel:0869224692"
              className="mt-2 inline-flex items-center justify-center gap-3 rounded-full bg-primary px-5 py-3 text-sm font-extrabold text-white sm:hidden"
            >
              <PhoneIcon />
              0869.224.692
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
