import { TOOLS } from "@/lib/tools-config";
import ToolRoutePage, { buildToolMetadata } from "@/components/ToolRoutePage";

const tool = TOOLS.find((t) => t.id === "watermark");

export const metadata = buildToolMetadata(tool);

export default function WatermarkPDF() {
  return <ToolRoutePage tool={tool} />;
}