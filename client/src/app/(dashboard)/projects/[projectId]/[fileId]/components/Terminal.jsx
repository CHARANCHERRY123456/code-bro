'use client';
import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { runCode } from '@/lib/runRuntimes';

const Terminal = forwardRef(({ code, language, fileName }, ref) => {
  const containerRef = useRef(null);
  const termRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    let mounted = true;
    let term;
    let fit;

    async function init() {
      try {
        const [{ Terminal }, { FitAddon }] = await Promise.all([
          import('xterm'),
          import('xterm-addon-fit')
        ]);
        await import('xterm/css/xterm.css');

        if (!mounted || !containerRef.current) return;

        term = new Terminal({ 
          cursorBlink: true, 
          fontSize: 13, 
          theme: { background: '#1e1e1e', foreground: '#d4d4d4' },
          convertEol: true
        });
        fit = new FitAddon();
        term.loadAddon(fit);
        term.open(containerRef.current);
        fit.fit();

        term.writeln('\x1b[1;32mCodeBro Terminal\x1b[0m');
        term.writeln('Click "Run Code" to execute the current file.\r\n');

        const onResize = () => fit && fit.fit();
        window.addEventListener('resize', onResize);

        termRef.current = { term, fit, onResize };
        setReady(true);
      } catch (err) {
        console.warn('xterm initialization failed:', err);
      }
    }

    init();

    return () => {
      mounted = false;
      if (termRef.current?.onResize) {
        window.removeEventListener('resize', termRef.current.onResize);
      }
      try {
        if (termRef.current?.term) termRef.current.term.dispose();
      } catch (e) {}
    };
  }, []);

  const runCurrentCode = async () => {
    const term = termRef.current?.term;
    if (!term || !code) {
      if (term) term.writeln('\x1b[1;31m✗ No code to run\x1b[0m\r\n');
      return;
    }

    setRunning(true);
    term.clear();
    term.writeln(`\x1b[1;36m=== Running: ${fileName || 'untitled'} ===\x1b[0m\r\n`);

    const onOutput = (text) => {
      term.write(text);
    };

    await runCode({ language, code, onOutput });
    setRunning(false);
  };

  useImperativeHandle(ref, () => ({
    run: runCurrentCode,
    clear: () => termRef.current?.term?.clear()
  }));

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] border-t border-[#2f3438]">
      <div className="px-3 py-2 bg-[#1f2426] border-b border-[#2f3438] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#ff5f56]"></span>
          <span className="w-3 h-3 rounded-full bg-[#ffbd2e]"></span>
          <span className="w-3 h-3 rounded-full bg-[#27c93f]"></span>
          <span className="ml-3 text-sm text-gray-200">Output</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={runCurrentCode}
            disabled={!ready || running}
            className="px-3 py-1 text-xs font-medium rounded bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white transition-colors flex items-center gap-1.5"
          >
            {running ? (
              <>
                <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Running...
              </>
            ) : (
              <>
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
                Run Code
              </>
            )}
          </button>
          <button
            onClick={() => termRef.current?.term?.clear()}
            disabled={!ready}
            className="px-3 py-1 text-xs font-medium rounded bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-gray-300 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden p-2" style={{ minHeight: 150 }}>
        <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      </div>
    </div>
  );
});

Terminal.displayName = 'Terminal';

export default Terminal;
