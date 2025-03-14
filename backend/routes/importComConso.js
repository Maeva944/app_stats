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

router.post("/upload-comconso", upload.single("file"), async (req, res) => {
    try{
        console.log("📩 Requête reçue !");
        console.log("📜 Contenu complet de req.body :", req.body);
        console.log("📅 Année reçue :", req.body.anneeTwo);
        console.log("📂 Catégorie reçue :", req.body.categorieTwo);
        console.log("✅ Fichier reçu :", req.file ? req.file.originalname : "Aucun fichier reçu");


        if(!req.body.anneeTwo || !req.body.categorieTwo || !req.file){
            return res.status(400).json({error: "la catégorie, l'année et le fichiers sont requis"});
        }

        const annee = parseInt(req.body.anneeTwo, 10);
        const categorieTwo = req.body.categorieTwo;
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(req.file.buffer);
        const worksheet = workbook.worksheets[0];


        let data = [];
        let matricules = new Set();

        worksheet.eachRow((row, rowNumber) => {
            if(rowNumber === 1)return;
            let matricule = extractMatricule(row.getCell(1).value);
            if (!matricule)return;
            matricules.add(matricule);
            console.log(`🔍 Ligne ${rowNumber} → Matricule extrait :`, matricule);

            if(categorieTwo === "Commentaires"){
                data.push({
                    matricule, 
                    produit: row.getCell(2).value,
                    avis: row.getCell(3).value || "",
                    suggestion: row.getCell(4).value || "",
                    nps_score:row.getCell(5).value,
                    job_date: row.getCell(6).value
                })
            }
        })
        const matriculesArray = [...matricules];
        const resultTechniciens = await pool.query(
            "SELECT id, matricule FROM technicien WHERE matricule = ANY($1::int[])",
            [matriculesArray]
        );

        const technicienMap = new Map(resultTechniciens.rows.map(t => [t.matricule, t.id]));
        const missingMatricules = matriculesArray.filter(mat => !technicienMap.has(mat));

        if (missingMatricules.length > 0) {
            return res.status(400).json({
                error: "Certains techniciens n'existent pas, veuillez les ajouter.",
                missing: missingMatricules
            });
        }
        console.log("📊 Matricules extraits du fichier :", matriculesArray);

        for(let item of data){
            const technicienId = technicienMap.get(item.matricule);
            const jobDate = item.job_date ? new Date(item.job_date) : null;

            if(categorieTwo === "Commentaires"){
                await pool.query(
                    `INSERT INTO commentaires_clients (technicien_id, produit, avis, suggestion, nps_score, job_date) 
                    VALUES ($1, $2, $3, $4, $5, $6)`,
                    [
                        technicienId,
                        item.produit,
                        item.avis, 
                        item.suggestion,
                        item.nps_score,
                        jobDate,
                    ]
                );
                console.log("✅ Donnée insérée :", item);
            }
        }
        res.json({ message: "Données importées avec succès !" });

    }catch(error){
        console.error("Erreur lors de l'importation :", error);
        res.status(500).json({error: "Erreur serveurs."});
    }
})

module.exports = router;
