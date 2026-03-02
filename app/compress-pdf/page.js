import { TOOLS } from "@/lib/tools-config";
import ToolRoutePage, { buildToolMetadata } from "@/components/ToolRoutePage";

const tool = TOOLS.find((t) => t.id === "compress");

export const metadata = buildToolMetadata(tool);

export default function CompressPDF() {
  return <ToolRoutePage tool={tool} />;
}