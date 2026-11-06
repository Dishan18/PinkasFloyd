"use client";

import CanvasLoader from "./components/common/CanvasLoader";
import ScrollWrapper from "./components/common/ScrollWrapper";
import Showcase from "./components/showcase";
import Footer from "./components/footer";
import Hero from "./components/hero";

const Home = () => {
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
