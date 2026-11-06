import type { MetadataRoute } from "next";
import { posters } from "./constants/posters";
import { SITE_URL } from "@/lib/seo";

// Generated at build time; replaces the hand-written public/sitemap.xml
// and includes every poster page.
export default function sitemap(): MetadataRoute.Sitemap {
	const staticRoutes: MetadataRoute.Sitemap = [
		{ url: SITE_URL, changeFrequency: "weekly", priority: 1 },
		{ url: `${SITE_URL}/shop`, changeFrequency: "daily", priority: 0.95 },
		{ url: `${SITE_URL}/contact`, changeFrequency: "monthly", priority: 0.7 },
		{ url: `${SITE_URL}/shipping`, changeFrequency: "yearly", priority: 0.5 },
		{ url: `${SITE_URL}/refund`, changeFrequency: "yearly", priority: 0.5 },
		{ url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.5 },
		{ url: `${SITE_URL}/terms`, changeFrequency: "yearly", priority: 0.5 },
	];

	const posterRoutes: MetadataRoute.Sitemap = posters.map((poster) => ({
		url: `${SITE_URL}/poster/${poster.id}`,
		changeFrequency: "monthly",
		priority: 0.8,
		images: [`${SITE_URL}${poster.image}`],
	}));

	return [...staticRoutes, ...posterRoutes];
}
