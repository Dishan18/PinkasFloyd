const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "");

export const SITE_URL = rawSiteUrl || "https://pinkasfloyd.in";

export const SITE_NAME = "Pinkasfloyd";

export const DEFAULT_OG_IMAGE = `${SITE_URL}/posters/ps25.jpg`;
export const DEFAULT_LOCALE = "en_IN";

export const DEFAULT_KEYWORDS = [
	"psychedelic posters",
	"music posters",
	"cinema posters",
	"movie posters",
	"mythology posters",
	"quotes posters",
	"desi posters",
	"bengali posters",
	"art posters",
	"abstract posters",
	"vintage posters",
	"retro posters",
	"concert posters",
	"hip hop posters",
	"rock band posters",
	"rave culture posters",
	"wall art posters",
	"aesthetic posters",
	"underground art posters",
	"Pink Floyd inspired posters",
];

function normalizeRoute(route = "/") {
	if (!route || route === "/") return "/";
	return route.startsWith("/") ? route : `/${route}`;
}

export function absoluteUrl(route = "/") {
	const normalizedRoute = normalizeRoute(route);
	return normalizedRoute === "/" ? SITE_URL : `${SITE_URL}${normalizedRoute}`;
}

/**
 * @param {{
 *   title: string,
 *   description: string,
 *   route?: string,
 *   keywords?: string[],
 *   images?: string[],
 *   noIndex?: boolean,
 *   type?: string,
 * }} config
 */
export function createMetadata({
	title,
	description,
	route = "/",
	keywords = [],
	images = [DEFAULT_OG_IMAGE],
	noIndex = false,
	type = "website",
}) {
	const canonicalRoute = normalizeRoute(route);

	const imageList = images.map((image) =>
		image.startsWith("http") ? image : absoluteUrl(image),
	);

	const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;

	return {
		title: fullTitle,
		description,
		keywords: [...new Set([...DEFAULT_KEYWORDS, ...keywords])],
		metadataBase: new URL(SITE_URL),
		alternates: {
			canonical: canonicalRoute,
		},
		openGraph: {
			title: fullTitle,
			description,
			url: canonicalRoute,
			siteName: SITE_NAME,
			locale: DEFAULT_LOCALE,
			type,
			images: imageList.map((url) => ({
				url,
				width: 1200,
				height: 1800,
			})),
		},
		twitter: {
			card: "summary_large_image",
			title: fullTitle,
			description,
			site: "@pinkasfloyd",
			images: imageList,
		},
		robots: noIndex
			? {
					index: false,
					follow: false,
					googleBot: {
						index: false,
						follow: false,
						"max-image-preview": "none",
						"max-snippet": 0,
					},
				}
			: {
					index: true,
					follow: true,
					googleBot: {
						index: true,
						follow: true,
						"max-image-preview": "large",
						"max-snippet": -1,
					},
				},
	};
}
