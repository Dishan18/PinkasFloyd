"use client";

import { useEffect } from "react";
import CanvasLoader from "./components/common/CanvasLoader";
import ScrollWrapper from "./components/common/ScrollWrapper";
import Showcase from "./components/showcase";
import Footer from "./components/footer";
import Hero from "./components/hero";

const Home = () => {
	useEffect(() => {
		const stateKey =
			typeof window.history.state?.key === "string"
				? window.history.state.key
				: "home";
		const refreshMarker = `home-refreshed:${stateKey}`;

		if (sessionStorage.getItem(refreshMarker) === "1") return;

		sessionStorage.setItem(refreshMarker, "1");
		window.location.reload();
	}, []);

	return (
		<div className="h-[100dvh] relative z-10">
			<CanvasLoader>
				<ScrollWrapper>
					<Hero />
					<Showcase />
					<Footer />
				</ScrollWrapper>
			</CanvasLoader>
		</div>
	);
};
export default Home;
