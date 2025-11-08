"use client";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";

export default function CodeEditor({ value, setValue, className = "", placeholder = "// file content..." }) {
  const minHeight = { minHeight: "calc(1.5em * 10)" };

  return (
      <CodeMirror
        value={value}
        height="100vh"
        theme={vscodeDark}
        extensions={[
            javascript(),
        ]}
        onChange={(value) => setValue(value)}
        placeholder={placeholder}
      />
  );
}