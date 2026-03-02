import { TOOLS } from "../lib/tools-config";

export default function sitemap() {
  const baseUrl = "https://pdfx.tools";

  // Main pages
  const mainRoutes = ["/", "/pricing"].map((route) => ({
    url: `${baseUrl}${route === "/" ? "" : route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "/" ? 1 : 0.8,
  }));

  // Tool pages
  const toolRoutes = TOOLS.filter((tool) => tool.route).map((tool) => ({
    url: `${baseUrl}${tool.route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  return [...mainRoutes, ...toolRoutes];
}
