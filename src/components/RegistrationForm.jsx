import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import "./RegistrationForm.css"; // stylizuj podle potřeby

export default function RegistrationForm() {
  const [formData, setFormData] = useState({
    regNumber: "",
    name: "",
    contact: "",
    company: "",
    deliveryTo: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "registrations"), {
        ...formData,
        timeIn: Timestamp.now(),
        timeOut: "", // nebo null – vyplníš později
      });

      setSubmitted(true);
      setFormData({
        regNumber: "",
        name: "",
        contact: "",
        company: "",
        deliveryTo: "",
      });
    } catch (err) {
      console.error("Error saving registration: ", err);
    }
  };

  if (submitted) {
    return (
      <div className="confirmation">
        <h2>Thank you!</h2>
        <p>Registration submitted successfully.</p>
      </div>
    );
  }

  return (
    <div className="form-wrapper">
      <h2>Westgate Oxford - Service Yard B</h2>
      <p>Out of hours access: Please call Control Room 01865 263699</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="regNumber"
          placeholder="Registration number"
          value={formData.regNumber}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="name"
          placeholder="Driver's name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="contact"
          placeholder="Contact number"
          value={formData.contact}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="company"
          placeholder="Company"
          value={formData.company}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="deliveryTo"
          placeholder="Delivery to"
          value={formData.deliveryTo}
          onChange={handleChange}
          required
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
