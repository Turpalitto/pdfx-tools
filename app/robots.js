export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: "https://pdfx.tools/sitemap.xml",
    host: "https://pdfx.tools",
  };
}