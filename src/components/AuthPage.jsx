const MailIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M4 6h16v12H4V6Zm1.5 1.5L12 13l6.5-5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PawIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M7.6 10.5c1.1-.2 1.7-1.8 1.4-3.5S7.5 4.1 6.4 4.3 4.7 6 5 7.7s1.5 3 2.6 2.8Zm8.8 0c1.1.2 2.3-1 2.6-2.8s-.3-3.3-1.4-3.5-2.3 1-2.6 2.8.3 3.3 1.4 3.5ZM12 10c1.2 0 2.2-1.4 2.2-3.1S13.2 3.8 12 3.8 9.8 5.2 9.8 6.9 10.8 10 12 10Zm-5.2 3.2c-1.4 1.6-2.1 3.1-1.5 4.4.8 1.8 3.2 1.4 5.2 1.1.6-.1 1.1-.2 1.5-.2s.9.1 1.5.2c2 .3 4.4.7 5.2-1.1.6-1.3-.1-2.8-1.5-4.4-1.7-1.9-3.2-2.8-5.2-2.8s-3.5.9-5.2 2.8Z" />
  </svg>
);

export default function AuthPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#fffaf6] pt-[86px] text-secondary">
      <div className="pointer-events-none absolute left-[-60px] top-[130px] h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute right-[-70px] top-[220px] h-52 w-52 rounded-full bg-[#0796A8]/10 blur-3xl" />
      <img
        src="/dogrunlegic.gif"
        alt="Chó cưng 3F Store"
        className="animate-dog-run-across pointer-events-none absolute bottom-3 left-0 z-[9999] w-[60px] max-w-[60px] object-contain drop-shadow-[0_22px_34px_rgba(31,41,55,0.12)] lg:bottom-8"
      />

      <section className="mx-auto grid min-h-[calc(100svh-86px)] w-full max-w-[1280px] items-center gap-8 px-3 py-5 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:py-10">
        <div className="relative hidden min-h-[620px] overflow-hidden rounded-[34px] bg-white shadow-[0_24px_70px_rgba(31,41,55,0.08)] lg:flex lg:flex-col">
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(circle at 16% 18%, rgba(240,90,40,0.18), transparent 26%), radial-gradient(circle at 86% 22%, rgba(7,150,168,0.16), transparent 28%), linear-gradient(145deg, #fff7ef, #ffffff 48%, #effafa)',
            }}
          />

          <div className="relative z-20 max-w-[400px] p-10">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-extrabold text-primary shadow-sm">
              <PawIcon />
              3F Store Member
            </span>
            <h1 className="mt-6 font-display text-[44px] font-black leading-[1.05] text-[#1a1a1a] xl:text-5xl">
              Đăng nhập để lưu ưu đãi cho thú cưng.
            </h1>
            <p className="mt-4 max-w-[330px] text-base leading-7 text-muted">
              Quản lý mã giảm giá, giỏ hàng và đơn COD của bạn trong cùng một tài khoản.
            </p>
          </div>

          <div className="relative z-10 mt-auto h-[330px]">
            <img
              src="/dogv2.png"
              alt="Chó cưng 3F Store"
              className="absolute bottom-0 left-8 w-[43%] max-w-[260px] object-contain drop-shadow-[0_22px_34px_rgba(31,41,55,0.12)]"
            />
            <img
              src="/hero_cat.png"
              alt="Mèo cưng 3F Store"
              className="absolute bottom-8 right-4 w-[46%] max-w-[300px] object-contain drop-shadow-[0_22px_34px_rgba(31,41,55,0.12)]"
            />

            <div className="absolute bottom-8 right-8 z-20 rounded-[24px] bg-white/90 p-5 shadow-[0_18px_46px_rgba(31,41,55,0.12)] backdrop-blur">
              <p className="text-sm font-bold text-muted">Hotline hỗ trợ</p>
              <p className="mt-1 text-2xl font-black text-primary">0869.224.692</p>
            </div>
          </div>
        </div>

        <div className="mx-auto min-w-0 w-full max-w-[470px]">
          <div className="mb-5 flex items-center justify-center lg:hidden">
            <div className="relative h-28 w-full overflow-hidden rounded-[26px] bg-white shadow-[0_14px_38px_rgba(31,41,55,0.08)]">
              <div className="absolute inset-0 bg-[linear-gradient(135deg,#fff3e9,#ffffff_52%,#eaf8fa)]" />
              <img src="/dogv2.png" alt="Chó 3F Store" className="absolute bottom-0 right-1 h-24 object-contain min-[390px]:right-2 min-[390px]:h-28" />
              <div className="absolute left-[1rem] right-[94px] top-[40%] min-w-0 min-[390px]:left-28 min-[390px]:right-28">
                <p className="text-xs font-extrabold uppercase text-primary">3F Store</p>
                <p className="mt-1 text-[12px] font-black leading-tight text-secondary min-[390px]:text-lg">
                  Lưu ưu đãi cho đơn hàng tiếp theo
                </p>
              </div>
            </div>
          </div>

          <div className="min-w-0 rounded-[28px] border border-gray-100 bg-white p-4 shadow-[0_18px_55px_rgba(31,41,55,0.08)] sm:p-6 relative">                     
            <img src="/sleep_cat.png" alt="Mèo 3F Store" className="absolute top-[-9%] left-0 h-20 object-contain min-[390px]:left-4 min-[390px]:h-24" />
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-extrabold uppercase text-primary">
                <PawIcon />
                Tài khoản 3F
              </span>
              <h2 className="mt-4 font-display text-[24px] font-black leading-tight text-secondary min-[390px]:text-[30px]">
                Đăng nhập / Đăng ký
              </h2>
              <p className="mt-2 text-[14px] leading-6 text-muted">
                Nhập số điện thoại để nhận mã xác minh và lưu mã giảm giá của bạn.
              </p>
            </div>

            <form className="mt-8 space-y-4">
              <div>
                <label htmlFor="phone-number" className="mb-2 block text-sm font-extrabold text-secondary">
                  Số điện thoại
                </label>
                <div className="flex min-w-0 gap-2">
                  <div className="flex h-12 w-[78px] shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-[12px] font-extrabold text-primary min-[390px]:w-[82px]">
                    VN +84
                  </div>
                  <input
                    id="phone-number"
                    type="tel"
                    inputMode="tel"
                    placeholder="912 345 678"
                    className="h-12 min-w-0 flex-1 rounded-2xl border border-gray-200 bg-white px-3 text-[12px] font-bold text-secondary outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 min-[390px]:px-4 min-[390px]:text-lg"
                  />
                </div>
              </div>

              <button
                type="button"
                className="h-[54px] w-full rounded-full bg-primary text-[14px] font-extrabold text-white shadow-[0_14px_28px_rgba(240,90,40,0.26)] transition-transform active:scale-[0.99]"
              >
                Gửi mã xác minh
              </button>
            </form>

            <button type="button" className="mt-6 w-full text-center text-[12px] font-extrabold text-primary">
              Đăng nhập bằng mật khẩu
            </button>

            <div className="my-8 flex items-center gap-3 text-xs font-bold text-muted">
              <span className="h-px flex-1 bg-gray-200" />
              HOẶC
              <span className="h-px flex-1 bg-gray-200" />
            </div>

            <button
              type="button"
              className="flex h-[48px] w-full items-center justify-center gap-4 rounded-full border border-gray-200 bg-white text-[15px] font-extrabold text-secondary shadow-sm transition-colors hover:border-primary hover:text-primary"
            >
              <MailIcon />
              Đăng nhập bằng email
            </button>

            <div className="mt-5 grid grid-cols-3 gap-3">
              <button type="button" className="grid h-[46px] place-items-center rounded-2xl border border-gray-200 bg-white shadow-sm" aria-label="Zalo">
                <span className="text-[13px] font-black text-primary">Zalo</span>
              </button>
              <button type="button" className="grid h-[46px] place-items-center rounded-2xl border border-gray-200 bg-white shadow-sm" aria-label="Facebook">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-primary text-lg font-black leading-none text-white">f</span>
              </button>
              <button type="button" className="grid h-[46px] place-items-center rounded-2xl border border-gray-200 bg-white shadow-sm" aria-label="Google">
                <span className="text-2xl font-black text-primary">G</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
