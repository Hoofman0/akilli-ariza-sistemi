// index.js
const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Test endpoint – DB bağlantısını test eder
app.get("/test", async (req, res) => {
    try {
      const result = await pool.query("SELECT NOW()");
      res.json({ success: true, time: result.rows[0] });
    } catch (err) {
      console.error("🔴 HATA:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  });
  
// Tüm kullanıcıları getir
app.get("/users", async (req, res) => {
  try {
    const allUsers = await pool.query("SELECT * FROM users ORDER BY id ASC");
    res.json(allUsers.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Yeni kullanıcı ekle
app.post('/users', async (req, res) => {
  try {
    const { name, role, email, phone } = req.body;
    const result = await pool.query(
      'INSERT INTO users (name, role, email, phone) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, role, email, phone]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Veritabanı Hatası:", error);

    if (error.code === '23505') {
      // Duplicate Email Hatası
      res.status(400).json({ message: "Bu email adresi zaten kayıtlı! ❌" });
    } else {
      // Diğer Hatalar
      res.status(500).json({ message: "Sunucu hatası oluştu ❌" });
    }
  }
});



//kullanıcı ekleme başarılı/hatalı
const handleUserSubmit = async (e) => {
  e.preventDefault();
  try {
    await axios.post("http://localhost:5000/users", userForm);
    setUserForm({ name: "", role: "", email: "", phone: "" });
    fetchUsers();
    toast.success("Kullanıcı başarıyla eklendi!");
  } catch (error) {
    console.error("Kullanıcı eklenemedi:", error);
    toast.error("Kullanıcı eklenemedi!");
  }
};


//makineleri listeleme
app.get("/machines", async (req, res) => {
  try {
    const allMachines = await pool.query("SELECT * FROM machines ORDER BY id ASC");
    res.json(allMachines.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

//yeni makine ekleme
app.post("/machines", async (req, res) => {
  try {
    const { name, type, status, location } = req.body;
    const newMachine = await pool.query(
      "INSERT INTO machines (name, type, status, location) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, type, status, location]
    );
    res.json(newMachine.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

//Makine Ekleme Başarılı / Hatalı
const handleMachineSubmit = async (e) => {
  e.preventDefault();
  try {
    await axios.post("http://localhost:5000/machines", machineForm);
    setMachineForm({ name: "", type: "", status: "", location: "" });
    fetchMachines();
    toast.success("Makine başarıyla eklendi!");
  } catch (error) {
    console.error("Makine eklenemedi:", error);
    toast.error("Makine eklenemedi!");
  }
};


//tüm arızaları listeleme
app.get("/faults", async (req, res) => {
  try {
    const allFaults = await pool.query("SELECT * FROM faults ORDER BY id ASC");
    res.json(allFaults.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

//yeni arıza kaydı ekleme
app.post("/faults", async (req, res) => {
  try {
    const { machine_id, description, status, resolved_by } = req.body;
    const newFault = await pool.query(
      "INSERT INTO faults (machine_id, description, status, resolved_by) VALUES ($1, $2, $3, $4) RETURNING *",
      [machine_id, description, status, resolved_by]
    );
    res.json(newFault.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.patch("/faults/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status, resolved_by } = req.body;
    const resolved_at = new Date();

    const updatedFault = await pool.query(
      "UPDATE faults SET status = $1, resolved_by = $2, resolved_at = $3 WHERE id = $4 RETURNING *",
      [status, resolved_by, resolved_at, id]
    );

    res.json(updatedFault.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});



//Arıza Ekleme Başarılı / Hatalı
const handleFaultSubmit = async (e) => {
  e.preventDefault();
  try {
    await axios.post("http://localhost:5000/faults", faultForm);
    setFaultForm({ machine_id: "", description: "", status: "open" });
    fetchFaults();
    toast.success("Arıza başarıyla kaydedildi!");
  } catch (error) {
    console.error("Arıza eklenemedi:", error);
    toast.error("Arıza kaydı yapılamadı!");
  }
};

//Arıza Çözme Başarılı / Hatalı
const resolveFault = async (id) => {
  try {
    await axios.patch(`http://localhost:5000/faults/${id}`, {
      status: "resolved",
      resolved_by: null
    });
    fetchFaults();
    toast.success("Arıza başarıyla çözüldü! 🎯");
  } catch (error) {
    console.error("Arıza çözülemedi:", error);
    toast.error("Arıza çözümünde hata oluştu ❌");
  }
};




// Belirli bir kullanıcıyı ID'sine göre siler
app.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteUser = await pool.query("DELETE FROM users WHERE id = $1", [id]);
    res.json({ success: true, message: "Kullanıcı silindi." });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Belirli bir makineyi ID'sine göre siler
app.delete("/machines/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteMachine = await pool.query("DELETE FROM machines WHERE id = $1", [id]);
    res.json({ success: true, message: "Makine silindi." });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Belirli bir arıza kaydını ID'sine göre siler
app.delete("/faults/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteFault = await pool.query("DELETE FROM faults WHERE id = $1", [id]);
    res.json({ success: true, message: "Arıza kaydı silindi." });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Belirli bir kullanıcının bilgilerini ID'sine göre günceller
app.put("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, email, phone } = req.body;
    const updateUser = await pool.query(
      "UPDATE users SET name = $1, role = $2, email = $3, phone = $4 WHERE id = $5 RETURNING *",
      [name, role, email, phone, id]
    );
    res.json(updateUser.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Belirli bir makinenin bilgilerini ID'sine göre günceller
app.put("/machines/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, status, location } = req.body;
    const updateMachine = await pool.query(
      "UPDATE machines SET name = $1, type = $2, status = $3, location = $4 WHERE id = $5 RETURNING *",
      [name, type, status, location, id]
    );
    res.json(updateMachine.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Belirli bir arıza kaydını ID'sine göre günceller
app.put("/faults/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { description, status, resolved_by } = req.body;
    const updateFault = await pool.query(
      "UPDATE faults SET description = $1, status = $2, resolved_by = $3 WHERE id = $4 RETURNING *",
      [description, status, resolved_by, id]
    );
    res.json(updateFault.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});


app.listen(PORT, () => {
  console.log(`🚀 Sunucu ${PORT} portunda çalışıyor...`);
});
