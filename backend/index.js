const express = require("express");
const cors = require("cors");
const pool = require("./db/db");
const techniciensRoutes = require("./routes/technicienRoute"); 
const authRoute = require("./routes/Auth");
const passwordRoute = require ("./routes/motdepasse");
const statsRoute = require("./routes/statistique");
const converExcel = require("./routes/convertExcel");
const moisRoute = require("./routes/mois");
const ConvertComConso = require("./routes/importComConso");
const Commentaires = require("./routes/commentaires");



const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", techniciensRoutes);
app.use("/auth", authRoute); 
app.use("/password", passwordRoute);
app.use("/statistiques", statsRoute); 
app.use("/convert", converExcel);
app.use("/mois", moisRoute);
app.use("/converttwo", ConvertComConso)
app.use("/commentaires", Commentaires)


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
});




