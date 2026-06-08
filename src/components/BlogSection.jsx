const posts = [
  {
    title: 'Cách chọn thức ăn phù hợp cho boss mỗi độ tuổi',
    desc: 'Hướng dẫn chọn khẩu phần và nhóm dinh dưỡng phù hợp cho chó mèo con, trưởng thành và lớn tuổi.',
    image: '/food.png',
    tag: 'Dinh dưỡng',
  },
  {
    title: '5 dấu hiệu cần bổ sung sản phẩm chăm sóc sức khỏe',
    desc: 'Nhận biết các thay đổi nhỏ trong thói quen ăn uống, vận động và giấc ngủ của thú cưng.',
    image: '/health.png',
    tag: 'Sức khỏe',
  },
  {
    title: 'Routine tắm, vệ sinh và grooming tại nhà dễ thực hiện',
    desc: 'Một lịch chăm sóc gọn gàng giúp lông mịn, nhà sạch và thú cưng thoải mái hơn mỗi ngày.',
    image: '/cleaning.png',
    tag: 'Chăm sóc',
  },
];

export default function BlogSection() {
  return (
    <section id="news" className="bg-[#FFF8F2] py-20 lg:py-24">
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <span className="mb-4 block text-sm font-bold uppercase tracking-wider text-primary">Bài viết mới</span>
            <h2 className="font-display text-4xl font-extrabold leading-tight text-secondary sm:text-5xl">
              Góc chia sẻ cho người nuôi thú cưng
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted">
              Những bài viết ngắn, dễ đọc và hữu ích để bạn chăm boss tốt hơn mỗi ngày.
            </p>
          </div>
          <a
            href="#news"
            className="inline-flex w-fit items-center justify-center rounded-full border border-primary/20 bg-white px-6 py-3 text-sm font-extrabold text-secondary transition-colors hover:border-primary hover:text-primary"
          >
            Xem tất cả bài viết
          </a>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.title}
              className="overflow-hidden rounded-[26px] bg-white shadow-[0_18px_44px_rgba(31,41,55,0.08)] transition-transform duration-300 hover:-translate-y-2"
            >
              <div className="aspect-[16/11] overflow-hidden">
                <img src={post.image} alt={post.title} className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
              </div>
              <div className="p-6">
                <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                  {post.tag}
                </span>
                <h3 className="mt-4 font-display text-2xl font-extrabold leading-snug text-secondary">
                  {post.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{post.desc}</p>
                <a
                  href="#news"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-extrabold text-secondary transition-colors hover:text-primary"
                >
                  Đọc bài viết
                  <span>→</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
