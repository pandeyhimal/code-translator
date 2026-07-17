// src/components/CodeEditor.jsx
import React from "react";
import Editor from "@monaco-editor/react";

const CodeEditor = ({ code, onCodeChange, selectedLanguage }) => {
  return (
    <div className="w-full h-[500px] border border-gray-300 rounded-md shadow-md">
      <Editor
        height="100%"
        language={selectedLanguage}
        value={code}
        theme="vs-dark"
        onChange={(value) => onCodeChange(value)}
        options={{
          fontSize: 16,
          minimap: { enabled: false },
          automaticLayout: true,
        }}
      />
    </div>
  );
};

export default CodeEditor;
