// Web Worker for running JavaScript code (isolated from main thread)
self.onmessage = function(e) {
  const { code } = e.data;
  
  const logs = [];
  
  // Mock console for capturing output
  const mockConsole = {
    log: (...args) => {
      logs.push({ type: 'log', message: args.map(a => String(a)).join(' ') });
    },
    error: (...args) => {
      logs.push({ type: 'error', message: args.map(a => String(a)).join(' ') });
    },
    warn: (...args) => {
      logs.push({ type: 'warn', message: args.map(a => String(a)).join(' ') });
    }
  };
  
  try {
    // Create function with mocked console
    const fn = new Function('console', code);
    const result = fn(mockConsole);
    
    // Send logs
    logs.forEach(log => {
      self.postMessage({ type: 'output', data: log });
    });
    
    // Send result if defined
    if (result !== undefined) {
      self.postMessage({ type: 'result', data: String(result) });
    }
    
    self.postMessage({ type: 'done', exitCode: 0 });
  } catch (error) {
    self.postMessage({ 
      type: 'error', 
      message: error.message,
      stack: error.stack 
    });
    self.postMessage({ type: 'done', exitCode: 1 });
  }
};
