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

export default function ShippingPageClient() {
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
							Logistics Directive
						</p>
						<h1 className="font-serif text-5xl md:text-7xl tracking-tight leading-[0.95] text-white">
							<span className="italic text-[#bfc6cc]">Transit </span>
							<span className="not-italic font-bold">Protocol</span>
						</h1>
						<p className="text-white/80 font-sans text-base max-w-2xl leading-relaxed font-light italic">
							Detailing the secure global white-glove transit mechanisms for
							your acquired artifacts.
						</p>
					</header>

					<article className="space-y-6 md:space-y-8 border-l border-white/15 pl-0 md:pl-10">
						<section className="bg-black/20 backdrop-blur-md border border-white/15 p-6 md:p-8 space-y-4">
							<div className="flex items-center gap-4 border-b border-white/10 pb-3">
								<span className="font-sans text-white tracking-[0.28rem] text-[10px] uppercase">
									Phase 01
								</span>
								<h2 className="font-serif text-2xl text-white tracking-tight">
									Curation &amp; Processing
								</h2>
							</div>
							<p className="font-sans text-white/80 text-sm leading-relaxed font-light">
								Requisitions are carefully examined and hand-inspected under
								gallery-standard illumination. Processing occurs within 1 to 2
								business days following payment confirmation.
							</p>
						</section>

						<section className="bg-black/20 backdrop-blur-md border border-white/15 p-6 md:p-8 space-y-4">
							<div className="flex items-center gap-4 border-b border-white/10 pb-3">
								<span className="font-sans text-white tracking-[0.28rem] text-[10px] uppercase">
									Phase 02
								</span>
								<h2 className="font-serif text-2xl text-white tracking-tight">
									Transit Horizon
								</h2>
							</div>
							<p className="font-sans text-white/80 text-sm leading-relaxed font-light">
								Standard domestic delivery operations conclude within 4 to 5
								working days. Remote coordinates may experience marginal
								extensions.
							</p>
						</section>

						<section className="bg-black/20 backdrop-blur-md border border-white/15 p-6 md:p-8 space-y-4">
							<div className="flex items-center gap-4 border-b border-white/10 pb-3">
								<span className="font-sans text-white tracking-[0.28rem] text-[10px] uppercase">
									Phase 03
								</span>
								<h2 className="font-serif text-2xl text-white tracking-tight">
									Operational Range
								</h2>
							</div>
							<p className="font-sans text-white/80 text-sm leading-relaxed font-light">
								Current transit capabilities are restricted to the Indian
								subcontinent. International dispatch is temporarily suspended
								pending new courier partnerships.
							</p>
						</section>

						<section className="bg-black/20 backdrop-blur-md border border-white/15 p-6 md:p-8 space-y-4">
							<div className="flex items-center gap-4 border-b border-white/10 pb-3">
								<span className="font-sans text-white tracking-[0.28rem] text-[10px] uppercase">
									Phase 04
								</span>
								<h2 className="font-serif text-2xl text-white tracking-tight">
									Archival Protection
								</h2>
							</div>
							<p className="font-sans text-white/80 text-sm leading-relaxed font-light">
								Artifacts are hermetically sealed and deployed in reinforced
								archival tubes or fortified flat mailers to strictly prevent
								environmental or structural damage.
							</p>
						</section>

						<section className="bg-black/20 backdrop-blur-md border border-white/15 p-6 md:p-8 space-y-4">
							<div className="flex items-center gap-4 border-b border-white/10 pb-3">
								<span className="font-sans text-white tracking-[0.28rem] text-[10px] uppercase">
									Phase 05
								</span>
								<h2 className="font-serif text-2xl text-white tracking-tight">
									Surveillance
								</h2>
							</div>
							<p className="font-sans text-white/80 text-sm leading-relaxed font-light">
								Encrypted tracking telemetry will be transmitted upon dispatch,
								allowing you to monitor the artifact&apos;s approach vector.
							</p>
						</section>
					</article>
				</main>

				<SiteFooter />
			</div>
		</>
	);
}
