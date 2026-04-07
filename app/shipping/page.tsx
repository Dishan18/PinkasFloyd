import { createMetadata } from "../../lib/seo";
import ShippingPageClient from "./ShippingPageClient";

const shippingMetadataConfig = {
	title: "Shipping Policy | Pinkasfloyd",
	description: "Transit timelines, processing, and delivery protocols.",
	route: "/shipping",
	keywords: ["shipping policy", "poster shipping India", "pinkasfloyd"],
};

export const metadata = createMetadata(shippingMetadataConfig);

export default function ShippingPage() {
	return <ShippingPageClient />;
}
