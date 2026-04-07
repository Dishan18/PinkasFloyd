"use client";

import { Canvas } from "@react-three/fiber";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";

import SiteFooter from "../components/common/SiteFooter";
import SiteNavbar from "../components/common/SiteNavbar";
import StarsContainer from "../components/models/Stars";
import { useThemeStore } from "../stores";
import { getSupabase } from "../../lib/supabaseClient";

type AuthMode = "login" | "signup" | "forgot";

type AppUser = {
	id: string;
	email?: string;
};

type OrderItem = {
	quantity?: number;
};

type OrderRecord = {
	items?: OrderItem[];
};

export default function AccountPage() {
	const supabase = useMemo(() => getSupabase(), []);
	const theme = useThemeStore((state) => state.theme);

	const [user, setUser] = useState<AppUser | null>(null);
	const [loading, setLoading] = useState(true);

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [mode, setMode] = useState<AuthMode>("login");
	const [error, setError] = useState<string | null>(null);
	const [message, setMessage] = useState<string | null>(null);
	const [acquiredPrints, setAcquiredPrints] = useState(0);
	const [needsVerification, setNeedsVerification] = useState(false);

	async function fetchApprovedPrintsCount(userId: string) {
		const { data, error: ordersError } = await supabase
			.from("orders")
			.select("items")
			.eq("user_id", userId)
			.eq("status", "approved");

		if (ordersError || !Array.isArray(data)) {
			setAcquiredPrints(0);
			return;
		}

		const total = data.reduce((ordersSum: number, order: OrderRecord) => {
			if (!Array.isArray(order.items)) return ordersSum;

			const orderQty = order.items.reduce(
				(itemsSum: number, item: OrderItem) => {
					const qty = Number(item?.quantity ?? 1);
					return itemsSum + (Number.isFinite(qty) && qty > 0 ? qty : 1);
				},
				0,
			);

			return ordersSum + orderQty;
		}, 0);

		setAcquiredPrints(total);
	}

	useEffect(() => {
		let isMounted = true;
		const loadingGuard = window.setTimeout(() => {
			if (isMounted) {
				setLoading(false);
			}
		}, 2500);

		async function init() {
			try {
				const {
					data: { session },
				} = await supabase.auth.getSession();

				if (!isMounted) return;

				const currentUser = (session?.user as AppUser) || null;
				setUser(currentUser);

				if (currentUser) {
					setEmail(currentUser.email || "");
					void fetchApprovedPrintsCount(currentUser.id);
				} else {
					setAcquiredPrints(0);
				}
			} catch {
				if (!isMounted) return;
				setUser(null);
				setAcquiredPrints(0);
			} finally {
				window.clearTimeout(loadingGuard);
				if (isMounted) {
					setLoading(false);
				}
			}
		}

		init();

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(
			async (_event: AuthChangeEvent, session: Session | null) => {
				if (!isMounted) return;

				const currentUser = (session?.user as AppUser) || null;
				setUser(currentUser);

				if (currentUser) {
					setEmail(currentUser.email || "");
					void fetchApprovedPrintsCount(currentUser.id);
				} else {
					setAcquiredPrints(0);
				}
			},
		);

		return () => {
			isMounted = false;
			window.clearTimeout(loadingGuard);
			subscription.unsubscribe();
		};
	}, [supabase]);

	async function handleAuth(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setError(null);
		setMessage(null);

		if (mode === "forgot") {
			const { error: resetError } = await supabase.auth.resetPasswordForEmail(
				email,
				{
					redirectTo: `${window.location.origin}/reset-password`,
				},
			);

			if (resetError) {
				setError(resetError.message);
				return;
			}

			setMessage(
				"Password reset link sent to your email. Please check your spam folder too.",
			);
			return;
		}

		if (mode === "login") {
			const res = await supabase.auth.signInWithPassword({ email, password });
			if (res.error) {
				setError(res.error.message);
			}
			return;
		}

		const signUpRes = await supabase.auth.signUp({ email, password });
		if (signUpRes.error) {
			setError(signUpRes.error.message);
			return;
		}

		if (!signUpRes.data.session) {
			setNeedsVerification(true);
		}
	}

	async function logout() {
		await supabase.auth.signOut();
		setUser(null);
	}

	const noiseOverlayStyle = {
		backgroundBlendMode: "soft-light" as const,
		backgroundImage:
			"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cfilter id='a'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23a)'/%3E%3C/svg%3E\")",
		backgroundRepeat: "repeat" as const,
		backgroundSize: "100px",
	};

	if (loading) {
		return (
			<div
				className="min-h-screen text-white"
				style={{ backgroundColor: theme.color, ...noiseOverlayStyle }}
			>
				<div className="min-h-screen flex items-center justify-center">
					<p className="font-sans text-[11px] uppercase tracking-[0.25rem]">
						Loading Account
					</p>
				</div>
			</div>
		);
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
				</Canvas>
			</div>

			<div className="relative z-10 min-h-screen flex flex-col text-white">
				<SiteNavbar />

				{!user ? (
					<main className="flex-1 flex items-center justify-center py-14 px-4 md:px-8">
						<div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 border border-white/15 bg-black/20 backdrop-blur-md overflow-hidden">
							<div className="hidden md:block relative min-h-[620px]">
								<div className="absolute inset-0 bg-black/35 z-10" />
								<Image
									className="w-full h-full object-cover"
									alt="Pinkasfloyd account"
									src="/pink.jpg"
									width={900}
									height={1200}
								/>
								<div className="absolute z-20 bottom-10 left-10 right-10">
									<p className="font-serif italic text-3xl mb-3">
										Posters by Pinkasfloyd.
									</p>
									<p className="font-sans text-[11px] uppercase tracking-[0.22rem] text-white/75 leading-relaxed">
										Log in to access orders and saved prints.
									</p>
								</div>
							</div>

							<div className="p-8 md:p-14 lg:p-16 bg-black/20">
								{needsVerification ? (
									<div>
										<h1 className="font-serif text-4xl mb-5 text-white">
											<span className="italic text-[#bfc6cc]">Verify </span>
											<span className="not-italic font-bold">Your Email</span>
										</h1>
										<p className="font-sans text-sm text-white/80 leading-relaxed mb-6">
											We sent a verification link to{" "}
											<span className="text-white">{email}</span>. Check inbox
											and spam.
										</p>
										<button
											type="button"
											onClick={() => {
												setNeedsVerification(false);
												setMode("login");
											}}
											className="w-full py-4 bg-white text-black font-sans text-[11px] uppercase tracking-[0.2rem] hover:bg-white/85 transition-colors"
										>
											Back to Login
										</button>
									</div>
								) : (
									<>
										<div className="mb-10">
											<h1 className="font-serif text-4xl mb-3 text-white">
												{mode === "login" ? (
													<>
														<span className="italic text-[#bfc6cc]">
															Welcome{" "}
														</span>
														<span className="not-italic font-bold">Back</span>
													</>
												) : mode === "signup" ? (
													<>
														<span className="italic text-[#bfc6cc]">
															Create{" "}
														</span>
														<span className="not-italic font-bold">
															Account
														</span>
													</>
												) : (
													<>
														<span className="italic text-[#bfc6cc]">
															Reset{" "}
														</span>
														<span className="not-italic font-bold">
															Password
														</span>
													</>
												)}
											</h1>
											<p className="font-sans text-sm text-white/75">
												{mode === "login"
													? "Enter your email and password to log in."
													: mode === "signup"
														? "Create an account to track your orders."
														: "Enter your email to receive a reset link."}
											</p>
										</div>

										<form className="space-y-7" onSubmit={handleAuth}>
											<div className="space-y-5">
												<label className="block space-y-2">
													<span className="font-sans text-[10px] uppercase tracking-[0.2rem] text-white/70">
														Email
													</span>
													<input
														type="email"
														required
														value={email}
														onChange={(e) => setEmail(e.target.value)}
														className="w-full bg-black/30 border border-white/20 px-3 py-3 text-sm text-white placeholder:text-white/45 outline-none focus:border-white/45"
														placeholder="curator@gmail.com"
													/>
												</label>

												{mode !== "forgot" && (
													<label className="block space-y-2">
														<span className="font-sans text-[10px] uppercase tracking-[0.2rem] text-white/70">
															Password
														</span>
														<input
															type="password"
															required
															value={password}
															onChange={(e) => setPassword(e.target.value)}
															className="w-full bg-black/30 border border-white/20 px-3 py-3 text-sm text-white placeholder:text-white/45 outline-none focus:border-white/45"
															placeholder="********"
														/>
													</label>
												)}
											</div>

											<div className="flex items-center justify-end">
												{mode === "login" && (
													<button
														type="button"
														onClick={() => setMode("forgot")}
														className="font-sans text-[10px] uppercase tracking-[0.18rem] text-white/75 hover:text-white"
													>
														Reset Password
													</button>
												)}
											</div>

											{error && <p className="text-red-400 text-sm">{error}</p>}
											{message && (
												<p className="text-green-400 text-sm">{message}</p>
											)}

											<div className="space-y-5 pt-2">
												<button
													type="submit"
													className="w-full py-4 bg-white text-black font-sans text-[11px] uppercase tracking-[0.2rem] hover:bg-white/85 transition-colors"
												>
													{mode === "login"
														? "Log In"
														: mode === "signup"
															? "Sign Up"
															: "Send Reset Link"}
												</button>

												<div className="text-center">
													<span className="font-sans text-sm text-white/65">
														{mode === "login"
															? "New here?"
															: "Already have an account?"}
													</span>
													<button
														type="button"
														onClick={() =>
															setMode(mode === "login" ? "signup" : "login")
														}
														className="ml-2 font-sans text-sm text-white hover:text-white/80 underline underline-offset-4"
													>
														{mode === "login" ? "Create Account" : "Log In"}
													</button>
												</div>
											</div>
										</form>
									</>
								)}
							</div>
						</div>
					</main>
				) : (
					<main className="flex-1 pt-16 pb-14 px-6 md:px-12 lg:px-16 max-w-[1800px] mx-auto w-full">
						<header className="mb-14 md:mb-18">
							<div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
								<div>
									<p className="font-sans text-[10px] uppercase tracking-[0.32rem] text-white/70 mb-3">
										Account
									</p>
									<h1 className="font-serif text-5xl md:text-7xl leading-none tracking-tight text-white">
										<span className="italic text-[#bfc6cc]">Welcome, </span>
										<span className="not-italic font-bold">
											{(user.email || "member").split("@")[0]}
										</span>
									</h1>
								</div>
								<div className="px-5 py-3 border border-white/20 bg-black/20">
									<span className="font-sans text-[10px] uppercase tracking-[0.22rem] text-white/80">
										Member
									</span>
								</div>
							</div>
						</header>

						<div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
							<aside className="lg:col-span-3 space-y-10">
								<nav className="flex flex-col gap-4">
									<button className="text-left border-l-2 border-white pl-4 font-sans text-[10px] uppercase tracking-[0.2rem] text-white">
										Dashboard
									</button>
									<Link
										href="/orders"
										className="text-left border-l-2 border-transparent hover:border-white/50 pl-4 font-sans text-[10px] uppercase tracking-[0.2rem] text-white/70 hover:text-white transition-colors"
									>
										My Collection
									</Link>
									<Link
										href="/wishlist"
										className="text-left border-l-2 border-transparent hover:border-white/50 pl-4 font-sans text-[10px] uppercase tracking-[0.2rem] text-white/70 hover:text-white transition-colors"
									>
										Desired Pieces
									</Link>
									<button
										onClick={logout}
										className="text-left border-l-2 border-transparent hover:border-white/50 pl-4 font-sans text-[10px] uppercase tracking-[0.2rem] text-white/70 hover:text-white transition-colors"
									>
										Logout
									</button>
								</nav>

								<div className="p-6 border border-white/15 bg-black/20">
									<h3 className="font-sans text-[10px] uppercase tracking-[0.2rem] text-white/75 mb-5">
										Account Overview
									</h3>
									<div className="flex items-center justify-between">
										<span className="font-sans text-xs text-white/70">
											Prints Acquired
										</span>
										<span className="font-serif text-2xl italic">
											{acquiredPrints}
										</span>
									</div>
								</div>
							</aside>

							<section className="lg:col-span-9">
								<div className="flex items-center gap-4 mb-8">
									<h2 className="font-serif italic text-3xl">Profile</h2>
									<div className="h-px flex-1 bg-white/20" />
								</div>

								<div className="border border-white/15 bg-black/20 p-6 md:p-8">
									<h3 className="font-sans text-[10px] uppercase tracking-[0.2rem] text-white/75 mb-7">
										Personal Information
									</h3>
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
										<div>
											<p className="font-sans text-[10px] uppercase tracking-[0.18rem] text-white/60 mb-2">
												Email Identity
											</p>
											<p className="font-sans text-sm text-white">
												{user.email}
											</p>
										</div>
										<div>
											<p className="font-sans text-[10px] uppercase tracking-[0.18rem] text-white/60 mb-2">
												Account Status
											</p>
											<p className="font-sans text-sm text-white">
												Verified Member
											</p>
										</div>
									</div>
								</div>
							</section>
						</div>
					</main>
				)}

				<SiteFooter />
			</div>
		</>
	);
}
