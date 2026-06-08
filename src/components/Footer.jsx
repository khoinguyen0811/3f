export default function Footer() {
  return (
    <footer id="contact" className="bg-[#111827] text-white py-16 lg:py-20 border-t border-gray-800">
      <div className="max-w-[1500px] mx-auto px-6 lg:px-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

        {/* 1. Brand Column */}
        <div className="flex flex-col items-start">
          {/* Bạn có thể thay /logo.png bằng logo của 3F Store */}
          <img src="/logo.png" alt="3F Store Logo" className="h-10 md:h-12 w-auto object-contain brightness-0 invert mb-6" />
          <p className="font-body text-gray-400 text-sm leading-relaxed mb-4 max-w-xs">
            <strong>3F Store</strong> là cửa hàng kinh doanh sản phẩm dành cho ngành thú cưng.
          </p>
          <div className="font-body text-gray-400 text-sm leading-relaxed mb-6 bg-gray-800/50 p-3 rounded-lg border border-gray-700/50">
            <span className="block text-gray-300 text-xs uppercase mb-1">Đơn vị chủ quản:</span>
            <strong className="text-white">CÔNG TY TNHH TM DV 3F</strong>
          </div>
          
          {/* Giữ lại icon mạng xã hội cho đẹp, bạn có thể xóa nếu không cần */}
          <div className="flex gap-3">
            {['facebook', 'instagram', 'tiktok'].map((soc) => (
              <a key={soc} href="#" className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors text-white shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
                  {soc === 'facebook' && <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />}
                  {soc === 'instagram' && <path d="M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM19.5 5.25h.008v.008h-.008V5.25z" />}
                  {soc === 'tiktok' && <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />}
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* 2. Policies Column */}
        <div>
          <h3 className="font-display font-bold text-lg text-white mb-6">Chính sách</h3>
          <ul className="flex flex-col gap-3 font-body text-sm text-gray-400">
            <li><a href="#" className="hover:text-primary transition-colors">Chính sách bảo mật</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Điều khoản giao dịch chung</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Chính sách vận chuyển, giao hàng</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Chính sách thanh toán</a></li>
          </ul>
        </div>

        {/* 3. Contact Column */}
        <div>
          <h3 className="font-display font-bold text-lg text-white mb-6">Liên hệ với chúng tôi</h3>
          
          <div className="font-body text-sm text-gray-400 mb-5 leading-relaxed bg-gray-800/30 p-3 border-l-2 border-primary">
            Công ty TNHH 3F STORE có mã số thuế: <strong>0319126776</strong> do Sở Tài chính Thành phố Hồ Chí Minh cấp ngày 26/08/2025.
          </div>

          <ul className="flex flex-col gap-4 font-body text-sm text-gray-400">
            <li className="flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-primary flex-shrink-0 mt-0.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              <span>16 Đường số 12, P. An Khánh, TP Thủ Đức, TP HCM</span>
            </li>
            <li className="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-primary flex-shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-1.514 2.018a14.942 14.942 0 01-6.947-6.947l2.018-1.514c.362-.272.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              <span>087.999.7474</span>
            </li>
            <li className="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-primary flex-shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              <span>3fstorevietnam@gmail.com</span>
            </li>
          </ul>
        </div>

        {/* 4. Newsletter Column */}
        <div>
          <h3 className="font-display font-bold text-lg text-white mb-6">Đăng ký nhận thông tin</h3>
          <p className="font-body text-gray-400 text-sm leading-relaxed mb-4">
            Đăng ký nhận bản tin để nhận ưu đãi đặc biệt về sản phẩm 3F Store.
          </p>
          
          <form className="mt-2" onSubmit={(e) => e.preventDefault()}>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Nhập email của bạn..." 
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 text-white text-sm rounded-l-lg focus:outline-none focus:border-primary transition-colors"
                required
              />
              <button 
                type="submit" 
                className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 text-sm font-semibold rounded-r-lg transition-colors"
              >
                Gửi
              </button>
            </div>
          </form>
        </div>

      </div>

      {/* Bottom Copyright */}
      <div className="max-w-[1500px] mx-auto px-6 lg:px-16 mt-12 pt-8 border-t border-gray-800/80 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 font-body">
        <p>@ CÔNG TY TNHH TM DV 3F. | Cung cấp bởi Sapo</p>
      </div>
    </footer>
  );
}