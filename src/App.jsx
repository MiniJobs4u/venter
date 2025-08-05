import React, { useState, useEffect } from "react";
import Register from "./components/Register";
import AdminLogin from "./components/AdminLogin";

function App() {
  const [isAdminView, setIsAdminView] = useState(false);

  // Volitelně: přepnutí podle URL parametru
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("admin") === "true") {
      setIsAdminView(true);
    }
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "1rem" }}>
      <button onClick={() => setIsAdminView(!isAdminView)} style={{ marginBottom: "1rem" }}>
        {isAdminView ? "Switch to Registration" : "Switch to Admin Login"}
      </button>

      {isAdminView ? <AdminLogin /> : <Register />}
    </div>
  );
}

export default App;
