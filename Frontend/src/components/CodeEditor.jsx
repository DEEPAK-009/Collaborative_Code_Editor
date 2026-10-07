import Editor from "@monaco-editor/react";
import { useRef } from "react";

const CodeEditor = ({
  code,
  language,
  onChange,
  readOnly,
}) => {
  const editorRef = useRef(null);
  const monacoRef = useRef(null);

  const defineAndSetTheme = (monaco) => {
    if (!monaco) return;
    monaco.editor.defineTheme("collabx-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#1A2232",
        "editorGutter.background": "#1A2232",
        "editor.lineHighlightBackground": "#ffffff0a",
        "editorLineNumber.foreground": "#50627e",
        "editorLineNumber.activeForeground": "#93c5fd",
        "editorIndentGuide.background1": "#ffffff0f",
        "editorIndentGuide.activeBackground1": "#ffffff22",
        "scrollbarSlider.background": "#ffffff10",
        "scrollbarSlider.hoverBackground": "#ffffff20",
        "scrollbarSlider.activeBackground": "#ffffff30",
      },
    });
    monaco.editor.setTheme("collabx-dark");
  };

  const handleBeforeMount = (monaco) => {
    defineAndSetTheme(monaco);
  };

  const handleMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    defineAndSetTheme(monaco);
  };

  return (
    <div className="editor-shell">
      <div className="editor-shell-header">
        <div className="editor-title-chip">
          <span className="editor-shell-title">Code</span>
        </div>
      </div>
      <div className="editor-shell-body">
        <Editor
          height="100%"
          language={language}
          theme="collabx-dark"
          beforeMount={handleBeforeMount}
          value={code}
          onChange={(nextValue) => onChange(nextValue || "")}
          onMount={handleMount}
          options={{
            automaticLayout: true,
            minimap: { enabled: false },
            fontSize: 14,
            fontLigatures: true,
            smoothScrolling: true,
            scrollBeyondLastLine: false,
            tabSize: 2,
            wordWrap: "on",
            lineNumbersMinChars: 3,
            readOnly,
            padding: { top: 12 },
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
