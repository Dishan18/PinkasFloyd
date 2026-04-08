"use client";

import React, { createContext, useContext, useState } from "react";

export interface Theme {
	type: string;
	color: string;
}

export const AvailableThemes: Theme[] = [
	{
		type: "light",
		color: "#e56399",
	},
	{
		type: "dark",
		color: "#1A1A1A",
	},
];

interface ThemeContextType {
	theme: Theme;
	nextTheme: () => void;
	setTheme: (type: string) => void;
	hasPreference: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({
	children,
	initialThemeType,
	hasPreferenceInitial,
}: {
	children: React.ReactNode;
	initialThemeType: string;
	hasPreferenceInitial: boolean;
}) {
	const [themeType, setThemeType] = useState<string>(initialThemeType);
	const [hasPreference, setHasPreference] = useState(hasPreferenceInitial);

	const applyTheme = (type: string) => {
		setThemeType(type);
		setHasPreference(true);
		
		const pref = type === "dark" ? "cool-black" : "poppy-pink";
		
		// Always synchronize to multiple destinations to avoid out of sync errors
		window.localStorage.setItem("pf-theme-preference", pref);
		document.cookie = `pf-theme-preference=${pref}; path=/; max-age=31536000`; // 1 year expiry

		// Also apply class at root element dynamically (helps Next.js routing persist)
		document.documentElement.classList.remove("light", "dark");
		document.documentElement.classList.add(type);
	};

	const nextThemeFn = () => {
		applyTheme(themeType === "light" ? "dark" : "light");
	};

	const theme = themeType === "light" ? AvailableThemes[0] : AvailableThemes[1];

	return (
		<ThemeContext.Provider
			value={{
				theme,
				setTheme: applyTheme,
				nextTheme: nextThemeFn,
				hasPreference,
			}}
		>
			{children}
		</ThemeContext.Provider>
	);
}

export const useTheme = () => {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
};
