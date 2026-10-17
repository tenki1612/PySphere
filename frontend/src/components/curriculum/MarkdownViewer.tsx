"use client";

import React, { useState } from "react";
import { Copy, Check, Terminal } from "lucide-react";

interface MarkdownViewerProps {
  content: string;
}

export function MarkdownViewer({ content }: MarkdownViewerProps) {
  if (!content) {
    return <div className="text-xs text-gray-400 italic">Đang tải bài giảng...</div>;
  }

  // Parse lines into logical blocks
  const lines = content.split("\n");
  const blocks: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBuffer: string[] = [];
  let codeLang = "";
  let blockKey = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check code fence
    if (line.trim().startsWith("```")) {
      if (inCodeBlock) {
        // End code block
        const codeText = codeBuffer.join("\n");
        blocks.push(
          <CodeBlock key={`code-${blockKey++}`} code={codeText} language={codeLang} />
        );
        codeBuffer = [];
        codeLang = "";
        inCodeBlock = false;
      } else {
        // Start code block
        inCodeBlock = true;
        codeLang = line.trim().replace("```", "").trim();
        codeBuffer = [];
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    const trimmed = line.trim();

    // Horizontal Rule
    if (trimmed === "---" || trimmed === "***" || trimmed === "___") {
      blocks.push(
        <hr
          key={`hr-${blockKey++}`}
          className="my-4 border-gray-200 dark:border-brand-border"
        />
      );
      continue;
    }

    // Headings
    if (trimmed.startsWith("# ")) {
      blocks.push(
        <h1
          key={`h1-${blockKey++}`}
          className="text-lg md:text-xl font-bold tracking-tight text-gray-900 dark:text-white border-b border-gray-200 dark:border-brand-border pb-2 mt-2 mb-3"
        >
          {formatInline(trimmed.replace("# ", ""))}
        </h1>
      );
      continue;
    }

    if (trimmed.startsWith("## ")) {
      blocks.push(
        <h2
          key={`h2-${blockKey++}`}
          className="text-base font-bold text-emerald-700 dark:text-emerald-400 mt-4 mb-2 flex items-center gap-1.5"
        >
          {formatInline(trimmed.replace("## ", ""))}
        </h2>
      );
      continue;
    }

    if (trimmed.startsWith("### ")) {
      blocks.push(
        <h3
          key={`h3-${blockKey++}`}
          className="text-sm font-semibold text-gray-900 dark:text-gray-100 mt-3 mb-1.5"
        >
          {formatInline(trimmed.replace("### ", ""))}
        </h3>
      );
      continue;
    }

    // Blockquote
    if (trimmed.startsWith("> ")) {
      blocks.push(
        <div
          key={`quote-${blockKey++}`}
          className="my-2 rounded-r-lg border-l-4 border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/20 p-3 text-xs text-emerald-900 dark:text-emerald-300"
        >
          {formatInline(trimmed.replace(/^>\s*/, ""))}
        </div>
      );
      continue;
    }

    // Bullet List Item
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      blocks.push(
        <li
          key={`li-${blockKey++}`}
          className="ml-4 list-disc text-xs text-gray-700 dark:text-gray-300 leading-relaxed my-0.5"
        >
          {formatInline(trimmed.slice(2))}
        </li>
      );
      continue;
    }

    // Numbered List Item
    const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
    if (numMatch) {
      blocks.push(
        <div
          key={`num-${blockKey++}`}
          className="flex items-start gap-2 my-1 text-xs text-gray-700 dark:text-gray-300 leading-relaxed"
        >
          <span className="font-semibold text-emerald-600 dark:text-emerald-400 shrink-0">
            {numMatch[1]}.
          </span>
          <div>{formatInline(numMatch[2])}</div>
        </div>
      );
      continue;
    }

    // Empty Line
    if (trimmed === "") {
      continue;
    }

    // Normal Paragraph
    blocks.push(
      <p
        key={`p-${blockKey++}`}
        className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed my-1.5"
      >
        {formatInline(trimmed)}
      </p>
    );
  }

  // Handle unclosed code block if any
  if (inCodeBlock && codeBuffer.length > 0) {
    blocks.push(
      <CodeBlock
        key={`code-${blockKey++}`}
        code={codeBuffer.join("\n")}
        language={codeLang}
      />
    );
  }

  return <div className="space-y-1">{blocks}</div>;
}

// Inline formatting: **bold**, `code`, and links
function formatInline(text: string): React.ReactNode {
  // Split by inline code `...`
  const codeParts = text.split(/(`[^`]+`)/g);

  return codeParts.map((part, index) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      const codeSnippet = part.slice(1, -1);
      return (
        <code
          key={index}
          className="rounded bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 px-1 py-0.5 font-mono text-[11px] font-medium text-emerald-700 dark:text-emerald-300 mx-0.5"
        >
          {codeSnippet}
        </code>
      );
    }

    // Parse **bold** inside text
    const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
    return boldParts.map((subPart, subIdx) => {
      if (subPart.startsWith("**") && subPart.endsWith("**")) {
        return (
          <strong
            key={`${index}-${subIdx}`}
            className="font-bold text-gray-900 dark:text-white"
          >
            {subPart.slice(2, -2)}
          </strong>
        );
      }
      return <React.Fragment key={`${index}-${subIdx}`}>{subPart}</React.Fragment>;
    });
  });
}

function CodeBlock({ code, language }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-2.5 rounded-lg border border-gray-200 dark:border-brand-border/60 bg-slate-900 text-slate-100 shadow-sm overflow-hidden text-xs font-mono">
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/80 px-3 py-1.5 text-[11px] text-gray-400">
        <span className="flex items-center gap-1.5 font-semibold text-emerald-400">
          <Terminal className="h-3 w-3" />
          {language || "python"}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 rounded px-2 py-0.5 text-[10px] text-gray-400 hover:text-white hover:bg-slate-800 transition"
          title="Sao chép mã nguồn"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-emerald-400" /> Đã sao chép!
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" /> Sao chép
            </>
          )}
        </button>
      </div>
      <pre className="p-3 overflow-x-auto leading-relaxed text-gray-100 whitespace-pre">
        <code>{code}</code>
      </pre>
    </div>
  );
}

