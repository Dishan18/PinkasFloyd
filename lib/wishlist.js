import { getSupabase } from "./supabaseClient";

export async function getCurrentUser() {
	const supabase = getSupabase();
	const {
		data: { session },
	} = await supabase.auth.getSession();

	return session?.user || null;
}

export async function fetchWishlistPosterIds(userId) {
	const supabase = getSupabase();
	const { data, error } = await supabase
		.from("wishlist")
		.select("poster_id")
		.eq("user_id", userId);

	if (error || !Array.isArray(data)) return [];
	return data.map((row) => row.poster_id);
}

export async function addToWishlist(userId, posterId) {
	const supabase = getSupabase();
	const { error } = await supabase
		.from("wishlist")
		.upsert(
			{ user_id: userId, poster_id: posterId },
			{ onConflict: "user_id,poster_id" },
		);

	return { error };
}

export async function removeFromWishlist(userId, posterId) {
	const supabase = getSupabase();
	const { error } = await supabase
		.from("wishlist")
		.delete()
		.eq("user_id", userId)
		.eq("poster_id", posterId);

	return { error };
}

export async function toggleWishlist(userId, posterId, currentlyWishlisted) {
	if (currentlyWishlisted) {
		return removeFromWishlist(userId, posterId);
	}

	return addToWishlist(userId, posterId);
}
