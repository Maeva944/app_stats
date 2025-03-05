const express = require("express");
const pool = require("../db/db");
const router = express.Router();

// 📌 Route pour récupérer tous les mois
router.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM Mois ORDER BY id ASC");
        res.json(result.rows);
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des mois :", error);
        res.status(500).json({ error: "Erreur serveur." });
    }
});

module.exports = router;
