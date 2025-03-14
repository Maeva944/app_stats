const express = require("express");
const pool = require("../db/db");

const router = express.Router();

/**
 * 🔍 Récupération des commentaires pour un technicien donné
 */
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        let { mois_id, annee } = req.query;

        // Vérification des paramètres
        if (!annee) {
            return res.status(400).json({ error: "L'année est requise." });
        }

        let query = `
            SELECT produit, avis, suggestion, nps_score, job_date 
            FROM commentaires_clients 
            WHERE technicien_id = $1 AND EXTRACT(YEAR FROM job_date) = $2
        `;

        let params = [id, annee];

        // 🔹 Filtrer par mois si fourni
        if (mois_id) {
            query += " AND EXTRACT(MONTH FROM job_date) = $3";
            params.push(mois_id);
        }

        query += " ORDER BY job_date DESC"; // Trier du plus récent au plus ancien

        const result = await pool.query(query, params);

        console.log(`📢 Commentaires récupérés pour technicien ${id}, Année: ${annee}, Mois: ${mois_id || "Tous"}`);
        res.json(result.rows);
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des commentaires :", error);
        res.status(500).json({ error: "Erreur serveur lors de la récupération des commentaires." });
    }
});

module.exports = router;
