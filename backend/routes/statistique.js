const express = require("express");
const pool = require("../db/db");
const router = express.Router();

// 📌 Route pour récupérer les statistiques d'un technicien par matricule avec mois et année
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let { mois_id, annee } = req.query; // Mois et année passés en paramètre de requête
    console.log("Query Params:", req.query); // Debugging
    console.log("Mois:", mois_id, "Année:", annee); 
    // 🔹 Vérifier si le technicien existe
    const checkTechnicien = await pool.query("SELECT * FROM Technicien WHERE id = $1", [id]);
    if (checkTechnicien.rows.length === 0) {
      return res.status(404).json({ error: "Technicien non trouvé." });
    }

    // 🔹 Si aucun mois et année ne sont fournis, utiliser le mois et l'année actuels
    if (!mois_id || !annee) {
      const currentDate = new Date();
      mois_id = mois_id || (currentDate.getMonth() + 1); // Mois actuel (1 = janvier)
      annee = annee || currentDate.getFullYear(); // Année actuelle
    }

    // 🔹 Vérifier si le mois est valide (entre 1 et 12)
    mois_id = parseInt(mois_id, 10);
    annee = parseInt(annee, 10);
    if (isNaN(mois_id) || mois_id < 1 || mois_id > 12 || isNaN(annee)) {
      return res.status(400).json({ error: "Mois ou année invalide." });
    }

    let result;
    if (mois_id === null) {
      result = await pool.query(
        `SELECT categorie, donnee 
         FROM Statistiques 
         WHERE technicien_id = $1 and mois_id is null and annee = $2`, 
        [id, annee]
      );
    } else {
      result = await pool.query(
        `SELECT categorie, donnee, mois_id, annee 
         FROM Statistiques 
         WHERE technicien_id = $1 AND mois_id = $2 AND annee = $3`, 
        [id, mois_id, annee]
      );
    }
    console.log("📊 Résultats SQL :", result.rows);

      let statistiquesTransformees = {};

      result.rows.forEach(stat => {
        const {categorie, donnee, mois_id, annee } = stat;

        if (!statistiquesTransformees[categorie]) {
          statistiquesTransformees[categorie] = {
            mois: mois_id,
            annee: annee,
            data : []
          };
        }
        console.log(`📂 Catégorie : ${categorie} (Mois: ${mois_id}, Année: ${annee})`);
        Object.entries(donnee).forEach(([sousCategorie, valeur]) => {
          statistiquesTransformees[categorie].data.push({
            sous_categorie: sousCategorie.trim(),
            valeur: parseFloat(valeur) * 100 // Conversion en pourcentage
          });
        });
      });
      console.log("📤 Envoi de la réponse...");
      res.json(statistiquesTransformees);
      console.log("✅ Réponse envoyée !");

  } catch (error) {
    console.error("❌ Erreur lors de la récupération des statistiques :", error);
    res.status(500).json({ error: "Erreur serveur." });
  }
});

module.exports = router;


