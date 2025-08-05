// src/App.jsx
import React, { useState } from "react";
import Register from "./components/Register";
import AdminLogin from "./components/AdminLogin";

function App() {
  const [mode, setMode] = useState("visitor");

  return (
    <div>
      <div style={{ textAlign: "center", margin: "2rem" }}>
        <button
          onClick={() => setMode("visitor")}
          style={{
            marginRight: "1rem",
            padding: "0.5rem 1rem",
            backgroundColor: mode === "visitor" ? "#007bff" : "#ccc",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Visitor
        </button>
        <button
          onClick={() => setMode("admin")}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: mode === "admin" ? "#007bff" : "#ccc",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Admin
        </button>
      </div>

      {mode === "visitor" ? <Register /> : <AdminLogin />}
    </div>
  );
}

export default App;
