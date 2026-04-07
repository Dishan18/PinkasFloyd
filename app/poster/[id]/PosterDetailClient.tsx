"use client";

import Image from "next/image";
import Link from "next/link";
import { Canvas } from "@react-three/fiber";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import CloudContainer from "@/app/components/models/Cloud";
import StarsContainer from "@/app/components/models/Stars";
import SiteNavbar from "@/app/components/common/SiteNavbar";
import SiteFooter from "@/app/components/common/SiteFooter";
import { useThemeStore } from "@/app/stores";
import { FRAMING_COST, posterPriceMap, posters } from "@/app/constants/posters";
import {
	fetchWishlistPosterIds,
	getCurrentUser,
	toggleWishlist,
} from "@/app/lib/wishlist";

type Poster = {
	id: string;
	image: string;
	alt?: string;
	category?: string[];
	sizes: string[];
};

type CartItem = {
	id: string;
	size: string;
	price: number;
	framed: boolean;
	quantity: number;
};

const dimensionsBySize: Record<string, string> = {
	A3: '11.7" x 16.5"',
	A4: '8.3" x 11.7"',
	"12x12": '12.0" x 12.0"',
	A6: '4.1" x 5.8"',
	A7: '2.9" x 4.1"',
};

export default function PosterDetailClient({
	poster,
	userId,
	initialWishlisted,
}: {
	poster: Poster;
	userId: string;
	initialWishlisted: boolean;
}) {
	const router = useRouter();
	const theme = useThemeStore((state) => state.theme);
	const [selectedSize, setSelectedSize] = useState(poster.sizes[0] || "A3");
	const [isFramed, setIsFramed] = useState(false);
	const [isWishlisted, setIsWishlisted] = useState(initialWishlisted);
	const [isAddingToCart, setIsAddingToCart] = useState(false);
	const [isWishlistAnimating, setIsWishlistAnimating] = useState(false);
	const [wishlistPulseKey, setWishlistPulseKey] = useState(0);
	const [resolvedUserId, setResolvedUserId] = useState(userId);
	const [isWishlistSaving, setIsWishlistSaving] = useState(false);

	const basePrice =
		posterPriceMap[selectedSize as keyof typeof posterPriceMap] || 99;
	const framingCost = FRAMING_COST;
	const finalPrice = isFramed ? basePrice + FRAMING_COST : basePrice;

	const { prevPoster, nextPoster } = useMemo(() => {
		const currentIndex = posters.findIndex((p) => p.id === poster.id);
		return {
			prevPoster: currentIndex > 0 ? posters[currentIndex - 1] : null,
			nextPoster:
				currentIndex >= 0 && currentIndex < posters.length - 1
					? posters[currentIndex + 1]
					: null,
		};
	}, [poster.id]);

	useEffect(() => {
		document.querySelectorAll(".close").forEach((el) => el.remove());
	}, []);

	useEffect(() => {
		let isMounted = true;

		async function hydrateWishlistState() {
			const currentUser = await getCurrentUser();

			if (!isMounted) return;

			if (!currentUser) {
				setResolvedUserId("");
				setIsWishlisted(false);
				return;
			}

			setResolvedUserId(currentUser.id);
			const ids = await fetchWishlistPosterIds(currentUser.id);

			if (!isMounted) return;
			setIsWishlisted(ids.includes(poster.id));
		}

		hydrateWishlistState();

		return () => {
			isMounted = false;
		};
	}, [poster.id]);

	const noiseOverlayStyle = {
		backgroundBlendMode: "soft-light" as const,
		backgroundImage:
			"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cfilter id='a'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23a)'/%3E%3C/svg%3E\")",
		backgroundRepeat: "repeat" as const,
		backgroundSize: "100px",
	};

	function addToCart() {
		if (isAddingToCart || typeof window === "undefined") return;

		setIsAddingToCart(true);
		const cartRaw = localStorage.getItem("cart");
		const cart: CartItem[] = cartRaw ? JSON.parse(cartRaw) : [];

		const existingIndex = cart.findIndex(
			(item) =>
				item.id === poster.id &&
				item.size === selectedSize &&
				item.framed === isFramed,
		);

		if (existingIndex >= 0) {
			cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + 1;
			cart[existingIndex].price = finalPrice;
		} else {
			cart.push({
				id: poster.id,
				size: selectedSize,
				price: finalPrice,
				framed: isFramed,
				quantity: 1,
			});
		}

		localStorage.setItem("cart", JSON.stringify(cart));
		window.setTimeout(() => setIsAddingToCart(false), 900);
	}

	async function handleWishlist() {
		if (isWishlistSaving) return;

		if (!resolvedUserId) {
			router.push("/account");
			return;
		}

		setIsWishlistSaving(true);
		const { error } = await toggleWishlist(
			resolvedUserId,
			poster.id,
			isWishlisted,
		);

		if (error) {
			setIsWishlistSaving(false);
			return;
		}

		const nextWishlisted = !isWishlisted;
		setIsWishlisted(nextWishlisted);
		setWishlistPulseKey((key) => key + 1);
		setIsWishlistSaving(false);

		setIsWishlistAnimating(true);
		window.setTimeout(() => setIsWishlistAnimating(false), 450);
	}

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

			<div className="relative z-10 min-h-screen lg:h-screen lg:min-h-0 lg:overflow-hidden flex flex-col">
				<SiteNavbar />

				<main className="w-full flex-1 px-5 md:px-10 py-6 lg:py-4 lg:overflow-hidden">
					<div className="max-w-[1700px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 lg:h-full">
						<section className="relative border border-white/15 bg-black/20 backdrop-blur-md p-6 md:p-10 min-h-[70vh] md:min-h-[78vh] lg:h-full flex items-center justify-center">
							{prevPoster && (
								<Link
									href={`/poster/${prevPoster.id}`}
									className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full border border-[#bfc6cc] bg-[#bfc6cc] text-[#2F3437] flex items-center justify-center hover:bg-[#bfc6cc]/25 transition-colors"
									title="Previous poster"
								>
									<Image
										src="/icons/chevron-left-svgrepo-com.svg"
										alt=""
										aria-hidden="true"
										width={18}
										height={18}
										className="w-[18px] h-[18px] filter brightness-0 invert"
									/>
								</Link>
							)}

							{nextPoster && (
								<Link
									href={`/poster/${nextPoster.id}`}
									className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full border border-[#bfc6cc] bg-[#bfc6cc] text-[#2F3437] flex items-center justify-center hover:bg-[#bfc6cc]/25 transition-colors"
									title="Next poster"
								>
									<Image
										src="/icons/chevron-right-svgrepo-com.svg"
										alt=""
										aria-hidden="true"
										width={18}
										height={18}
										className="w-[18px] h-[18px] filter brightness-0 invert"
									/>
								</Link>
							)}

							<div className="relative z-10 w-full max-w-[280px] sm:max-w-[360px] md:max-w-[430px] aspect-[3/4] shadow-2xl ring-1 ring-white/15 rounded-[12px] overflow-hidden">
								<Image
									src={poster.image}
									alt={poster.alt || "Poster image"}
									fill
									priority
									sizes="(min-width: 1024px) 430px, (min-width: 640px) 360px, 280px"
									className="object-cover rounded-[12px]"
								/>
								<div className="absolute bottom-3 left-3 bg-black/75 border border-white/20 rounded-md text-white/80 px-3 py-1 text-[10px] uppercase tracking-[0.32em] font-sans">
									#{poster.id}
								</div>
							</div>
						</section>

						<section className="border border-white/15 bg-black/20 backdrop-blur-md px-6 sm:px-10 lg:px-12 py-8 lg:py-10 text-white lg:h-full lg:overflow-y-auto">
							<header className="space-y-6 pb-8 border-b border-white/10">
								<span className="font-sans text-[10px] uppercase tracking-[0.45rem] text-white/70 block border-b border-white/10 pb-4">
									{poster.category?.[0] || "archive"}
								</span>
								<h1 className="font-serif italic text-5xl md:text-6xl leading-[1.1] tracking-tighter capitalize text-[#bfc6cc]">
									Artifact {poster.id}
								</h1>
								<div className="flex items-baseline space-x-2">
									<p className="font-serif text-3xl leading-none tracking-tighter">
										Rs {basePrice}
									</p>
									{isFramed && (
										<span className="font-sans text-sm italic tracking-tighter text-white/70 relative top-[-4px]">
											+ Rs {framingCost} frame
										</span>
									)}
								</div>
							</header>

							<div className="pt-8 space-y-8">
								<div className="space-y-3">
									<p className="font-sans text-[10px] uppercase tracking-[0.35rem] text-white/70">
										Size
									</p>
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
										{poster.sizes.map((size) => (
											<button
												type="button"
												key={size}
												onClick={() => setSelectedSize(size)}
												className={`px-3 py-2 border text-left transition-colors ${
													selectedSize === size
														? "border-[#bfc6cc] bg-[#bfc6cc] text-[#2F3437]"
														: "border-[#bfc6cc]/45 bg-black/20 text-[#bfc6cc] hover:bg-[#bfc6cc]/25"
												}`}
											>
												<div className="flex items-center justify-between gap-3">
													<span className="font-sans text-[10px] uppercase tracking-[0.16rem]">
														{size}
													</span>
													<span className="font-sans text-[9px] text-current/70 text-right">
														{dimensionsBySize[size] || "Standard"}
													</span>
												</div>
											</button>
										))}
									</div>
								</div>

								<div className="space-y-3">
									<p className="font-sans text-[10px] uppercase tracking-[0.35rem] text-white/70">
										Finish
									</p>
									<div className="grid grid-cols-1 gap-2">
										<button
											type="button"
											onClick={() => setIsFramed(false)}
											className={`px-3 py-2 border text-left transition-colors ${
												!isFramed
													? "border-[#bfc6cc] bg-[#bfc6cc] text-[#2F3437]"
													: "border-[#bfc6cc]/45 bg-black/20 text-[#bfc6cc] hover:bg-[#bfc6cc]/25"
											}`}
										>
											<div className="flex items-center justify-between gap-3">
												<span className="font-sans text-[10px] uppercase tracking-[0.18rem]">
													Unframed Roll
												</span>
												<span className="font-sans text-[9px] text-current/70 text-right">
													Included
												</span>
											</div>
										</button>
										<button
											type="button"
											onClick={() => setIsFramed(true)}
											className={`px-3 py-2 border text-left transition-colors ${
												isFramed
													? "border-[#bfc6cc] bg-[#bfc6cc] text-[#2F3437]"
													: "border-[#bfc6cc]/45 bg-black/20 text-[#bfc6cc] hover:bg-[#bfc6cc]/25"
											}`}
										>
											<div className="flex items-center justify-between gap-3">
												<span className="font-sans text-[10px] uppercase tracking-[0.18rem]">
													Framed
												</span>
												<span className="font-sans text-[9px] text-current/70 text-right">
													+Rs {FRAMING_COST}
												</span>
											</div>
										</button>
									</div>
								</div>

								<div className="space-y-3">
									<div className="grid grid-cols-2 gap-2">
										<button
											type="button"
											onClick={addToCart}
											disabled={isAddingToCart}
											className="w-full py-3 sm:py-5 bg-[#bfc6cc] text-[#2F3437] font-sans text-[8px] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.35em] transition-all duration-500 relative overflow-hidden group hover:bg-[#bfc6cc]/25 disabled:opacity-70"
										>
											<span className="relative z-10 block h-[10px] sm:h-[14px] leading-none">
												<span
													className={`absolute inset-0 text-center transition-all duration-300 ${isAddingToCart ? "opacity-0 -translate-y-1" : "opacity-100 translate-y-0"}`}
												>
													Add to Cart
												</span>
												<span
													className={`absolute inset-0 text-center transition-all duration-300 ${isAddingToCart ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"}`}
												>
													Adding to Cart
												</span>
											</span>
											<div className="absolute inset-0 bg-[#bfc6cc]/25 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
											<div
												className="absolute inset-y-0 left-0 w-1/2 -translate-x-[140%] bg-gradient-to-r from-transparent via-black/25 to-transparent pointer-events-none"
												style={{
													animation: isAddingToCart
														? "cartSweep 1s ease-in-out forwards"
														: "none",
												}}
											/>
										</button>

										<button
											type="button"
											onClick={handleWishlist}
											disabled={isWishlistSaving}
											className={`w-full py-3 sm:py-5 border font-sans text-[8px] sm:text-[10px] uppercase tracking-[0.1em] sm:tracking-[0.3em] transition-all duration-500 ${
												isWishlisted
													? "border-[#bfc6cc] bg-[#bfc6cc] text-[#2F3437]"
													: "border-[#bfc6cc]/45 text-[#bfc6cc] hover:bg-[#bfc6cc]/25"
											} ${isWishlistAnimating ? "scale-[1.02]" : "scale-100"} ${isWishlistSaving ? "opacity-75" : "opacity-100"} relative overflow-hidden`}
										>
											<span className="relative block h-[10px] sm:h-[14px] leading-none">
												<span
													className={`absolute inset-0 text-center transition-all duration-300 ${isWishlisted ? "opacity-0 -translate-y-1" : "opacity-100 translate-y-0"}`}
												>
													Wishlist
												</span>
												<span
													className={`absolute inset-0 text-center transition-all duration-300 ${isWishlisted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"}`}
												>
													Wishlisted
												</span>
											</span>
											<span
												key={wishlistPulseKey}
												className={`pointer-events-none absolute inset-0 ${isWishlistAnimating ? "wishlistPing" : ""}`}
											/>
										</button>
									</div>

									<button
										type="button"
										onClick={() => router.push(`/shop#${poster.id}`)}
										className="w-full py-3 border border-[#bfc6cc] text-[#bfc6cc] hover:bg-[#bfc6cc]/25 font-sans text-[10px] uppercase tracking-[0.3rem] transition-colors"
									>
										Back to Shop
									</button>
								</div>

								<div className="pt-8 border-t border-white/10 space-y-4">
									<h3 className="font-serif text-2xl italic">Details</h3>
									<p className="font-sans text-white/80 leading-relaxed text-sm">
										Printed on heavyweight premium stock with quality inks. Each
										print is quality-checked before dispatch.
									</p>
									<ul className="space-y-2 font-sans text-[10px] uppercase tracking-[0.22rem] text-white/70">
										<li>350 GSM premium paper</li>
										<li>Secure global shipping</li>
										<li>Museum grade framing</li>
									</ul>
								</div>
							</div>
						</section>
					</div>
				</main>

				<SiteFooter />
			</div>

			<style jsx>{`
				@keyframes cartSweep {
					0% {
						transform: translateX(-140%);
					}
					100% {
						transform: translateX(320%);
					}
				}

				.wishlistPing {
					animation: wishlistPing 420ms ease;
				}

				@keyframes wishlistPing {
					0% {
						opacity: 0;
						transform: scale(0.96);
					}
					45% {
						opacity: 0.18;
						transform: scale(1.02);
					}
					100% {
						opacity: 0;
						transform: scale(1.05);
					}
				}
			`}</style>
		</>
	);
}
