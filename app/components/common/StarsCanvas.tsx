"use client";

import { Canvas } from "@react-three/fiber";
import StarsContainer from "../models/Stars";

// Kept in its own module so three.js is only downloaded when stars are shown.
export default function StarsCanvas() {
	return (
		<Canvas camera={{ position: [0, 0, 1] }}>
			<ambientLight intensity={0.5} />
			<StarsContainer />
		</Canvas>
	);
}
