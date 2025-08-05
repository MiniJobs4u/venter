import React from "react";
import "./AdminPanel.css";

export default function AdminPanel() {
  const data = [
    {
      reg: "JIDV 8GL",
      name: "George Evans",
      contact: "123 456 7890",
      company: "Triple Logistics",
      timeIn: "13:45 30/04/24",
      timeOut: "13:45 23:45",
      delivery: "Parcels",
    },
    {
      reg: "ABA 3AM",
      name: "John Smith",
      contact: "123 456 7890",
      company: "Fleet Services",
      timeIn: "13:45 30/04/24",
      timeOut: "13:45 19:15",
      delivery: "Parcels",
    },
    // Přidej další záznamy podle potřeby
  ];

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>WESTGATE</h1>
        <h2>OXFORD</h2>
      </div>

      <div className="admin-panel">
        <div className="export-buttons">
          <button>Export as CSV</button>
          <button>Export as PDF</button>
        </div>

        <h2>Registrations</h2>
        <div className="admin-table-wrapper">
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
              {data.map((entry, index) => (
                <tr key={index}>
                  <td>{entry.reg}</td>
                  <td>{entry.name}</td>
                  <td>{entry.contact}</td>
                  <td>{entry.company}</td>
                  <td>{entry.timeIn}</td>
                  <td>{entry.timeOut}</td>
                  <td>{entry.delivery}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
