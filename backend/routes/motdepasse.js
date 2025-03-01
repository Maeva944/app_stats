const express = require("express");
const bcrypt = require("bcrypt");
const pool = require("../db/db");
const router = express.Router();

router.post("/change", async (req, res) => {
    try {
      const { email, oldPassword, newPassword } = req.body;

      // 🔹 Vérifier que les champs sont bien remplis
      if (!email || !oldPassword || !newPassword) {
        return res.status(400).json({ error: "Tous les champs sont requis." });
      }

      console.log("🔍 Requête reçue :", { email, oldPassword, newPassword });

      // 🔹 Vérifier la complexité du nouveau mot de passe
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/;
      if (!passwordRegex.test(newPassword)) {
        return res.status(400).json({ error: "Le mot de passe doit contenir au moins 10 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial." });
      }
      
      const result = await pool.query("SELECT * FROM Users WHERE email = $1", [email]);

      const user = result.rows[0];
      // 🔹 Vérifier que le nouveau mot de passe est différent de l'ancien
        const isSamePassword = await bcrypt.compare(newPassword, user.password);
        if (isSamePassword) {
        return res.status(400).json({ error: "Le nouveau mot de passe doit être différent de l'ancien." });
        }


      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Email non trouvé." });
      }


      // 🔹 Vérifier que l'ancien mot de passe est correct
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: "Ancien mot de passe incorrect." });
      }

      // 🔹 Hacher le nouveau mot de passe
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // 🔹 Mettre à jour le mot de passe dans la base
      await pool.query(
        "UPDATE Users SET password = $1, must_change_password = FALSE WHERE email = $2",
        [hashedPassword, email]
      );

      res.json({ message: "✅ Mot de passe mis à jour avec succès !" });

    } catch (error) {
      console.error("Erreur lors du changement de mot de passe :", error);
      res.status(500).json({ error: "Erreur serveur." });
    }
});

module.exports = router;

