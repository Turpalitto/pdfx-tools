import { TOOLS } from "@/lib/tools-config";
import ToolRoutePage, { buildToolMetadata } from "@/components/ToolRoutePage";

const tool = TOOLS.find((t) => t.id === "info");

export const metadata = buildToolMetadata(tool);

export default function AnalyzePDF() {
  return <ToolRoutePage tool={tool} />;
}