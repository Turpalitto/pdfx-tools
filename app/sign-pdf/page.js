import { TOOLS } from "@/lib/tools-config";
import ToolRoutePage, { buildToolMetadata } from "@/components/ToolRoutePage";

const tool = TOOLS.find((t) => t.id === "sign");

export const metadata = buildToolMetadata(tool);

export default function SignPDF() {
  return <ToolRoutePage tool={tool} />;
}