// Web Worker for running Python code using Pyodide
let pyodide = null;

self.onmessage = async function(e) {
  const { type, code } = e.data;
  
  if (type === 'init') {
    try {
      self.postMessage({ type: 'status', message: 'Loading Pyodide...' });
      
      importScripts('https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js');
      pyodide = await loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/'
      });
      
      self.postMessage({ type: 'ready' });
    } catch (error) {
      self.postMessage({ type: 'error', message: 'Failed to load Pyodide: ' + error.message });
    }
    return;
  }
  
  if (type === 'run') {
    if (!pyodide) {
      self.postMessage({ type: 'error', message: 'Pyodide not initialized' });
      self.postMessage({ type: 'done', exitCode: 1 });
      return;
    }
    
    try {
      // Capture stdout/stderr
      pyodide.runPython(`
import sys
from io import StringIO
sys.stdout = StringIO()
sys.stderr = StringIO()
`);
      
      // Run user code
      await pyodide.runPythonAsync(code);
      
      // Get output
      const stdout = pyodide.runPython('sys.stdout.getvalue()');
      const stderr = pyodide.runPython('sys.stderr.getvalue()');
      
      if (stdout) {
        self.postMessage({ type: 'stdout', data: stdout });
      }
      
      if (stderr) {
        self.postMessage({ type: 'stderr', data: stderr });
      }
      
      self.postMessage({ type: 'done', exitCode: 0 });
    } catch (error) {
      self.postMessage({ 
        type: 'error', 
        message: error.message 
      });
      self.postMessage({ type: 'done', exitCode: 1 });
    }
  }
};
