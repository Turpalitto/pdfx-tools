import { TOOLS } from "@/lib/tools-config";
import ToolRoutePage, { buildToolMetadata } from "@/components/ToolRoutePage";

const tool = TOOLS.find((t) => t.id === "merge");

export const metadata = buildToolMetadata(tool);

export default function MergePDF() {
  return <ToolRoutePage tool={tool} />;
}