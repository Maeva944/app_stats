const express = require("express");
const pool = require("../db/db");
const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'upload/pdp/');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)); 
    }
  });
const upload = multer({ storage: storage });
const router = express.Router();
const bcrypt = require('bcrypt');

router.post("/ajout-employe", upload.single("photo"), async(req, res)=>{
    try{
        const nom = req.body.nom;
        const prenom = req.body.prenom;
        const matricule = req.body.matricule;
        const email = req.body.email.toLowerCase().trim();
        const role_id = parseInt(req.body.role_id);
        const metier_id = req.body.metier_id;
        const photo = req.file;
        const mdp = req.body.mdp;
        console.log("nom du fichier:", photo ? photo.filename : 'Pas de fichier');
        console.log("role_id:", role_id);
        console.log("Type de role_id:", typeof role_id);  


        const UserInputValid = (email) => {
        const pattern = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        return pattern.test(email);
        };

        if (!UserInputValid(email)) {
            return res.status(401).json({ error: "Format d'email invalide." });
        }
        const hashedPassword = await bcrypt.hash(mdp, 10);

        const userResult = await pool.query(`
            INSERT INTO users (email, password, role_id, metier_id, must_change_password) 
            VALUES ($1, $2, $3, $4, $5) RETURNING id`,
            [email, hashedPassword, role_id, metier_id, true]
        );
        const userId = userResult.rows[0].id;

        let technicienId = null;

        // Si l'utilisateur est un technicien, insérer dans la table techniciens
        if (role_id === 3) {  // Role technicien
            const technicienResult = await pool.query(`
                INSERT INTO technicien (nom, prenom, matricule, photo) 
                VALUES ($1, $2, $3, $4) RETURNING id`,
                [nom, prenom, matricule, photo ? `/upload/pdp/${photo.filename}` : null]
            );
            technicienId = technicienResult.rows[0].id;
        }

        await pool.query(`
            UPDATE users SET technicien_id = $1 WHERE id = $2`,
            [technicienId, userId]
        );

        res.status(200).json({ message: "Employé ajouté avec succès !" });
    }catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de l'ajout de l'employé." });
    }
});

module.exports = router;