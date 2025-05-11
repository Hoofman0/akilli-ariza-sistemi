// index.js

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt"); // veya bcryptjs
const jwt = require("jsonwebtoken");
const pool = require("./db");

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewareler (En üste yazılır)
app.use(cors());
app.use(express.json());

// Sabitler
const SECRET_KEY = "gizli_sifremiz"; // (Gerçek projede güçlü bir key kullanılır.)

// --- Kullanıcı Kayıt (REGISTER) ---
app.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, hashedPassword, role]
    );

    res.status(201).json({ message: "Kayıt başarılı!" });
  } catch (error) {
    console.error("🔴 HATA:", error.message);
    if (error.code === "23505") {
      res.status(400).json({ message: "Bu email zaten kayıtlı!" });
    } else {
      res.status(500).json({ message: "Sunucu hatası oluştu." });
    }
  }
});

// --- Kullanıcı Giriş (LOGIN) ---
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Email bulunamadı!" });
    }

    const user = result.rows[0];

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Şifre yanlış!" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });

    res.json({ message: "Giriş başarılı!", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Sunucu hatası oluştu." });
  }
});

// --- Kullanıcıları Listeleme ---
app.get("/users", async (req, res) => {
  try {
    const allUsers = await pool.query("SELECT * FROM users ORDER BY id ASC");
    res.json(allUsers.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// --- Yeni Kullanıcı Ekleme ---
app.post("/users", async (req, res) => {
  try {
    const { name, role, email, phone } = req.body;
    const result = await pool.query(
      "INSERT INTO users (name, role, email, phone) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, role, email, phone]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    if (error.code === "23505") {
      res.status(400).json({ message: "Bu email adresi zaten kayıtlı!" });
    } else {
      res.status(500).json({ message: "Sunucu hatası oluştu" });
    }
  }
});

// --- Makine CRUD ---
app.get("/machines", async (req, res) => {
  try {
    const allMachines = await pool.query("SELECT * FROM machines ORDER BY id ASC");
    res.json(allMachines.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

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

// --- Arıza CRUD ---
app.get("/faults", async (req, res) => {
  try {
    const allFaults = await pool.query("SELECT * FROM faults ORDER BY id ASC");
    res.json(allFaults.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

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

// Kullanıcı silme (DELETE)
app.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM users WHERE id = $1", [id]);
    res.json({ success: true, message: "Kullanıcı silindi." });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Makine Silme
app.delete("/machines/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM machines WHERE id = $1", [id]);
    res.json({ success: true, message: "Makine silindi." });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Arıza Silme
app.delete("/faults/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM faults WHERE id = $1", [id]);
    res.json({ success: true, message: "Arıza kaydı silindi." });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Arıza Çözme (PATCH /faults/:id)
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
    console.error("Arıza çözüm hatası:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Yeni sıcaklık verisi ekleme (ESP8266'dan veri alımı)
app.post("/temperatures", async (req, res) => {
  const { machine_id, temperature } = req.body;

  try {
    //sıcaklık verisi kaydetme 
    const result = await pool.query(
      "INSERT INTO machine_temperatures (machine_id, temperature) VALUES ($1, $2) RETURNING *",
      [machine_id, temperature]
    );

    //otomatik arıza talebi kodu
    if (temperature >= 25) {
      const kontrol = await pool.query(
        "SELECT * FROM faults WHERE machine_id = $1 AND status = 'arızalı'",
        [machine_id]
      );

      if (kontrol.rowCount === 0) {
        await pool.query(
          "INSERT INTO faults (machine_id, description, status) VALUES ($1, $2, $3)",
          [machine_id, "Sıcaklık 25°C'yi geçti! Otomatik arıza oluşturuldu.", "arızalı"]
        );
        console.log(`🔥 Makine ${machine_id} için otomatik arıza oluşturuldu!`);
      }
    }

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("Sıcaklık ekleme hatası:", error);
    res.status(500).json({ success: false, message: "Sunucu hatası oluştu." });
  }
});


// Her makinenin en son sıcaklık verisini getir
app.get("/temperatures/latest", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT mt.machine_id, mt.temperature
      FROM machine_temperatures mt
      INNER JOIN (
        SELECT machine_id, MAX(recorded_at) AS latest
        FROM machine_temperatures
        GROUP BY machine_id
      ) latest_temps
      ON mt.machine_id = latest_temps.machine_id AND mt.recorded_at = latest_temps.latest
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Sıcaklık çekme hatası:", error);
    res.status(500).json({ success: false, message: "Sunucu hatası oluştu." });
  }
});

// --- Sunucu Başlat ---
app.listen(PORT, () => {
  console.log(`🚀 Sunucu ${PORT} portunda çalışıyor...`);
});
