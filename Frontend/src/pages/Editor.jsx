import { useParams } from "react-router-dom";
import { useState, useContext } from "react";
import { runCode } from "../api/execute";
import { AuthContext } from "../context/AuthContext";

import Header from "../components/Header";
import CodeEditor from "../components/CodeEditor";
import Chat from "../components/Chat";
import Participants from "../components/Participants";
import Output from "../components/Output";

const Editor = () => {
  const { roomId } = useParams();

  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");
  const [output, setOutput] = useState("");

  const { token } = useContext(AuthContext);

  const handleRun = async () => {
    try {
      const res = await runCode(language, code, token);
      setOutput(res.data.output);
    } catch (err) {
      setOutput("Execution failed");
    }
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>

      <Header
        roomId={roomId}
        language={language}
        setLanguage={setLanguage}
        onRun={handleRun}
      />

      <div style={{ flex: 1, display: "flex" }}>

        <div style={{ flex: 3, display: "flex", flexDirection: "column" }}>
          <CodeEditor 
            code={code} 
            setCode={setCode} 
          />

          <Output output={output} />
        </div>

        <div style={{ flex: 1 }}>
          <Chat roomId={roomId} />
        </div>

        <div style={{ width: "250px" }}>
          <Participants roomId={roomId} />
        </div>

      </div>

    </div>
  );
};

export default Editor;