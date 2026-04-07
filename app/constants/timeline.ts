import * as THREE from "three";
import { TimelinePoint } from "../types";

export const TIMELINE_POINTS: TimelinePoint[] = [
	{
		point: new THREE.Vector3(0, 0, 0),
		year: "2025",
		title: "Met Pink",
		subtitle: "The first spark",
		position: "right",
	},
	{
		point: new THREE.Vector3(-4, -4, -3),
		year: "2025",
		title: "The Genesis",
		subtitle: "Idea of Pinkasfloyd was born",
		position: "right",
	},
	{
		point: new THREE.Vector3(-3, -1, -6),
		year: "2026",
		title: "Website Ready",
		subtitle: "pinkasfloyd.in is live",
		position: "left",
	},
	{
		point: new THREE.Vector3(0, -1, -10),
		year: "2026",
		title: "What to start selling?",
		subtitle: "Shirts? Socks? Books? Posters? ...",
		position: "left",
	},
	{
		point: new THREE.Vector3(1, 1, -12),
		year: new Date().toLocaleDateString("default", { year: "numeric" }),
		title: "?",
		subtitle: "???",
		position: "right",
	},
];
