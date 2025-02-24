const express = require("express");
const cors = require("cors");
const pool = require("./db/db");
const techniciensRoutes = require("./routes/technicienRoute"); 

const app = express();
app.use(cors());
app.use(express.json());
app.use("/", techniciensRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
});


