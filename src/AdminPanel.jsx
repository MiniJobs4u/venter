import React, { useEffect, useMemo, useState } from "react";
import "./AdminPanel.css";

import { jsPDF } from "jspdf";
import "jspdf-autotable";

// ----- 🔽 přidej tyhle importy (Firebase) -----
import { db } from "../firebase"; // musí exportovat `db`
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
// ----------------------------------------------

export default function AdminPanel() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // ✅ ŽIVÁ data z Firestore
  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, "registrations"), orderBy("timeIn", "desc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setRows(normalize(data));
        setLoading(false);
      },
      (err) => {
        console.error("onSnapshot error:", err);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  // ...zbytek komponenty beze změn (filtry, export, render, normalize atd.)
}
