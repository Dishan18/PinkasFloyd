"use client";

import { Canvas } from "@react-three/fiber";
import SiteNavbar from "../components/common/SiteNavbar";
import SiteFooter from "../components/common/SiteFooter";
import StarsContainer from "../components/models/Stars";
import { useTheme } from "@/app/contexts/ThemeContext";

const noiseOverlayStyle = {
	backgroundBlendMode: "soft-light" as const,
	backgroundImage:
		"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cfilter id='a'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23a)'/%3E%3C/svg%3E\")",
	backgroundRepeat: "repeat" as const,
	backgroundSize: "100px",
};

export default function TermsPageClient() {
	const { theme } = useTheme();

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
							<span className="italic text-[#bfc6cc]">Terms of </span>
							<span className="not-italic font-bold">Sale</span>
						</h1>
						<p className="text-white/80 font-sans text-base max-w-2xl leading-relaxed font-light italic">
							Protocols governing the acquisition and transit of archival
							materials from our private repository.
						</p>
					</header>

					<article className="space-y-6 md:space-y-8 border-l border-white/15 pl-0 md:pl-10">
						<section className="bg-black/20 backdrop-blur-md border border-white/15 p-6 md:p-8 space-y-4">
							<div className="flex items-center gap-4 border-b border-white/10 pb-3">
								<span className="font-sans text-white tracking-[0.28rem] text-[10px] uppercase">
									Section 01
								</span>
								<h2 className="font-serif text-2xl text-white tracking-tight">
									Agreement
								</h2>
							</div>
							<p className="font-sans text-white/80 text-sm leading-relaxed font-light">
								By acquiring a piece from the Pinkasfloyd archive, you enter
								into an agreement bound by these protocols. Each transaction is
								treated as a transfer of curation rather than a simple retail
								exchange.
							</p>
						</section>

						<section className="bg-black/20 backdrop-blur-md border border-white/15 p-6 md:p-8 space-y-4">
							<div className="flex items-center gap-4 border-b border-white/10 pb-3">
								<span className="font-sans text-white tracking-[0.28rem] text-[10px] uppercase">
									Section 02
								</span>
								<h2 className="font-serif text-2xl text-white tracking-tight">
									The Artifacts
								</h2>
							</div>
							<p className="font-sans text-white/80 text-sm leading-relaxed font-light">
								All visual materials are independent artworks inspired by music,
								film, and cultural aesthetics. These represent individual
								artistic interpretations and are not official merchandise unless
								explicitly designated within the registry.
							</p>
						</section>

						<section className="bg-black/20 backdrop-blur-md border border-white/15 p-6 md:p-8 space-y-4">
							<div className="flex items-center gap-4 border-b border-white/10 pb-3">
								<span className="font-sans text-white tracking-[0.28rem] text-[10px] uppercase">
									Section 03
								</span>
								<h2 className="font-serif text-2xl text-white tracking-tight">
									Usage Jurisdiction
								</h2>
							</div>
							<p className="font-sans text-white/80 text-sm leading-relaxed font-light">
								Artifacts are procured strictly for personal curation and
								display. Commercial reproduction, redistribution, or
								unauthorized exhibition of these prints is strictly prohibited
								to maintain the integrity of the archive.
							</p>
						</section>

						<section className="bg-black/20 backdrop-blur-md border border-white/15 p-6 md:p-8 space-y-4">
							<div className="flex items-center gap-4 border-b border-white/10 pb-3">
								<span className="font-sans text-white tracking-[0.28rem] text-[10px] uppercase">
									Section 04
								</span>
								<h2 className="font-serif text-2xl text-white tracking-tight">
									Procurement &amp; Transit
								</h2>
							</div>
							<p className="font-sans text-white/80 text-sm leading-relaxed font-light">
								Requisitions are processed within 1 to 2 business days. It is
								the collector&apos;s responsibility to provide precise transit
								coordinates. Pinkasfloyd employs secure white-glove packaging
								tailored for archival preservation during global transit.
							</p>
						</section>

						<section className="bg-black/20 backdrop-blur-md border border-white/15 p-6 md:p-8 space-y-4">
							<div className="flex items-center gap-4 border-b border-white/10 pb-3">
								<span className="font-sans text-white tracking-[0.28rem] text-[10px] uppercase">
									Section 05
								</span>
								<h2 className="font-serif text-2xl text-white tracking-tight">
									Liability Parameters
								</h2>
							</div>
							<p className="font-sans text-white/80 text-sm leading-relaxed font-light">
								In the unlikely event of transit complication or
								dissatisfaction, Pinkasfloyd&apos;s absolute liability remains
								strictly capped at the original monetary value required to
								acquire the artifact in question.
							</p>
						</section>
					</article>
				</main>

				<SiteFooter />
			</div>
		</>
	);
}
