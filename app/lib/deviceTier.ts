"use client";

import { useEffect, useState } from "react";

type NetworkInformationLike = {
	saveData?: boolean;
	effectiveType?: string;
};

type NavigatorWithHints = Navigator & {
	deviceMemory?: number;
	connection?: NetworkInformationLike;
};

export type LowEndDeviceSignals = {
	isMobileLike: boolean;
	deviceMemory?: number;
	cpuCores?: number;
	saveData: boolean;
	effectiveType?: string;
	lowMemory: boolean;
	lowCpu: boolean;
	slowNetwork: boolean;
	isLowEndMobile: boolean;
};

export function getLowEndDeviceSignals(): LowEndDeviceSignals {
	if (typeof window === "undefined" || typeof navigator === "undefined") {
		return {
			isMobileLike: false,
			saveData: false,
			lowMemory: false,
			lowCpu: false,
			slowNetwork: false,
			isLowEndMobile: false,
		};
	}

	const nav = navigator as NavigatorWithHints;
	const ua = navigator.userAgent ?? "";
	const isMobileUA = /Android|iPhone|iPad|iPod|Mobile/i.test(ua);
	const hasCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
	const isMobileLike = isMobileUA || hasCoarsePointer;

	const deviceMemory = nav.deviceMemory;
	const cpuCores = nav.hardwareConcurrency;
	const saveData = Boolean(nav.connection?.saveData);
	const effectiveType = nav.connection?.effectiveType;

	const lowMemory = typeof deviceMemory === "number" && deviceMemory <= 6;
	const lowCpu = typeof cpuCores === "number" && cpuCores <= 4;
	const slowNetwork =
		typeof effectiveType === "string" &&
		(/2g/.test(effectiveType) || effectiveType === "3g");
	const constrained4g = effectiveType === "4g" && saveData;

	return {
		isMobileLike,
		deviceMemory,
		cpuCores,
		saveData,
		effectiveType,
		lowMemory,
		lowCpu,
		slowNetwork,
		isLowEndMobile:
			isMobileLike &&
			(lowMemory || lowCpu || saveData || slowNetwork || constrained4g),
	};
}

export function useIsLowEndMobile() {
	const [isLowEndMobile, setIsLowEndMobile] = useState(false);

	useEffect(() => {
		setIsLowEndMobile(getLowEndDeviceSignals().isLowEndMobile);
	}, []);

	return isLowEndMobile;
}
