"use client";

import { useEffect, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";

import SiteNavbar from "../components/common/SiteNavbar";
import SiteFooter from "../components/common/SiteFooter";
import StarsContainer from "../components/models/Stars";
import { useThemeStore } from "../stores";
import { getSupabase } from "../../lib/supabaseClient";

export default function ResetPasswordPage() {
	const supabase = useMemo(() => getSupabase(), []);
	const theme = useThemeStore((state) => state.theme);

	const [password, setPassword] = useState("");
	const [message, setMessage] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [validSession, setValidSession] = useState(false);

	useEffect(() => {
		async function init() {
			try {
				const url = new URL(window.location.href);
				const code = url.searchParams.get("code");

				if (code) {
					const { data, error: exchangeError } =
						await supabase.auth.exchangeCodeForSession(code);

					if (exchangeError) {
						setError(exchangeError.message);
						return;
					}

					if (data.session) {
						setValidSession(true);
						return;
					}
				}

				const {
					data: { session },
				} = await supabase.auth.getSession();

				if (session) {
					setValidSession(true);
				} else {
					setError("Invalid or expired reset link.");
				}
			} catch (err) {
				console.error(err);
				setError("Something went wrong.");
			}
		}

		init();
	}, [supabase]);

	async function updatePassword() {
		setError(null);
		setMessage(null);

		if (!password || password.length < 6) {
			setError("Password must contain at least 6 characters.");
			return;
		}

		const { error: updateError } = await supabase.auth.updateUser({ password });

		if (updateError) {
			setError(updateError.message);
			return;
		}

		setMessage("Password updated. Redirecting to account...");

		window.setTimeout(() => {
			window.location.assign("/account");
		}, 1800);
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
				</Canvas>
			</div>

			<div className="relative z-10 min-h-screen flex flex-col text-white">
				<SiteNavbar />

				<main className="flex-1 flex items-center justify-center pt-20 pb-12 px-6">
					<div className="w-full max-w-md border border-white/15 bg-black/20 backdrop-blur-md p-8 md:p-10 shadow-2xl relative overflow-hidden">
						<div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -z-10" />

						<div className="mb-9 text-center">
							<span className="font-sans text-white/80 tracking-[0.5rem] uppercase text-[9px] mb-4 block">
								Security Override
							</span>
							<h1 className="text-3xl font-serif italic text-[#bfc6cc]">
								Reinstate Cipher
							</h1>
						</div>

						{!validSession ? (
							<div className="p-4 border border-red-300/35 bg-red-300/10 text-red-100 font-sans text-[10px] uppercase tracking-[0.2rem] text-center">
								{error || "Verifying session..."}
							</div>
						) : (
							<div className="space-y-6">
								<div className="space-y-2">
									<label className="font-sans text-white/70 text-[9px] uppercase tracking-[0.3em]">
										New Password
									</label>
									<input
										type="password"
										placeholder="********"
										className="w-full bg-black/30 border border-white/20 text-white py-4 px-5 text-sm placeholder:text-white/35 outline-none focus:border-white/45 transition-colors"
										onChange={(e) => setPassword(e.target.value)}
									/>
								</div>

								{error && (
									<div className="p-3 border border-red-300/35 bg-red-300/10 text-red-100 font-sans text-[10px] uppercase tracking-[0.2rem] text-center">
										{error}
									</div>
								)}

								{message && (
									<div className="p-3 border border-emerald-300/35 bg-emerald-300/10 text-emerald-100 font-sans text-[10px] uppercase tracking-[0.2rem] text-center">
										{message}
									</div>
								)}

								<button
									onClick={updatePassword}
									className="w-full py-5 bg-white text-black font-sans text-[10px] uppercase tracking-[0.3em] hover:bg-white/85 transition-colors"
								>
									Confirm Override
								</button>
							</div>
						)}
					</div>
				</main>

				<SiteFooter />
			</div>
		</>
	);
}
