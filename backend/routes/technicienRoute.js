const express = require('express');
const Technicien = require('../model/Technicien');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const techniciens = await Technicien.getAllTechniciens();
        res.json(techniciens);
    } catch (error) {
        console.error("Erreur lors de la récupération des techniciens :", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

module.exports = router;
