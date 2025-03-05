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
        if(!req.body.mois || !req.body.annee || !req.file ){
            return res.status(400).json({ error : "Le fichier, mois et année son requis."})
        }
        console.log("📤 Mois reçu :", req.body.mois);
        console.log("📤 Année reçue :", req.body.annee);

        const mois = req.body.mois;
        const annee = parseInt(req.body.annee, 10);
    
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(req.file.buffer);
        const worksheet = workbook.worksheets[0];

        console.log("Fichier excel chargé :", req.file);

        let SousCatégorie = [];
        let matricules = new Set();
        let data = [];
        let categorie = "";
        
        if (workbook.worksheets[0]) {
            categorie = "Qualité Technique";
        }
        console.log(categorie);
        //récupération des sous catégorie (la première ligne du fichier excel)
        worksheet.getRow(1).eachCell((cell, colNumber) => {
            if(colNumber > 1){
                SousCatégorie.push(cell.value);
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
       
        const result = await pool.query(
            "SELECT MATRICULE FROM technicien WHERE matricule = ANY($1::int[])", [matriculesArray]
        );
        
        const existMatricules = new Set(result.rows.map(row => row.matricule));
        const missingMatricules = matriculesArray.filter(mat => !existMatricules.has(mat));

        if(missingMatricules.length > 0){
            return res.status(400).json({
                error: "Certain technicien n'existent pas veuiller les ajouters",
                missing: missingMatricules
            });
        }

        //Importer les stats dans la BDD 
        worksheet.eachRow((row, rowNumber, matricule)=>{
            if(rowNumber === 1)return;
            if(!matricule)return;
            
            SousCatégorie.forEach((SousCatégorie, index)=>{
                const valeur = row.getCell(index + 2).value;

                if(valeur !== null && valeur !== undefined){
                    data.push({
                        matricule,
                        categorie: "Qualité Technique",
                        sous_categorie: SousCatégorie,
                        valeur: toString(valeur),
                        mois: mois,
                        annee: annee
                    })
                }
            })
            
        });

        for (let item of data){
            await pool.query(
                `INSERT INTO Statistiques (matricule, categorie, sous_categorie, valeur, mois, annee) VALUES ($1, $2, $3, $4, $5, $6)`,
                [item.matricule, item.categorie, item.sous_categorie, item.valeur, item.mois, item.annee]
            );
        }
        res.json({ message: "Données insérées avec succès !" });
    } catch (error) {
        console.error("❌ Erreur lors du traitement du fichier :", error);
        res.status(500).json({ error: "Erreur serveur." });
    }
})

module.exports = router;

