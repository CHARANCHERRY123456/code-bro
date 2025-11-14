"use client";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { json } from "@codemirror/lang-json";
import { markdown } from "@codemirror/lang-markdown";
import { xml } from "@codemirror/lang-xml";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { yCollab } from 'y-codemirror.next';
import { useEffect, useRef, useState, useMemo } from "react";

// Language detection based on file extension
const getLanguageExtension = (fileName) => {
  const ext = fileName?.split('.').pop()?.toLowerCase();
  
  const languageMap = {
    // JavaScript/TypeScript
    'js': javascript({ jsx: false }),
    'jsx': javascript({ jsx: true }),
    'ts': javascript({ typescript: true }),
    'tsx': javascript({ jsx: true, typescript: true }),
    'mjs': javascript(),
    'cjs': javascript(),
    
    // Python
    'py': python(),
    
    // Java
    'java': java(),
    
    // C/C++
    'c': cpp(),
    'cpp': cpp(),
    'cc': cpp(),
    'h': cpp(),
    'hpp': cpp(),
    
    // Web
    'html': html(),
    'htm': html(),
    'css': css(),
    'scss': css(),
    'sass': css(),
    'json': json(),
    'xml': xml(),
    
    // Markdown
    'md': markdown(),
    'markdown': markdown(),
  };
  
  return languageMap[ext] || javascript(); // Default to JavaScript
};

// Available languages for selection
const languages = [
  { id: 'javascript', name: 'JavaScript', extension: '.js' },
  { id: 'typescript', name: 'TypeScript', extension: '.ts' },
  { id: 'python', name: 'Python', extension: '.py' },
  { id: 'java', name: 'Java', extension: '.java' },
  { id: 'cpp', name: 'C++', extension: '.cpp' },
  { id: 'c', name: 'C', extension: '.c' },
  { id: 'html', name: 'HTML', extension: '.html' },
  { id: 'css', name: 'CSS', extension: '.css' },
  { id: 'json', name: 'JSON', extension: '.json' },
  { id: 'markdown', name: 'Markdown', extension: '.md' },
  { id: 'xml', name: 'XML', extension: '.xml' },
];

export default function RealTimeEditor({ fileId = "1", fileName = "untitled.js", projectId }){
  const editorRef = useRef(null);
  const ydocRef = useRef(null);
  const providerRef = useRef(null);
  const [collabExtension, setCollabExtension] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  
  // Get language extension based on selected language
  const languageExtension = useMemo(() => {
    const languageMap = {
      'javascript': javascript(),
      'typescript': javascript({ typescript: true }),
      'python': python(),
      'java': java(),
      'cpp': cpp(),
      'c': cpp(),
      'html': html(),
      'css': css(),
      'json': json(),
      'markdown': markdown(),
      'xml': xml(),
    };
    return languageMap[selectedLanguage] || javascript();
  }, [selectedLanguage]);
  
  // Set initial language based on fileName
  useEffect(() => {
    const ext = fileName?.split('.').pop()?.toLowerCase();
    const langMap = {
      'js': 'javascript', 'jsx': 'javascript', 'mjs': 'javascript',
      'ts': 'typescript', 'tsx': 'typescript',
      'py': 'python',
      'java': 'java',
      'cpp': 'cpp', 'cc': 'cpp', 'cxx': 'cpp', 'hpp': 'cpp',
      'c': 'c', 'h': 'c',
      'html': 'html', 'htm': 'html',
      'css': 'css',
      'json': 'json',
      'md': 'markdown', 'markdown': 'markdown',
      'xml': 'xml',
    };
    if (ext && langMap[ext]) {
      setSelectedLanguage(langMap[ext]);
    }
  }, [fileName]);

  useEffect(()=>{
    setIsReady(false);
    
    // Initialize Yjs document
    const ydoc = new Y.Doc();
    ydocRef.current = ydoc;

    // Get the shared text type
    const ytext = ydoc.getText("codemirror");

    // Initialize WebSocket provider with proper URL
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:5000';
    console.log('Connecting to WebSocket:', wsUrl, 'Document:', fileId);
    console.log('Yjs Documenttext :', ytext);
    const provider = new WebsocketProvider(
      wsUrl,
      fileId,
      ydoc
    );
    providerRef.current = provider;

    // Set user info in awareness
    provider.awareness.setLocalStateField('user', {
      name: 'User ' + Math.floor(Math.random() * 100),
      color: '#' + Math.floor(Math.random()*16777215).toString(16)
    });

    // Set up collaboration extension immediately
    setCollabExtension([yCollab(ytext, provider.awareness)]);

    // Listen to provider status
    provider.on('status', event => {
      console.log('WebSocket status:', event.status);
      if (event.status === 'connected') {
        setIsReady(true);
      }
    });

    // Listen for sync events
    provider.on('sync', isSynced => {
      console.log('Document synced:', isSynced);
      if (isSynced) {
        setIsReady(true);
      }
    });

    return () => {
      console.log('Cleaning up Yjs connection for document:', fileId);
      setIsReady(false);
      setCollabExtension([]);
      if (providerRef.current) {
        providerRef.current.destroy();
      }
      if (ydocRef.current) {
        ydocRef.current.destroy();
      }
    };
  }, [fileId]);

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
        <div className="px-3 py-2 bg-[#1f2426] border-b border-[#2f3438] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56]"></span>
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e]"></span>
            <span className="w-3 h-3 rounded-full bg-[#27c93f]"></span>
            <span className="ml-3 text-sm text-gray-200">{fileName}</span>
          </div>
          
          {/* Language Selector - LeetCode Style */}
          <div className="relative">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="px-3 py-1.5 pr-8 bg-[#2a2d30] text-gray-200 text-sm border border-[#3e3e42] rounded hover:bg-[#313538] focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer appearance-none transition-colors"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23999' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                backgroundPosition: 'right 0.5rem center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1.25em 1.25em',
              }}
            >
              {languages.map((lang) => (
                <option key={lang.id} value={lang.id} className="bg-[#2a2d30]">
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-hidden bg-[#1e1e1e]">
          <style jsx global>{`
            .cm-editor {
              background: #1e1e1e !important;
              color: #d4d4d4 !important;
              font-family: 'Menlo', 'Monaco', 'Courier New', monospace !important;
              height: 100%;
            }
            .cm-scroller {
              background: #1e1e1e !important;
            }
            .cm-content {
              background: #1e1e1e !important;
              padding: 0.5rem 0;
            }
            .cm-line {
              background: transparent !important;
              padding: 0 1rem;
              line-height: 1.5rem;
              color: #d4d4d4;
            }
            .cm-gutters {
              background: #1e1e1e !important;
              color: #858585;
              border-right: 1px solid #3e3e42;
              padding-right: 0.5rem;
            }
            .cm-activeLineGutter {
              background: #282828 !important;
            }
            .cm-activeLine {
              background: #282828 !important;
            }
            /* Selection styles - VS Code like */
            .cm-selectionBackground,
            .cm-content ::selection {
              background: #264f78 !important;
            }
            .cm-focused .cm-selectionBackground,
            .cm-focused .cm-content ::selection {
              background: #264f78 !important;
            }
            .cm-selectionMatch {
              background: #3a3d41 !important;
            }
            .cm-cursor {
              border-left: 2px solid white !important;
            }
            .cm-placeholder {
              color: #6b7280;
              font-style: italic;
            }
            .cm-matchingBracket {
              background: rgba(255, 255, 255, 0.1);
              border: 1px solid #3e3e42;
            }
            .cm-searchMatch {
              background: rgba(250, 204, 21, 0.3);
              border: 1px solid rgba(250, 204, 21, 0.5);
            }
            .cm-searchMatch-selected {
              background: rgba(250, 204, 21, 0.5);
            }
            .cm-focused {
              outline: none !important;
            }
            /* Yjs collaboration cursors */
            .y-cursor, .yjs-cursor {
              position: relative;
              border-left: 2px solid #3b8eea;
              margin-left: -1px;
            }
            .y-selection, .yjs-selection {
              background: rgba(59, 142, 234, 0.2);
              border-left: 2px solid #3b8eea;
            }
            /* Scrollbar */
            .cm-scroller::-webkit-scrollbar {
              width: 12px;
              height: 12px;
            }
            .cm-scroller::-webkit-scrollbar-track {
              background: #1e1e1e;
            }
            .cm-scroller::-webkit-scrollbar-thumb {
              background: #424242;
              border-radius: 4px;
              border: 2px solid #1e1e1e;
            }
            .cm-scroller::-webkit-scrollbar-thumb:hover {
              background: #4e4e4e;
            }
          `}</style>
          <CodeMirror
            ref={editorRef}
            height="100%"
            className="h-full"
            extensions={[languageExtension, vscodeDark, ...collabExtension]}
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