import { TOOLS } from "@/lib/tools-config";
import ToolRoutePage, { buildToolMetadata } from "@/components/ToolRoutePage";

const tool = TOOLS.find((t) => t.id === "extract");

export const metadata = buildToolMetadata(tool);

export default function ExtractText() {
  return <ToolRoutePage tool={tool} />;
}