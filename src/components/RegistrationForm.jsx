// src/components/RegistrationForm.jsx
import React, { useState } from "react";
import "./RegistrationForm.css";

export default function RegistrationForm() {
  const [registration, setRegistration] = useState("");
  const [driverName, setDriverName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [deliveryTo, setDeliveryTo] = useState("");
  const [reason, setReason] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // TODO: Implement saving to Firebase or other backend
    console.log({
      registration,
      driverName,
      contactNumber,
      deliveryTo,
      reason,
    });

    // Reset form after submission
    setRegistration("");
    setDriverName("");
    setContactNumber("");
    setDeliveryTo("");
    setReason("");
  };

  return (
    <div className="registration-form">
      <h2>Westgate Oxford - Service Yard B</h2>
      <p>
        Out of hours access: Please call Control Room<br />
        01865 263699
      </p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Vehicle registration"
          value={registration}
          onChange={(e) => setRegistration(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Driver’s name"
          value={driverName}
          onChange={(e) => setDriverName(e.target.value)}
          required
        />
        <input
          type="tel"
          placeholder="Contact number"
          value={contactNumber}
          onChange={(e) => setContactNumber(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Delivery to"
          value={deliveryTo}
          onChange={(e) => setDeliveryTo(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Reason for visit"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
        />
        <button type="submit">Submit</button>
      </form>

      <div className="footer">
        Powered by <img src="/mitie-logo.png" alt="Mitie logo" />
      </div>
    </div>
  );
}
