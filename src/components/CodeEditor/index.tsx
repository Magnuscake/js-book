import { useRef } from "react";
import MonacoEditor, { EditorDidMount } from "@monaco-editor/react";
import prettier from "prettier";
import parser from "prettier/parser-babel";
import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import MonacoJSXHighlighter from "monaco-jsx-highlighter";

interface CodeEditorProps {
  initialValue: string;
  onChange(value: string): void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ initialValue, onChange }) => {
  const editorRef = useRef<any>();

  const onEditorDidMount: EditorDidMount = (getValue, monacoEditor) => {
    editorRef.current = monacoEditor;
    monacoEditor.onDidChangeModelContent(() => {
      onChange(getValue());
    });

    // TODO: Eventually give option of setting tab size
    monacoEditor.getModel()?.updateOptions({ tabSize: 2 });

    // const babelParse = (code: string) =>
    //   parse(code, {
    //     sourceType: "module",
    //     plugins: ["jsx"],
    //   });

    // const highlighter = new MonacoJSXHighlighter(
    //   // @ts-ignore
    //   monaco,
    //   babelParse,
    //   traverse,
    //   monacoEditor
    // );
    // // Activate highlighting (debounceTime default: 100ms)
    // // @ts-ignore
    // highlighter.highLightOnDidChangeModelContent(
    //   () => {},
    //   () => {},
    //   undefined,
    //   () => {}
    // );
    // // Activate JSX commenting
    //
    // // @ts-ignore
    // highlighter.addJSXCommentCommand();
  };

  const onFormatClick = () => {
    // get current value from editor
    const unformatted = editorRef.current.getModel().getValue();
    // format the value
    const formatted = prettier
      .format(unformatted, {
        parser: "babel",
        plugins: [parser],
        useTabs: false,
        semi: true,
        singleQuote: true,
        trailingComma: "es5",
      })
      .replace(/\n$/, "");
    // set the formatted value back in the editor
    editorRef.current.setValue(formatted);
  };

  return (
    <div className="editor-wrapper">
      <button
        className="button button-format is-primary is-small"
        onClick={onFormatClick}
      >
        Format
      </button>
      <MonacoEditor
        editorDidMount={onEditorDidMount}
        value={initialValue}
        language="javascript"
        theme="dark"
        height="100%"
        options={{
          wordWrap: "on",
          minimap: { enabled: false },
          showUnused: false,
          folding: false,
          lineNumbersMinChars: 3,
          fontSize: 16,
        }}
      />
    </div>
  );
};

export default CodeEditor;
