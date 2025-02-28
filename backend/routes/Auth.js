const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db/db");
const router = express.Router();

router.post("/", async (req, res) => { 
  try {
    let { email, password } = req.body;

    // 🔹 Vérifier si le username et le mot de passe sont fournis
    if (!email || !password) {
      return res.status(400).json({ error: "Email et mot de passe requis." });
    }

    email = email.toLowerCase().trim();

    const isUserInputValid = (email) => {
      const pattern = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
      return pattern.test(email);
    };

    if (!isUserInputValid(email)) {
      return res.status(401).json({ error: "Format d'email invalide." });
    }

     
    const result = await pool.query(`
      SELECT u.id, u.email, u.password, u.must_change_password, u.technicien_matricule, r.nom AS role
      FROM Users u
      JOIN Roles r ON u.role_id = r.id
      WHERE u.email = $1
    `, [email]);

    if (result.rows.length === 0) {
      console.log("⛔ Utilisateur non trouvé :", email);
      return res.status(401).json({ error: "Email ou mot de passe incorect." });
    }

    const user = result.rows[0];


    // 🔹 Vérifier le mot de passe avec bcrypt.compare
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch && result.rows.length === 1) {
      console.log("⛔ Mot de passe incorrect pour :", email);
      return res.status(401).json({ error: "mot de passe incorrect." });
    }

    // 🔹 Vérifier si l'utilisateur doit changer son mot de passe
    if (user.must_change_password) {
      return res.json({ mustChangePassword: true });
    }

    // 🔹 Générer un token JWT pour la session
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




