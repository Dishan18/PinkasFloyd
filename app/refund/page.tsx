import { createMetadata } from "../../lib/seo";
import RefundPageClient from "./RefundPageClient";

const refundMetadataConfig = {
	title: "Refund Policy | Pinkasfloyd",
	description: "Refund policy for anomalous items and transit issues.",
	route: "/refund",
	keywords: ["refund policy", "poster return policy", "pinkasfloyd"],
};

export const metadata = createMetadata(refundMetadataConfig);

export default function RefundPage() {
	return <RefundPageClient />;
}
