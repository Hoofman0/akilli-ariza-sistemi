import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={navStyle}>
      <div style={containerStyle}>
        <Link to="/" style={logoStyle}>Akıllı Talep Yönetimi</Link>
        <div style={menuStyle}>
          <CustomLink to="/">Dashboard</CustomLink>
          <CustomLink to="/users">Kullanıcılar</CustomLink>
          <CustomLink to="/machines">Makineler</CustomLink>
          <CustomLink to="/faults">Arızalar</CustomLink>
        </div>
      </div>
    </nav>
  );
}

function CustomLink({ to, children }) {
  return (
    <Link to={to} style={linkStyle}>
      {children}
    </Link>
  );
}

// Stiller
const navStyle = {
  backgroundColor: "#2c3e50",
  padding: "10px 0",
  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
};

const containerStyle = {
  width: "90%",
  margin: "0 auto",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const logoStyle = {
  color: "#ffffff",
  fontSize: "20px",
  fontWeight: "bold",
  textDecoration: "none",
};

const menuStyle = {
  display: "flex",
  gap: "25px",
};

const linkStyle = {
  color: "#ecf0f1",
  textDecoration: "none",
  fontSize: "16px",
  padding: "8px 12px",
  borderRadius: "5px",
  transition: "background 0.3s",
};

CustomLink.defaultProps = {
  style: linkStyle
};

export default Navbar;
