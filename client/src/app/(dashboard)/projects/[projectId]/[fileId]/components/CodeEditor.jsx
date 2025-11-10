"use client";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { yCollab } from 'y-codemirror.next';
import { useEffect, useRef } from "react";
import { Compartment } from "@codemirror/state";

export default function RealTimeEditor({fileId = "1"}){
  const editorRef = useRef(null);
  const collabCompartment = useRef(new Compartment());

  useEffect(()=>{
    const ydoc = new Y.Doc();

    const provider=new WebsocketProvider(
      process.env.NEXT_PUBLIC_WS_URL,
      fileId,
      ydoc
    );

    const ytext = ydoc.getText("codemirror");

    const interval = setInterval(()=>{
      const view = editorRef.current?.view;
      if(view){
        clearInterval(interval);
        // Reconfigure the compartment with the collaborative extension
        view.dispatch({
          effects: collabCompartment.current.reconfigure(yCollab(ytext, provider.awareness)),
        });
      }
    },200);


    return ()=>{
      provider.destroy();
      ydoc.destroy();
    }

  },[fileId]);

  return (
    <div className="flex flex-col h-full p-4 overflow-hidden">
      <div className="flex items-center justify-between mb-3 shrink-0">
        <h2 className="text-lg font-semibold text-gray-100">Collaborative code editor</h2>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-xs font-medium text-green-400">Connected</span>
        </div>
      </div>

      {/* Editor card - purely Tailwind, dark theme applied to CodeMirror internals via arbitrary selectors */}
      <div className="flex-1 flex flex-col rounded-md overflow-hidden border border-[#2f3438] shadow-sm bg-[#161719] min-h-0">
        <div className="px-3 py-2 bg-[#1f2426] border-b border-[#2f3438] flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56]"></span>
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e]"></span>
            <span className="w-3 h-3 rounded-full bg-[#27c93f]"></span>
            <span className="ml-3 text-sm text-gray-200">file-{fileId}.js</span>
          </div>
          
        </div>

        <div className="flex-1 overflow-hidden bg-[#1e1e1e] [&_.cm-editor]:bg-[#1e1e1e]! [&_.cm-editor]:text-[#d4d4d4] [&_.cm-editor]:font-mono [&_.cm-scroller]:bg-[#1e1e1e]! [&_.cm-content]:bg-[#1e1e1e]! [&_.cm-content]:py-2 [&_.cm-line]:bg-transparent! [&_.cm-line]:px-4 [&_.cm-line]:leading-6 [&_.cm-line]:text-[#d4d4d4] [&_.cm-gutters]:bg-[#1e1e1e]! [&_.cm-gutters]:text-[#858585] [&_.cm-gutters]:border-r [&_.cm-gutters]:border-[#3e3e42] [&_.cm-gutters]:pr-2 [&_.cm-activeLineGutter]:bg-[#282828]! [&_.cm-activeLine]:bg-[#282828]! [&_.cm-selectionBackground]:bg-blue-500/30! [&_.cm-cursor]:border-l-2! [&_.cm-cursor]:border-white! [&_.cm-placeholder]:text-[#6b7280] [&_.cm-placeholder]:italic [&_.cm-matchingBracket]:bg-white/10 [&_.cm-matchingBracket]:border [&_.cm-matchingBracket]:border-[#3e3e42] [&_.cm-searchMatch]:bg-yellow-400/30 [&_.cm-searchMatch]:border [&_.cm-searchMatch]:border-yellow-400/50 [&_.cm-searchMatch-selected]:bg-yellow-400/50 [&_.cm-focused]:outline-none [&_.y-cursor]:relative [&_.y-cursor]:border-l-2 [&_.y-cursor]:border-blue-500 [&_.y-cursor]:-ml-px [&_.yjs-cursor]:relative [&_.yjs-cursor]:border-l-2 [&_.yjs-cursor]:border-blue-500 [&_.yjs-cursor]:-ml-px [&_.y-selection]:bg-blue-500/20 [&_.y-selection]:border-l-2 [&_.y-selection]:border-blue-500 [&_.yjs-selection]:bg-blue-500/20 [&_.yjs-selection]:border-l-2 [&_.yjs-selection]:border-blue-500 [&_.cm-scroller::-webkit-scrollbar]:w-3 [&_.cm-scroller::-webkit-scrollbar]:h-3 [&_.cm-scroller::-webkit-scrollbar-track]:bg-[#1e1e1e] [&_.cm-scroller::-webkit-scrollbar-thumb]:bg-[#424242] [&_.cm-scroller::-webkit-scrollbar-thumb]:rounded [&_.cm-scroller::-webkit-scrollbar-thumb]:border-2 [&_.cm-scroller::-webkit-scrollbar-thumb]:border-[#1e1e1e] [&_.cm-scroller::-webkit-scrollbar-thumb:hover]:bg-[#4e4e4e]">
          <CodeMirror
            ref={editorRef}
            height="100%"
            className="h-full bg-[#1e1e1e]!"
            extensions={[javascript(), vscodeDark, collabCompartment.current.of([])]}
            placeholder="// start typing the code here"
            basicSetup={{
              lineNumbers: true,
              highlightActiveLineGutter: true,
              highlightActiveLine: true,
              foldGutter: true,
              dropCursor: true,
              allowMultipleSelections: true,
              indentOnInput: true,
              bracketMatching: true,
              closeBrackets: true,
              autocompletion: true,
            }}
          />
        </div>
      </div>
    </div>
  )
}