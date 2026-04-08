"use client";

import { useState } from "react";
import { useTheme } from "@/app/contexts/ThemeContext";

type Preference = "cool-black" | "poppy-pink";

export default function ThemePreferenceGate() {
	const { setTheme, hasPreference } = useTheme();
	const [isOpen, setIsOpen] = useState(!hasPreference);

	const applyPreference = (value: Preference) => {
		if (value === "cool-black") {
			setTheme("dark");
		} else {
			setTheme("light");
		}
		setIsOpen(false);
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 backdrop-blur-sm px-5">
			<div className="w-full max-w-sm border border-white/20 bg-black/75 backdrop-blur-xl p-6 sm:p-7 text-white shadow-2xl">
				<p className="font-sans text-[10px] uppercase tracking-[0.32rem] text-white/70 mb-3">
					Welcome
				</p>
				<h2 className="font-serif text-3xl leading-tight text-[#bfc6cc] mb-6">
					your vibe settings:
				</h2>

				<div className="grid grid-cols-1 gap-2.5">
					<button
						type="button"
						onClick={() => applyPreference("cool-black")}
						className="w-full px-4 py-3 border border-[#bfc6cc]/40 text-[#bfc6cc] hover:bg-[#bfc6cc]/15 transition-colors font-sans text-[11px] uppercase tracking-[0.24rem]"
					>
						cool Black
					</button>
					<button
						type="button"
						onClick={() => applyPreference("poppy-pink")}
						className="w-full px-4 py-3 border border-[#bfc6cc]/40 text-[#bfc6cc] hover:bg-[#bfc6cc]/15 transition-colors font-sans text-[11px] uppercase tracking-[0.24rem]"
					>
						poppy Pink
					</button>
				</div>
			</div>
		</div>
	);
}
