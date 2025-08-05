import React, { useState } from "react";
import { db } from "../firebase"; // uprav podle své cesty k firebase.js
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
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
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
      <h2>Westgate Oxford - Service Yard B</h2>
      <p>Out of hours access: Please call Control Room 01865 263699</p>
      {submitted ? (
        <p style={{ color: "green" }}>Thank you. Registration submitted.</p>
      ) : (
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            name="vehicle"
            placeholder="Vehicle registration"
            value={form.vehicle}
            onChange={handleChange}
            required
          />
          <input
            name="name"
            placeholder="Driver's name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            name="contact"
            placeholder="Contact number"
            value={form.contact}
            onChange={handleChange}
            required
          />
          <input
            name="company"
            placeholder="Company name"
            value={form.company}
            onChange={handleChange}
            required
          />
          <input
            name="reason"
            placeholder="Reason for visit"
            value={form.reason}
            onChange={handleChange}
            required
          />
          <button type="submit">Submit</button>
        </form>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "400px",
    margin: "2rem auto",
    padding: "2rem",
    background: "#001628",
    color: "white",
    borderRadius: "8px",
    fontFamily: "Arial, sans-serif",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
};
