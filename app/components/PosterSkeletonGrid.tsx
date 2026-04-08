"use client";

import { useTheme } from "@/app/contexts/ThemeContext";
import { useEffect, useState } from "react";

function hexToRgba(hex: string, alpha: number) {
	const normalized = hex.replace("#", "");
	if (normalized.length !== 6) return `rgba(255, 255, 255, ${alpha})`;
	const r = parseInt(normalized.slice(0, 2), 16);
	const g = parseInt(normalized.slice(2, 4), 16);
	const b = parseInt(normalized.slice(4, 6), 16);
	return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function PosterSkeletonGrid({ count = 15 }: { count?: number }) {
	const { theme } = useTheme();
	const isDark = theme.type === "dark";
	
	// A highly premium skeleton color tuned for the dark/pink themes
	const skeletonColor = isDark ? "rgba(255,255,255,0.06)" : hexToRgba(theme.color, 0.4);

	// Use fixed heights for the first render to guarantee SSR hydration match,
	// then randomize slightly on the client for the masonry cascading aesthetic.
	const [heights, setHeights] = useState<string[]>(
		Array.from({ length: count }, (_, i) => {
			const pattern = [380, 280, 420, 310, 450];
			return `${pattern[i % 5]}px`;
		})
	);
	
	useEffect(() => {
		const newHeights = Array.from({ length: count }, () => {
			const randomH = Math.floor(Math.random() * (450 - 250 + 1) + 250);
			return `${randomH}px`;
		});
		setHeights(newHeights);
	}, [count]);

	return (
		<div className="mt-16 pb-24 px-4 md:px-8 columns-2 sm:columns-2 md:columns-3 lg:columns-5 gap-2">
			{Array.from({ length: count }).map((_, i) => (
				<div
					key={i}
					className="w-full mb-2 animate-pulse overflow-hidden rounded-[10px]"
					style={{
						height: heights[i],
						backgroundColor: skeletonColor,
						transition: "height 0.4s ease-out",
					}}
				/>
			))}
		</div>
	);
}
