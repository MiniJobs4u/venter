import React, { useEffect, useMemo, useState } from "react";
import "./AdminPanel.css";

// Volitelně Firebase (když máš `db` export z ../firebase)
let canUseFirestore = false;
let fs;
try {
  // Tyto importy necháme uvnitř try, aby se build nezlomil, když Firebase nepoužíváš
  // eslint-disable-next-line
  fs = require("firebase/firestore");
  canUseFirestore = true;
} catch (_) {}

/* Exporty */
import { jsPDF } from "jspdf";
import "jspdf-autotable";

export default function AdminPanel() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Načtení dat (Firestore -> fallback na mock)
  useEffect(() => {
    let isMounted = true;

    async function load() {
      setLoading(true);
      try {
        if (canUseFirestore) {
          const { db } = require("../firebase"); // musí exportovat `db`
          const { collection, getDocs, orderBy, query } = fs;

          const q = query(collection(db, "registrations"), orderBy("timeIn", "desc"));
          const snap = await getDocs(q);
          const data = snap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          }));
          if (isMounted) setRows(normalize(data));
        } else {
          if (isMounted) setRows(normalize(MOCK_DATA));
        }
      } catch (e) {
        console.error("Loading registrations failed → using mock data.", e);
        if (isMounted) setRows(normalize(MOCK_DATA));
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();
    return () => (isMounted = false);
  }, []);

  // Filtrace podle data
  const filtered = useMemo(() => {
    if (!dateFrom && !dateTo) return rows;

    const from = dateFrom ? new Date(dateFrom + "T00:00:00") : null;
    const to = dateTo ? new Date(dateTo + "T23:59:59") : null;

    return rows.filter((r) => {
      const t = r.timeInDate || new Date(r.timeIn);
      if (from && t < from) return false;
      if (to && t > to) return false;
      return true;
    });
  }, [rows, dateFrom, dateTo]);

  const exportCSV = () => {
    const header = [
      "Reg. number",
      "Name",
      "Contact",
      "Company",
      "Time in",
      "Time out",
      "Delivery to",
    ];
    const body = filtered.map((r) => [
      r.vehicleReg || "",
      r.name || "",
      r.contact || "",
      r.company || "",
      r.timeIn || "",
      r.timeOut || "-",
      r.deliveryTo || "",
    ]);

    const csv = [header, ...body].map((row) => row.map(safeCSV).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "vehicle_log.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    doc.setFontSize(14);
    doc.text("Registrations", 40, 40);

    const head = [
      ["Reg. number", "Name", "Contact", "Company", "Time in", "Time out", "Delivery to"],
    ];
    const body = filtered.map((r) => [
      r.vehicleReg || "",
      r.name || "",
      r.contact || "",
      r.company || "",
      r.timeIn || "",
      r.timeOut || "-",
      r.deliveryTo || "",
    ]);

    doc.autoTable({
      head,
      body,
      startY: 60,
      styles: { fontSize: 9, cellPadding: 6 },
      headStyles: { fillColor: [15, 35, 55] },
      alternateRowStyles: { fillColor: [245, 248, 252] },
    });

    doc.save("vehicle_log.pdf");
  };

  return (
    <div className="admin-wrap">
      <header className="brand">
        <div className="brand-top">WESTGATE</div>
        <div className="brand-sub">OXFORD</div>
      </header>

      <div className="panel">
        <div className="panel-head">
          <h2>Registrations</h2>

          <div className="filters">
            <label>
              From
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </label>
            <label>
              To
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </label>

            <button className="btn ghost" onClick={() => { setDateFrom(""); setDateTo(""); }}>
              Clear
            </button>

            <div className="spacer" />

            <button className="btn" onClick={exportCSV}>
              Export as CSV
            </button>
            <button className="btn outline" onClick={exportPDF}>
              Export as PDF
            </button>
          </div>
        </div>

        <div className="table-wrap">
          <table className="reg-table">
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
                <tr>
                  <td colSpan="7" className="loading">
                    Loading…
                  </td>
                </tr>
              ) : filtered.length ? (
                filtered.map((r) => (
                  <tr key={r.id}>
                    <td>{r.vehicleReg}</td>
                    <td>{r.name}</td>
                    <td>{r.contact}</td>
                    <td>{r.company}</td>
                    <td>{r.timeIn}</td>
                    <td>{r.timeOut || "-"}</td>
                    <td>{r.deliveryTo}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="loading">
                    No records
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <footer className="powered">
        Powered by <img src="/mitie-logo.png" alt="Mitie" />
      </footer>
    </div>
  );
}

/* ---------- helpers ---------- */

function safeCSV(v) {
  if (v == null) return "";
  const s = String(v);
  // uniknout čárky/uvozovky
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function normalize(list) {
  return list.map((r, i) => {
    const tIn = r.timeIn ? toHuman(r.timeIn) : "-";
    const tOut = r.timeOut ? toHuman(r.timeOut) : null;
    return {
      id: r.id || String(i),
      vehicleReg: r.vehicleReg || r.registration || "",
      name: r.name || r.driverName || "",
      contact: r.contact || r.contactNumber || "",
      company: r.company || "",
      deliveryTo: r.deliveryTo || r.destination || "",
      timeIn: tIn,
      timeOut: tOut,
      timeInDate: r.timeIn ? new Date(r.timeIn) : null,
    };
  });
}

function toHuman(val) {
  // podpora timestampu, ISO, čísla
  const d = val?.seconds ? new Date(val.seconds * 1000) : new Date(val);
  if (Number.isFinite(val)) return new Date(val).toLocaleString();
  if (isNaN(d.getTime())) return String(val);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) +
    " " +
    d.toLocaleDateString();
}

/* ---------- fallback data ---------- */
const MOCK_DATA = [
  {
    vehicleReg: "JIDV 8GL",
    name: "George Evans",
    contact: "123 456 7890",
    company: "Triple Logistics",
    timeIn: new Date("2024-04-30T13:45:00"),
    timeOut: new Date("2024-04-30T23:45:00"),
    deliveryTo: "Parcels",
  },
  {
    vehicleReg: "ABA 3AM",
    name: "John Smith",
    contact: "123 456 7890",
    company: "Fleet Services",
    timeIn: new Date("2024-04-30T13:45:00"),
    timeOut: new Date("2024-04-30T19:15:00"),
    deliveryTo: "Parcels",
  },
  {
    vehicleReg: "GNE.4HR",
    name: "Damian Grant",
    contact: "123 456 7890",
    company: "Acme Ltd.",
    timeIn: new Date("2024-04-30T13:55:00"),
    timeOut: new Date("2024-04-30T14:55:00"),
    deliveryTo: "Parcels",
  },
];
