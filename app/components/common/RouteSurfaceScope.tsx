"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function RouteSurfaceScope() {
	const pathname = usePathname();

	useEffect(() => {
		document.body.dataset.nonHome = pathname === "/" ? "false" : "true";
	}, [pathname]);

	return null;
}
