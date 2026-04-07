import { createMetadata } from "../../lib/seo";
import ContactPageClient from "./ContactPageClient";

const contactMetadataConfig = {
	title: "Contact Pinkasfloyd | Poster Store",
	description:
		"Contact the curators at Pinkasfloyd for archival inquiries, acquisitions, and transit support.",
	route: "/contact",
	keywords: ["contact poster store", "poster support", "art gallery contact"],
};

export const metadata = createMetadata(contactMetadataConfig);

export default function ContactPage() {
	return <ContactPageClient />;
}
