// src/components/AdminPanel.jsx
import React, { useEffect, useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import "../../App.css";
export default function AdminPanel() {
  const [registrations, setRegistrations] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const db = getFirestore();
      const querySnapshot = await getDocs(collection(db, "registrations"));
      const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setRegistrations(data);
    };

    fetchData();
  }, []);

  const logout = () => {
    const auth = getAuth();
    signOut(auth);
    window.location.reload();
  };

  const filterData = () => {
    if (!startDate || !endDate) return registrations;
    const start = new Date(startDate);
    const end = new Date(endDate);
    return registrations.filter((entry) => {
      const entryDate = new Date(entry.timeIn);
      return entryDate >= start && entryDate <= end;
    });
  };

  const exportCSV = () => {
    const data = filterData();
    const csvContent = [
      ["Reg. Number", "Name", "Contact", "Delivery To", "Time In", "Time Out"],
      ...data.map((entry) => [
        entry.vehicleReg,
        entry.name,
        entry.contact,
        entry.deliveryTo,
        entry.timeIn,
        entry.timeOut || "-",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "vehicle_log.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Daily Vehicle Log", 14, 16);
    doc.autoTable({
      startY: 20,
      head: [["Reg. Number", "Name", "Contact", "Delivery To", "Time In", "Time Out"]],
      body: filterData().map((entry) => [
        entry.vehicleReg,
        entry.name,
        entry.contact,
        entry.deliveryTo,
        entry.timeIn,
        entry.timeOut || "-",
      ]),
    });
    doc.save("vehicle_log.pdf");
  };

  return (
    <div className="container">
      <img src="/logo-westgate.png" alt="Westgate Logo" className="logo" />
      <h2>Daily Vehicle Log</h2>
      <button onClick={logout}>Logout</button>
      <div style={{ margin: "1rem 0" }}>
        <label style={{ marginRight: "0.5rem" }}>From:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          style={{ marginRight: "1rem" }}
        />
        <label style={{ marginRight: "0.5rem" }}>To:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          style={{ marginRight: "1rem" }}
        />
        <button onClick={exportCSV} style={{ marginRight: "1rem" }}>Export to CSV</button>
        <button onClick={exportPDF}>Export to PDF</button>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Reg. Number</th>
            <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Name</th>
            <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Contact</th>
            <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Delivery To</th>
            <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Time In</th>
            <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Time Out</th>
          </tr>
        </thead>
        <tbody>
          {filterData().map((entry) => (
            <tr key={entry.id}>
              <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{entry.vehicleReg}</td>
              <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{entry.name}</td>
              <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{entry.contact}</td>
              <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{entry.deliveryTo}</td>
              <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{entry.timeIn}</td>
              <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{entry.timeOut || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="footer">
        Powered by <img src="/logo-mitie.png" alt="Mitie Logo" />
      </div>
    </div>
  );
}
