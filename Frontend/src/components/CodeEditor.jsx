import Editor from "@monaco-editor/react";
import { useEffect, useRef } from "react";

const CURSOR_CLASSES = Array.from({ length: 6 }, (_, index) => `remote-cursor-${index}`);

const CodeEditor = ({
  code,
  language,
  onChange,
  onCursorMove,
  readOnly,
  remoteCursors,
}) => {
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const decorationIdsRef = useRef([]);

  const onCursorMoveRef = useRef(onCursorMove);

  useEffect(() => {
    onCursorMoveRef.current = onCursorMove;
  }, [onCursorMove]);

  useEffect(() => {
    if (!editorRef.current || !monacoRef.current) {
      return;
    }

    const model = editorRef.current.getModel();

    if (!model) {
      return;
    }

    const decorations = remoteCursors
      .filter((cursor) => cursor?.position?.lineNumber && cursor?.position?.column)
      .map((cursor, index) => {
        const lineNumber = Math.min(
          Math.max(cursor.position.lineNumber, 1),
          model.getLineCount()
        );
        const maxColumn = model.getLineMaxColumn(lineNumber);
        const column = Math.min(Math.max(cursor.position.column, 1), maxColumn);
        const endColumn = Math.min(column + 1, maxColumn);

        return {
          range: new monacoRef.current.Range(lineNumber, column, lineNumber, endColumn),
          options: {
            className: CURSOR_CLASSES[index % CURSOR_CLASSES.length],
            hoverMessage: cursor.displayName ? { value: cursor.displayName } : undefined,
          },
        };
      });

    decorationIdsRef.current = editorRef.current.deltaDecorations(
      decorationIdsRef.current,
      decorations
    );
  }, [remoteCursors]);

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

    editor.onDidChangeCursorPosition((event) => {
      onCursorMoveRef.current?.(event.position);
    });
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
