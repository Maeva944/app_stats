const express = require('express');
const Technicien = require('../model/Technicien');
const router = express.Router();
const pool = require("../db/db");

router.get('/', async (req, res) => {
    try {
        const techniciens = await Technicien.getAllTechniciens();
        res.json(techniciens);
    } catch (error) {
        console.error("Erreur lors de la récupération des techniciens :", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

router.get('/techniciendetail/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
        // 🔹 Récupérer les infos du technicien
        const technicienResult = await pool.query(
            "SELECT * FROM Technicien WHERE id = $1",
            [id]
        );

        if (technicienResult.rows.length === 0) {
            return res.status(404).json({ error: "Technicien non trouvé" });
        }


        const statsResult = await pool.query(
            "SELECT * FROM Statistiques WHERE matricule = (SELECT matricule FROM Technicien WHERE id = $1)",
            [id]
        );

        res.json({
            technicien: technicienResult.rows[0],
            statistiques: statsResult.rows
        });

    } catch (error) {
        console.error("Erreur lors de la récupération du technicien :", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

module.exports = router;
