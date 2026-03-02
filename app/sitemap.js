import { TOOLS } from "../lib/tools-config";

export default function sitemap() {
  const baseUrl = "https://pdfx.tools";

  // Main pages
  const mainRoutes = ["", "/pricing"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.8,
  }));

  // Tool pages
  const toolRoutes = TOOLS.map((tool) => {
    const routeMap = {
      pdf2img: "/pdf-to-image",
      img2pdf: "/image-to-pdf",
      merge: "/merge-pdf",
      compress: "/compress-pdf",
      rotate: "/rotate-pdf",
      split: "/split-pdf",
      watermark: "/watermark-pdf",
      info: "/analyze-pdf",
      ocr: "/ocr-pdf",
      extract: "/extract-text",
      sign: "/sign-pdf",
      pagenum: "/page-numbers",
    };
    return {
      url: `${baseUrl}${routeMap[tool.id] || "/"}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    };
  });

  return [...mainRoutes, ...toolRoutes];
}
