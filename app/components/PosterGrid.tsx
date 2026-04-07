"use client";

import { useState, useEffect, useRef } from "react";
import ShopCard from "./ShopCard";

type PosterGridItem = {
	id: string;
	image: string;
	alt?: string;
};

type PosterGridProps = {
	postersData?: PosterGridItem[];
	wishlistIds?: string[];
	onToggleWishlist?: (id: string) => void;
};

function getColumnCount() {
	if (typeof window === "undefined") return 0;
	if (window.innerWidth >= 1024) return 5;
	if (window.innerWidth >= 768) return 3;
	return 2;
}

export default function PosterGrid({
	postersData = [],
	wishlistIds = [],
	onToggleWishlist,
}: PosterGridProps) {
	const [visibleCount, setVisibleCount] = useState(20);
	const observerRef = useRef<HTMLDivElement | null>(null);
	const [colCount, setColCount] = useState(getColumnCount);

	useEffect(() => {
		const hash = typeof window !== "undefined" ? window.location.hash : "";
		let newCount = 20;

		if (hash && postersData.length > 0) {
			const targetId = hash.replace("#", "");
			const targetIndex = postersData.findIndex((p) => p.id === targetId);
			if (targetIndex !== -1 && targetIndex >= 20) {
				newCount = targetIndex + 12;
			}
		}

		requestAnimationFrame(() => {
			setVisibleCount(newCount);
		});

		if (hash) {
			setTimeout(() => {
				const targetId = hash.replace("#", "");
				const element = document.getElementById(targetId);
				if (element) {
					element.scrollIntoView({ behavior: "smooth", block: "center" });
				}
			}, 400);
		}
	}, [postersData]);

	useEffect(() => {
		const handleResize = () => setColCount(getColumnCount());
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					setVisibleCount((prev) => {
						if (prev >= postersData.length) return prev;
						return Math.min(prev + 20, postersData.length);
					});
				}
			},
			{ rootMargin: "400px" },
		);

		const node = observerRef.current;
		if (node) observer.observe(node);
		return () => observer.disconnect();
	}, [postersData]);

	const visiblePosters = postersData.slice(0, visibleCount);

	let content;

	if (visiblePosters.length === 0) {
		content = (
			<div className="py-20 text-center text-white italic font-light w-full col-span-full">
				No artifacts found in this category.
			</div>
		);
	} else if (colCount === 0) {
		content = (
			<div className="mt-16 pb-24 px-4 md:px-8 columns-2 sm:columns-2 md:columns-3 lg:columns-5 gap-2">
				{visiblePosters.map((poster) => (
					<ShopCard
						key={poster.id}
						id={poster.id}
						image={poster.image}
						alt={poster.alt}
						isWishlisted={wishlistIds.includes(poster.id)}
						onToggleWishlist={onToggleWishlist}
					/>
				))}
			</div>
		);
	} else {
		const columns: PosterGridItem[][] = Array.from(
			{ length: colCount },
			() => [],
		);
		visiblePosters.forEach((poster, idx: number) => {
			columns[idx % colCount].push(poster);
		});

		content = (
			<div className="mt-16 pb-24 px-4 md:px-8 flex items-start gap-2">
				{columns.map((colItems, colIdx) => (
					<div key={colIdx} className="flex flex-col flex-1 relative">
						{colItems.map((poster) => (
							<ShopCard
								key={poster.id}
								id={poster.id}
								image={poster.image}
								alt={poster.alt}
								isWishlisted={wishlistIds.includes(poster.id)}
								onToggleWishlist={onToggleWishlist}
							/>
						))}
					</div>
				))}
			</div>
		);
	}

	return (
		<>
			{content}
			{visibleCount < postersData.length && (
				<div ref={observerRef} className="h-10 w-full" />
			)}
		</>
	);
}
