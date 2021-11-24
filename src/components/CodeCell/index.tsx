import { useState } from "react";

import CodeEditor from "@components/CodeEditor";
import CodePreview from "@components/CodePreview";
import bundle from "@plugins/bundler";
import Resizable from "@components/Resizable";

const CodeCell = () => {
  const [code, setCode] = useState("");
  const [input, setInput] = useState("");

  const onClick = async () => {
    const output = await bundle(input);
    setCode(output);
  };

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
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
    </Resizable>
  );
};

export default CodeCell;
