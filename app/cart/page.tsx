"use client";

import Image from "next/image";
import Link from "next/link";
import { Canvas } from "@react-three/fiber";
import { useEffect, useMemo, useState } from "react";

import SiteFooter from "../components/common/SiteFooter";
import SiteNavbar from "../components/common/SiteNavbar";
import CloudContainer from "../components/models/Cloud";
import StarsContainer from "../components/models/Stars";
import { FRAMING_COST, posterPriceMap, posters } from "../constants/posters";
import { useThemeStore } from "../stores";
import { getSupabase } from "../../lib/supabaseClient";

type CartItem = {
	id: string;
	size: keyof typeof posterPriceMap;
	price: number;
	framed: boolean;
	quantity?: number;
};

type User = {
	id: string;
	email?: string;
};

function normalizeCart(items: CartItem[]): CartItem[] {
	return items.map((item) => {
		const basePrice = posterPriceMap[item.size] || 99;
		const normalizedPrice = item.framed ? basePrice + FRAMING_COST : basePrice;
		return { ...item, price: normalizedPrice, quantity: item.quantity || 1 };
	});
}

export default function CartPage() {
	const theme = useThemeStore((state) => state.theme);
	const [cart, setCart] = useState<CartItem[]>([]);
	const [user, setUser] = useState<User | null>(null);
	const [isDiscountApplied, setIsDiscountApplied] = useState(false);
	const [isCheckingOut, setIsCheckingOut] = useState(false);

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [address, setAddress] = useState("");

	useEffect(() => {
		if (typeof window === "undefined") return;

		const raw = window.localStorage.getItem("cart");
		const parsed = raw ? (JSON.parse(raw) as CartItem[]) : [];
		setCart(normalizeCart(parsed));
	}, []);

	useEffect(() => {
		async function fetchUser() {
			const supabase = getSupabase();

			try {
				const {
					data: { session },
				} = await supabase.auth.getSession();

				const currentUser = (session?.user as User) || null;

				if (currentUser) {
					setUser(currentUser);
					setEmail(currentUser.email || "");
				} else {
					setUser(null);
				}
			} catch (err) {
				console.error("Session verification failed", err);
			}
		}

		fetchUser();
	}, []);

	useEffect(() => {
		if (typeof window === "undefined") return;
		window.localStorage.setItem("cart", JSON.stringify(cart));
	}, [cart]);

	function updateQuantity(index: number, delta: number) {
		setCart((prev) => {
			const updated = [...prev];
			const current = updated[index];
			if (!current) return prev;

			const nextQty = (current.quantity || 1) + delta;
			if (nextQty < 1) {
				updated.splice(index, 1);
				return updated;
			}

			updated[index] = { ...current, quantity: nextQty };
			return updated;
		});
	}

	function removeItem(index: number) {
		setCart((prev) => {
			const updated = [...prev];
			updated.splice(index, 1);
			return updated;
		});
	}

	const subtotal = useMemo(() => {
		return cart.reduce(
			(sum, item) => sum + item.price * (item.quantity || 1),
			0,
		);
	}, [cart]);

	const calculatedDiscount = Math.round(subtotal * 0.05);
	const discount = isDiscountApplied ? calculatedDiscount : 0;
	const total = subtotal - discount;

	async function checkout() {
		if (isCheckingOut) return;

		if (!name || !email || !phone || !address) {
			window.alert("Please fill in all shipping details");
			return;
		}

		const supabase = getSupabase();

		let currentUser: User | null = null;
		try {
			const {
				data: { session },
			} = await supabase.auth.getSession();
			currentUser = (session?.user as User) || null;
		} catch (err) {
			console.error("Session fetch failed", err);
		}

		if (!currentUser) {
			window.alert("Please login to continue");
			window.location.assign("/account");
			return;
		}

		setIsCheckingOut(true);

		const orderId =
			"VA-" +
			Math.floor(1000 + Math.random() * 9000) +
			"-" +
			Math.floor(100 + Math.random() * 900);

		const order = {
			orderId,
			name,
			email,
			phone,
			address,
			items: cart.map((item) => {
				const poster = posters.find((p) => p.id === item.id);
				return {
					...item,
					title: poster ? poster.id.replace(/-/g, " ") : "Archive Item",
				};
			}),
			total,
		};

		window.localStorage.setItem("order", JSON.stringify(order));
		window.setTimeout(() => {
			window.location.assign("/payment");
		}, 450);
	}

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

				<main className="flex-1 pt-14 md:pt-20 pb-10 px-4 sm:px-6 md:px-12 lg:px-16 max-w-[1800px] mx-auto w-full">
					<header className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
						<div>
							<span className="block font-sans text-[10px] uppercase tracking-[0.35rem] text-white/65 mb-3">
								Cart
							</span>
							<h1 className="font-serif text-5xl md:text-7xl leading-none tracking-tight text-white">
								<span className="italic text-[#bfc6cc]">Your </span>
								<span className="not-italic font-bold">Cart</span>
							</h1>
						</div>
						<p className="font-sans text-sm md:text-base text-white/75 max-w-sm">
							Review your artifacts before checkout.
						</p>
					</header>

					<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
						<section className="lg:col-span-7 space-y-4">
							{!user && (
								<div className="border border-white/20 bg-black/20 backdrop-blur-sm px-4 py-3 text-sm text-white/85">
									Please login first to finalize your acquisition.
								</div>
							)}

							{cart.length === 0 ? (
								<div className="text-center py-20 border border-white/20 bg-black/20 backdrop-blur-sm">
									<p className="font-sans text-white/75 mb-8">
										Your cart is empty.
									</p>
									<Link
										href="/shop"
										className="inline-flex items-center px-8 py-3 border border-[#bfc6cc] text-[#bfc6cc] font-sans text-[10px] uppercase tracking-[0.28rem] hover:bg-[#bfc6cc]/25 transition-colors"
									>
										Shop Prints
									</Link>
								</div>
							) : (
								<div className="space-y-3">
									{cart.map((item, index) => {
										const poster = posters.find((p) => p.id === item.id);
										const qty = item.quantity || 1;

										if (!poster) return null;

										return (
											<article
												key={`${item.id}-${item.size}-${item.framed}-${index}`}
												className="group flex gap-3 md:gap-4 border border-white/15 bg-black/20 backdrop-blur-sm px-3 py-3 md:px-4"
											>
												<Link
													href={`/poster/${poster.id}`}
													className="w-20 md:w-24 aspect-[3/4] relative overflow-hidden shrink-0"
												>
													<Image
														src={poster.image}
														alt={poster.alt || "Poster"}
														fill
														className="object-cover group-hover:grayscale transition-all duration-500"
													/>
												</Link>

												<div className="grow">
													<div className="flex items-start justify-between gap-2 mb-1.5">
														<h3 className="font-serif text-lg md:text-xl capitalize leading-tight">
															{poster.id.replace(/-/g, " ")}
														</h3>
														<span className="font-sans text-[11px] md:text-xs uppercase tracking-[0.18rem] text-white/85">
															Rs {item.price * qty}
														</span>
													</div>

													<p className="font-sans text-[11px] md:text-sm text-white/70 mb-3 leading-relaxed">
														{item.size} Edition
														<br />
														{item.framed ? "Framed" : "Unframed"}
													</p>

													<div className="flex items-center justify-between gap-2 flex-wrap">
														<div className="flex items-center gap-2">
															<button
																aria-label="Decrease quantity"
																onClick={() => updateQuantity(index, -1)}
																className="w-8 h-8 border border-[#bfc6cc] text-[#bfc6cc] flex items-center justify-center hover:bg-[#bfc6cc]/25 transition-colors"
															>
																<Image
																	src="/icons/minus.svg"
																	alt=""
																	aria-hidden="true"
																	width={11}
																	height={11}
																/>
															</button>

															<span className="font-sans text-xs w-5 text-center">
																{qty < 10 ? `0${qty}` : qty}
															</span>

															<button
																aria-label="Increase quantity"
																onClick={() => updateQuantity(index, 1)}
																className="w-8 h-8 border border-[#bfc6cc] text-[#bfc6cc] flex items-center justify-center hover:bg-[#bfc6cc]/25 transition-colors"
															>
																<Image
																	src="/icons/plus.svg"
																	alt=""
																	aria-hidden="true"
																	width={11}
																	height={11}
																/>
															</button>
														</div>

														<button
															aria-label="Remove item"
															onClick={() => removeItem(index)}
															className="font-sans text-[10px] uppercase tracking-[0.2rem] text-[#bfc6cc] hover:bg-[#bfc6cc]/25 transition-colors flex items-center gap-1.5 px-2 py-1"
														>
															<Image
																src="/icons/delete.svg"
																alt=""
																aria-hidden="true"
																width={14}
																height={14}
															/>
															Remove
														</button>
													</div>
												</div>
											</article>
										);
									})}
								</div>
							)}
						</section>

						{cart.length > 0 && (
							<aside className="lg:col-span-5">
								<div className="lg:sticky lg:top-24 border border-white/15 bg-black/20 backdrop-blur-sm p-5 md:p-8">
									<h2 className="font-sans text-[10px] uppercase tracking-[0.3rem] text-white/75 mb-6 pb-4 border-b border-white/15">
										Shipping Details
									</h2>

									<div className="space-y-4 mb-8">
										<label className="block space-y-2">
											<span className="font-sans text-[10px] uppercase tracking-[0.2rem] text-white/70">
												Full Name
											</span>
											<input
												type="text"
												value={name}
												onChange={(e) => setName(e.target.value)}
												placeholder="John Doe"
												className="w-full bg-black/30 border border-white/20 px-3 py-2.5 text-sm text-white placeholder:text-white/45 outline-none focus:border-white/45"
											/>
										</label>

										<label className="block space-y-2">
											<span className="font-sans text-[10px] uppercase tracking-[0.2rem] text-white/70">
												Email Delivery
											</span>
											<input
												type="email"
												value={email}
												disabled={!!user}
												onChange={(e) => setEmail(e.target.value)}
												placeholder="john@example.com"
												className="w-full bg-black/30 border border-white/20 px-3 py-2.5 text-sm text-white placeholder:text-white/45 outline-none focus:border-white/45 disabled:opacity-60 disabled:cursor-not-allowed"
											/>
										</label>

										<label className="block space-y-2">
											<span className="font-sans text-[10px] uppercase tracking-[0.2rem] text-white/70">
												Contact Number
											</span>
											<input
												type="tel"
												value={phone}
												onChange={(e) => setPhone(e.target.value)}
												placeholder="+1 (555) 000-0000"
												className="w-full bg-black/30 border border-white/20 px-3 py-2.5 text-sm text-white placeholder:text-white/45 outline-none focus:border-white/45"
											/>
										</label>

										<label className="block space-y-2">
											<span className="font-sans text-[10px] uppercase tracking-[0.2rem] text-white/70">
												Shipping Destination
											</span>
											<textarea
												value={address}
												onChange={(e) => setAddress(e.target.value)}
												rows={3}
												placeholder="123 Archive Ave, Gallery District"
												className="w-full resize-none bg-black/30 border border-white/20 px-3 py-2.5 text-sm text-white placeholder:text-white/45 outline-none focus:border-white/45"
											/>
										</label>
									</div>

									<div className="space-y-4 mb-8 border-t border-white/15 pt-6">
										<div className="flex items-center justify-between">
											<span className="font-sans text-sm text-white/75">
												Subtotal
											</span>
											<span className="font-sans text-sm">Rs {subtotal}</span>
										</div>

										<div className="flex items-center justify-between">
											<span className="font-sans text-sm text-white/75">
												Member Discount (5%)
											</span>
											<div className="flex items-center gap-3">
												<span className="font-sans text-sm">
													-Rs {calculatedDiscount}
												</span>
												<button
													type="button"
													onClick={() => setIsDiscountApplied(true)}
													disabled={isDiscountApplied || subtotal === 0}
													className="px-3 py-1 border border-[#bfc6cc] text-[#bfc6cc] font-sans text-[10px] uppercase tracking-[0.16rem] hover:bg-[#bfc6cc]/25 disabled:opacity-50 relative overflow-hidden min-w-[78px]"
												>
													<span className="relative block h-[10px] leading-none">
														<span
															className={`absolute inset-0 text-center transition-all duration-300 ${
																isDiscountApplied
																	? "opacity-0 -translate-y-1"
																	: "opacity-100 translate-y-0"
															}`}
														>
															Apply
														</span>
														<span
															className={`absolute inset-0 text-center transition-all duration-300 ${
																isDiscountApplied
																	? "opacity-100 translate-y-0"
																	: "opacity-0 translate-y-1"
															}`}
														>
															Applied
														</span>
													</span>
												</button>
											</div>
										</div>

										<div className="flex items-center justify-between">
											<span className="font-sans text-sm text-white/75">
												Shipping
											</span>
											<span className="font-sans text-[10px] uppercase tracking-[0.2rem]">
												Complimentary
											</span>
										</div>

										<div className="pt-4 border-t border-white/15 flex items-end justify-between">
											<span className="font-sans text-xs uppercase tracking-[0.2rem] text-white/65">
												Total
											</span>
											<div className="text-right">
												<p
													className={`font-sans text-xs text-white/45 line-through min-h-[16px] transition-all duration-500 ${
														isDiscountApplied
															? "opacity-100 translate-y-0"
															: "opacity-0 -translate-y-1"
													}`}
												>
													Rs {subtotal}
												</p>
												<div className="inline-grid h-[44px] md:h-[56px] items-end">
													<span
														className={`col-start-1 row-start-1 font-serif text-3xl italic leading-none whitespace-nowrap transition-all duration-500 ${
															isDiscountApplied
																? "opacity-0 -translate-y-3"
																: "opacity-100 translate-y-0"
														}`}
													>
														Rs {subtotal}
													</span>
													<span
														className={`col-start-1 row-start-1 font-serif text-3xl italic leading-none whitespace-nowrap transition-all duration-500 ${
															isDiscountApplied
																? "opacity-100 translate-y-0"
																: "opacity-0 translate-y-3"
														}`}
													>
														Rs {total}
													</span>
												</div>
											</div>
										</div>
									</div>

									<div className="space-y-3">
										<button
											onClick={checkout}
											disabled={isCheckingOut}
											className="w-full bg-[#bfc6cc] text-[#2F3437] py-3.5 font-sans text-[11px] uppercase tracking-[0.2rem] transition-all duration-500 inline-flex items-center justify-center gap-2 relative overflow-hidden group hover:bg-[#bfc6cc]/25 disabled:opacity-80"
										>
											<span className="relative z-10 inline-block min-w-[104px] h-[12px] leading-none text-center">
												<span
													className={`absolute inset-0 text-center transition-all duration-300 ${
														isCheckingOut
															? "opacity-0 -translate-y-1"
															: "opacity-100 translate-y-0"
													}`}
												>
													Checkout
												</span>
												<span
													className={`absolute inset-0 text-center transition-all duration-300 ${
														isCheckingOut
															? "opacity-100 translate-y-0"
															: "opacity-0 translate-y-1"
													}`}
												>
													Processing
												</span>
											</span>
											<Image
												src="/icons/chevron-right-svgrepo-com.svg"
												alt=""
												aria-hidden="true"
												width={20}
												height={20}
												className="relative z-10 shrink-0"
											/>
											<div className="absolute inset-0 bg-[#bfc6cc]/25 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
											<div
												className="absolute inset-y-0 left-0 w-1/2 -translate-x-[140%] bg-gradient-to-r from-transparent via-black/25 to-transparent pointer-events-none"
												style={{
													animation: isCheckingOut
														? "cartSweep 1s ease-in-out forwards"
														: "none",
												}}
											/>
										</button>

										<Link
											href="/shop"
											className="block w-full text-center py-3 border border-[#bfc6cc] text-[#bfc6cc] hover:bg-[#bfc6cc]/25 font-sans text-[10px] uppercase tracking-[0.2rem] transition-colors"
										>
											Continue Shopping
										</Link>
									</div>
								</div>
							</aside>
						)}
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
			`}</style>
		</>
	);
}
