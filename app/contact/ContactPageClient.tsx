"use client";

import Image from "next/image";
import { Canvas } from "@react-three/fiber";

import SiteNavbar from "../components/common/SiteNavbar";
import SiteFooter from "../components/common/SiteFooter";
import CloudContainer from "../components/models/Cloud";
import StarsContainer from "../components/models/Stars";
import { useThemeStore } from "../stores";

export default function ContactPageClient() {
	const theme = useThemeStore((state) => state.theme);

	const noiseOverlayStyle = {
		backgroundBlendMode: "soft-light" as const,
		backgroundImage:
			"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cfilter id='a'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23a)'/%3E%3C/svg%3E\")",
		backgroundRepeat: "repeat" as const,
		backgroundSize: "100px",
	};

	return (
		<>
			<div
				className="fixed inset-0 w-full h-full z-0 transition-colors duration-1000"
				style={{ backgroundColor: theme.color, ...noiseOverlayStyle }}
			>
				<Canvas camera={{ position: [0, 0, 1] }}>
					<ambientLight intensity={0.5} />
					<StarsContainer />
					<CloudContainer />
				</Canvas>
			</div>

			<div className="relative z-10 min-h-screen flex flex-col text-white">
				<SiteNavbar />

				<main className="pt-14 md:pt-20 pb-16 md:pb-20 px-6 md:px-12 max-w-[1200px] mx-auto w-full flex-1">
					<header className="mb-16 md:mb-20 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-10 border-b border-white/15 pb-10 md:pb-12">
						<div className="max-w-3xl">
							<p className="font-sans text-white/80 text-[10px] uppercase tracking-[0.5rem] mb-6 flex items-center md:justify-start justify-center gap-4">
								<span className="w-8 h-[1px] bg-white/40 hidden md:block" />
								Curatorial Desk
							</p>
							<h1 className="font-serif text-5xl md:text-7xl italic tracking-tight text-[#bfc6cc] mb-6">
								Establish Contact
							</h1>
							<p className="text-white/80 font-sans text-lg max-w-xl leading-relaxed font-light italic mx-auto md:mx-0">
								For inquiries, commissions, or questions regarding our
								collection.
							</p>
						</div>
					</header>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
						<div className="space-y-12 md:space-y-14">
							<section className="space-y-5">
								<div className="flex justify-between items-center border-b border-white/15 pb-4">
									<h3 className="font-serif text-2xl text-white">
										Direct Comm
									</h3>
									<Image
										src="/icons/email.svg"
										alt="Mail"
										width={24}
										height={24}
										className="opacity-75 filter brightness-0 invert"
									/>
								</div>
								<p className="font-sans text-white/75 text-sm font-light leading-relaxed">
									For orders, returns, or general inquiries. All messages are
									carefully reviewed.
								</p>
								<a
									href="mailto:dishansarkar9@gmail.com"
									className="inline-block text-white font-sans text-[10px] uppercase tracking-[0.3em] pb-1 border-b border-white/35 hover:border-white transition-colors"
								>
									dishansarkar9@gmail.com
								</a>
							</section>

							<section className="space-y-5">
								<div className="flex justify-between items-center border-b border-white/15 pb-4">
									<h3 className="font-serif text-2xl text-white">
										Response Frequency
									</h3>
									<Image
										src="/icons/alarm.svg"
										alt="Schedule"
										width={24}
										height={24}
										className="opacity-75 filter brightness-0 invert"
									/>
								</div>
								<p className="font-sans text-white/75 text-sm font-light leading-relaxed">
									Responses are typically issued within 24 hours. For order
									queries, include your Archive ID.
								</p>
							</section>

							<section className="space-y-5">
								<div className="flex justify-between items-center border-b border-white/15 pb-4">
									<h3 className="font-serif text-2xl text-white">
										Bespoke Commissions
									</h3>
									<Image
										src="/icons/architecture.svg"
										alt="Architecture"
										width={24}
										height={24}
										className="opacity-75 filter brightness-0 invert"
									/>
								</div>
								<p className="font-sans text-white/75 text-sm font-light leading-relaxed">
									For custom pieces, share your references. Each work is created
									with careful alignment to our aesthetic.
								</p>
							</section>
						</div>

						<div className="relative p-8 md:p-12 border border-white/15 bg-black/20 backdrop-blur-sm overflow-hidden">
							<div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -z-10" />

							<h2 className="font-serif text-3xl italic text-white mb-8">
								The Manifesto
							</h2>

							<div className="space-y-6 font-sans text-white/75 text-sm font-light leading-relaxed italic">
								<p>
									Pinkasfloyd sits at the intersection of music, cinema, and a
									restrained, meticulous aesthetic. It avoids visual noise and
									rewards close attention.
								</p>
								<p>
									Our repertoire draws from iconic album sleeve typography,
									esoteric cinema promotional materials, and a visual language
									that echoes long after the initial view.
								</p>
								<p>
									These are not mere prints. They are intentional fragments of
									narrative for the spaces you curate.
								</p>
							</div>
						</div>
					</div>
				</main>

				<SiteFooter />
			</div>
		</>
	);
}
