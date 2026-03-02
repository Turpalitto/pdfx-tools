import { TOOLS } from "@/lib/tools-config";
import ToolRoutePage, { buildToolMetadata } from "@/components/ToolRoutePage";

const tool = TOOLS.find((t) => t.id === "pagenum");

export const metadata = buildToolMetadata(tool);

export default function PageNumbers() {
  return <ToolRoutePage tool={tool} />;
}