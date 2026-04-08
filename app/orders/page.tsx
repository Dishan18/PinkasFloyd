"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Canvas } from "@react-three/fiber";

import SiteNavbar from "../components/common/SiteNavbar";
import SiteFooter from "../components/common/SiteFooter";
import StarsContainer from "../components/models/Stars";
import { posters } from "../constants/posters";
import { useTheme } from "@/app/contexts/ThemeContext";
import { getSupabase } from "../../lib/supabaseClient";

type OrderItem = {
	id: string;
	title?: string;
	size?: string;
	framed?: boolean;
	price: number;
	quantity?: number;
};

type Order = {
	id: number;
	order_id: string;
	created_at: string;
	status?: "pending" | "approved" | "declined" | string;
	total: number;
	items?: OrderItem[];
};

type FilterKey = "all" | "pending" | "approved" | "declined";

export default function OrdersPage() {
	const router = useRouter();
	const { theme } = useTheme();
	const [orders, setOrders] = useState<Order[]>([]);
	const [loading, setLoading] = useState(true);
	const [activeFilter, setActiveFilter] = useState<FilterKey>("all");

	useEffect(() => {
		let isMounted = true;
		const loadingGuard = window.setTimeout(() => {
			if (isMounted) {
				setLoading(false);
			}
		}, 2500);

		async function fetchOrders() {
			try {
				const supabase = getSupabase();

				const {
					data: { session },
				} = await supabase.auth.getSession();

				if (!isMounted) return;

				const user = session?.user;

				if (!user) {
					router.replace("/account");
					return;
				}

				const { data, error } = await supabase
					.from("orders")
					.select("*")
					.eq("user_id", user.id)
					.order("created_at", { ascending: false });

				if (!isMounted) return;

				if (!error) {
					setOrders((data as Order[]) || []);
				}
			} catch {
				if (!isMounted) return;
				setOrders([]);
			} finally {
				window.clearTimeout(loadingGuard);
				if (isMounted) {
					setLoading(false);
				}
			}
		}

		fetchOrders();

		return () => {
			isMounted = false;
			window.clearTimeout(loadingGuard);
		};
	}, [router]);

	function getStatusStyle(status: string) {
		switch (status) {
			case "approved":
				return {
					cardBorder: "border-white/40",
					badgeBg: "bg-white/12",
					badgeText: "text-white border-white/20",
				};
			case "declined":
				return {
					cardBorder: "border-red-300/35",
					badgeBg: "bg-red-200/10",
					badgeText: "text-red-200 border-red-200/25",
				};
			case "pending":
			default:
				return {
					cardBorder: "border-[#bfc6cc]/35",
					badgeBg: "bg-[#bfc6cc]/10",
					badgeText: "text-[#bfc6cc] border-[#bfc6cc]/25",
				};
		}
	}

	const statusCounts = useMemo(() => {
		return {
			all: orders.length,
			pending: orders.filter(
				(order) => (order.status || "pending") === "pending",
			).length,
			approved: orders.filter((order) => order.status === "approved").length,
			declined: orders.filter((order) => order.status === "declined").length,
		};
	}, [orders]);

	const filteredOrders = useMemo(() => {
		if (activeFilter === "all") return orders;
		return orders.filter(
			(order) => (order.status || "pending") === activeFilter,
		);
	}, [activeFilter, orders]);

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
						Loading Orders
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

				<main className="flex-1 pt-16 pb-14 px-6 md:px-12 lg:px-16 max-w-[1800px] mx-auto w-full">
					<header className="mb-12 md:mb-16">
						<p className="font-sans text-[10px] uppercase tracking-[0.32rem] text-white/70 mb-3">
							Orders
						</p>
						<h1 className="font-serif text-5xl md:text-7xl leading-none tracking-tight text-white">
							<span className="italic text-[#bfc6cc]">Order </span>
							<span className="not-italic font-bold">History</span>
						</h1>
						<div className="h-px w-32 bg-white/30 mt-6" />
					</header>

					<div className="flex flex-wrap gap-6 md:gap-8 mb-10 items-end border-b border-white/15 pb-3 overflow-x-auto">
						{(["all", "pending", "approved", "declined"] as FilterKey[]).map(
							(key) => (
								<button
									key={key}
									onClick={() => setActiveFilter(key)}
									className={`${
										activeFilter === key
											? "text-white"
											: "text-white/45 hover:text-white/80"
									} font-sans text-[11px] uppercase tracking-[0.2rem] whitespace-nowrap transition-colors`}
								>
									{key === "all" ? "All Orders" : key}
									{statusCounts[key] > 0 ? ` (${statusCounts[key]})` : ""}
								</button>
							),
						)}
					</div>

					{orders.length === 0 ? (
						<div className="text-center text-white/60 italic py-20 border border-white/20 bg-black/20 backdrop-blur-sm">
							<p>You have no orders yet.</p>
							<Link
								href="/shop"
								className="inline-block mt-6 border border-white/45 text-white px-6 py-3 font-sans text-[10px] uppercase tracking-[0.22rem] hover:border-white transition-colors"
							>
								Shop Prints
							</Link>
						</div>
					) : filteredOrders.length === 0 ? (
						<div className="text-center text-white/60 italic py-20 border border-white/20 bg-black/20 backdrop-blur-sm">
							<p>No {activeFilter} orders found.</p>
						</div>
					) : (
						<div className="grid grid-cols-1 gap-8 md:gap-10">
							{filteredOrders.map((order) => {
								const styles = getStatusStyle(order.status || "pending");

								return (
									<article
										key={order.id}
										className={`bg-black/20 backdrop-blur-sm border-l-2 ${styles.cardBorder} border-y border-r border-white/10 p-6 md:p-8`}
									>
										<div className="flex flex-col md:flex-row justify-between gap-7">
											<div className="flex-1">
												<div className="flex items-center gap-4 mb-5 flex-wrap">
													<span
														className={`px-3 py-1 ${styles.badgeBg} ${styles.badgeText} text-[10px] font-sans tracking-[0.16rem] uppercase rounded-full border`}
													>
														{order.status || "pending"}
													</span>
													<span className="font-sans text-[10px] uppercase tracking-[0.16rem] text-white/40">
														ID: {order.order_id}
													</span>
												</div>

												<h2 className="font-serif text-2xl md:text-3xl mb-6 capitalize">
													{order.items?.length === 1 && order.items[0].title
														? order.items[0].title
														: `Order (${order.items?.length || 0} Prints)`}
												</h2>

												<div className="space-y-5">
													{order.items?.map((item, index) => {
														const posterDef = posters.find(
															(p) => p.id === item.id,
														);
														return (
															<div
																key={`${item.id}-${index}`}
																className="flex items-start gap-4 border-b border-white/10 pb-5 last:border-0 last:pb-0"
															>
																{posterDef && (
																	<div className="w-16 md:w-20 h-24 md:h-28 shrink-0 relative overflow-hidden bg-black/25">
																		<Image
																			src={posterDef.image}
																			alt={item.title || "Artwork"}
																			fill
																			className="object-cover"
																		/>
																	</div>
																)}

																<div className="flex-1">
																	<p className="font-serif text-lg capitalize">
																		{item.title || "Archive Item"}
																	</p>
																	<p className="font-sans text-sm text-white/65 mt-1">
																		{item.size || "Standard"} Edition -{" "}
																		{item.framed ? "Framed" : "Unframed"} - Qty:{" "}
																		{item.quantity || 1}
																	</p>
																	<p className="font-sans text-sm text-white mt-2">
																		Rs {item.price * (item.quantity || 1)}
																	</p>
																</div>
															</div>
														);
													})}
												</div>
											</div>

											<div className="md:w-60 border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-6 flex flex-col justify-between">
												<div>
													<p className="font-sans text-[10px] uppercase tracking-[0.18rem] text-white/50 mb-2">
														Order Date
													</p>
													<p className="font-serif text-xl mb-5">
														{new Date(order.created_at).toLocaleDateString(
															"en-US",
															{
																month: "short",
																day: "numeric",
																year: "numeric",
															},
														)}
													</p>

													<p className="font-sans text-[10px] uppercase tracking-[0.18rem] text-white/50 mb-2">
														Total
													</p>
													<p
														className={`font-serif text-3xl ${
															order.status === "declined"
																? "text-white/40 line-through"
																: "text-white"
														}`}
													>
														Rs {order.total}
													</p>
												</div>
											</div>
										</div>
									</article>
								);
							})}
						</div>
					)}
				</main>

				<SiteFooter />
			</div>
		</>
	);
}
