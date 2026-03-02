import { TOOLS } from "@/lib/tools-config";
import ToolRoutePage, { buildToolMetadata } from "@/components/ToolRoutePage";

const tool = TOOLS.find((t) => t.id === "pdf2img");

export const metadata = buildToolMetadata(tool);

export default function PdfToImage() {
  return <ToolRoutePage tool={tool} />;
}