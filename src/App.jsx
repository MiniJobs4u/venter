import React, { useState, useEffect } from "react";
import Register from "./Register";
import Login from "./components/Login";
import AdminPanel from "./components/AdminPanel";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsub();
  }, []);

  if (window.location.pathname === "/admin") {
    return user ? <AdminPanel /> : <Login onLogin={() => window.location.reload()} />;
  }

  return <Register />;
}

export default App;
