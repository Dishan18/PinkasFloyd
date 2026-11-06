"use client";

import dynamic from "next/dynamic";
import { useTheme } from "@/app/contexts/ThemeContext";
import { useIsLowEndMobile } from "@/app/lib/deviceTier";
import { noiseOverlayStyle } from "@/app/utils/styles";

// three.js (~250KB) loads after the page is interactive instead of blocking it.
const StarsCanvas = dynamic(() => import("./StarsCanvas"), { ssr: false });

/** Fixed theme-coloured, grainy background with the starfield (dark theme only). */
export default function PageBackground() {
	const { theme } = useTheme();
	const isLowEndMobile = useIsLowEndMobile();
	// Stars only render in the dark theme and are skipped on low-end phones,
	// so don't download three.js at all in those cases.
	const showStars = theme.type === "dark" && !isLowEndMobile;

	return (
		<div
			className="fixed inset-0 w-full h-full z-0 transition-colors duration-1000"
			style={{ backgroundColor: theme.color, ...noiseOverlayStyle }}
		>
			{showStars && <StarsCanvas />}
		</div>
	);
}
