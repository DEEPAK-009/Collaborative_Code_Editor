import { useParams } from "react-router-dom";
import { useState } from "react";

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

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      
      <Header
        roomId={roomId}
        language={language}
        setLanguage={setLanguage}
      />

      <div style={{ flex: 1, display: "flex" }}>
        
        <div style={{ flex: 3, display: "flex", flexDirection: "column" }}>
          <CodeEditor
            code={code}
            setCode={setCode}
            language={language}
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