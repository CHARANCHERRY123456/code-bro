"use client";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { githubDark } from "@uiw/codemirror-theme-github";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { EditorView } from "@uiw/react-codemirror";

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