const Header = () => {
  return (
    <div style={{ height: "60px", borderBottom: "1px solid gray", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px" }}>
      
      <div>
        Room: AB43F5
      </div>

      <div>
        <select>
          <option>Python</option>
          <option>JavaScript</option>
        </select>

        <button style={{ marginLeft: "10px" }}>
          Run
        </button>
      </div>

    </div>
  );
};

export default Header;