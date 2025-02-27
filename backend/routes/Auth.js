const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db/db");
const router = express.Router();


router.post("/", async (req, res) => { 
  try {
    const { username, password } = req.body;

    const result = await pool.query("SELECT * FROM Users WHERE username = $1", [username]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Utilisateur ou mot de passe incorrect." });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Utilisateur ou mot de passe incorrect." });
    }

    if (user.must_change_password) {
      return res.json({ mustChangePassword: true });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, technicien_matricule: user.technicien_matricule },
      "secret_key",
      { expiresIn: "1h" }
    );

    res.json({ token });

  } catch (error) {
    console.error("Erreur de connexion :", error);
    res.status(500).json({ error: "Erreur serveur." });
  }
});


module.exports = router;

