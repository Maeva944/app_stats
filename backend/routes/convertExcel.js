const express = require("express");
const ExcelJS = require("exceljs");
const pool = require("../db/db");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();



function extractMatricule(value, rowNumber){
    if(!value) return;
    const match = value.toString().match(/\d+/);
    return match ? parseInt(match[0]) : null;
}



router.post("/upload", upload.single("file"), async (req, res) => {
    console.log("📩 Requête reçue !");
    console.log("✅ req.mois :", req.body);
    console.log("✅ req.file :", req.file ? req.file.originalname : "Aucun fichier reçu");
    try{
        if(!req.body.categorie  || !req.body.annee || !req.file ){
            return res.status(400).json({ error : "La catégorie, Le fichiers et l'année son requis."})
        }
        console.log("📤 Mois reçu :", req.body.mois);
        console.log("📤 Année reçue :", req.body.annee);
        console.log("📤 catégorie reçue :", req.body.categorie);

        
        const annee = parseInt(req.body.annee, 10);

        let mois = req.body.mois;
    
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(req.file.buffer);
        const worksheet = workbook.worksheets[0];

        console.log("Fichier excel chargé :", req.file);

        let SousCategorie = [];
        let matricules = new Set();
        let data = [];
        let categorie = "";
        
        if (workbook.worksheets[0]) {
            categorie = req.body.categorie;
        }
        console.log(categorie);
        //récupération des sous catégorie (la première ligne du fichier excel)
        worksheet.getRow(1).eachCell((cell, colNumber) => {
            if(colNumber > 1){
                SousCategorie.push(cell.value);
            }
        })

        //récupération des matricules
        worksheet.eachRow((row, rowNumber)=>{
            if(rowNumber === 1) return;
            let matricule = extractMatricule(row.getCell(1).value);
            if (matricule) {
                matricules.add(matricule);
            }
        })
        //vérifier si les techniciens existe
        const matriculesArray = [...matricules];
        const resultTechniciens = await pool.query(
            "SELECT id, matricule FROM technicien WHERE matricule = ANY($1::int[])",
            [matriculesArray]
        );

        // Création d'un mapping { matricule: technicien_id }
        const technicienMap = new Map(resultTechniciens.rows.map(t => [t.matricule, t.id]));
       
        
       

        const missingMatricules = matriculesArray.filter(mat => !technicienMap.has(mat));
        if (missingMatricules.length > 0) {
            return res.status(400).json({
                error: "Certains techniciens n'existent pas, veuillez les ajouter.",
                missing: missingMatricules
            });
        }
        //Importer les stats dans la BDD 
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) return;
            let matricule = extractMatricule(row.getCell(1).value);
            if (!matricule) return;
            const technicienId = technicienMap.get(matricule);
            if (!technicienId) {
                console.warn(`❌ Matricule ${matricule} non trouvé dans la base.`);
                return;
            }

            let donnee = {};

            SousCategorie.forEach((SousCategorie, index) => {
                const valeur = row.getCell(index + 2).value;
                if (valeur !== null && valeur !== undefined) {
                    donnee[SousCategorie] = valeur.toString();
                }
            });

            data.push({
                technicien_id: technicienId,
                matricule,
                donnee: JSON.stringify(donnee),
                categorie,
                mois: parseInt(mois, 10),
                annee: annee
            });
        });

        console.log("📊 Données JSONB à insérer :", data);

        await Promise.all(
            data.map(async (item) => {
                if (!item.mois) {
                    // 🔹 Cas de l'importation annuelle → Écraser les anciennes données
                    await pool.query(
                        `INSERT INTO Statistiques (technicien_id, matricule, categorie, donnee, mois_id, annee) 
                        VALUES ($1, $2, $3, $4::jsonb, NULL, $5)
                        ON CONFLICT (technicien_id, categorie, annee)
                        DO UPDATE SET donnee = EXCLUDED.donnee`,
                        [
                            item.technicien_id,
                            item.matricule,
                            item.categorie,
                            item.donnee,
                            item.annee
                        ]
                    );
                } else {
                    await pool.query(
                        `INSERT INTO Statistiques (technicien_id, matricule, categorie, donnee, mois_id, annee) 
                         VALUES ($1, $2, $3, $4::jsonb, $5, $6)
                         ON CONFLICT (technicien_id, categorie, annee, mois_id) 
                         DO UPDATE SET donnee = EXCLUDED.donnee`,
                        [
                            item.technicien_id,
                            item.matricule,
                            item.categorie,
                            item.donnee,
                            parseInt(item.mois, 10),
                            item.annee
                        ]
                    );                    
                }
            })
        );

        console.log("💾 Nombre de lignes insérées :", data.length);
        res.json({ message: "Données JSONB insérées avec succès !" });
    } catch (error) {
        console.error("❌ Erreur lors du traitement du fichier :", error);
        res.status(500).json({ error: "Erreur serveur." });
    }
})

module.exports = router;

