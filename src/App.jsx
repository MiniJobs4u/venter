import React from "react";
import { Outlet } from "react-router-dom";

// Layout pouze drží tmavé pozadí přes celou app
export default function App() {
  return (
    <div style={{ minHeight: "100vh", background: "#061825" }}>
      <Outlet />
    </div>
  );
}
