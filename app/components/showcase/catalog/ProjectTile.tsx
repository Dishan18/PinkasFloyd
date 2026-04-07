import { Image as DreiImage } from "@react-three/drei";
import { ThreeEvent } from "@react-three/fiber";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { isMobile } from "react-device-detect";
import * as THREE from "three";
import { useRouter } from "next/navigation";

import { usePortalStore } from "@stores";

interface ProjectTileProps {
	poster: {
		id: string;
		image: string;
	};
	index: number;
	position: [number, number, number];
	rotation: [number, number, number];
}

const ProjectTile = ({
	poster,
	index,
	position,
	rotation,
}: ProjectTileProps) => {
	const projectRef = useRef<THREE.Group>(null);
	const router = useRouter();
	const [hovered, setHovered] = useState(false);
	const isProjectSectionActive = usePortalStore(
		(state) => state.activePortalId === "projects",
	);

	useEffect(() => {
		if (projectRef.current) {
			gsap.to(projectRef.current.position, {
				y: isProjectSectionActive ? 0 : -20,
				duration: 1,
				delay: isProjectSectionActive ? index * 0.05 : 0,
			});
		}
	}, [isProjectSectionActive, index]);

	const handleClick = (e: ThreeEvent<MouseEvent>) => {
		e.stopPropagation();
		document.body.style.cursor = "auto";
		router.push(`/poster/${poster.id}`);
	};

	return (
		<group
			position={position}
			rotation={rotation}
			onClick={handleClick}
			onPointerOver={() => {
				if (!isMobile && isProjectSectionActive) {
					setHovered(true);
					document.body.style.cursor = "pointer";
				}
			}}
			onPointerOut={() => {
				if (!isMobile && isProjectSectionActive) {
					setHovered(false);
					document.body.style.cursor = "auto";
				}
			}}
		>
			<group ref={projectRef} position={[0, -20, 0]}>
				<DreiImage
					url={poster.image}
					transparent
					opacity={hovered ? 1 : 0.8}
					scale={hovered ? [3.15, 4.72] : [3, 4.5]}
				/>
			</group>
		</group>
	);
};

export default ProjectTile;
