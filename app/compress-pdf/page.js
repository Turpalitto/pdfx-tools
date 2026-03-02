import { TOOLS } from "../../../lib/tools-config";
import ToolInterface from "../../../components/ToolInterface";

const tool = TOOLS.find((t) => t.id === "compress");

export const metadata = {
  title: `${tool.title} | PDF X`,
  description: tool.description,
  keywords: tool.keywords,
};

export default function CompressPDF() {
  return <ToolInterface tool={tool} />;
}
