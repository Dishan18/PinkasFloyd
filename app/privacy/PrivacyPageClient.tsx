"use client";

import { Canvas } from "@react-three/fiber";
import SiteNavbar from "../components/common/SiteNavbar";
import SiteFooter from "../components/common/SiteFooter";
import StarsContainer from "../components/models/Stars";
import { useThemeStore } from "../stores";

const noiseOverlayStyle = {
	backgroundBlendMode: "soft-light" as const,
	backgroundImage:
		"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cfilter id='a'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23a)'/%3E%3C/svg%3E\")",
	backgroundRepeat: "repeat" as const,
	backgroundSize: "100px",
};

export default function PrivacyPageClient() {
	const theme = useThemeStore((state) => state.theme);

	return (
		<>
			<div
				className="fixed inset-0 w-full h-full z-0 transition-colors duration-1000"
				style={{ backgroundColor: theme.color, ...noiseOverlayStyle }}
			>
				<Canvas camera={{ position: [0, 0, 1] }}>
					<ambientLight intensity={0.5} />
					<StarsContainer />
				</Canvas>
			</div>

			<div className="relative z-10 min-h-screen flex flex-col text-white">
				<SiteNavbar />

				<main className="pt-16 md:pt-20 pb-14 md:pb-20 px-6 md:px-12 max-w-5xl mx-auto w-full flex-1">
					<header className="mb-12 md:mb-16 space-y-5">
						<p className="font-sans text-white text-[10px] uppercase tracking-[0.46rem] flex items-center gap-4">
							<span className="w-8 h-[1px] bg-white/40" />
							Legal Registry
						</p>
						<h1 className="font-serif text-5xl md:text-7xl tracking-tight leading-[0.95] text-white">
							<span className="italic text-[#bfc6cc]">Protocols &amp; </span>
							<span className="not-italic font-bold">Privacy</span>
						</h1>
						<p className="text-white/80 font-sans text-base max-w-2xl leading-relaxed font-light italic">
							Last updated: March 15, 2026. The terms under which your data is
							cataloged and protected within the Archive.
						</p>
					</header>

					<div className="space-y-6 md:space-y-8">
						<section className="bg-black/20 backdrop-blur-md border border-white/15 shadow-2xl relative overflow-hidden p-6 md:p-8">
							<div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl -z-0" />
							<div className="relative z-10 flex flex-col md:flex-row gap-6 md:gap-8 items-start">
								<span className="text-3xl md:text-4xl font-serif text-white leading-none italic opacity-60 block w-10 md:w-12 shrink-0">
									I.
								</span>
								<div className="space-y-3">
									<h2 className="text-2xl font-serif text-white tracking-tight">
										Information We Collect
									</h2>
									<p className="text-white/80 text-sm font-light">
										We collect only the information required to process your
										order:
									</p>
									<ul className="list-disc pl-5 space-y-1 text-white/80 text-sm font-light marker:text-white">
										<li>Name and shipping address</li>
										<li>Email for order updates</li>
										<li>Phone number for delivery coordination</li>
										<li>Payment handled securely via UPI</li>
									</ul>
								</div>
							</div>
						</section>

						<section className="bg-black/20 backdrop-blur-md border border-white/15 shadow-2xl relative overflow-hidden p-6 md:p-8">
							<div className="relative z-10 flex flex-col md:flex-row gap-6 md:gap-8 items-start">
								<span className="text-3xl md:text-4xl font-serif text-white leading-none italic opacity-60 block w-10 md:w-12 shrink-0">
									II.
								</span>
								<div className="space-y-3">
									<h2 className="text-2xl font-serif text-white tracking-tight">
										How We Use Your Information
									</h2>
									<p className="text-white/80 text-sm font-light">
										Your information is used only for:
									</p>
									<ul className="list-disc pl-5 space-y-1 text-white/80 text-sm font-light marker:text-white">
										<li>Processing and delivering your order</li>
										<li>Sending updates and confirmations</li>
										<li>Customer support</li>
										<li>Improving the experience</li>
									</ul>
								</div>
							</div>
						</section>

						<section className="bg-black/20 backdrop-blur-md border border-white/15 shadow-2xl relative overflow-hidden p-6 md:p-8">
							<div className="relative z-10 flex flex-col md:flex-row gap-6 md:gap-8 items-start">
								<span className="text-3xl md:text-4xl font-serif text-white leading-none italic opacity-60 block w-10 md:w-12 shrink-0">
									III.
								</span>
								<div className="space-y-3">
									<h2 className="text-2xl font-serif text-white tracking-tight">
										Data Security
									</h2>
									<p className="text-white/80 text-sm font-light">
										Your data is stored securely and is never sold or shared for
										marketing. Payments are handled through secure UPI systems.
									</p>
								</div>
							</div>
						</section>

						<section className="bg-black/20 backdrop-blur-md border border-white/15 shadow-2xl relative overflow-hidden p-6 md:p-8">
							<div className="relative z-10 flex flex-col md:flex-row gap-6 md:gap-8 items-start">
								<span className="text-3xl md:text-4xl font-serif text-white leading-none italic opacity-60 block w-10 md:w-12 shrink-0">
									IV.
								</span>
								<div className="space-y-3">
									<h2 className="text-2xl font-serif text-white tracking-tight">
										Your Rights
									</h2>
									<p className="text-white/80 text-sm font-light">
										You can request access, updates, or deletion of your data
										at:
									</p>
									<a
										href="mailto:dishansarkar9@gmail.com"
										className="font-sans text-white tracking-[0.22rem] uppercase text-[11px] underline underline-offset-4 mt-2 inline-block hover:text-white/75 transition-colors"
									>
										dishansarkar9@gmail.com
									</a>
								</div>
							</div>
						</section>
					</div>
				</main>

				<SiteFooter />
			</div>
		</>
	);
}
