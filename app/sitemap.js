import { TOOLS } from "../lib/tools-config";

export default function sitemap() {
  const baseUrl = "https://pdfx.tools";
  const now = new Date();

  const staticRoutes = ["/", "/pricing", "/privacy", "/terms", "/blog"].map((route) => ({
    url: `${baseUrl}${route === "/" ? "" : route}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: route === "/" ? 1 : 0.8,
  }));

  const blogRoutes = ["/blog/kak-szhat-pdf", "/blog/kak-obedinit-pdf", "/blog/kak-konvertirovat-pdf-v-jpg"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const toolRoutes = TOOLS.filter((tool) => tool.route).map((tool) => ({
    url: `${baseUrl}${tool.route}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  return [...staticRoutes, ...blogRoutes, ...toolRoutes];
}
