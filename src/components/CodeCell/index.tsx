import { useState, useEffect } from "react";

import CodeEditor from "@components/CodeEditor";
import CodePreview from "@components/CodePreview";
import bundle from "@plugins/bundler";
import Resizable from "@components/Resizable";

const CodeCell = () => {
  const [code, setCode] = useState("");
  const [input, setInput] = useState("");

  useEffect(() => {
    const timer = setTimeout(async () => {
      const output = await bundle(input);
      setCode(output);
    }, 800);

    return () => {
      clearTimeout(timer);
    };
  }, [input]);

  return (
    <Resizable direction="vertical">
      <div style={{ height: "100%", display: "flex" }}>
        <Resizable direction="horizontal">
          <CodeEditor
            onChange={(value) => setInput(value)}
            initialValue="const a = 1"
          />
        </Resizable>
        <CodePreview bundledCode={code} />
      </div>
    </Resizable>
  );
};

export default CodeCell;
