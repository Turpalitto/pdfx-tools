import { notFound } from "next/navigation";
import { TOOLS } from "@/lib/tools-config";
import ToolRoutePage, { buildToolMetadata } from "@/components/ToolRoutePage";

// Статическая генерация всех страниц инструментов при билде
export function generateStaticParams() {
  return TOOLS.map((tool) => ({ tool: tool.route.replace("/", "") }));
}

function resolveTool(slug) {
  return TOOLS.find((tool) => tool.route === `/${slug}`);
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const tool = resolveTool(resolvedParams?.tool);
  if (!tool) return {};
  return buildToolMetadata(tool);
}

export default async function DynamicToolPage({ params }) {
  const resolvedParams = await params;
  const tool = resolveTool(resolvedParams?.tool);

  if (!tool) {
    notFound();
  }

  return <ToolRoutePage tool={tool} />;
}