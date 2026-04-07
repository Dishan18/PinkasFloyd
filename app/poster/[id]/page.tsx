import { notFound } from "next/navigation";
import PosterDetailClient from "./PosterDetailClient";
import { posters } from "@/app/constants/posters";
import { fetchWishlistPosterIds, getCurrentUser } from "@/app/lib/wishlist";

export async function generateStaticParams() {
	return posters.map((poster) => ({ id: poster.id }));
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

	const user = await getCurrentUser();
	const wishlistIds = user ? await fetchWishlistPosterIds(user.id) : [];

	return (
		<PosterDetailClient
			poster={poster}
			userId={user?.id || ""}
			initialWishlisted={wishlistIds.includes(id)}
		/>
	);
}
