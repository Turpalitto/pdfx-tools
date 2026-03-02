import { TOOLS } from "@/lib/tools-config";
import ToolRoutePage, { buildToolMetadata } from "@/components/ToolRoutePage";

const tool = TOOLS.find((t) => t.id === "ocr");

export const metadata = buildToolMetadata(tool);

export default function OcrPDF() {
  return <ToolRoutePage tool={tool} />;
}