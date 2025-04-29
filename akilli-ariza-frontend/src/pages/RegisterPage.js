import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Lütfen tüm alanları doldurun!");
      return;
    }

    // Şu an için localStorage ile kayıt yapıyoruz
    localStorage.setItem("user", JSON.stringify(formData));
    toast.success("Kayıt başarılı! Şimdi giriş yapabilirsiniz. 🎯");
    navigate("/login");
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #6B73FF 0%, #000DFF 100%)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: "'Poppins', sans-serif"
    }}>
      <form onSubmit={handleRegister} style={{
        backgroundColor: "#ffffff",
        padding: "40px",
        borderRadius: "12px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "320px"
      }}>
        <h2 style={{ marginBottom: "20px" }}>Kayıt Ol</h2>

        <input
          type="text"
          name="name"
          placeholder="Ad Soyad"
          value={formData.name}
          onChange={handleChange}
          style={inputStyle}
        />
        <input
          type="email"
          name="email"
          placeholder="Email adresi"
          value={formData.email}
          onChange={handleChange}
          style={inputStyle}
        />
        <input
          type="password"
          name="password"
          placeholder="Şifre"
          value={formData.password}
          onChange={handleChange}
          style={inputStyle}
        />

        <button type="submit" style={buttonStyle}>Kayıt Ol</button>

        <p style={{ marginTop: "15px", color: "#555" }}>
          Zaten hesabınız var mı? <a href="/login" style={{ color: "#000DFF", fontWeight: "bold" }}>Giriş Yap</a>
        </p>
      </form>
    </div>
  );
}

const inputStyle = {
  padding: "12px",
  marginBottom: "15px",
  width: "100%",
  borderRadius: "8px",
  border: "1px solid #ccc"
};

const buttonStyle = {
  backgroundColor: "#000DFF",
  color: "#ffffff",
  border: "none",
  padding: "12px",
  borderRadius: "8px",
  width: "100%",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "16px",
  transition: "background-color 0.3s"
};

export default RegisterPage;
