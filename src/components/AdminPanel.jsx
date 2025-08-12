import React, { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import "./AdminPanel.css";
import { useNavigate } from "react-router-dom";

export default function AdminPanel() {
  const [rows, setRows] = useState([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const nav = useNavigate();

  // Guard – jen přihlášený admin
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) nav("/admin-login", { replace: true });
    });
    return () => unsub();
  }, [nav]);

  useEffect(() => {
    const q = query(collection(db, "registrations"), orderBy("timeIn", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => {
        const x = d.data();
        return {
          id: d.id,
          vehicleReg: x.vehicleReg || "",
          name: x.name || "",
          contact: x.contact || "",
          deliveryTo: x.deliveryTo || "",
          reason: x.reason || "",
          timeIn: x.timeIn?.toDate?.() ?? null,
          timeOut: x.timeOut?.toDate?.() ?? null,
        };
      });
      setRows(data);
    });
    return () => unsub();
  }, []);

  const filtered = useMemo(() => {
    if (!from && !to) return rows;
    const f = from ? new Date(from + "T00:00:00") : null;
    const t = to ? new Date(to + "T23:59:59") : null;
    return rows.filter((r) => {
      if (!r.timeIn) return false;
      if (f && r.timeIn < f) return false;
      if (t && r.timeIn > t) return false;
      return true;
    });
  }, [rows, from, to]);

  const exportCSV = () => {
    const lines = [
      ["Reg. number", "Name", "Contact", "Company", "Time in", "Time out", "Reason"].join(","),
      ...filtered.map((r) =>
        [
          safe(r.vehicleReg),
          safe(r.name),
          safe(r.contact),
          safe(r.deliveryTo),
          r.timeIn ? fmt(r.timeIn) : "-",
          r.timeOut ? fmt(r.timeOut) : "-",
          safe(r.reason),
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([lines], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vehicle_log.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    doc.setFontSize(16);
    doc.text("Registrations", 40, 40);
    doc.autoTable({
      startY: 60,
      styles: { fontSize: 9, cellPadding: 6 },
      head: [["Reg. number", "Name", "Contact", "Company", "Time in", "Time out", "Reason"]],
      body: filtered.map((r) => [
        r.vehicleReg,
        r.name,
        r.contact,
        r.deliveryTo,
        r.timeIn ? fmt(r.timeIn) : "-",
        r.timeOut ? fmt(r.timeOut) : "-",
        r.reason || "",
      ]),
    });
    doc.save("vehicle_log.pdf");
  };

  return (
    <div className="admin-root">
      <header className="branding">
        <div className="brand-badge small">
          <div className="brand-title small">WESTGATE</div>
        </div>
        <div className="brand-sub small">OXFORD</div>
      </header>

      <div className="admin-card">
        <div className="toolbar">
          <div className="title">Registrations</div>
          <div className="grow"></div>
          <div className="filters">
            <label>
              From
              <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
            </label>
            <label>
              To
              <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
            </label>
            <button className="btn ghost" onClick={() => { setFrom(""); setTo(""); }}>Clear</button>
            <button className="btn" onClick={exportCSV}>Export as CSV</button>
            <button className="btn" onClick={exportPDF}>Export as PDF</button>
            <button className="btn ghost" onClick={() => signOut(auth)}>Logout</button>
          </div>
        </div>

        <div className="table-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>Reg. number</th>
                <th>Name</th>
                <th>Contact</th>
                <th>Company</th>
                <th>Time in</th>
                <th>Time out</th>
                <th>Reason</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id}>
                  <td>{r.vehicleReg}</td>
                  <td>{r.name}</td>
                  <td>{r.contact}</td>
                  <td>{r.deliveryTo}</td>
                  <td>{r.timeIn ? fmt(r.timeIn) : "-"}</td>
                  <td>{r.timeOut ? fmt(r.timeOut) : "-"}</td>
                  <td>{r.reason || "-"}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", opacity: .7, padding: "22px" }}>
                    No records in selected range.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function fmt(d) {
  const dd = new Date(d);
  const p = (n) => n.toString().padStart(2, "0");
  return `${p(dd.getHours())}:${p(dd.getMinutes())} ${p(dd.getDate())}/${p(dd.getMonth() + 1)}/${dd.getFullYear()}`;
}
const safe = (s = "") => `"${String(s).replaceAll('"','""')}"`;
