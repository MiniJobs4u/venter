import { db } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
// ...

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
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
        timeIn: serverTimestamp(), // ✅ klíčové pro řazení a zobrazení
      });
      setForm(initial);
      setOk(true);
      setTimeout(() => setOk(false), 2500);
    } catch (e) {
      console.error(e);
      setErr("Saving failed. Try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="reg-wrap">
      {/* ...hlavička atd... */}

      <form className="reg-card" onSubmit={handleSubmit}>
        {/* vstupy – VŠECHNY mají name= dle fieldů výše */}
        <input
          name="vehicleReg"
          value={form.vehicleReg}
          onChange={handleChange}
          placeholder="Vehicle registration"
          required
        />

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Driver's name"
          required
        />

        <input
          name="contact"
          value={form.contact}
          onChange={handleChange}
          placeholder="Contact number"
          required
        />

        <input
          name="company"
          value={form.company}
          onChange={handleChange}
          placeholder="Delivery to / Company name"
          required
        />

        <input
          name="deliveryTo"
          value={form.deliveryTo}
          onChange={handleChange}
          placeholder="Reason for visit"
        />

        <button className="btn" disabled={saving}>
          {saving ? "Saving…" : "Submit"}
        </button>

        {ok && <div className="note ok">Saved ✓</div>}
        {err && <div className="note err">{err}</div>}
      </form>

      {/* ✅ Admin přístup dole */}
      <div className="admin-entry">
        <a className="admin-link" href="?admin=true">Admin login</a>
      </div>
    </div>
  );
}
/* spodní link na admin login */
.admin-entry{
  margin-top: 28px;
  display: flex;
  justify-content: center;
  opacity: .85;
}
.admin-link{
  color: var(--accent);
  text-decoration: none;
  border: 1px solid var(--accent);
  padding: 10px 16px;
  border-radius: 10px;
  background: transparent;
}
.admin-link:hover{
  background: rgba(56,168,232,.12);
}
