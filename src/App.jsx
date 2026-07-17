// src/App.jsx
import React, { useState, useEffect } from "react";
import { usePyodide } from "./utils/usePyodide";
import { translateCode } from "./utils/translator";
import MonacoEditor from "./components/CodeEditor";

function App() {
  const { pyodide, loading } = usePyodide();
  const [code, setCode] = useState(`# Write Python code here\n`);
  const [output, setOutput] = useState("");
  const [errors, setErrors] = useState([]);

  // Initialize/reinitialize Python stdout buffer on Pyodide load or reset
  async function initializePy() {
    if (!pyodide) return;
    await pyodide.runPythonAsync(`
import sys
from io import StringIO
sys.stdout = StringIO()
sys.stderr = sys.stdout
`);
  }

  // Run once when Pyodide is ready
  useEffect(() => {
    initializePy();
  }, [pyodide]);

  // Run code & check syntax
  async function runCode() {
    if (!pyodide) {
      setOutput("Pyodide is still loading, please wait...");
      return;
    }
    try {
      setErrors([]);
      // Syntax check (compile)
      pyodide.runPython(`compile('''${code}''', '<input>', 'exec')`);

      // Run code
      await pyodide.runPythonAsync(code);

      // Get all output so far
      const currentOutput = pyodide.runPython("sys.stdout.getvalue()");
      setOutput(currentOutput);
    } catch (err) {
      setErrors([err.message]);
    }
  }

  // Reset environment & output/errors
  async function resetEnvironment() {
    if (!pyodide) return;
    await initializePy();
    setOutput("");
    setErrors([]);
  }

  const translated = translateCode(code);

  return (
    <div className="p-6 bg-gray-100 min-h-screen max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Nepali Code Translator</h1>

      <label className="block font-semibold mb-2">Write Python Code:</label>
      <MonacoEditor
        height="300px"
        language="python"
        value={code}
        onChange={(value) => setCode(value)}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          wordWrap: "on",
          automaticLayout: true,
        }}
      />

      <div className="flex gap-4 mt-4">
        <button
          onClick={runCode}
          disabled={loading}
          className={`px-4 py-2 rounded text-white ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Loading Python..." : "Run Code"}
        </button>

        <button
          onClick={resetEnvironment}
          disabled={loading}
          className={`px-4 py-2 rounded text-white ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-gray-700 hover:bg-gray-800"
          }`}
        >
          Reset Environment
        </button>
      </div>

      <section className="mt-8 p-4 bg-white shadow rounded">
        <h2 className="text-xl font-semibold mb-3">Translated Nepali Code</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-x-auto whitespace-pre-wrap font-mono text-sm">{translated}</pre>
      </section>

      <section className="mt-8 p-4 bg-black text-white font-mono rounded min-h-[120px]">
        <h3 className="font-semibold mb-2">Output:</h3>
        <pre>{output || "(No output yet)"}</pre>
      </section>

      <section className="mt-8 p-4 bg-red-100 rounded border border-red-400 text-red-700 min-h-[80px]">
        <h3 className="font-semibold mb-2">Syntax Errors Detected:</h3>
        {errors.length === 0 ? (
          <p>No errors found!</p>
        ) : (
          <ul className="list-disc list-inside">
            {errors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default App;
