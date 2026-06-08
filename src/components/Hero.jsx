import { useEffect, useRef } from "react";
import gsap from "gsap";

// ── Blob paths từ blobmaker.app ──────────────────────────────────────────────
// Tất cả dùng viewBox 200x200, origin tại tâm (100,100)

// Blob ảnh chính
const BLOB_MAIN =
	"M36.5,-51.7C45.3,-43.8,49.2,-30.5,53.2,-17.5C57.1,-4.4,61.2,8.4,59.7,21.4C58.2,34.4,51.2,47.5,40.3,54.9C29.4,62.2,14.7,63.7,0.2,63.3C-14.2,63,-28.4,60.8,-36.3,52.5C-44.2,44.3,-45.9,29.8,-51.9,15.8C-57.8,1.8,-68.2,-11.9,-68.5,-25.7C-68.7,-39.4,-58.8,-53.3,-45.7,-59.9C-32.6,-66.4,-16.3,-65.7,-1.2,-64C13.8,-62.3,27.6,-59.7,36.5,-51.7Z";

// Blob nền xám nhạt góc trên phải (hơi lớn hơn, asymmetric)
const BLOB_BG =
	"M47.6,-64.7C59.4,-56.3,65.2,-39.9,68.2,-23.9C71.1,-7.8,71.2,7.9,65.4,21.1C59.6,34.3,47.9,45.1,34.5,53.2C21.1,61.3,5.9,66.7,-9.7,67.2C-25.2,67.8,-41,63.5,-51.3,53.5C-61.6,43.5,-66.3,27.8,-67.5,12C-68.8,-3.8,-66.6,-19.7,-59.2,-32.4C-51.9,-45.1,-39.4,-54.6,-25.9,-62.1C-12.4,-69.5,2.1,-74.9,15.7,-72.6C29.3,-70.3,35.8,-73.1,47.6,-64.7Z";

// Blob teal dưới phải (nằm ngang, dẹt)
const BLOB_TEAL =
	"M38.4,-26C47.1,-12.4,49.7,5.8,44,19.8C38.3,33.8,24.4,43.6,7.8,47.1C-8.7,50.6,-28,47.7,-39.1,36.5C-50.2,25.3,-53.1,5.7,-47.4,-10.4C-41.8,-26.5,-27.5,-39.1,-12.2,-43.6C3.1,-48.1,29.7,-39.6,38.4,-26Z";

// Blob orange kicker kiri (kecil, bulat tidak sempurna)
const BLOB_ORANGE =
	"M28.5,-22.1C34.2,-11.6,34.3,2.5,29.1,14.6C23.8,26.8,13.2,37,0.1,36.9C-13,36.9,-26,26.5,-31.9,13.5C-37.7,0.5,-36.3,-15.1,-28.5,-25.7C-20.7,-36.3,-6.4,-42,5.7,-41.7C17.8,-41.5,22.7,-32.7,28.5,-22.1Z";

// Blob kuning kecil kanan bawah
const BLOB_YELLOW =
	"M22.6,-16.3C27.5,-6.5,28.3,6.5,23.5,16.7C18.7,26.9,8.3,34.3,-1.9,35.5C-12.1,36.8,-22.2,31.8,-28.5,22.2C-34.7,12.7,-37.2,-1.5,-33,-13.2C-28.9,-24.9,-18.2,-34.2,-6.4,-36.5C5.4,-38.8,17.6,-26.1,22.6,-16.3Z";

export default function Hero() {
	const sectionRef = useRef(null);
	const textRef = useRef(null);
	const imageRef = useRef(null);

	useEffect(() => {
		const ctx = gsap.context(() => {
			gsap.fromTo(
				Array.from(textRef.current.children),
				{ y: 30, opacity: 0 },
				{ y: 0, opacity: 1, duration: 0.75, stagger: 0.13, ease: "power3.out" },
			);
			gsap.fromTo(
				imageRef.current,
				{ x: 50, opacity: 0 },
				{ x: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.1 },
			);
		}, sectionRef);
		return () => ctx.revert();
	}, []);

	return (
		<section
			ref={sectionRef}
			id="home"
			className="relative overflow-hidden bg-white pt-[86px]"
			style={{ minHeight: "100svh" }}
		>
			<div
				className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-col items-center gap-8 px-6 py-12 sm:px-10 lg:flex-row lg:items-center lg:gap-0 lg:px-12 lg:py-0"
				style={{ minHeight: "calc(100svh - 86px)" }}
			>
				{/* ── LEFT: text ── */}
				<div
					ref={textRef}
					className="z-10 flex w-full flex-col items-start lg:w-[38%] lg:shrink-0"
				>
					<h1 className="font-display text-[52px] font-black uppercase leading-[1.0] text-[#1a1a1a] sm:text-[68px] lg:text-[76px] xl:text-[88px]">
						WE ARE
						<br />
						3F STORE
					</h1>

					<p className="mt-2 max-w-[320px] text-sm leading-6 text-[#888] sm:text-[15px] sm:leading-7">
						Hệ thống cửa hàng đồ ăn thú cưng hàng đầu Việt Nam. Cung cấp thú cảnh,
						thức ăn, phụ kiện và dịch vụ dành cho thú cưng.
					</p>

					<div className="mt-3 flex items-center gap-4">
						<a
							href="#about"
							className="inline-flex items-center justify-center rounded-full bg-primary px-7 py-3.5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(240,90,40,0.32)] transition-transform hover:-translate-y-0.5 active:scale-95"
						>
							Về chúng tôi
						</a>
						<svg viewBox="0 0 56 40" fill="none" className="w-10 -scale-x-100 text-primary" aria-hidden="true">
							<path d="M52 8 C36 6, 14 16, 8 32" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" fill="none" />
							<path d="M4 26 L8 33 L15 30" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
						</svg>
					</div>
				</div>

				{/* ── RIGHT: blob image area ── */}
				<div
					ref={imageRef}
					className="relative flex w-full items-center justify-center lg:w-[62%]"
				>
					{/* Blob nền xám nhạt — góc trên phải, behind everything */}
					<svg
						viewBox="0 0 200 200"
						className="pointer-events-none absolute"
						style={{ top: "-8%", right: "-2%", width: "66%", opacity: 0.55, zIndex: 0 }}
						aria-hidden="true"
					>
						<path d={BLOB_BG} transform="translate(100 100)" fill="#E8E5E1" />
					</svg>

					{/* Blob orange — sát mép trái blob ảnh */}
					<svg
						viewBox="0 0 200 200"
						className="pointer-events-none absolute"
						style={{ left: "12%", top: "26%", width: "8%", zIndex: 3 }}
						aria-hidden="true"
					>
						<path d={BLOB_ORANGE} transform="translate(100 100)" fill="#F05A28" />
					</svg>
					{/* Blob ảnh chính */}
					<svg
						viewBox="0 0 200 200"
						xmlns="http://www.w3.org/2000/svg"
						className="relative w-full"
						style={{
							zIndex: 1,
							filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.12))",
							
							// CÁCH 1: Dùng transform scale (Khuyên dùng)
							// Thay đổi giá trị 1.25 lên 1.3, 1.4... tùy theo độ lớn bạn muốn
							transform: "scale(1.25)", 
							
							// Giữ nguyên hoặc tăng nhẹ margin âm để tạo không gian
							marginLeft: "-80px",
							marginRight: "-80px",
							width: "calc(100% + 160px)",
						}}
					>	
						<defs>
        				<clipPath id="heroBlobClip">
           			 		{/* Bạn cũng có thể phóng to riêng cái viền cắt bằng cách thêm scale vào transform */}
           				 	{/* Ví dụ: transform="translate(100 100) scale(1.1)" */}
         	 				<path d={BLOB_MAIN} transform="translate(100 100)" />
        				</clipPath>
						</defs>
						<image
							href="nice.png"
							x="34" 
        					y="15"
							// QUAN TRỌNG: Đã sửa width từ 150 -> 200 để ảnh phủ kín viewBox 200x200
							width="130" 
							height="200"
							className=""
							preserveAspectRatio="xMidYMid slice"
							clipPath="url(#heroBlobClip)"
						/>
					</svg>

					{/* Blob teal — sát mép dưới phải blob ảnh */}
					<svg
						viewBox="0 0 200 200"
						className="pointer-events-none absolute"
						style={{ bottom: "2%", right: "6%", width: "18%", zIndex: 2 }}
						aria-hidden="true"
					>
						<path d={BLOB_TEAL} transform="translate(100 100)" fill="#0796A8" />
					</svg>

					{/* Blob vàng — sát cạnh teal */}
					<svg
						viewBox="0 0 200 200"
						className="pointer-events-none absolute"
						style={{ bottom: "-2%", right: "21%", width: "8%", zIndex: 2 }}
						aria-hidden="true"
					>
						<path d={BLOB_YELLOW} transform="translate(100 100)" fill="#F5C518" />
					</svg>
				</div>
			</div>
		</section>
	);
}
