import React from "react";
import { getAuth, signOut } from "firebase/auth";

export default function AdminPanel() {
  const logout = () => {
    const auth = getAuth();
    signOut(auth);
    window.location.reload();
  };

  return (
    <div>
      <h2>Welcome, Admin!</h2>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
