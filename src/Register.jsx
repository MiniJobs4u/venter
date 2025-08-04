import React, { useState } from "react";
import { db } from "./firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

export default function Register() {
  const [form, setForm] = useState({
    vehicle: "",
    name: "",
    contact: "",
    company: "",
    reason: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "registrations"), {
        ...form,
        timeIn: Timestamp.now(),
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Error saving registration:", err);
    }
  };

  return (
    <div style={styles.container}>
      <img
        src="/logo-westgate.png"
        alt="Westgate Oxford"
        style={{ width: 180, marginBottom: 12 }}
      />
      <div style={{ textAlign: "center", marginBottom: 20, fontSize: 16 }}>
        <div>Welcome to Service Yard B</div>
        <div>Out of hours access:</div>
        <div>Please call Control Room</div>
        <div>01865 263699</div>
      </div>

      {!submitted ? (
        <form onSubmit={handleSubmit} style={styles.form}>
          <input name="vehicle" placeholder="Vehicle registration" onChange={handleChange} required />
          <input name="name" placeholder="Driver's name" onChange={handleChange} required />
          <input name="contact" placeholder="Contact number" onChange={handleChange} required />
          <input name="company" placeholder="Company name" onChange={handleChange} required />
          <input name="reason" placeholder="Reason for visit" onChange={handleChange} required />
          <button type="submit">Submit</button>
        </form>
      ) : (
        <div style={{ color: "#6df76d" }}>✅ Thank you. See you soon again!</div>
      )}

      <img src="/mitie-logo.png" alt="Mitie" style={{ width: 100, marginTop: 40 }} />
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 360,
    margin: "auto",
    padding: 20,
    fontFamily: "Arial, sans-serif",
    color: "#fff",
    background: "#0c1b2a",
    borderRadius: 10,
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
};
