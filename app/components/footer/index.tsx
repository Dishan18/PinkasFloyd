import { Text, useCursor, useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { isMobile } from "react-device-detect";
import * as THREE from "three";

const FooterActionItem = ({ label, href }: { label: string; href: string }) => {
	const textRef = useRef<THREE.Group>(null);
	const [hovered, setHovered] = useState(false);

	useCursor(hovered);

	useEffect(() => {
		gsap.to(textRef.current, {
			letterSpacing: hovered ? 0.25 : 0,
			duration: 0.25,
		});

		return () => {
			gsap.killTweensOf(textRef.current);
		};
	}, [hovered]);

	return (
		<Text
			ref={textRef}
			font="./Vercetti-Regular.woff"
			fontSize={0.2}
			color="white"
			onClick={() => {
				window.location.href = href;
			}}
			onPointerOver={() => setHovered(true)}
			onPointerOut={() => setHovered(false)}
		>
			{label}
		</Text>
	);
};

const Footer = () => {
	const groupRef = useRef<THREE.Group>(null);
	const data = useScroll();

	useFrame(() => {
		const d = data.range(0.8, 0.2);
		if (groupRef.current) {
			groupRef.current.visible = d > 0;
		}
	});

	return (
		<group
			position={[0, -44, 18]}
			rotation={[-Math.PI / 2, 0, 0]}
			ref={groupRef}
		>
			<group position={[isMobile ? -0.7 : -1.3, 0, 0]}>
				<FooterActionItem label="ACCOUNT" href="/account" />
			</group>
			<group position={[isMobile ? 1.0 : 1.3, 0, 0]}>
				<FooterActionItem label="CART" href="/cart" />
			</group>
		</group>
	);
};

export default Footer;
