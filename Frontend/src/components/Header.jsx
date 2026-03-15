const Header = ({ roomId }) => {
  return (
    <div
      style={{
        height: "60px",
        borderBottom: "1px solid gray",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
      }}
    >
      <div>
        Room: {roomId}
      </div>

      <div>
        <select>
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
          <option value="cpp">C++</option>
          <option value="java">Java</option>
        </select>

        <button style={{ marginLeft: "10px" }}>
          Run
        </button>
      </div>
    </div>
  );
};
