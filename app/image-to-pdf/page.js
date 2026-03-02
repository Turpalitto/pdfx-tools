import { TOOLS } from "@/lib/tools-config";
import ToolRoutePage, { buildToolMetadata } from "@/components/ToolRoutePage";

const tool = TOOLS.find((t) => t.id === "img2pdf");

export const metadata = buildToolMetadata(tool);

export default function ImageToPdf() {
  return <ToolRoutePage tool={tool} />;
}