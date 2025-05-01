import React, { useEffect, useState } from "react";
import axios from "axios";

function DashboardPage() {
  const [userCount, setUserCount] = useState(0);
  const [machineCount, setMachineCount] = useState(0);
  const [faultCount, setFaultCount] = useState(0);
  const [resolvedFaultCount, setResolvedFaultCount] = useState(0);
  const [openFaultCount, setOpenFaultCount] = useState(0);

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      const users = await axios.get("http://localhost:5000/users");
      const machines = await axios.get("http://localhost:5000/machines");
      const faults = await axios.get("http://localhost:5000/faults");
  
      setUserCount(users.data.length);
      setMachineCount(machines.data.length);
      setFaultCount(faults.data.length);
  
      const resolved = faults.data.filter(fault => fault.status === "resolved").length;
      const open = faults.data.filter(fault => fault.status === "arızalı").length;
  
      setResolvedFaultCount(resolved);
      setOpenFaultCount(open);
    } catch (error) {
      console.error("Dashboard verileri çekilemedi:", error);
    }
  };  

  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", marginTop: "40px", gap: "20px" }}>
      <Card title="Toplam Kullanıcı" value={userCount} color="#4CAF50" />
      <Card title="Toplam Makine" value={machineCount} color="#3498db" />
      <Card title="Toplam Arıza" value={faultCount} color="#e67e22" />
      <Card title="Çözülmüş Arıza" value={resolvedFaultCount} color="#2ecc71" />
      <Card title="Açık Arıza" value={openFaultCount} color="#e74c3c" />
    </div>
  );
}

function Card({ title, value, color }) {
  return (
    <div style={{
      backgroundColor: "#ffffff",
      padding: "30px",
      borderRadius: "10px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      textAlign: "center",
      width: "250px",
      transition: "transform 0.3s",
    }}>
      <h3>{title}</h3>
      <p style={{ fontSize: "36px", color: color, marginTop: "10px" }}>{value}</p>
    </div>
  );
}

export default DashboardPage;
