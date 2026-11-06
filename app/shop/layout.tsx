import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";

// The shop page is a client component, so its metadata lives here.
// Without this, /shop inherits the root canonical ("/") and search
// engines treat it as a duplicate of the home page.
export const metadata = createMetadata({
	title: "Shop Posters",
	description:
		"Browse the full Pinkasfloyd archive of music, cinema, mythology, desi and quote posters in A3, A4, 12x12, A6 and A7.",
	route: "/shop",
	keywords: ["buy posters online", "posters india", "wall posters"],
}) as Metadata;

export default function ShopLayout({ children }: { children: React.ReactNode }) {
	return children;
}
