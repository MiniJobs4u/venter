// src/App.jsx
import React from "react";
import AdminPanel from "./components/AdminPanel";
import RegistrationForm from "./components/RegistrationForm";

export default function App() {
  const params = new URLSearchParams(window.location.search);
  const isAdmin = params.get("admin") === "true";

  return isAdmin ? <AdminPanel /> : <RegistrationForm />;
}
