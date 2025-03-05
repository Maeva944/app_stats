const express = require("express");
const pool = require("../db/db");
const router = express.Router();

// 📌 Route pour récupérer les statistiques d'un technicien par matricule avec mois et année
router.get("/:matricule", async (req, res) => {
  try {
    const { matricule } = req.params;
    let { mois, annee } = req.query; // Mois et année passés en paramètre de requête

    // 🔹 Vérifier si le technicien existe
    const checkTechnicien = await pool.query("SELECT * FROM Technicien WHERE matricule = $1", [matricule]);
    if (checkTechnicien.rows.length === 0) {
      return res.status(404).json({ error: "Technicien non trouvé." });
    }

    // 🔹 Si aucun mois et année ne sont fournis, utiliser le mois et l'année actuels
    if (!mois || !annee) {
      const currentDate = new Date();
      mois = mois || (currentDate.getMonth() + 1); // Mois actuel (1 = janvier)
      annee = annee || currentDate.getFullYear(); // Année actuelle
    }

    // 🔹 Vérifier si le mois est valide (entre 1 et 12)
    mois = parseInt(mois, 10);
    annee = parseInt(annee, 10);
    if (isNaN(mois) || mois < 1 || mois > 12 || isNaN(annee)) {
      return res.status(400).json({ error: "Mois ou année invalide." });
    }

    // 🔹 Récupérer les statistiques associées au technicien pour le mois et l’année donnés
    const result = await pool.query(
      `SELECT categorie, sous_categorie, valeur 
       FROM Statistiques 
       WHERE matricule = $1 AND mois = $2 AND annee = $3`, 
      [matricule, mois, annee]
    );

    // 🔹 Organiser les données sous forme de catégories avec sous-catégories
    const stats = {};
    result.rows.forEach((row) => {
      if (!stats[row.categorie]) {
        stats[row.categorie] = [];
      }
      stats[row.categorie].push({ sous_categorie: row.sous_categorie, valeur: row.valeur });
    });

    res.json({ 
      technicien: checkTechnicien.rows[0], 
      statistiques: stats, 
      mois: mois, 
      annee: annee 
    });

  } catch (error) {
    console.error("❌ Erreur lors de la récupération des statistiques :", error);
    res.status(500).json({ error: "Erreur serveur." });
  }
});

module.exports = router;
