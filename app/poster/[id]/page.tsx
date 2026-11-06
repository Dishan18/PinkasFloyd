import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PosterDetailClient from "./PosterDetailClient";
import { posterName, posters } from "@/app/constants/posters";
import { createMetadata } from "@/lib/seo";

export async function generateStaticParams() {
	return posters.map((poster) => ({ id: poster.id }));
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ id: string }>;
}): Promise<Metadata> {
	const { id } = await params;
	const poster = posters.find((item) => item.id === id);
	if (!poster) return {};

	const category = poster.category?.[0] ?? "art";

	return createMetadata({
		title: `${posterName(poster)} — ${category} poster`,
		description: `Collectible ${category} poster #${poster.id}. Available in A3, A4, 12x12, A6 and A7, framed or unframed, from the Pinkasfloyd archive.`,
		route: `/poster/${poster.id}`,
		keywords: (poster.category ?? []).map((c) => `${c} posters`),
		images: [poster.image],
	}) as Metadata;
}

export default async function PosterDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const poster = posters.find((item) => item.id === id);

	if (!poster) {
		notFound();
	}

	// The Supabase session lives in the browser, so wishlist state is
	// resolved client-side in PosterDetailClient.
	return (
		<PosterDetailClient poster={poster} userId="" initialWishlisted={false} />
	);
}
