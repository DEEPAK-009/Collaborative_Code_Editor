// import { useParams } from "react-router-dom";
// import { useState, useContext, useEffect } from "react";
// import { runCode } from "../api/execute";
// import { AuthContext } from "../context/AuthContext";
// import { useLocation } from "react-router-dom";

// import socket from "../socket/socket";
// import Header from "../components/Header";
// import CodeEditor from "../components/CodeEditor";
// import Chat from "../components/Chat";
// import Participants from "../components/Participants";
// import Output from "../components/Output";

// const Editor = () => {
//   const { roomId } = useParams();
//   const [joined, setJoined] = useState(false);
//   const [code, setCode] = useState("");
//   const [language, setLanguage] = useState("python");
//   const [output, setOutput] = useState("");

//   const { token } = useContext(AuthContext);

//   // socket connection

//   useEffect(() => {
//   socket.auth = { token };

//   if (!socket.connected) {
//     socket.connect();
//   }

//   const handleConnect = () => {
//     console.log("Connected:", socket.id);
//     socket.emit("join-room", { roomId });
//   };

//   socket.on("connect", handleConnect);

//   return () => {
//     socket.off("connect", handleConnect);
//     // ❌ DO NOT disconnect here
//   };
// }, [roomId, token]);

//   useEffect(() => {
//     socket.on("load-code", ({ code }) => {
//       setCode(code);
//       setJoined(true);
//     });

//     socket.on("code-update", ({ code }) => {
//       setCode(code);
//     });

//     return () => {
//       socket.off("load-code");
//       socket.off("code-update");
//     };
//   }, []);

//   useEffect(() => {
//   socket.on("execution-result", ({ output }) => {
//     setOutput(output);
//   });

//   return () => {
//     socket.off("execution-result");
//   };
// }, []);

//   const handleRun = async () => {
//     try {
//       await runCode(roomId, language, code, token);
//     } catch (err) {
//       setOutput("Execution failed");
//     }
//   };

//   return (
//     <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
//       <Header
//         roomId={roomId}
//         language={language}
//         setLanguage={setLanguage}
//         onRun={handleRun}
//       />

//       <div style={{ flex: 1, display: "flex" }}>
//         <div style={{ flex: 3, display: "flex", flexDirection: "column" }}>
//           <CodeEditor code={code} setCode={setCode} roomId={roomId} joined={joined}/>

//           <Output output={output} />
//         </div>

//         <div style={{ flex: 1 }}>
//           <Chat roomId={roomId} />
//         </div>

//         <div style={{ width: "250px" }}>
//           <Participants roomId={roomId} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Editor;



import { useParams } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { runCode } from "../api/execute";
import { AuthContext } from "../context/AuthContext";
import { useLocation } from "react-router-dom"; // ✅ ADDED

import socket from "../socket/socket";
import Header from "../components/Header";
import CodeEditor from "../components/CodeEditor";
import Chat from "../components/Chat";
import Participants from "../components/Participants";
import Output from "../components/Output";

const Editor = () => {
  const { roomId } = useParams();

  const location = useLocation(); // ✅ ADDED
  const username =
  location.state?.username || localStorage.getItem("username"); // ✅ EXTRACT USERNAME

  const [joined, setJoined] = useState(false);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");
  const [output, setOutput] = useState("");

  const { token } = useContext(AuthContext);

  // socket connection
  useEffect(() => {
    socket.auth = { token };

    if (!socket.connected) {
      socket.connect();
    }

    const handleConnect = () => {
      console.log("Connected:", socket.id);

      socket.emit("join-room", {
        roomId,
        username, // ✅ SEND USERNAME
      });
    };

    socket.on("connect", handleConnect);

    return () => {
      socket.off("connect", handleConnect);
      // ❌ DO NOT disconnect here
    };
  }, [roomId, token, username]); // ✅ added username dependency

  useEffect(() => {
    socket.on("load-code", ({ code }) => {
      setCode(code);
      setJoined(true);
    });

    socket.on("code-update", ({ code }) => {
      setCode(code);
    });

    return () => {
      socket.off("load-code");
      socket.off("code-update");
    };
  }, []);

  useEffect(() => {
    socket.on("execution-result", ({ output }) => {
      setOutput(output);
    });

    return () => {
      socket.off("execution-result");
    };
  }, []);

  const handleRun = async () => {
    try {
      await runCode(roomId, language, code, token);
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
            roomId={roomId}
            joined={joined}
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