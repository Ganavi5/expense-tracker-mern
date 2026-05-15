import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const center = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f5f5f5",
  };

  const card = {
    backgroundColor: "white",
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "400px",
  };

  const input = {
    width: "100%",
    padding: "0.75rem",
    margin: "0.5rem 0",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "1rem",
  };

  const btn = {
    width: "100%",
    padding: "0.75rem",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontSize: "1rem",
    cursor: "pointer",
    marginTop: "1rem",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", form);
      alert("Registered Successfully");
      navigate("/");
    } catch (err) {
      alert(err.response?.data || "Error");
    }
  };

  return (
    <div style={center}>
      <form onSubmit={handleSubmit} style={card}>
        <h2>Register</h2>
        <input placeholder="Name" style={input} onChange={(e) => setForm({...form, name: e.target.value})} />
        <input placeholder="Email" style={input} onChange={(e) => setForm({...form, email: e.target.value})} />
        <input type="password" placeholder="Password" style={input} onChange={(e) => setForm({...form, password: e.target.value})} />
        <button type="submit" style={btn}>Register</button>
      </form>
    </div>
  );
}

export default Register;