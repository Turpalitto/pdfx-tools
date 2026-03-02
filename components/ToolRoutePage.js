import ToolInterface from "@/components/ToolInterface";

export function buildToolMetadata(tool) {
  const url = `https://pdfx.tools${tool.route}`;

  return {
    title: tool.title,
    description: tool.description,
    keywords: tool.keywords,
    alternates: {
      canonical: tool.route,
    },
    openGraph: {
      type: "website",
      url,
      title: tool.title,
      description: tool.description,
      images: ["/opengraph-image"],
    },
    twitter: {
      card: "summary_large_image",
      title: tool.title,
      description: tool.description,
      images: ["/opengraph-image"],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

function buildToolSchema(tool) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `${tool.label} - PDF X`,
    url: `https://pdfx.tools${tool.route}`,
    applicationCategory: "UtilityApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description: tool.description,
  };
}

export default function ToolRoutePage({ tool }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildToolSchema(tool)) }} />
      <ToolInterface tool={tool} />
    </>
  );
}