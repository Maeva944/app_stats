const pool = require('../db/db');

class Technicien{
    static async getAllTechniciens(){
        try {
            const result = await pool.query('SELECT * FROM Technicien');
            return result.rows;
        } catch (error) {
            console.error("Erreur lors de la récupération des techniciens :", error);
            throw error;
        }
    }

    static async getBestVaps(){
        try {
            const result = await pool.query('SELECT * FROM Technicien ORDER BY VAPS DESC LIMIT 3');
            return result.rows;
        } catch (error) {
            console.error("Erreur lors de la récupération des meilleurs VAPS :", error);
            throw error;
        }
    }

    static async getBestNPS(){
        try{
            const result = await pool.query('SELECT * FROM Technicien ORDER BY NPS DESC LIMIT 3')
            return result.rows;
        }catch (error){
            console.error("Erreur lors de la récupération des meilleurs NPS :", error);
            throw error;
        }
    }
}

module.exports = Technicien