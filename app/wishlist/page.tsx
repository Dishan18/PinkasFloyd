"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import PosterGrid from "../components/PosterGrid";
import SiteNavbar from "../components/common/SiteNavbar";
import PageBackground from "@/app/components/common/PageBackground";
import SiteFooter from "../components/common/SiteFooter";
import PosterSkeletonGrid from "../components/PosterSkeletonGrid";
import { posters } from "../constants/posters";
import {
	fetchWishlistPosterIds,
	getCurrentUser,
	toggleWishlist,
} from "../lib/wishlist";

type AppUser = {
	id: string;
};

export default function WishlistPage() {
	const router = useRouter();

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


	if (loading) {
		return (
			<>
				<PageBackground />

				<div className="relative z-10 min-h-screen flex flex-col pt-14 md:pt-20">
                    <SiteNavbar />
                    <main className="max-w-[1800px] mx-auto w-full flex-1 w-full px-6 md:px-12">
                        <header className="mb-12 md:mb-16 mt-14 md:mt-0">
                            <p className="font-sans text-white/80 text-[10px] uppercase tracking-[0.5rem] mb-6 flex items-center gap-4">
                                <span className="w-8 h-[1px] bg-white/35" />
                                Saved Pieces
                            </p>
                            <h1 className="font-serif text-6xl md:text-8xl tracking-tighter leading-[0.9] text-white mb-4">
                                <span className="italic text-[#bfc6cc]">Loading </span>
                                <span className="not-italic font-bold">Wishlist</span>
                            </h1>
                            <p className="text-white/80 font-sans text-lg max-w-xl leading-relaxed font-light italic">
                                Retrieving your bookmarked items...
                            </p>
                        </header>
                        <PosterSkeletonGrid count={5} />
                    </main>
				</div>
			</>
		);
	}

	return (
		<>
			<PageBackground />

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
