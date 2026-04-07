import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import RouteSurfaceScope from "./components/common/RouteSurfaceScope";

const soriaFont = localFont({
	src: "../public/soria-font.ttf",
	variable: "--font-soria",
});

const vercettiFont = localFont({
	src: "../public/Vercetti-Regular.woff",
	variable: "--font-vercetti",
});

export const metadata: Metadata = {
	title: "Pinkasfloyd | Poster Store",
	description:
		"A curated poster store for collectible prints inspired by music, cinema, and culture.",
	metadataBase: new URL("https://pinkasfloyd.in"),
	alternates: {
		canonical: "/",
	},
	icons: {
		icon: "/fav.jpg",
		shortcut: "/fav.jpg",
		apple: "/fav.jpg",
	},
	keywords:
		"Pinkasfloyd, poster store, collectible posters, music posters, cinema posters, wall art, archival prints",
	authors: [{ name: "Pinkasfloyd" }],
	creator: "Pinkasfloyd",
	publisher: "Pinkasfloyd",
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	openGraph: {
		title: "Pinkasfloyd | Poster Store",
		description:
			"A curated poster store for collectible prints inspired by music, cinema, and culture.",
		url: "https://pinkasfloyd.in",
		siteName: "Pinkasfloyd",
		locale: "en_IN",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Pinkasfloyd | Poster Store",
		description:
			"A curated poster store for collectible prints inspired by music, cinema, and culture.",
	},
	verification: {
		google: "GsRYY-ivL0F_VKkfs5KAeToliqz0gCrRAJKKmFkAxBA",
	},
};

export const viewport: Viewport = {
	themeColor: "#000000",
	initialScale: 1,
	minimumScale: 1,
	maximumScale: 1,
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className="overscroll-y-none">
			<body
				className={`${soriaFont.variable} ${vercettiFont.variable} font-sans antialiased`}
				data-non-home="false"
			>
				<RouteSurfaceScope />
				{children}
			</body>
			<GoogleAnalytics gaId={"G-7WD4HM3XRE"} />
		</html>
	);
}
