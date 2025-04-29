import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [userForm, setUserForm] = useState({ name: "", role: "", email: "", phone: "" });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Kullanıcılar çekilemedi:", error);
    }
  };

  const handleUserInputChange = (e) => {
    setUserForm({ ...userForm, [e.target.name]: e.target.value });
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/users", userForm);
      setUserForm({ name: "", role: "", email: "", phone: "" });
      fetchUsers();
      toast.success("Kullanıcı başarıyla eklendi! 🎉");
    } catch (error) {
      console.error("HATA DETAY:", error);
  
      if (error.response) {
        if (error.response.status === 500) {
          toast.error("Bu email zaten kayıtlı olabilir veya sunucu hatası oluştu! ❌");
        } else if (error.response.data && error.response.data.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Sunucu hatası oluştu! ❌");
        }
      } else {
        toast.error("Ağ hatası oluştu, sunucuya ulaşılamadı ❌");
      }
    }
  };
  
  
  

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/users/${id}`);
      fetchUsers();
      toast.error("Kullanıcı silindi! 🗑️");
    } catch (error) {
      console.error("Kullanıcı silinemedi:", error);
      toast.error("Kullanıcı silinemedi ❌");
    }
  };

  return (
    <div>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Kullanıcılar</h2>

      <form onSubmit={handleUserSubmit} style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center", marginBottom: "30px" }}>
        <input
          type="text"
          name="name"
          placeholder="Ad Soyad"
          value={userForm.name}
          onChange={handleUserInputChange}
          required
          style={inputStyle}
        />
        <input
          type="text"
          name="role"
          placeholder="Rol"
          value={userForm.role}
          onChange={handleUserInputChange}
          required
          style={inputStyle}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={userForm.email}
          onChange={handleUserInputChange}
          required
          style={inputStyle}
        />
        <input
          type="text"
          name="phone"
          placeholder="Telefon"
          value={userForm.phone}
          onChange={handleUserInputChange}
          style={inputStyle}
        />
        <button
          type="submit"
          style={{
            backgroundColor: "#4CAF50",
            color: "#ffffff",
            border: "none",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Kaydet
        </button>
      </form>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
        {users.map((user) => (
          <div
            key={user.id}
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "10px",
              padding: "20px",
              width: "250px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              transition: "transform 0.3s",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow = "0 6px 12px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
            }}
          >
            <h3 style={{ margin: "10px 0" }}>{user.name}</h3>
            <p style={{ margin: "5px 0" }}>{user.role}</p>
            <p style={{ margin: "5px 0" }}>{user.email}</p>
            <p style={{ margin: "5px 0" }}>{user.phone}</p>
            <button
              onClick={() => deleteUser(user.id)}
              style={{
                marginTop: "10px",
                backgroundColor: "#f44336",
                color: "#ffffff",
                border: "none",
                padding: "8px 16px",
                borderRadius: "5px",
                cursor: "pointer"
              }}
            >
              Sil
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const inputStyle = {
  padding: "10px",
  borderRadius: "5px",
  border: "1px solid #ccc",
};

export default UsersPage;
