import React from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

const registrations = [
  { reg: "JIDV 8GL", name: "George Evans", contact: "123 456 7890", company: "Triple Logistics", timeIn: "13:45 30/04/24", timeOut: "23:45", purpose: "Parcels" },
  { reg: "ABA 3AM", name: "John Smith", contact: "123 456 7890", company: "Fleet Services", timeIn: "13:45 30/04/24", timeOut: "19:15", purpose: "Parcels" },
  { reg: "GNE.4HR", name: "Damian Grant", contact: "123 456 7890", company: "Acme Ltd.", timeIn: "13:45 30/04/24", timeOut: "02:55", purpose: "Parcels" },
  { reg: "PB37 TTX", name: "Charles Fire", contact: "123 456 7890", company: "Global Couriers", timeIn: "17:20 30/04/24", timeOut: "19:30", purpose: "Delivery" },
  // ... další záznamy dle potřeby
];

export default function AdminPanel() {
  const exportCSV = () => {
    const csv = [
      ["Reg. number", "Name", "Contact", "Company", "Time in", "Time out", "Delivery to"],
      ...registrations.map(r => [r.reg, r.name, r.contact, r.company, r.timeIn, r.timeOut, r.purpose])
    ]
      .map(row => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "registrations.csv";
    link.click();
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Registrations", 14, 16);
    doc.autoTable({
      startY: 20,
      head: [["Reg. number", "Name", "Contact", "Company", "Time in", "Time out", "Delivery to"]],
      body: registrations.map(r => [r.reg, r.name, r.contact, r.company, r.timeIn, r.timeOut, r.purpose]),
    });
    doc.save("registrations.pdf");
  };

  return (
    <div style={{ backgroundColor: "#0a1d3b", minHeight: "100vh", padding: "2rem", color: "#fff" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h1 style={{ color: "#ffffff", fontSize: "2rem" }}>Registrations</h1>
        <div>
          <button onClick={exportCSV} style={buttonStyle}>Export as CSV</button>
          <button onClick={exportPDF} style={buttonStyle}>Export as PDF</button>
        </div>
      </div>

      <table style={tableStyle}>
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
          {registrations.map((r, i) => (
            <tr key={i}>
              <td>{r.reg}</td>
              <td>{r.name}</td>
              <td>{r.contact}</td>
              <td>{r.company}</td>
              <td>{r.timeIn}</td>
              <td>{r.timeOut}</td>
              <td>{r.purpose}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const buttonStyle = {
  backgroundColor: "#1e90ff",
  color: "#fff",
  border: "none",
  padding: "0.5rem 1rem",
  marginLeft: "0.5rem",
  borderRadius: "4px",
  cursor: "pointer",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  backgroundColor: "#0d2a50",
  color: "#fff",
};

tableStyle["th"] = tableStyle["td"] = {
  padding: "0.75rem",
  border: "1px solid #1e90ff",
  textAlign: "left",
};
