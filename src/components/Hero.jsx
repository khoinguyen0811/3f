import { useEffect, useRef } from "react";
import gsap from "gsap";

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

	/*
	  Blob path từ blobmaker.app — viewBox 200x200, origin tại tâm (100,100).
	  Path gốc: M36.5,-51.7 C45.3,-43.8 ... Z  (tọa độ relative to center)
	  Dùng trực tiếp trong SVG với <image> bên trong — không cần chuyển đổi.
	*/
	const BLOB_PATH =
		"M36.5,-51.7C45.3,-43.8,49.2,-30.5,53.2,-17.5C57.1,-4.4,61.2,8.4,59.7,21.4C58.2,34.4,51.2,47.5,40.3,54.9C29.4,62.2,14.7,63.7,0.2,63.3C-14.2,63,-28.4,60.8,-36.3,52.5C-44.2,44.3,-45.9,29.8,-51.9,15.8C-57.8,1.8,-68.2,-11.9,-68.5,-25.7C-68.7,-39.4,-58.8,-53.3,-45.7,-59.9C-32.6,-66.4,-16.3,-65.7,-1.2,-64C13.8,-62.3,27.6,-59.7,36.5,-51.7Z";

	return (
		<section
			ref={sectionRef}
			id="home"
			className="relative overflow-hidden bg-white"
			style={{ minHeight: "calc(100svh - 72px)" }}
		>
			<div
				className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-col items-center gap-8 px-6 py-12 sm:px-10 lg:flex-row lg:items-center lg:gap-0 lg:px-12 lg:py-0"
				style={{ minHeight: "calc(100svh - 72px)" }}
			>
				{/* ── LEFT: text ── */}
				<div
					ref={textRef}
					className="z-10 flex w-full flex-col items-start lg:w-[42%] lg:shrink-0"
				>
					<h1 className="font-display text-[52px] font-black uppercase leading-[1.0] text-[#1a1a1a] sm:text-[68px] lg:text-[76px] xl:text-[88px]">
						WE ARE
						<br />
						3F STORE
					</h1>

					<p className="mt-5 max-w-[320px] text-sm leading-6 text-[#888] sm:text-[15px] sm:leading-7">
						Hệ thống cửa hàng thú cưng hàng đầu Việt Nam. Cung cấp thú cảnh,
						thức ăn, phụ kiện và dịch vụ dành cho thú cưng.
					</p>

					<div className="mt-8 flex items-center gap-4">
						<a
							href="#about"
							className="inline-flex items-center justify-center rounded-full bg-primary px-7 py-3.5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(240,90,40,0.32)] transition-transform hover:-translate-y-0.5 active:scale-95"
						>
							Về chúng tôi
						</a>
						<svg
							viewBox="0 0 56 40"
							fill="none"
							className="w-10 -scale-x-100 text-primary"
							aria-hidden="true"
						>
							<path d="M52 8 C36 6, 14 16, 8 32" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" fill="none" />
							<path d="M4 26 L8 33 L15 30" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
						</svg>
					</div>
				</div>

				{/* ── RIGHT: blob image area ── */}
				<div
					ref={imageRef}
					className="relative flex w-full items-center justify-center lg:w-[65%]"
				>
					{/* Background light blob (top-right, behind SVG) */}
					<div
						className="pointer-events-none absolute"
						style={{
							top: "-10%",
							right: "-4%",
							width: "45%",
							height: "40%",
							background: "#EDECEA",
							borderRadius: "50% 55% 48% 52% / 52% 50% 50% 48%",
							zIndex: 0,
						}}
					/>

					{/* Orange dot */}
					<div
						className="pointer-events-none absolute"
						style={{
							width: 28,
							height: 28,
							borderRadius: "50%",
							background: "#F05A28",
							left: "13%",
							top: "22%",
							zIndex: 3,
						}}
					/>

					<svg
						viewBox="0 0 200 200"
						xmlns="http://www.w3.org/2000/svg"
						className="relative w-full"
						style={{
							zIndex: 1,
							filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.12))",
							marginLeft: "-80px",
							marginRight: "-80px",
							width: "calc(100% + 160px)",
						}}
					>
						<defs>
							<clipPath id="heroBlobClip">
								<path d={BLOB_PATH} transform="translate(100 100)" />
							</clipPath>
						</defs>
						<image
							href="/petnow_hero_store.png"
							x="0" y="0"
							width="200" height="200"
							preserveAspectRatio="xMidYMid slice"
							clipPath="url(#heroBlobClip)"
						/>
					</svg>

					{/* Teal blob — bottom right */}
					<div
						className="pointer-events-none absolute"
						style={{
							width: 100,
							height: 52,
							background: "#0796A8",
							borderRadius: "50% 50% 48% 52% / 62% 62% 38% 38%",
							bottom: "-4%",
							right: "3%",
							zIndex: 2,
						}}
					/>

					{/* Yellow circle */}
					<div
						className="pointer-events-none absolute"
						style={{
							width: 36,
							height: 36,
							borderRadius: "50%",
							background: "#F5C518",
							bottom: "-9%",
							right: "17%",
							zIndex: 2,
						}}
					/>
				</div>
			</div>
		</section>
	);
}
