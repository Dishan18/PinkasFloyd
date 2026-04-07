import { createMetadata } from "../../lib/seo";
import TermsPageClient from "./TermsPageClient";

const termsMetadataConfig = {
	title: "Terms and Conditions | Pinkasfloyd",
	description: "Terms and conditions for acquiring pieces from Pinkasfloyd.",
	route: "/terms",
	keywords: ["terms and conditions", "poster purchase terms", "pinkasfloyd"],
};

export const metadata = createMetadata(termsMetadataConfig);

export default function TermsPage() {
	return <TermsPageClient />;
}
