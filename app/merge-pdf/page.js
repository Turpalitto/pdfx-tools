import { TOOLS } from "../../../lib/tools-config";
import ToolInterface from "../../../components/ToolInterface";

const tool = TOOLS.find((t) => t.id === "merge");

export const metadata = {
  title: `${tool.title} | PDF X`,
  description: tool.description,
  keywords: tool.keywords,
};

export default function MergePDF() {
  return <ToolInterface tool={tool} />;
}
