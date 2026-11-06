"use client";

import { useGSAP } from "@gsap/react";
import { AdaptiveDpr, ScrollControls, useProgress } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import gsap from "gsap";
import { Suspense, useEffect, useRef, useState } from "react";
import { isMobile } from "react-device-detect";

import { useTheme } from "@/app/contexts/ThemeContext";
import { useIsLowEndMobile } from "../../lib/deviceTier";

import ProgressLoader from "./ProgressLoader";
import { ScrollHint } from "./ScrollHint";
import ThemeSwitcher from "./ThemeSwitcher";
import { noiseOverlayStyle } from "@/app/utils/styles";
// import {Perf} from "r3f-perf"

const CanvasLoader = (props: { children: React.ReactNode }) => {
	const ref = useRef<HTMLDivElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const { theme } = useTheme();
	const backgroundColor = theme.color;
	const isLowEndMobile = useIsLowEndMobile();
	const { progress } = useProgress();
	const [canvasStyle, setCanvasStyle] = useState<React.CSSProperties>({
		position: "absolute",
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		opacity: 0,
		overflow: "hidden",
	});

	useEffect(() => {
		if (!isMobile) {
			const borderStyle = {
				inset: "1rem",
				width: "calc(100% - 2rem)",
				height: "calc(100% - 2rem)",
			};
			setCanvasStyle({ ...canvasStyle, ...borderStyle });
		}
	}, [isMobile]);

	useGSAP(() => {
		if (progress === 100) {
			gsap.to(".base-canvas", { opacity: 1, duration: 3, delay: 1 });
		}
	}, [progress]);

	useGSAP(() => {
		gsap.to(ref.current, {
			backgroundColor: backgroundColor,
			duration: 1,
		});
		gsap.to(canvasRef.current, {
			backgroundColor: backgroundColor,
			duration: 1,
			...noiseOverlayStyle,
		});
	}, [backgroundColor]);


	return (
		<div className="h-full wrapper relative">
			<div className="h-full relative" ref={ref}>
				<Canvas
					className="base-canvas"
					shadows={!isLowEndMobile}
					style={canvasStyle}
					ref={canvasRef}
					dpr={isLowEndMobile ? [1, 1] : [1, 2]}
				>
					{/* <Perf/> */}
					<Suspense fallback={null}>
						<ambientLight intensity={0.5} />

						<ScrollControls
							pages={4}
							damping={0.4}
							maxSpeed={1}
							distance={1}
							style={{ zIndex: 1 }}
						>
							{props.children}
						</ScrollControls>
					</Suspense>
					<AdaptiveDpr pixelated />
				</Canvas>
				<ProgressLoader progress={progress} />
			</div>
			<ThemeSwitcher />
			<ScrollHint />
		</div>
	);
};

export default CanvasLoader;
