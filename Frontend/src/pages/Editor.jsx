import Header from "../components/Header";
import CodeEditor from "../components/CodeEditor";
import Chat from "../components/Chat";
import Participants from "../components/Participants";
import Output from "../components/Output";

const Editor = () => {
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      
      <Header />

      <div style={{ flex: 1, display: "flex" }}>
        
        {/* CODE + OUTPUT */}
        <div style={{ flex: 3, display: "flex", flexDirection: "column" }}>
          <CodeEditor />
          <Output />
        </div>

        {/* CHAT */}
        <div style={{ flex: 1 }}>
          <Chat />
        </div>

        {/* PARTICIPANTS */}
        <div style={{ width: "250px" }}>
          <Participants />
        </div>

      </div>

    </div>
  );
};

export default Editor;