"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Canvas } from "@react-three/fiber";

import PosterGrid from "../components/PosterGrid";
import SiteNavbar from "../components/common/SiteNavbar";
import SiteFooter from "../components/common/SiteFooter";
import CloudContainer from "../components/models/Cloud";
import StarsContainer from "../components/models/Stars";
import { posters } from "../constants/posters";
import {
	fetchWishlistPosterIds,
	getCurrentUser,
	toggleWishlist,
} from "../lib/wishlist";
import { useThemeStore } from "../stores";

type AppUser = {
	id: string;
};

export default function WishlistPage() {
	const router = useRouter();
	const theme = useThemeStore((state) => state.theme);

	const [user, setUser] = useState<AppUser | null>(null);
	const [loading, setLoading] = useState(true);
	const [wishlistIds, setWishlistIds] = useState<string[]>([]);

	useEffect(() => {
		let isMounted = true;
		const loadingGuard = window.setTimeout(() => {
			if (isMounted) {
				setLoading(false);
			}
		}, 2500);

		async function loadWishlist() {
			try {
				const currentUser = await getCurrentUser();

				if (!isMounted) return;

				if (!currentUser) {
					setUser(null);
					setWishlistIds([]);
					return;
				}

				setUser(currentUser);
				const ids = await fetchWishlistPosterIds(currentUser.id);
				if (!isMounted) return;
				setWishlistIds(ids);
			} catch {
				if (!isMounted) return;
				setUser(null);
				setWishlistIds([]);
			} finally {
				window.clearTimeout(loadingGuard);
				if (isMounted) {
					setLoading(false);
				}
			}
		}

		loadWishlist();

		return () => {
			isMounted = false;
			window.clearTimeout(loadingGuard);
		};
	}, []);

	async function handleToggleWishlist(posterId: string) {
		if (!user) {
			router.push("/account");
			return;
		}

		const isWishlisted = wishlistIds.includes(posterId);
		const { error } = await toggleWishlist(user.id, posterId, isWishlisted);
		if (error) return;

		setWishlistIds((prev) =>
			prev.includes(posterId)
				? prev.filter((id) => id !== posterId)
				: [...prev, posterId],
		);
	}

	const wishlistedPosters = useMemo(() => {
		return posters.filter((poster) => wishlistIds.includes(poster.id));
	}, [wishlistIds]);

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
						Loading Wishlist
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
					<CloudContainer />
				</Canvas>
			</div>

			<div className="relative z-10 min-h-screen flex flex-col">
				<SiteNavbar />

				<main className="pt-14 md:pt-20 pb-14 px-6 md:px-12 max-w-[1800px] mx-auto w-full flex-1">
					{!user ? (
						<div className="mt-12 py-20 text-center border border-white/20 bg-black/20 backdrop-blur-sm">
							<h1 className="font-serif text-4xl text-white mb-5">
								<span className="italic text-[#bfc6cc]">Your </span>
								<span className="not-italic font-bold">Wishlist</span>
							</h1>
							<p className="text-white/75 mb-8 font-sans">
								Please log in to view and manage your wishlist.
							</p>
							<button
								onClick={() => router.push("/account")}
								className="px-8 py-4 border border-white/45 text-white font-sans text-[10px] uppercase tracking-[0.22rem] hover:border-white transition-colors"
							>
								Go to Account
							</button>
						</div>
					) : (
						<>
							<header className="mb-12 md:mb-16">
								<p className="font-sans text-white/80 text-[10px] uppercase tracking-[0.5rem] mb-6 flex items-center gap-4">
									<span className="w-8 h-[1px] bg-white/35" />
									Saved Pieces
								</p>
								<h1 className="font-serif text-6xl md:text-8xl tracking-tighter leading-[0.9] text-white mb-4">
									<span className="italic text-[#bfc6cc]">Your </span>
									<span className="not-italic font-bold">Wishlist</span>
								</h1>
								<p className="text-white/80 font-sans text-lg max-w-xl leading-relaxed font-light italic">
									Posters you bookmarked for later.
								</p>
							</header>

							{wishlistedPosters.length === 0 ? (
								<div className="mt-16 py-20 text-center border border-white/20 bg-black/20 backdrop-blur-sm">
									<p className="text-white/75 italic font-sans">
										No wishlisted posters yet.
									</p>
								</div>
							) : (
								<PosterGrid
									postersData={wishlistedPosters}
									wishlistIds={wishlistIds}
									onToggleWishlist={handleToggleWishlist}
								/>
							)}
						</>
					)}
				</main>

				<SiteFooter />
			</div>
		</>
	);
}
