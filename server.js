const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public")); // IMPORTANT for HTML

/* ================= DB CONNECTION ================= */
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Shanmukh_0063",
  database: "LOSTANDFOUND"
});

db.connect(err => {
  if (err) {
    console.log("DB ERROR:", err);
  } else {
    console.log("Connected to LOSTANDFOUND DB");
  }
});

/* ================= AUTH ================= */

// SIGNUP (FIXED)
app.post("/signup", (req, res) => {
  const { name, email, phone, password } = req.body;

  db.query(
    "INSERT INTO USERS(name,email,phone,password,role) VALUES(?,?,?,?, 'CITIZEN')",
    [name, email, phone, password],
    (err) => {
      if (err) return res.json({ error: err });
      res.json({ message: "Signup successful" });
    }
  );
});

// LOGIN
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM USERS WHERE email=? AND password=?",
    [email, password],
    (err, result) => {
      if (err) return res.json({ error: err });

      if (result.length > 0) {
        res.json(result[0]);
      } else {
        res.json({ error: "Invalid login" });
      }
    }
  );
});

/* ================= DROPDOWNS ================= */

app.get("/users", (req, res) => {
  db.query("SELECT user_id,name FROM USERS", (err, r) => res.json(r));
});

app.get("/items", (req, res) => {
  db.query("SELECT * FROM ITEMS", (err, r) => res.json(r));
});

app.get("/stations", (req, res) => {
  db.query("SELECT * FROM POLICE_STATIONS", (err, r) => res.json(r));
});

/* ================= LOST ================= */

app.post("/add-lost", (req, res) => {
  const { user_id, item_id, station_id, location } = req.body;

  db.query(
    "INSERT INTO LOST_REPORTS(user_id,item_id,station_id,location) VALUES(?,?,?,?)",
    [user_id, item_id, station_id, location],
    (err) => {
      if (err) return res.json({ error: err });
      res.json({ message: "Lost item added" });
    }
  );
});

/* ================= FOUND ================= */

app.post("/add-found", (req, res) => {
  const { user_id, item_id, station_id, location } = req.body;

  db.query(
    "INSERT INTO FOUND_REPORTS(user_id,item_id,station_id,location) VALUES(?,?,?,?)",
    [user_id, item_id, station_id, location],
    (err) => {
      if (err) return res.json({ error: err });
      res.json({ message: "Found item added" });
    }
  );
});

/* ================= LOST ITEMS ================= */

app.get("/lost-items", (req, res) => {
  db.query(
    `SELECT l.lost_id,u.name AS user_name,i.item_name,l.location
     FROM LOST_REPORTS l
     JOIN USERS u ON l.user_id=u.user_id
     JOIN ITEMS i ON l.item_id=i.item_id`,
    (err, r) => res.json(r)
  );
});

/* ================= FOUND ITEMS (WITH CONTACT) ================= */

app.get("/found-items", (req, res) => {
  db.query(
    `SELECT f.found_id,
            u.name AS user_name,
            u.email,
            u.phone,
            i.item_name,
            f.location
     FROM FOUND_REPORTS f
     JOIN USERS u ON f.user_id=u.user_id
     JOIN ITEMS i ON f.item_id=i.item_id`,
    (err, r) => res.json(r)
  );
});

/* ================= MATCHES ================= */

app.get("/matches", (req, res) => {
  db.query(
    `SELECT m.match_id,i.item_name,m.match_score
     FROM MATCHES m
     JOIN LOST_REPORTS l ON m.lost_id=l.lost_id
     JOIN ITEMS i ON l.item_id=i.item_id`,
    (err, r) => res.json(r)
  );
});

/* ================= NOTIFICATIONS ================= */

app.get("/notifications/:id", (req, res) => {
  db.query(
    "SELECT * FROM NOTIFICATIONS WHERE user_id=?",
    [req.params.id],
    (err, r) => res.json(r)
  );
});

/* ================= START SERVER ================= */

app.listen(3000, () => {
  console.log("Server running on port 3000");
});