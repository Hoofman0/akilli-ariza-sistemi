import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function LoginPage() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (email.trim() === "") {
      toast.error("Lütfen bir email adresi girin! ❌");
      return;
    }

    // Şu an için email kontrolü yok, doğrudan giriş yaptırıyoruz
    toast.success("Başarıyla giriş yapıldı! 🎉");
    navigate("/"); // Dashboard sayfasına yönlendir
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#f2f4f8",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: "'Poppins', sans-serif"
    }}>
      <form onSubmit={handleLogin} style={{
        backgroundColor: "#ffffff",
        padding: "40px",
        borderRadius: "10px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "300px"
      }}>
        <h2 style={{ marginBottom: "20px" }}>Giriş Yap</h2>
        <input
          type="email"
          placeholder="Email adresi"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            width: "100%",
            marginBottom: "20px"
          }}
        />
        <button type="submit" style={{
          backgroundColor: "#4CAF50",
          color: "#ffffff",
          border: "none",
          padding: "10px 20px",
          borderRadius: "5px",
          cursor: "pointer",
          width: "100%"
        }}>
          Giriş Yap
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
