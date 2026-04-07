import Link from "next/link";
import Image from "next/image";

type ShopCardProps = {
	id: string;
	image: string;
	alt?: string;
	isWishlisted?: boolean;
	onToggleWishlist?: (id: string) => void;
};

export default function ShopCard({
	id,
	image,
	alt,
	isWishlisted = false,
	onToggleWishlist,
}: ShopCardProps) {
	return (
		<div
			id={id}
			className="relative group overflow-hidden rounded-[10px] block w-full break-inside-avoid mb-2 hover:ring-1 hover:ring-white/[0.06] transition-all"
		>
			<Link href={`/poster/${id}`} className="block">
				<Image
					src={image}
					alt={alt || "Artwork"}
					width={600}
					height={900}
					sizes="(min-width: 1024px) 20vw, (min-width: 768px) 33vw, 50vw"
					className="w-full h-auto block rounded-[10px]"
				/>
				<div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center p-4">
					<h3 className="font-serif text-white text-[10px] md:text-[11px] tracking-widest uppercase text-center">
						{id.replace(/-/g, " ")}
					</h3>
				</div>
			</Link>

			<button
				type="button"
				aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();
					onToggleWishlist?.(id);
				}}
				className="absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3 w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center transition-opacity hover:opacity-80"
			>
				<span
					className="w-[14px] h-[14px] sm:w-[18px] sm:h-[18px]"
					style={{
						backgroundColor: isWishlisted ? "#e30b5d" : "#ffffff",
						WebkitMask: "url('/icons/wishlist.svg') center / contain no-repeat",
						mask: "url('/icons/wishlist.svg') center / contain no-repeat",
					}}
				/>
			</button>
		</div>
	);
}
