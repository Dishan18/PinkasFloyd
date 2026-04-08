import { useEffect, useMemo, useState } from "react";
import { isMobile } from "react-device-detect";
import ProjectTile from "./ProjectTile";
import { Text } from "@react-three/drei";
import { useRouter } from "next/navigation";
import { usePortalStore } from "@stores";
import { posters } from "../../../constants/posters";
import { useThree } from "@react-three/fiber";
import gsap from "gsap";
import * as THREE from "three";

const ProjectsCarousel = () => {
	const [activeId, setActiveId] = useState<number | null>(null);
	const isActive = usePortalStore(
		(state) => state.activePortalId === "projects",
	);
	const setIsTransitioning = usePortalStore(
		(state) => state.setIsTransitioning,
	);
	const router = useRouter();
	const { camera } = useThree();

	useEffect(() => {
		if (!isActive) setActiveId(null);
	}, [isActive]);

	const tiles = useMemo(() => {
		const fov = Math.PI * 1.5;
		const distance = 15;

		const rows = isMobile ? 2 : 3;
		const itemsPerRow = isMobile ? 8 : 12;
		const displayPosters = posters.slice(0, rows * itemsPerRow);
		const seeMorePosition = new THREE.Vector3(0, 1, -12);

		return displayPosters.map((poster, i) => {
			const col = i % itemsPerRow;
			const row = Math.floor(i / itemsPerRow);

			// Angle distributes along the arc
			const angle = (fov / itemsPerRow) * col - fov / 3;
			const z = -distance * Math.cos(angle);
			const x = distance * Math.sin(angle);
			const rotY = -angle;

			// Vertical row positioning
			const rowHeight = 5;
			const startY = ((rows - 1) * rowHeight) / 2;
			const y = startY - row * rowHeight + 1; // +1 offset to match view level
			const tilePosition = new THREE.Vector3(x, y, z);

			// Keep a strict spatial clearing around SEE MORE so no poster sits under/over it.
			// Remove row constraints and check all posters against a radius.
			const radius = isMobile ? 5.2 : 4.4;
			if (tilePosition.distanceTo(seeMorePosition) < radius) {
				return null;
			}

			return (
				<ProjectTile
					key={poster.id}
					poster={poster}
					index={i}
					position={[x, y, z]}
					rotation={[0, rotY, 0]}
				/>
			);
		});
	}, [activeId, isActive]);

	return (
		<group rotation={[0, -Math.PI / 12, 0]}>
			{tiles}
			<Text
				position={[0, 1, -12]}
				fontSize={1.2}
				font="./soria-font.ttf"
				color="#222" // Dark color so it stands out against clouds/sky
				outlineWidth={0.02}
				outlineColor="white"
				onClick={(e) => {
					e.stopPropagation();
					document.body.style.cursor = "auto";

					setIsTransitioning(true);

					const projCamera = camera as THREE.PerspectiveCamera;

					// Trigger the route transition instantly. Next.js will fetch chunks in background.
					router.push("/shop");

					// Slowly zoom into the portal while the network loads /shop.
					// This keeps the user entertained visually during the loading freeze window!
					gsap.to(projCamera, {
						fov: 10,
						duration: 2.0, // Slow deep zoom
						ease: "power2.inOut",
						onUpdate: () => projCamera.updateProjectionMatrix(),
						onComplete: () => {
							setIsTransitioning(false);
						},
					});
				}}
				onPointerOver={() => {
					if (!isMobile) document.body.style.cursor = "pointer";
				}}
				onPointerOut={() => {
					if (!isMobile) document.body.style.cursor = "auto";
				}}
			>
				SEE MORE
			</Text>
		</group>
	);
};

export default ProjectsCarousel;
