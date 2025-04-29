import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function FaultsPage() {
  const [faults, setFaults] = useState([]);
  const [faultForm, setFaultForm] = useState({ machine_id: "", description: "", status: "arızalı" });
  const [machines, setMachines] = useState([]);
  const [users, setUsers] = useState([]);
  const [resolverMap, setResolverMap] = useState({});

  useEffect(() => {
    fetchFaults();
    fetchMachines();
    fetchUsers();
  }, []);

  const fetchFaults = async () => {
    try {
      const response = await axios.get("http://localhost:5000/faults");
      setFaults(response.data);
    } catch (error) {
      console.error("Arızalar çekilemedi:", error);
    }
  };

  const fetchMachines = async () => {
    try {
      const response = await axios.get("http://localhost:5000/machines");
      setMachines(response.data);
    } catch (error) {
      console.error("Makineler çekilemedi:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Kullanıcılar çekilemedi:", error);
    }
  };

  const handleFaultInputChange = (e) => {
    setFaultForm({ ...faultForm, [e.target.name]: e.target.value });
  };

  const handleFaultSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/faults", faultForm);
      setFaultForm({ machine_id: "", description: "", status: "arızalı" });
      fetchFaults();
      toast.success("Arıza başarıyla kaydedildi! 🎉");
    } catch (error) {
      console.error("Arıza kaydı yapılamadı:", error);
      toast.error("Arıza kaydı yapılamadı ❌");
    }
  };

  const deleteFault = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/faults/${id}`);
      fetchFaults();
      toast.error("Arıza kaydı silindi! 🗑️");
    } catch (error) {
      console.error("Arıza kaydı silinemedi:", error);
      toast.error("Arıza kaydı silinemedi ❌");
    }
  };

  const resolveFault = async (id) => {
    try {
      const resolverId = resolverMap[id];
      if (!resolverId) {
        toast.error("Lütfen çözecek kullanıcıyı seçin!");
        return;
      }

      await axios.patch(`http://localhost:5000/faults/${id}`, {
        status: "çözüldü",
        resolved_by: resolverId
      });
      fetchFaults();
      toast.success("Arıza başarıyla çözüldü! 🎯");
    } catch (error) {
      console.error("Arıza çözülemedi:", error);
      toast.error("Arıza çözümünde hata oluştu ❌");
    }
  };

  return (
    <div>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Arızalar</h2>

      <form onSubmit={handleFaultSubmit} style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center", marginBottom: "30px" }}>
        <select name="machine_id" value={faultForm.machine_id} onChange={handleFaultInputChange} required style={{
          padding: "10px",
          borderRadius: "5px",
          border: "1px solid #ccc"
        }}>
          <option value="">Makine Seçiniz</option>
          {machines.map((machine) => (
            <option key={machine.id} value={machine.id}>
              {machine.name} - {machine.type}
            </option>
          ))}
        </select>
        <input type="text" name="description" placeholder="Açıklama" value={faultForm.description} onChange={handleFaultInputChange} required />
        <button type="submit" style={{
          backgroundColor: "#4CAF50",
          color: "#ffffff",
          border: "none",
          padding: "10px 20px",
          borderRadius: "5px",
          cursor: "pointer"
        }}>Kaydet</button>
      </form>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
        {faults.map((fault) => (
          <div key={fault.id} style={{
            backgroundColor: "#ffffff",
            borderRadius: "10px",
            padding: "20px",
            width: "280px",
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
            <h3 style={{ margin: "10px 0" }}>Makine ID: {fault.machine_id}</h3>
            <p style={{ margin: "5px 0" }}>{fault.description}</p>
            <p style={{ margin: "5px 0" }}>Durum: {fault.status}</p>
            {fault.resolved_at && (
              <p style={{ margin: "5px 0", fontSize: "12px", color: "#888" }}>
                Çözüm Tarihi: {new Date(fault.resolved_at).toLocaleString()}
              </p>
            )}

            <select
              value={resolverMap[fault.id] || ""}
              onChange={(e) => setResolverMap({ ...resolverMap, [fault.id]: e.target.value })}
              style={{
                padding: "8px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                marginTop: "10px"
              }}
            >
              <option value="">Çözecek kullanıcı seç</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>

            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              {fault.status === "arızalı" && (
                <button onClick={() => resolveFault(fault.id)} style={{
                  backgroundColor: "#3498db",
                  color: "#ffffff",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "5px",
                  cursor: "pointer"
                }}>
                  Çöz
                </button>
              )}
              <button onClick={() => deleteFault(fault.id)} style={{
                backgroundColor: "#f44336",
                color: "#ffffff",
                border: "none",
                padding: "8px 16px",
                borderRadius: "5px",
                cursor: "pointer"
              }}>
                Sil
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FaultsPage;
