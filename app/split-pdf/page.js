import { TOOLS } from "@/lib/tools-config";
import ToolRoutePage, { buildToolMetadata } from "@/components/ToolRoutePage";

const tool = TOOLS.find((t) => t.id === "split");

export const metadata = buildToolMetadata(tool);

export default function SplitPDF() {
  return <ToolRoutePage tool={tool} />;
}