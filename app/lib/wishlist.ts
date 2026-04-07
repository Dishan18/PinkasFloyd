import { getSupabase } from "../../lib/supabaseClient";

type AppUser = {
	id: string;
	email?: string;
};

export async function getCurrentUser(): Promise<AppUser | null> {
	const supabase = getSupabase();
	const {
		data: { session },
	} = await supabase.auth.getSession();

	return (session?.user as AppUser) || null;
}

export async function fetchWishlistPosterIds(
	userId: string,
): Promise<string[]> {
	if (!userId) return [];

	const supabase = getSupabase();
	const { data, error } = await supabase
		.from("wishlist")
		.select("poster_id")
		.eq("user_id", userId);

	if (error || !Array.isArray(data)) return [];
	return data.map((row: { poster_id: string }) => row.poster_id);
}

export async function addToWishlist(userId: string, posterId: string) {
	const supabase = getSupabase();
	const { error } = await supabase
		.from("wishlist")
		.upsert(
			{ user_id: userId, poster_id: posterId },
			{ onConflict: "user_id,poster_id" },
		);

	return { error };
}

export async function removeFromWishlist(userId: string, posterId: string) {
	const supabase = getSupabase();
	const { error } = await supabase
		.from("wishlist")
		.delete()
		.eq("user_id", userId)
		.eq("poster_id", posterId);

	return { error };
}

export async function toggleWishlist(
	userId: string,
	posterId: string,
	currentlyWishlisted: boolean,
) {
	if (!userId) {
		return { error: "missing-user" };
	}

	if (currentlyWishlisted) {
		return removeFromWishlist(userId, posterId);
	}

	return addToWishlist(userId, posterId);
}
