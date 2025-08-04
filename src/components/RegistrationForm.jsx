import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    regNumber: "",
    driverName: "",
    contact: "",
    company: "",
    reason: "",
    deliveryTo: ""
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "registrations"), {
        ...formData,
        timeIn: serverTimestamp(),
        timeOut: null
      });
      alert("Registration submitted!");
      setFormData({
        regNumber: "",
        driverName: "",
        contact: "",
        company: "",
        reason: "",
        deliveryTo: ""
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "400px", margin: "0 auto" }}>
      <h2>Register Entry</h2>
      <input name="regNumber" placeholder="Vehicle registration" value={formData.regNumber} onChange={handleChange} required />
      <input name="driverName" placeholder="Driver’s name" value={formData.driverName} onChange={handleChange} required />
      <input name="contact" placeholder="Contact number" value={formData.contact} onChange={handleChange} required />
      <input name="company" placeholder="Company name" value={formData.company} onChange={handleChange} required />
      <input name="reason" placeholder="Reason for visit" value={formData.reason} onChange={handleChange} required />
      <input name="deliveryTo" placeholder="Delivery to" value={formData.deliveryTo} onChange={handleChange} required />
      <button type="submit">Submit</button>
    </form>
  );
};

export default RegistrationForm;
