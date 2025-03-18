const express = require("express");
const pool = require("../db/db");
const router = express.Router();

// 📌 Route pour récupérer les statistiques d'un technicien par matricule avec mois et année
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let { mois_id, annee, aLAnnee, categorie_id  } = req.query; // Mois et année passés en paramètre de requête
    console.log("ID:", id, "Mois:", mois_id, "Année:", annee, "À l'année:", aLAnnee, "categorie:", categorie_id); 
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
    categorie_id = categorie_id ? parseInt(categorie_id, 10) : null;

    let query;
    let params;

    let result;

    if (aLAnnee === "true") {
      result = await pool.query(
        `SELECT 
          s.technicien_id,  
          s.categorie_id, 
          c.nom AS categorie_nom, 
          s.donnee, 
          s.mois_id, 
          s.annee
        FROM Statistiques s
        JOIN Categories c ON s.categorie_id = c.id
        WHERE s.technicien_id = $1
        AND s.annee = $2
        AND s.categorie_id = $3`, // 🛠️ Ajout du filtre par catégorie_id
        [id, annee, categorie_id] // 🛠️ Assurer qu'on passe bien les 3 paramètres
      );
    } else {
      result = await pool.query(
        `SELECT 
          s.technicien_id, 
          s.categorie_id, 
          s.donnee, 
          s.mois_id, 
          s.annee 
        FROM Statistiques s
        WHERE s.technicien_id = $1 
        AND s.mois_id = $2 
        AND s.annee = $3 
        AND s.categorie_id = $4`, 
        [id, mois_id, annee, categorie_id]
      );
    }
    
    
    console.log("🛠 Requête SQL générée :", query);
    console.log("📊 Paramètres SQL envoyés :", params);
    console.log("📊 Résultats SQL :", result.rows);

    let statistiquesTransformees = {};
    result.rows.forEach(stat => {
        const { categorie_id, donnee, mois_id, annee } = stat;
    
        if (!statistiquesTransformees[categorie_id]) { // ❌ categorie_id est undefined ici !
            statistiquesTransformees[categorie_id] = {
                mois: mois_id || null,
                annee: annee,
                data: []
            };
        }
    
        Object.entries(donnee).forEach(([sousCategorie, valeur]) => {
            statistiquesTransformees[categorie_id].data.push({
                sous_categorie: sousCategorie.trim(),
                valeur: parseFloat(valeur) * 100
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




