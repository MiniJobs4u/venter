// src/App.jsx
import React, { useState } from "react";
import Register from "./components/Register";
import AdminLogin from "./components/AdminLogin";

function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  const toggleMode = () => {
    setIsAdmin((prev) => !prev);
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <button onClick={toggleMode} style={{ marginBottom: "1rem" }}>
        {isAdmin ? "Přepnout na registraci" : "Přepnout na přihlášení admina"}
      </button>

      {isAdmin ? <AdminLogin /> : <Register />}
    </div>
  );
}

export default App;
