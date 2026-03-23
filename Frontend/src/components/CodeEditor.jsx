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

  useEffect(() => {
    if (!editorRef.current || !monacoRef.current) {
      return;
    }

    const model = editorRef.current.getModel();

    if (!model) {
      return;
    }

    const decorations = remoteCursors.map((cursor, index) => {
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
        },
      };
    });

    decorationIdsRef.current = editorRef.current.deltaDecorations(
      decorationIdsRef.current,
      decorations
    );
  }, [remoteCursors]);

  const handleMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    editor.onDidChangeCursorPosition((event) => {
      onCursorMove?.(event.position);
    });
  };

  return (
    <div className="editor-shell">
      <Editor
        height="100%"
        language={language}
        theme="vs-dark"
        value={code}
        onChange={(nextValue) => onChange(nextValue || "")}
        onMount={handleMount}
        options={{
          automaticLayout: true,
          minimap: { enabled: false },
          fontSize: 15,
          fontLigatures: true,
          smoothScrolling: true,
          scrollBeyondLastLine: false,
          tabSize: 2,
          readOnly,
          padding: { top: 18 },
        }}
      />
    </div>
  );
};

export default CodeEditor;
