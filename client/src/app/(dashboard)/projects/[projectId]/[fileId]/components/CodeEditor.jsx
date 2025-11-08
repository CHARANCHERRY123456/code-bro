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
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-2">Collaborative code editor</h2>
      <CodeMirror
        ref={editorRef}
        height="400px"
        // include the vscode dark theme and the compartment so we can reconfigure it later
        extensions={[javascript(), vscodeDark, collabCompartment.current.of([])]}
        placeholder={"//start typing the code here"}
      />
    </div>
  )
}