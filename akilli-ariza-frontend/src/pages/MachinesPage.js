import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function MachinesPage() {
  const [machines, setMachines] = useState([]);
  const [machineForm, setMachineForm] = useState({ name: "", type: "", status: "", location: "" });

  useEffect(() => {
    fetchMachines();
  }, []);

  const fetchMachines = async () => {
    try {
      const response = await axios.get("http://localhost:5000/machines");
      setMachines(response.data);
    } catch (error) {
      console.error("Makineler çekilemedi:", error);
    }
  };

  const handleMachineInputChange = (e) => {
    setMachineForm({ ...machineForm, [e.target.name]: e.target.value });
  };

  const handleMachineSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/machines", machineForm);
      setMachineForm({ name: "", type: "", status: "", location: "" });
      fetchMachines();
      toast.success("Makine başarıyla eklendi! 🎉");
    } catch (error) {
      console.error("Makine eklenemedi:", error);
      toast.error("Makine eklenemedi ❌");
    }
  };

  const deleteMachine = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/machines/${id}`);
      fetchMachines();
      toast.error("Makine silindi! 🗑️");
    } catch (error) {
      console.error("Makine silinemedi:", error);
      toast.error("Makine silinemedi ❌");
    }
  };

  return (
    <div>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Makineler</h2>

      <form onSubmit={handleMachineSubmit} style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center", marginBottom: "30px" }}>
        <input type="text" name="name" placeholder="Makine Adı" value={machineForm.name} onChange={handleMachineInputChange} required />
        <input type="text" name="type" placeholder="Makine Tipi" value={machineForm.type} onChange={handleMachineInputChange} required />
        <input type="text" name="status" placeholder="Durum" value={machineForm.status} onChange={handleMachineInputChange} />
        <input type="text" name="location" placeholder="Lokasyon" value={machineForm.location} onChange={handleMachineInputChange} />
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
        {machines.map((machine) => (
          <div key={machine.id} style={{
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
            <h3 style={{ margin: "10px 0" }}>{machine.name}</h3>
            <p style={{ margin: "5px 0" }}>Tip: {machine.type}</p>
            <p style={{ margin: "5px 0" }}>Durum: {machine.status}</p>
            <p style={{ margin: "5px 0" }}>Lokasyon: {machine.location}</p>
            <button onClick={() => deleteMachine(machine.id)} style={{
              marginTop: "10px",
              backgroundColor: "#f44336",
              color: "#ffffff",
              border: "none",
              padding: "8px 16px",
              borderRadius: "5px",
              cursor: "pointer"
            }}>Sil</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MachinesPage;
