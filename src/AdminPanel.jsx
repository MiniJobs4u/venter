import React from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./AdminPanel.css";

const data = [
  {
    reg: "JIDV 8GL",
    name: "George Evans",
    contact: "123 456 7890",
    company: "Triple Logistics",
    timeIn: "13:45 30/04/24",
    timeOut: "23:45",
    deliveryTo: "Parcels",
  },
  {
    reg: "ABA 3AM",
    name: "John Smith",
    contact: "123 456 7890",
    company: "Fleet Services",
    timeIn: "13:45 30/04/24",
    timeOut: "19:15",
    deliveryTo: "Parcels",
  },
  // Můžeš přidat další záznamy
];

export default function AdminPanel() {
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [["Reg. number", "Name", "Contact", "Company", "Time in", "Time out", "Delivery to"]],
      body: data.map((row) => [
        row.reg,
        row.name,
        row.contact,
        row.company,
        row.timeIn,
        row.timeOut,
        row.deliveryTo,
      ]),
    });
    doc.save("registrations.pdf");
  };

  const exportToCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Reg. number,Name,Contact,Company,Time in,Time out,Delivery to"]
        .concat(
          data.map((row) =>
            [row.reg, row.name, row.contact, row.company, row.timeIn, row.timeOut, row.deliveryTo].join(",")
          )
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "registrations.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="admin-panel">
      <h2>Registrations</h2>
      <div className="export-buttons">
        <button onClick={exportToCSV}>Export as CSV</button>
        <button onClick={exportToPDF}>Export as PDF</button>
      </div>
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
          {data.map((entry, i) => (
            <tr key={i}>
              <td>{entry.reg}</td>
              <td>{entry.name}</td>
              <td>{entry.contact}</td>
              <td>{entry.company}</td>
              <td>{entry.timeIn}</td>
              <td>{entry.timeOut}</td>
              <td>{entry.deliveryTo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
