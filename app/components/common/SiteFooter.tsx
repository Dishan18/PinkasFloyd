import Link from "next/link";

export default function SiteFooter() {
	return (
		<footer className="relative z-20 w-full border-t border-white/15 mt-auto bg-transparent backdrop-blur-0">
			<div className="max-w-[1700px] mx-auto px-5 md:px-10 py-8 md:py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
				<div className="flex flex-wrap items-center gap-6">
					<Link
						href="/shop"
						className="font-sans text-[10px] uppercase tracking-[0.28rem] text-white/75 hover:text-white transition-colors"
					>
						Collections
					</Link>
					<Link
						href="/shipping"
						className="font-sans text-[10px] uppercase tracking-[0.28rem] text-white/75 hover:text-white transition-colors"
					>
						Shipping
					</Link>
					<Link
						href="/refund"
						className="font-sans text-[10px] uppercase tracking-[0.28rem] text-white/75 hover:text-white transition-colors"
					>
						Refund
					</Link>
					<Link
						href="/contact"
						className="font-sans text-[10px] uppercase tracking-[0.28rem] text-white/75 hover:text-white transition-colors"
					>
						Contact
					</Link>
					<Link
						href="/privacy"
						className="font-sans text-[10px] uppercase tracking-[0.28rem] text-white/75 hover:text-white transition-colors"
					>
						Privacy
					</Link>
					<Link
						href="/terms"
						className="font-sans text-[10px] uppercase tracking-[0.28rem] text-white/75 hover:text-white transition-colors"
					>
						Terms
					</Link>
				</div>

				<p className="font-sans text-[10px] uppercase tracking-[0.2rem] text-white/55">
					Copyright 2026 Pinkasfloyd
				</p>
			</div>
		</footer>
	);
}
