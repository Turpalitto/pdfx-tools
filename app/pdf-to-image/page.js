import { TOOLS } from "../../../lib/tools-config";

const tool = TOOLS.find((t) => t.id === "pdf2img");

export const metadata = {
  title: `${tool.title} | PDF X`,
  description: tool.description,
  keywords: tool.keywords,
};

export default function PdfToImage() {
  return (
    <div className="min-h-screen bg-[#070809] text-[#e8e3db]">
      <div className="max-w-[940px] mx-auto px-4 py-8">
        <h1 className="text-3xl font-black mb-4">{tool.label}</h1>
        <p className="text-[#888] mb-8">{tool.description}</p>
      </div>
    </div>
  );
}
