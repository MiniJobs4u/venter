// src/components/AdminPanel.jsx
import React, { useEffect, useMemo, useState } from "react";
import "./AdminPanel.css";
import { db } from "../firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

export default function AdminPanel() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Živý odběr dat
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
        console.error(err);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  const filtered = useMemo(() => {
    if (!dateFrom && !dateTo) return rows;
    const from = dateFrom ? new Date(dateFrom) : null;
    const to = dateTo ? new Date(dateTo) : null;
    return rows.filter((r) => {
      const d = r.timeInDate;
      if (from && d < from) return false;
      if (to) {
        const end = new Date(to);
        end.setHours(23, 59, 59, 999);
        if (d > end) return false;
      }
      return true;
    });
  }, [rows, dateFrom, dateTo]);

  const exportCSV = () => {
    const head = [
      "Reg. number",
      "Name",
      "Contact",
      "Company",
      "Time in",
      "Time out",
      "Delivery to",
    ];
    const body = filtered.map((r) => [
      r.vehicleReg,
      r.name,
      r.contact,
      r.company,
      r.timeIn || "",
      r.timeOut || "",
      r.deliveryTo || "",
    ]);
    const csv = [head, ...body].map((a) => a.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vehicle_log.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });
    doc.text("Daily Vehicle Log", 14, 14);
    const body = filtered.map((r) => [
      r.vehicleReg,
      r.name,
      r.contact,
      r.company,
      r.timeIn || "",
      r.timeOut || "",
      r.deliveryTo || "",
    ]);
    doc.autoTable({
      startY: 18,
      head: [[
        "Reg. number","Name","Contact","Company","Time in","Time out","Delivery to"
      ]],
      body,
      styles: { fontSize: 8 },
    });
    doc.save("vehicle_log.pdf");
  };

  return (
    <div className="page admin">
      <div className="logoBlock">
        <div className="logoTop">WESTGATE</div>
        <div className="logoSub">OXFORD</div>
      </div>

      <div className="panel">
        <div className="panelHead">
          <h1>Registrations</h1>
          <div className="actions">
            <div className="dates">
              <label>From</label>
              <input type="date" value={dateFrom} onChange={(e)=>setDateFrom(e.target.value)} />
              <label>To</label>
              <input type="date" value={dateTo} onChange={(e)=>setDateTo(e.target.value)} />
            </div>
            <button className="btn ghost" onClick={exportCSV}>Export as CSV</button>
            <button className="btn" onClick={exportPDF}>Export as PDF</button>
          </div>
        </div>

        <div className="tableWrap">
          <table>
            <thead>
              <tr>
                <th>Reg. number</th>
                <th>Name</th>
                <th>Contact</th>
                <th>Company</th>
                <th>Time in</th>
                <th>Time out</th>
                <th>Delivery to</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" className="muted">Loading…</td></tr>
              ) : filtered.length ? (
                filtered.map((r) => (
                  <tr key={r.id}>
                    <td>{r.vehicleReg}</td>
                    <td>{r.name}</td>
                    <td>{r.contact}</td>
                    <td>{r.company}</td>
                    <td>{r.timeIn}</td>
                    <td>{r.timeOut || "-"}</td>
                    <td>{r.deliveryTo || "-"}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="7" className="muted">No data</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* helper – převod timeIn na čitelné pole + Date */
function normalize(arr) {
  return arr.map((r) => {
    let timeInStr = "";
    let timeInDate = new Date(0);
    if (r.timeIn && r.timeIn.seconds) {
      timeInDate = new Date(r.timeIn.seconds * 1000);
      timeInStr = fmt(timeInDate);
    } else if (typeof r.timeIn === "string") {
      const d = new Date(r.timeIn);
      if (!isNaN(d)) {
        timeInDate = d;
        timeInStr = fmt(d);
      }
    }
    return { ...r, timeIn: timeInStr, timeInDate };
  });
}

function fmt(d) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(d.getHours())}:${pad(d.getMinutes())} ${pad(d.getDate())}/${pad(
    d.getMonth() + 1
  )}/${String(d.getFullYear()).slice(-2)}`;
}
