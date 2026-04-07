import { createMetadata } from "../../lib/seo";
import PrivacyPageClient from "./PrivacyPageClient";

const privacyMetadataConfig = {
	title: "Privacy Policy | Pinkasfloyd",
	description:
		"Read the PinkasFloyd privacy policy for information about order processing and customer data.",
	route: "/privacy",
	keywords: ["privacy policy", "poster store privacy"],
};

export const metadata = createMetadata(privacyMetadataConfig);

export default function PrivacyPage() {
	return <PrivacyPageClient />;
}
