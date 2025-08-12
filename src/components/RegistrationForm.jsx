import React, { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import "./RegistrationForm.css";

export default function RegistrationForm() {
  const [form, setForm] = useState({
    vehicleReg: "",
    name: "",
    contact: "",
    deliveryTo: "",
    reason: "",
  });
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(false);
  const colRef = collection(db, "registrations");

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setOk(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.vehicleReg || !form.name || !form.contact) return;
    setLoading(true);
    try {
      await addDoc(colRef, {
        ...form,
        timeIn: serverTimestamp(),
        timeOut: null,
      });
      setForm({
        vehicleReg: "",
        name: "",
        contact: "",
        deliveryTo: "",
        reason: "",
      });
      setOk(true);
    } catch (err) {
      console.error("Save error:", err);
      alert("Saving failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reg-root">
      <header className="branding">
        <div className="brand-badge">
          <div className="brand-title">WESTGATE</div>
        </div>
        <div className="brand-sub">OXFORD</div>
      </header>

      <main className="card">
        <form onSubmit={handleSubmit} className="form">
          <label className="lbl">Vehicle registration</label>
          <input
            name="vehicleReg"
            value={form.vehicleReg}
            onChange={handleChange}
            className="inp"
            placeholder=""
            required
          />

          <label className="lbl">Driver’s name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="inp"
            required
          />

          <label className="lbl">Contact number</label>
          <input
            name="contact"
            value={form.contact}
            onChange={handleChange}
            className="inp"
            required
          />

          <label className="lbl">Delivery to</label>
          <input
            name="deliveryTo"
            value={form.deliveryTo}
            onChange={handleChange}
            className="inp"
          />

          <label className="lbl">Reason for visit</label>
          <input
            name="reason"
            value={form.reason}
            onChange={handleChange}
            className="inp"
          />

          <button className="btn" type="submit" disabled={loading}>
            {loading ? "Saving..." : "Submit"}
          </button>

          {ok && <div className="ok">Thank you. Entry recorded.</div>}
        </form>
      </main>

      <footer className="footer">
        <div className="powered">
          Powered by <span className="mitie">mitie</span>
        </div>
        <Link to="/admin-login" className="admin-link">
          Admin login
        </Link>
      </footer>
    </div>
  );
}
