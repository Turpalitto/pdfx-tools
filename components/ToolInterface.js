"use client";

import { useState, useCallback } from "react";
import DropZone from "./DropZone";

export default function ToolInterface({ tool }) {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState({ pct: 0, label: "" });
  const [result, setResult] = useState(null);
  const [options, setOptions] = useState({});

  const handleFiles = useCallback((newFiles) => {
    const fileArray = Array.from(newFiles);
    if (!tool.multi && fileArray.length > 1) {
      fileArray.length = 1; // Keep only first file for single-file tools
    }
    setFiles(prev => {
      const combined = tool.multi ? [...prev, ...fileArray] : fileArray;
      // Remove duplicates
      return combined.filter((f, i, a) => 
        a.findIndex(x => x.name === f.name && x.size === f.size) === i
      );
    });
    setResult(null);
  }, [tool]);

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setResult(null);
  };

  const convert = async () => {
    if (!files.length) return;
    setProcessing(true);
    setProgress({ pct: 0, label: "Подготовка..." });
    setResult(null);

    try {
      // TODO: Implement actual conversion logic
      // For now, simulate processing
      for (let i = 0; i <= 100; i += 10) {
        setProgress({ pct: i, label: `Обработка... ${i}%` });
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Mock result
      setResult({
        icon: "✅",
        title: "Готово!",
        info: `${files.length} файлов обработано`,
        downloads: files.map((f, i) => ({
          label: `Скачать ${f.name}`,
          action: () => console.log("Download:", f.name)
        }))
      });
    } catch (error) {
      console.error("Error:", error);
      setResult({
        icon: "❌",
        title: "Ошибка",
        info: error.message,
        downloads: []
      });
    } finally {
      setProcessing(false);
      setProgress({ pct: 0, label: "" });
    }
  };

  const reset = () => {
    setResult(null);
    setProgress({ pct: 0, label: "" });
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Tool Header */}
      <div className="text-center mb-8">
        <div className="text-4xl mb-3">{tool.emoji}</div>
        <h1 className="text-2xl font-black mb-2">{tool.label}</h1>
        <p className="text-[#888]">{tool.description}</p>
        {tool.pro && (
          <div className="inline-flex bg-gradient-to-r from-[#ffdc50] to-[#ff8c42] text-[#070809] text-xs font-black px-3 py-1 rounded-full mt-2">
            PRO
          </div>
        )}
      </div>

      {/* Drop Zone */}
      <DropZone 
        onFiles={handleFiles} 
        accept={tool.accept} 
        multi={tool.multi} 
      />

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-6">
          <div className="text-xs font-mono text-[#444] mb-3">
            ФАЙЛЫ ({files.length})
          </div>
          <div className="space-y-2">
            {files.map((file, i) => (
              <div key={i} className="bg-[#090a0b] border border-[#181818] rounded-lg p-3 flex items-center gap-3">
                <div className="text-xs font-mono bg-[rgba(255,220,80,0.08)] text-[#ffdc50] px-2 py-1 rounded border border-[rgba(255,220,80,0.15)]">
                  {file.name.split(".").pop().toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate">{file.name}</div>
                  <div className="text-xs text-[#444] font-mono">
                    {(file.size / 1024).toFixed(1)} KB
                  </div>
                </div>
                <button
                  onClick={() => removeFile(i)}
                  className="w-6 h-6 bg-[#1a1a1a] border border-[#1a1a1a] text-[#2a2a2a] rounded flex items-center justify-center hover:border-[#333] hover:text-[#444] transition-colors"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Options */}
      {files.length > 0 && (
        <div className="mt-6 bg-[#090a0b] border border-[#181818] rounded-xl p-4">
          <div className="text-xs font-mono text-[#444] mb-3">НАСТРОЙКИ</div>
          <div className="text-sm text-[#888]">
            Опции для {tool.label} будут добавлены...
          </div>
        </div>
      )}

      {/* Convert Button */}
      {files.length > 0 && !processing && !result && (
        <button
          onClick={convert}
          className="w-full mt-6 bg-[#ffdc50] text-[#070809] font-black py-3 rounded-xl hover:brightness-110 transition-all"
        >
          ⚡ ОБРАБОТАТЬ
        </button>
      )}

      {/* Progress */}
      {processing && (
        <div className="mt-6 bg-[#090a0b] border border-[#181818] rounded-xl p-4">
          <div className="bg-[#0f0f0f] border border-[#181818] rounded-lg h-2 overflow-hidden mb-3">
            <div 
              className="h-full bg-gradient-to-r from-[#ffdc50] to-[#ff8c42] transition-all duration-300"
              style={{ width: `${progress.pct}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-[#444] font-mono">
            <span>{progress.label}</span>
            <span className="text-[#ffdc50] font-semibold">{progress.pct}%</span>
          </div>
        </div>
      )}

      {/* Result */}
      {result && !processing && (
        <div className="mt-6 bg-[#090a0b] border border-[#1f2a1f] rounded-xl p-6">
          <div className="text-center mb-4">
            <div className="text-3xl mb-2">{result.icon}</div>
            <div className="text-lg font-black mb-1">{result.title}</div>
            <div className="text-sm text-[#888]">{result.info}</div>
          </div>
          
          {result.downloads?.length > 0 && (
            <div className="flex flex-col gap-2">
              {result.downloads.map((download, i) => (
                <button
                  key={i}
                  onClick={download.action}
                  className={`w-full py-2 rounded-lg font-semibold transition-all ${
                    download.sec 
                      ? "bg-[#0f0f0f] text-[#e8e3db] border border-[#1a1a1a] hover:border-[#2a2a2a]"
                      : "bg-[#00d68f] text-[#070809] hover:brightness-110"
                  }`}
                >
                  {download.label}
                </button>
              ))}
            </div>
          )}

          <button
            onClick={reset}
            className="w-full mt-4 bg-[#0f0f0f] text-[#888] py-2 rounded-lg hover:text-[#e8e3db] transition-colors"
          >
            ↺ Новая операция
          </button>
        </div>
      )}
    </div>
  );
}
