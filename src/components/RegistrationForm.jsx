import React, { useState } from "react";
import "./RegistrationForm.css";
import { db } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

export default function RegistrationForm() {
  const [regNumber, setRegNumber] = useState("");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [company, setCompany] = useState("");
  const [deliveryTo, setDeliveryTo] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!regNumber || !name || !contact || !company || !deliveryTo) {
      alert("Please fill out all fields.");
      return;
    }

    setSubmitting(true);

    try {
      await addDoc(collection(db, "registrations"), {
        regNumber,
        name,
        contact,
        company,
        deliveryTo,
        timeIn: Timestamp.now(),
      });

      setSubmitted(true);

      // Reset form
      setRegNumber("");
      setName("");
      setContact("");
      setCompany("");
      setDeliveryTo("");

      setTimeout(() => {
        setSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error("Error submitting registration:", error);
      alert("There was an error. Please try again.");
    }

    setSubmitting(false);
  };

  return (
    <div className="registration-form">
      <h2>Westgate Oxford - Service Yard B</h2>
      <p>Out of hours access: Please call Control Room 01865 263699</p>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Vehicle Reg. Number"
          value={regNumber}
          onChange={(e) => setRegNumber(e.target.value)}
        />
        <input
          type="text"
          placeholder="Driver's Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Contact Number"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
        />
        <input
          type="text"
          placeholder="Company Name"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
        <input
          type="text"
          placeholder="Delivery To"
          value={deliveryTo}
          onChange={(e) => setDeliveryTo(e.target.value)}
        />

        <button type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </form>

      {submitted && (
        <p style={{ textAlign: "center", color: "#87cefa", marginTop: "1rem" }}>
          ✅ Registration submitted successfully.
        </p>
      )}
    </div>
  );
}
