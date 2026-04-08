"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Canvas } from "@react-three/fiber";
import PosterGrid from "../components/PosterGrid";
import { posters } from "../constants/posters";
import {
	fetchWishlistPosterIds,
	getCurrentUser,
	toggleWishlist,
} from "../lib/wishlist";
import { useTheme } from "@/app/contexts/ThemeContext";
import StarsContainer from "../components/models/Stars";
import CloudContainer from "../components/models/Cloud";
import SiteNavbar from "../components/common/SiteNavbar";
import SiteFooter from "../components/common/SiteFooter";

type CategoryOption = {
	key: string;
	label: string;
	count: number;
};

function normalizeCategory(category: string) {
	const value = category.trim().toLowerCase();
	if (value === "movie") return "cinema";
	return value;
}

function categoryToLabel(category: string) {
	return category.charAt(0).toUpperCase() + category.slice(1);
}

function hexToRgba(hex: string, alpha: number) {
	const normalized = hex.replace("#", "");
	if (normalized.length !== 6) return `rgba(255, 255, 255, ${alpha})`;

	const r = Number.parseInt(normalized.slice(0, 2), 16);
	const g = Number.parseInt(normalized.slice(2, 4), 16);
	const b = Number.parseInt(normalized.slice(4, 6), 16);

	return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function Shop() {
	type ShopUser = { id: string };

	const router = useRouter();
	const { theme } = useTheme();
	const [activeCategory, setActiveCategory] = useState("all");
	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const [user, setUser] = useState<ShopUser | null>(null);
	const [wishlistIds, setWishlistIds] = useState<string[]>([]);
	const filterRef = useRef<HTMLDivElement | null>(null);
	const accentColor = theme.color;
	const accentPanelBorder = hexToRgba(accentColor, 0.3);
	const accentPanelFill = hexToRgba(accentColor, 0.36);

	const categoryOptions = useMemo<CategoryOption[]>(() => {
		const categoryCounts = new Map<string, number>();

		posters.forEach((poster) => {
			(poster.category ?? []).forEach((category) => {
				const normalized = normalizeCategory(category);
				categoryCounts.set(
					normalized,
					(categoryCounts.get(normalized) ?? 0) + 1,
				);
			});
		});

		const dynamicOptions = Array.from(categoryCounts.entries())
			.sort((a, b) => a[0].localeCompare(b[0]))
			.map(([key, count]) => ({
				key,
				label: categoryToLabel(key),
				count,
			}));

		return [
			{ key: "all", label: "All Works", count: posters.length },
			...dynamicOptions,
		];
	}, []);

	const selectedCategory =
		categoryOptions.find((category) => category.key === activeCategory) ??
		categoryOptions[0];

	const filteredPosters =
		activeCategory === "all"
			? posters
			: posters.filter((p) =>
					p.category?.map((c) => normalizeCategory(c)).includes(activeCategory),
				);

	useEffect(() => {
		document.querySelectorAll(".close").forEach((el) => el.remove());

		async function initWishlist() {
			const currentUser = await getCurrentUser();
			setUser(currentUser);

			if (!currentUser) {
				setWishlistIds([]);
				return;
			}

			const ids = await fetchWishlistPosterIds(currentUser.id);
			setWishlistIds(ids);
		}
		initWishlist();
	}, []);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (!filterRef.current) return;
			if (!filterRef.current.contains(event.target as Node)) {
				setIsFilterOpen(false);
			}
		}

		function handleEscape(event: KeyboardEvent) {
			if (event.key === "Escape") {
				setIsFilterOpen(false);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		document.addEventListener("keydown", handleEscape);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			document.removeEventListener("keydown", handleEscape);
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

	const noiseOverlayStyle = {
		backgroundBlendMode: "soft-light",
		backgroundImage:
			"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cfilter id='a'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23a)'/%3E%3C/svg%3E\")",
		backgroundRepeat: "repeat",
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

			<div className="relative z-10 min-h-screen flex flex-col">
				<SiteNavbar />

				<main className="py-12 md:py-16 px-6 md:px-12 max-w-[1800px] mx-auto w-full flex-1">
					<header className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-12">
						<div className="max-w-3xl">
							<p className="font-sans text-white text-[10px] uppercase tracking-[0.5rem] mb-6 flex items-center gap-4">
								<span className="w-8 h-[1px] bg-white/50"></span>
								The Pinkasfloyd Archive
							</p>
							<h1 className="font-serif text-6xl md:text-8xl tracking-tighter leading-[0.9] text-white mb-8">
								<span className="italic text-[#bfc6cc]">Curated </span>
								<span className="not-italic font-bold">Artifacts</span>
							</h1>
							<p className="text-white/80 font-sans text-lg max-w-xl leading-relaxed font-light italic">
								A sanctuary for the discerning collector.
							</p>
						</div>

						<div
							ref={filterRef}
							className="relative border-l border-white/20 pl-0 md:pl-12"
						>
							<button
								type="button"
								onClick={() => setIsFilterOpen((prev) => !prev)}
								aria-haspopup="listbox"
								aria-expanded={isFilterOpen}
								className="min-w-[170px] md:min-w-[260px] px-3 md:px-5 py-2 md:py-3 transition-all duration-300 flex items-center justify-between gap-2 md:gap-4"
								style={{
									backgroundColor: "transparent",
									color: "#bfc6cc",
								}}
							>
								<span className="font-sans text-[10px] md:text-xs uppercase tracking-[0.16em] md:tracking-[0.2em] text-white/75">
									Filter:
								</span>
								<span
									className="font-sans text-[10px] md:text-xs uppercase tracking-[0.12em] md:tracking-[0.16em]"
									style={{ color: "#bfc6cc" }}
								>
									{selectedCategory.label}
								</span>
								<span
									className={`w-3.5 h-3.5 md:w-4 md:h-4 transition-transform duration-300 ${
										isFilterOpen ? "rotate-180" : "rotate-0"
									}`}
									style={{
										backgroundColor: isFilterOpen ? "#bfc6cc" : "white",
										WebkitMask:
											"url('/icons/dropdown.svg') center / contain no-repeat",
										mask: "url('/icons/dropdown.svg') center / contain no-repeat",
									}}
								/>
							</button>

							<div
								className={`absolute right-0 mt-2 w-full min-w-[260px] backdrop-blur-xl border shadow-xl overflow-hidden transition-all duration-300 ease-out origin-top z-30 ${
									isFilterOpen
										? "opacity-100 translate-y-0 max-h-80 pointer-events-auto"
										: "opacity-0 -translate-y-2 max-h-0 pointer-events-none"
								}`}
								style={{
									backgroundColor: hexToRgba(accentColor, 0.82),
									borderColor: accentPanelBorder,
								}}
							>
								<div className="max-h-80 overflow-y-auto py-1">
									{categoryOptions.map((category) => {
										const isActive = category.key === activeCategory;
										return (
											<button
												type="button"
												key={category.key}
												onClick={() => {
													setActiveCategory(category.key);
													setIsFilterOpen(false);
												}}
												role="option"
												aria-selected={isActive}
												className={`w-full px-4 py-3 text-left transition-colors duration-200 flex items-center justify-between gap-3 ${
													isActive
														? "text-[#bfc6cc]"
														: "text-white hover:bg-white/10"
												}`}
												style={
													isActive
														? { backgroundColor: accentPanelFill }
														: undefined
												}
											>
												<span className="font-sans text-[11px] uppercase tracking-[0.18em]">
													{category.label}
												</span>
												<span className="font-sans text-[10px] uppercase tracking-[0.14em] opacity-80">
													{category.count} products
												</span>
											</button>
										);
									})}
								</div>
							</div>
						</div>
					</header>

					<PosterGrid
						postersData={filteredPosters}
						wishlistIds={wishlistIds}
						onToggleWishlist={handleToggleWishlist}
					/>
				</main>

				<SiteFooter />
			</div>
		</>
	);
}
