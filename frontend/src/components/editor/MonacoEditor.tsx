"use client";

import Editor from "@monaco-editor/react";

interface MonacoEditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

export function MonacoEditor({
  value,
  onChange,
  readOnly = false,
}: MonacoEditorProps) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-lg border border-brand-border bg-[#1e1e1e]">
      <Editor
        height="100%"
        defaultLanguage="python"
        language="python"
        theme="vs-dark"
        value={value}
        onChange={(val) => onChange(val || "")}
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "'Fira Code', 'Courier New', monospace",
          lineNumbers: "on",
          roundedSelection: true,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 4,
          insertSpaces: true,
          wordWrap: "on",
          padding: { top: 12, bottom: 12 },
          suggestOnTriggerCharacters: true,
          cursorBlinking: "smooth",
          cursorSmoothCaretAnimation: "on",
          smoothScrolling: true,
        }}
        loading={
          <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
            Đang tải Monaco Code Editor...
          </div>
        }
      />
    </div>
  );
}

