'use client';
import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';

const Terminal = forwardRef(({ code, language, fileName }, ref) => {
  const containerRef = useRef(null);
  const termRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [running, setRunning] = useState(false);
  const currentWorkerRef = useRef(null);
  const pyWorkerRef = useRef(null);

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
        term.writeln('\x1b[90mPress Ctrl+C to stop execution\x1b[0m\r\n');

        // Handle Ctrl+C to abort execution
        term.onKey(({ key, domEvent }) => {
          if (domEvent.ctrlKey && domEvent.key === 'c' && currentWorkerRef.current) {
            abortExecution();
          }
        });

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

  const abortExecution = () => {
    const term = termRef.current?.term;
    if (currentWorkerRef.current) {
      term?.write('\r\n\x1b[1;33m^C\x1b[0m\r\n');
      term?.writeln('\x1b[1;31m✗ Execution aborted\x1b[0m\r\n');
      currentWorkerRef.current.terminate();
      currentWorkerRef.current = null;
      setRunning(false);
    }
  };

  const runCurrentCode = async () => {
    const term = termRef.current?.term;
    if (!term || !code) {
      if (term) term.writeln('\x1b[1;31m✗ No code to run\x1b[0m\r\n');
      return;
    }

    setRunning(true);
    term.clear();
    term.writeln(`\x1b[1;36m=== Running: ${fileName || 'untitled'} ===\x1b[0m\r\n`);

    const lang = language.toLowerCase();

    if (lang === 'javascript' || lang === 'js') {
      // Run JavaScript in worker
      const worker = new Worker('/js-worker.js');
      currentWorkerRef.current = worker;

      worker.onmessage = (e) => {
        const { type, data, message, stack, exitCode } = e.data;
        
        if (type === 'output') {
          if (data.type === 'error') {
            term.write('\x1b[1;31mERROR: \x1b[0m' + data.message + '\r\n');
          } else if (data.type === 'warn') {
            term.write('\x1b[1;33mWARN: \x1b[0m' + data.message + '\r\n');
          } else {
            term.write(data.message + '\r\n');
          }
        } else if (type === 'result') {
          term.write('\x1b[1;32mReturn value: \x1b[0m' + data + '\r\n');
        } else if (type === 'error') {
          term.write('\x1b[1;31m✗ Error: \x1b[0m' + message + '\r\n');
          if (stack) term.write('\x1b[90m' + stack + '\x1b[0m\r\n');
        } else if (type === 'done') {
          if (exitCode === 0) {
            term.write('\x1b[1;32m✓ Execution completed\x1b[0m\r\n');
          } else {
            term.write('\x1b[1;31m✗ Execution failed\x1b[0m\r\n');
          }
          currentWorkerRef.current = null;
          setRunning(false);
        }
      };

      worker.onerror = (err) => {
        term.write('\x1b[1;31m✗ Worker error: \x1b[0m' + err.message + '\r\n');
        currentWorkerRef.current = null;
        setRunning(false);
      };

      worker.postMessage({ code });
    } else if (lang === 'python' || lang === 'py') {
      // Run Python in Pyodide worker
      if (!pyWorkerRef.current) {
        // Initialize Python worker once
        const worker = new Worker('/py-worker.js');
        pyWorkerRef.current = worker;

        worker.onmessage = (e) => {
          const { type, message, data, exitCode } = e.data;
          
          if (type === 'status') {
            term.write('\x1b[90m' + message + '\x1b[0m\r\n');
          } else if (type === 'ready') {
            term.write('\x1b[90mPyodide ready\x1b[0m\r\n');
            // Now run the code
            currentWorkerRef.current = worker;
            worker.postMessage({ type: 'run', code });
          } else if (type === 'stdout') {
            term.write(data + '\r\n');
          } else if (type === 'stderr') {
            term.write('\x1b[1;31mStderr:\x1b[0m\r\n' + data + '\r\n');
          } else if (type === 'error') {
            term.write('\x1b[1;31m✗ Error: \x1b[0m' + message + '\r\n');
          } else if (type === 'done') {
            if (exitCode === 0) {
              term.write('\x1b[1;32m✓ Execution completed\x1b[0m\r\n');
            } else {
              term.write('\x1b[1;31m✗ Execution failed\x1b[0m\r\n');
            }
            currentWorkerRef.current = null;
            setRunning(false);
          }
        };

        worker.onerror = (err) => {
          term.write('\x1b[1;31m✗ Worker error: \x1b[0m' + err.message + '\r\n');
          currentWorkerRef.current = null;
          setRunning(false);
        };

        // Init Pyodide
        worker.postMessage({ type: 'init' });
      } else {
        // Reuse existing Pyodide worker
        currentWorkerRef.current = pyWorkerRef.current;
        pyWorkerRef.current.postMessage({ type: 'run', code });
      }
    } else {
      term.write('\x1b[1;31m✗ Language not supported for frontend execution: \x1b[0m' + language + '\r\n');
      term.write('\x1b[90mOnly JavaScript and Python are supported\x1b[0m\r\n');
      setRunning(false);
    }
  };

  useImperativeHandle(ref, () => ({
    run: runCurrentCode,
    abort: abortExecution,
    clear: () => termRef.current?.term?.clear()
  }));

  // Cleanup workers on unmount
  useEffect(() => {
    return () => {
      if (currentWorkerRef.current) {
        currentWorkerRef.current.terminate();
      }
      if (pyWorkerRef.current) {
        pyWorkerRef.current.terminate();
      }
    };
  }, []);

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
            onClick={abortExecution}
            disabled={!ready || !running}
            className="px-3 py-1 text-xs font-medium rounded bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white transition-colors flex items-center gap-1.5"
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
            </svg>
            Stop
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
