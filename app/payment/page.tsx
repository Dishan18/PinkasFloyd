"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Canvas } from "@react-three/fiber";

import SiteNavbar from "../components/common/SiteNavbar";
import SiteFooter from "../components/common/SiteFooter";
import CloudContainer from "../components/models/Cloud";
import StarsContainer from "../components/models/Stars";
import { posters } from "../constants/posters";
import { useThemeStore } from "../stores";
import { getSupabase } from "../../lib/supabaseClient";

type OrderItem = {
	id: string;
	title?: string;
	size?: string;
	price: number;
	quantity?: number;
	framed?: boolean;
};

type OrderData = {
	orderId: string;
	name: string;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: OrderItem[];
};

type ItemPayload = {
	id: string;
	title: string;
	size: string;
	price: number;
	quantity: number;
	subtotal: number;
	framed: boolean;
};

export default function PaymentPage() {
	const theme = useThemeStore((state) => state.theme);
	const [order, setOrder] = useState<OrderData | null>(null);
	const [itemsJson, setItemsJson] = useState<ItemPayload[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [mounted, setMounted] = useState(false);

	const insertAttempted = useRef(false);

	useEffect(() => {
		setMounted(true);

		if (typeof window === "undefined") return;

		const raw = window.localStorage.getItem("order");
		const data = raw ? (JSON.parse(raw) as OrderData) : null;
		setOrder(data);

		if (!data) return;

		const enriched = data.items.map((item) => {
			const poster = posters.find((p) => p.id === item.id);
			const qty = item.quantity || 1;

			return {
				id: item.id,
				title: poster ? poster.id.replace(/-/g, " ") : item.id,
				size: item.size || "Standard",
				price: item.price,
				quantity: qty,
				subtotal: item.price * qty,
				framed: !!item.framed,
			};
		});

		setItemsJson(enriched);
	}, []);

	async function handlePayment() {
		if (loading || !order || insertAttempted.current) return;

		setLoading(true);
		setError(null);
		insertAttempted.current = true;

		try {
			const supabase = getSupabase();

			const {
				data: { session },
			} = await supabase.auth.getSession();

			const user = session?.user;

			if (!user) {
				throw new Error("Authorization credentials missing.");
			}

			const itemsText = itemsJson
				.map(
					(item, i) =>
						`${i + 1}. ${item.title} (${item.size}, ${item.framed ? "Framed" : "Unframed"}) x ${item.quantity} = Rs ${item.subtotal}`,
				)
				.join("\n");

			const message = `Archive Order ID: ${order.orderId}\n\n${itemsText}\n\nTotal Requisition: Rs ${order.total}\n\nCollector: ${order.name}\nComm Link: ${order.phone}\n\nEstablishing transaction node. Please provide secure transfer coordinates (QR).`;

			const whatsappUrl = `https://wa.me/918902130104?text=${encodeURIComponent(message)}`;

			const existing = await supabase
				.from("orders")
				.select("id")
				.eq("order_id", order.orderId)
				.maybeSingle();

			if (!existing.data) {
				const { error: dbError } = await supabase.from("orders").insert([
					{
						order_id: order.orderId,
						user_id: user.id,
						name: order.name,
						email: order.email,
						phone: order.phone,
						address: order.address,
						items: itemsJson,
						total: order.total,
					},
				]);

				if (dbError) throw dbError;
			}

			window.localStorage.removeItem("cart");
			window.localStorage.removeItem("order");

			window.location.assign(whatsappUrl);
		} catch (err) {
			console.error(err);
			setError("Payment channel handshake failed. Please retry.");
			setLoading(false);
			insertAttempted.current = false;
		}
	}

	const noiseOverlayStyle = {
		backgroundBlendMode: "soft-light" as const,
		backgroundImage:
			"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cfilter id='a'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23a)'/%3E%3C/svg%3E\")",
		backgroundRepeat: "repeat" as const,
		backgroundSize: "100px",
	};

	if (!mounted) return null;

	if (!order) {
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
					<div className="flex-1 flex items-center justify-center font-serif italic text-xl px-6 text-center">
						No pending orders detected.
					</div>
					<SiteFooter />
				</div>
			</>
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
					<CloudContainer />
				</Canvas>
			</div>

			<div className="relative z-10 min-h-screen flex flex-col text-white">
				<SiteNavbar />

				<main className="flex-1 pt-16 pb-14 px-6 md:px-12 max-w-[1200px] mx-auto w-full">
					<div className="max-w-xl mx-auto space-y-10">
						<header className="text-center">
							<p className="font-sans text-white/80 text-[10px] uppercase tracking-[0.5rem] mb-3">
								Checkout
							</p>
							<h1 className="font-serif text-5xl tracking-tight text-white mb-4">
								<span className="italic text-[#bfc6cc]">Secure </span>
								<span className="not-italic font-bold">Payment</span>
							</h1>
							<p className="font-sans text-sm font-light text-white/75 italic leading-relaxed max-w-sm mx-auto">
								Complete your purchase via the secure channel.
							</p>
						</header>

						<div className="border border-white/15 bg-black/20 backdrop-blur-md p-8 md:p-10 shadow-2xl relative overflow-hidden group">
							<div className="flex justify-between items-start border-b border-white/10 pb-6 mb-8 gap-4">
								<div>
									<p className="font-sans text-white/65 text-[9px] uppercase tracking-[0.3em] mb-2">
										Order ID
									</p>
									<p className="font-serif text-2xl text-white tracking-wide">
										{order.orderId}
									</p>
								</div>
								<div className="text-right">
									<p className="font-sans text-white/65 text-[9px] uppercase tracking-[0.3em] mb-2">
										Total
									</p>
									<p className="font-serif text-3xl text-white">
										Rs {order.total}
									</p>
								</div>
							</div>

							<div className="space-y-7">
								<div className="border border-white/10 bg-black/20 p-5 space-y-3">
									<div className="flex items-center gap-3 text-white mb-1">
										<Image
											src="/icons/lock.svg"
											alt="Lock"
											width={18}
											height={18}
										/>
										<p className="font-sans text-[10px] uppercase tracking-[0.24rem]">
											Secure Transfer
										</p>
									</div>
									<p className="font-sans text-xs leading-relaxed text-white/70 font-light">
										You will be redirected to WhatsApp. Send the pre-filled
										message to receive secure payment instructions.
									</p>
								</div>

								{error && (
									<div className="p-3 border border-red-300/35 bg-red-300/10 text-red-100 font-sans text-[10px] uppercase tracking-[0.2rem] text-center">
										{error}
									</div>
								)}

								<button
									onClick={handlePayment}
									disabled={loading}
									className="w-full py-5 bg-white text-black font-sans uppercase tracking-[0.3em] text-[10px] font-bold transition-all duration-500 shadow-lg shadow-white/10 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
								>
									<span className="relative z-10">
										{loading ? "Processing" : "Pay Now"}
									</span>
									<div className="absolute inset-0 bg-black/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
								</button>
							</div>
						</div>
					</div>
				</main>

				<SiteFooter />
			</div>
		</>
	);
}
