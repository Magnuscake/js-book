import { useState } from "react";
import { Resizable } from 'react-resizable';

import CodeEditor from "@components/CodeEditor";
import CodePreview from "@components/CodePreview";
import bundle from "@plugins/bundler";

const CodeCell = () => {
  const [code, setCode] = useState("");
  const [input, setInput] = useState("");

  const onClick = async () => {
    const output = await bundle(input);
    setCode(output);
  };

  return (
    <div>
      <CodeEditor
        onChange={(value) => setInput(value)}
        initialValue="const a = 1"
      />
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      <CodePreview bundledCode={code} />
    </div>
  );
};

export default CodeCell;
