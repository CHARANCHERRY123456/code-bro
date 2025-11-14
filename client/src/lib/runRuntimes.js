// Frontend-only code execution runtimes (no backend changes)

// Run JavaScript code in-browser with console capture
export async function runJS(code, onOutput) {
  const logs = [];
  const origLog = console.log;
  const origError = console.error;
  const origWarn = console.warn;
  
  console.log = (...args) => {
    const msg = args.map(a => String(a)).join(' ');
    logs.push(msg);
    origLog(...args);
  };
  console.error = (...args) => {
    const msg = 'ERROR: ' + args.map(a => String(a)).join(' ');
    logs.push(msg);
    origError(...args);
  };
  console.warn = (...args) => {
    const msg = 'WARN: ' + args.map(a => String(a)).join(' ');
    logs.push(msg);
    origWarn(...args);
  };

  try {
    onOutput('\x1b[1;33m>>> Running JavaScript...\x1b[0m\r\n');
    const fn = new Function(code);
    const result = fn();
    
    if (logs.length > 0) {
      logs.forEach(log => onOutput(log + '\r\n'));
    }
    
    if (result !== undefined) {
      onOutput('\x1b[1;32mReturn value: \x1b[0m' + String(result) + '\r\n');
    }
    
    onOutput('\x1b[1;32m✓ Execution completed\x1b[0m\r\n');
  } catch (error) {
    onOutput('\x1b[1;31m✗ Error: \x1b[0m' + error.message + '\r\n');
    if (error.stack) {
      onOutput('\x1b[90m' + error.stack + '\x1b[0m\r\n');
    }
  } finally {
    console.log = origLog;
    console.error = origError;
    console.warn = origWarn;
  }
}

// Run Python code using Pyodide (in-browser Python)
let pyodideInstance = null;

export async function runPy(code, onOutput) {
  try {
    onOutput('\x1b[1;33m>>> Running Python (Pyodide)...\x1b[0m\r\n');
    
    // Load Pyodide if not already loaded
    if (!pyodideInstance) {
      // Delegate to preload helper which may be triggered earlier
      await preloadPyodide(onOutput);
    }

    // Capture stdout
    pyodideInstance.runPython(`
import sys
from io import StringIO
sys.stdout = StringIO()
sys.stderr = StringIO()
`);

    // Run user code
    await pyodideInstance.runPythonAsync(code);

    // Get output
    const stdout = pyodideInstance.runPython('sys.stdout.getvalue()');
    const stderr = pyodideInstance.runPython('sys.stderr.getvalue()');

    if (stdout) {
      onOutput(stdout + '\r\n');
    }
    
    if (stderr) {
      onOutput('\x1b[1;31mStderr:\x1b[0m\r\n' + stderr + '\r\n');
    }
    
    onOutput('\x1b[1;32m✓ Execution completed\x1b[0m\r\n');
  } catch (error) {
    onOutput('\x1b[1;31m✗ Error: \x1b[0m' + error.message + '\r\n');
  }
}

// Run code via Piston API (remote execution, may hit CORS)
export async function runRemote(code, language, onOutput) {
  try {
    onOutput(`\x1b[1;33m>>> Running ${language} via Piston API...\x1b[0m\r\n`);
    
    const payload = {
      language,
      version: '*',
      files: [{ name: 'main', content: code }]
    };

    const res = await fetch('https://emkc.org/api/v2/piston/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();

    if (data.run) {
      if (data.run.stdout) {
        onOutput(data.run.stdout + '\r\n');
      }
      
      if (data.run.stderr) {
        onOutput('\x1b[1;31mStderr:\x1b[0m\r\n' + data.run.stderr + '\r\n');
      }
      
      onOutput(`\x1b[1;36mExit code: ${data.run.code}\x1b[0m\r\n`);
      
      if (data.run.code === 0) {
        onOutput('\x1b[1;32m✓ Execution completed\x1b[0m\r\n');
      } else {
        onOutput('\x1b[1;31m✗ Execution failed\x1b[0m\r\n');
      }
    } else {
      onOutput('\x1b[1;31m✗ No run data in response\x1b[0m\r\n');
    }
  } catch (error) {
    onOutput('\x1b[1;31m✗ Error: \x1b[0m' + error.message + '\r\n');
    
    if (error.message.includes('CORS') || error.message.includes('Failed to fetch')) {
      onOutput('\x1b[90m\r\nNote: Direct Piston API calls may be blocked by CORS.\x1b[0m\r\n');
      onOutput('\x1b[90mConsider using a backend proxy route instead.\x1b[0m\r\n');
    }
  }
}

// Main dispatcher: route to appropriate runtime based on language
export async function runCode({ language, code, onOutput }) {
  if (!code || !code.trim()) {
    onOutput('\x1b[1;31m✗ No code to run\x1b[0m\r\n');
    return;
  }

  // Normalize language name
  const lang = language.toLowerCase();

  // Route to appropriate runner
  if (lang === 'javascript' || lang === 'js') {
    await runJS(code, onOutput);
  } else if (lang === 'python' || lang === 'py') {
    await runPy(code, onOutput);
  } else {
    // Try remote execution for other languages
    const pistonLangMap = {
      'typescript': 'typescript',
      'ts': 'typescript',
      'java': 'java',
      'c': 'c',
      'cpp': 'cpp',
      'c++': 'cpp',
      'go': 'go',
      'rust': 'rust',
      'ruby': 'ruby',
      'php': 'php',
      'swift': 'swift',
      'kotlin': 'kotlin',
      'csharp': 'csharp',
      'c#': 'csharp',
    };

    const pistonLang = pistonLangMap[lang] || lang;
    await runRemote(code, pistonLang, onOutput);
  }
}

// Preload Pyodide in background to reduce first-run latency
export async function preloadPyodide(onOutput) {
  if (pyodideInstance) return pyodideInstance;
  try {
    if (onOutput) onOutput('\x1b[90mLoading Pyodide (background)...\x1b[0m\r\n');

    if (!window.loadPyodide) {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }

    pyodideInstance = await window.loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/'
    });

    if (onOutput) onOutput('\x1b[90mPyodide loaded (background)\x1b[0m\r\n');
    return pyodideInstance;
  } catch (err) {
    if (onOutput) onOutput('\x1b[1;31mFailed to preload Pyodide: ' + (err.message || err) + '\x1b[0m\r\n');
    throw err;
  }
}
