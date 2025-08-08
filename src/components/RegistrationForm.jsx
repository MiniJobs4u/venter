// src/components/RegistrationForm.jsx
import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import "./RegistrationForm.css";

const initial = {
  vehicleReg: "",
  name: "",
  contact: "",
  company: "",
  deliveryTo: "",
};

export default function RegistrationForm() {
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState("");

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErr("");
    try {
      await addDoc(collection(db, "registrations"), {
        vehicleReg: form.vehicleReg.trim(),
        name: form.name.trim(),
        contact: form.contact.trim(),
        company: form.company.trim(),
        deliveryTo: form.deliveryTo.trim(),
        timeIn: serverTimestamp(),
      });
      setForm(initial);
      setOk(true);
      setTimeout(() => setOk(false), 2500);
    } catch (error) {
      console.error(error);
      setErr("Saving failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page">
      <div className="logoBlock">
        <div className="logoTop">WESTGATE</div>
        <div className="logoSub">OXFORD</div>
      </div>

      <form className="card" onSubmit={onSubmit}>
        <h1 className="title">Westgate Oxford - Service Yard B</h1>
        <p className="subtitle">
          Out of hours access: Please call Control Room 01865 263699
        </p>

        <label>Vehicle registration</label>
        <input
          name="vehicleReg"
          value={form.vehicleReg}
          onChange={onChange}
          placeholder="Vehicle registration"
          required
        />

        <label>Driver’s name</label>
        <input
          name="name"
          value={form.name}
          onChange={onChange}
          placeholder="Driver's name"
          required
        />

        <label>Contact number</label>
        <input
          name="contact"
          value={form.contact}
          onChange={onChange}
          placeholder="Contact number"
          required
        />

        <label>Delivery to</label>
        <input
          name="company"
          value={form.company}
          onChange={onChange}
          placeholder="Delivery to"
          required
        />

        <label>Reason for visit</label>
        <input
          name="deliveryTo"
          value={form.deliveryTo}
          onChange={onChange}
          placeholder="Reason for visit"
        />

        <button className="btn" disabled={saving}>
          {saving ? "Saving…" : "Submit"}
        </button>

        {ok && <div className="note ok">Saved ✓</div>}
        {err && <div className="note err">{err}</div>}
      </form>

      <div className="adminEntry">
        <a className="adminLink" href="?admin=true">Admin login</a>
      </div>
    </div>
  );
}
