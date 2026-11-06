"use client";

import SiteNavbar from "../components/common/SiteNavbar";
import PageBackground from "@/app/components/common/PageBackground";
import SiteFooter from "../components/common/SiteFooter";


export default function RefundPageClient() {

	return (
		<>
			<PageBackground />

			<div className="relative z-10 min-h-screen flex flex-col text-white">
				<SiteNavbar />

				<main className="pt-16 md:pt-20 pb-14 md:pb-20 px-6 md:px-12 max-w-5xl mx-auto w-full flex-1">
					<header className="mb-12 md:mb-16 space-y-5">
						<p className="font-sans text-white text-[10px] uppercase tracking-[0.46rem] flex items-center gap-4">
							<span className="w-8 h-[1px] bg-white/40" />
							Resolution Protocol
						</p>
						<h1 className="font-serif text-5xl md:text-7xl tracking-tight leading-[0.95] text-white">
							<span className="italic text-[#bfc6cc]">Refund </span>
							<span className="not-italic font-bold">Directive</span>
						</h1>
						<p className="text-white/80 font-sans text-base max-w-2xl leading-relaxed font-light italic">
							Outlining the acceptable parameters for the retrieval and
							reimbursement of compromised artifacts.
						</p>
					</header>

					<article className="space-y-6 md:space-y-8 border-l border-white/15 pl-0 md:pl-10">
						<section className="bg-black/20 backdrop-blur-md border border-white/15 p-6 md:p-8 space-y-4">
							<div className="flex items-center gap-4 border-b border-white/10 pb-3">
								<span className="font-sans text-white tracking-[0.28rem] text-[10px] uppercase">
									Condition 01
								</span>
								<h2 className="font-serif text-2xl text-white tracking-tight">
									Refund Eligibility
								</h2>
							</div>
							<p className="font-sans text-white/80 text-sm leading-relaxed font-light">
								Reimbursements and exchanges are strictly authorized solely for
								artifacts that arrive exhibiting critical structural damage or
								misprints resulting directly from transit or production failure.
							</p>
						</section>

						<section className="bg-black/20 backdrop-blur-md border border-white/15 p-6 md:p-8 space-y-4">
							<div className="flex items-center gap-4 border-b border-white/10 pb-3">
								<span className="font-sans text-white tracking-[0.28rem] text-[10px] uppercase">
									Condition 02
								</span>
								<h2 className="font-serif text-2xl text-white tracking-tight">
									Initiation Sequence
								</h2>
							</div>
							<p className="font-sans text-white/80 text-sm leading-relaxed font-light">
								You must transmit a formal damage report within 48 hours of
								successful delivery telemetry to:
							</p>
							<a
								href="mailto:dishansarkar9@gmail.com"
								className="font-sans text-white text-[11px] uppercase tracking-[0.24rem] inline-block hover:text-white/75 transition-colors underline underline-offset-4"
							>
								dishansarkar9@gmail.com
							</a>
							<p className="font-sans text-white/80 text-sm leading-relaxed font-light">
								The transmission must include the Archive ID (Order ID),
								high-resolution photographic evidence of the compromise, and a
								concise incident summary.
							</p>
						</section>

						<section className="bg-black/20 backdrop-blur-md border border-white/15 p-6 md:p-8 space-y-4">
							<div className="flex items-center gap-4 border-b border-white/10 pb-3">
								<span className="font-sans text-white tracking-[0.28rem] text-[10px] uppercase">
									Condition 03
								</span>
								<h2 className="font-serif text-2xl text-white tracking-tight">
									Processing Delta
								</h2>
							</div>
							<p className="font-sans text-white/80 text-sm leading-relaxed font-light">
								Approved reimbursements or replacement dispatches will be
								orchestrated within 3 to 5 business cycles following our
								verification of the anomaly.
							</p>
						</section>

						<section className="bg-black/20 backdrop-blur-md border border-white/15 p-6 md:p-8 space-y-4">
							<div className="flex items-center gap-4 border-b border-white/10 pb-3">
								<span className="font-sans text-white tracking-[0.28rem] text-[10px] uppercase">
									Condition 04
								</span>
								<h2 className="font-serif text-2xl text-white tracking-tight">
									Non-Refundable Parameters
								</h2>
							</div>
							<p className="font-sans text-white/80 text-sm leading-relaxed font-light">
								The following manifestations do not qualify for engagement of
								the refund directive:
							</p>
							<ul className="list-disc list-inside font-sans text-white/80 text-sm font-light space-y-2">
								<li>Capricious alteration of preference (Change of mind).</li>
								<li>Compromises inflicted to the artifact post-delivery.</li>
								<li>
									Appeals transmitted outside the 48-hour authorization window.
								</li>
							</ul>
						</section>
					</article>
				</main>

				<SiteFooter />
			</div>
		</>
	);
}
