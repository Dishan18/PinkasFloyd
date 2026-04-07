"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";

import { getSupabase } from "../../../lib/supabaseClient";

export default function SiteNavbar() {
	const [open, setOpen] = useState(false);
	const [user, setUser] = useState<User | null>(null);
	const supabase = useMemo(() => getSupabase(), []);

	useEffect(() => {
		supabase.auth
			.getSession()
			.then(({ data }: { data: { session: Session | null } }) => {
				setUser(data.session?.user || null);
			});

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(
			(_event: AuthChangeEvent, session: Session | null) => {
				setUser(session?.user || null);
			},
		);

		return () => subscription.unsubscribe();
	}, [supabase]);

	async function handleLogout() {
		await supabase.auth.signOut();
		setUser(null);
		window.location.assign("/account");
	}

	return (
		<header className="relative z-20 w-full border-b border-white/15 bg-transparent">
			<nav className="max-w-[1700px] mx-auto flex items-center justify-between px-5 md:px-10 py-4">
				<button
					type="button"
					onClick={() => {
						window.location.assign("/");
					}}
					className="font-sans text-[11px] uppercase tracking-[0.35rem] text-white hover:text-white/75 transition-colors"
				>
					Home
				</button>

				<div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
					<Link
						href="/shop"
						className="font-sans text-[11px] uppercase tracking-[0.28rem] text-white/85 hover:text-white transition-colors"
					>
						Shop
					</Link>
					{user && (
						<Link
							href="/orders"
							className="font-sans text-[11px] uppercase tracking-[0.28rem] text-white/85 hover:text-white transition-colors"
						>
							Orders
						</Link>
					)}
					{user && (
						<Link
							href="/wishlist"
							className="font-sans text-[11px] uppercase tracking-[0.28rem] text-white/85 hover:text-white transition-colors"
						>
							Wishlist
						</Link>
					)}
				</div>

				<div className="hidden md:flex items-center gap-5">
					<Link
						href="/account"
						aria-label={user ? "Account" : "Login"}
						className="inline-flex items-center justify-center opacity-90 hover:opacity-100 transition-opacity"
					>
						<Image
							src="/icons/person.svg"
							alt=""
							aria-hidden="true"
							width={22}
							height={22}
							className="filter brightness-0 invert"
						/>
					</Link>
					<Link
						href="/cart"
						aria-label="Cart"
						className="inline-flex items-center justify-center opacity-90 hover:opacity-100 transition-opacity"
					>
						<Image
							src="/icons/cart-svgrepo-com.svg"
							alt=""
							aria-hidden="true"
							width={22}
							height={22}
							className="filter brightness-0 invert"
						/>
					</Link>
				</div>

				<div className="md:hidden flex items-center">
					<button
						type="button"
						className="inline-flex items-center justify-center opacity-90 hover:opacity-100 transition-opacity"
						onClick={() => setOpen((prev) => !prev)}
						aria-label={open ? "Close menu" : "Open menu"}
					>
						<Image
							src="/icons/menu.svg"
							alt=""
							aria-hidden="true"
							width={20}
							height={20}
							className={`h-5 w-5 filter brightness-0 invert transition-transform duration-300 ${open ? "rotate-90" : "rotate-0"}`}
						/>
					</button>
				</div>
			</nav>

			<div
				aria-hidden={!open}
				className={`md:hidden absolute left-0 right-0 top-full z-30 overflow-hidden transition-all duration-300 ease-out ${
					open
						? "max-h-80 opacity-100 translate-y-0"
						: "max-h-0 opacity-0 -translate-y-2 pointer-events-none"
				}`}
			>
				<div className="border-t border-white/15 px-5 py-4 flex flex-col items-center text-center gap-4 bg-black/45 backdrop-blur-sm">
					<Link
						href="/shop"
						className="font-sans text-[11px] uppercase tracking-[0.28rem] text-white/85 hover:text-white transition-colors"
						onClick={() => setOpen(false)}
					>
						Shop
					</Link>
					{user && (
						<Link
							href="/orders"
							className="font-sans text-[11px] uppercase tracking-[0.28rem] text-white/85 hover:text-white transition-colors"
							onClick={() => setOpen(false)}
						>
							Orders
						</Link>
					)}
					{user && (
						<Link
							href="/wishlist"
							className="font-sans text-[11px] uppercase tracking-[0.28rem] text-white/85 hover:text-white transition-colors"
							onClick={() => setOpen(false)}
						>
							Wishlist
						</Link>
					)}
					<Link
						href="/account"
						className="font-sans text-[11px] uppercase tracking-[0.28rem] text-white/85 hover:text-white transition-colors"
						onClick={() => setOpen(false)}
					>
						{user ? "Account" : "Login"}
					</Link>
					<Link
						href="/cart"
						className="font-sans text-[11px] uppercase tracking-[0.28rem] text-white/85 hover:text-white transition-colors"
						onClick={() => setOpen(false)}
					>
						Cart
					</Link>
					{user && (
						<button
							type="button"
							onClick={() => {
								handleLogout();
								setOpen(false);
							}}
							className="font-sans text-[11px] uppercase tracking-[0.28rem] text-white/70 hover:text-white transition-colors pt-3 border-t border-white/15 w-full"
						>
							Logout
						</button>
					)}
				</div>
			</div>
		</header>
	);
}
