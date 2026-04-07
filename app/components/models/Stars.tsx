import { useThemeStore } from "@/app/stores";
import { Stars } from "@react-three/drei";
import { usePathname } from "next/navigation";
import { useIsLowEndMobile } from "../../lib/deviceTier";

const StarsContainer = () => {
	const isDarkTheme = useThemeStore((state) => state.theme.type === "dark");
	const pathname = usePathname();
	const isLowEndMobile = useIsLowEndMobile();

	if (!isDarkTheme) return null;
	if (isLowEndMobile && pathname !== "/") return null;

	const starCount = isLowEndMobile ? 450 : 2500;

	return (
		<Stars
			radius={200}
			depth={100}
			count={starCount}
			factor={10}
			saturation={10}
			fade={true}
			speed={1}
		/>
	);
};

export default StarsContainer;
