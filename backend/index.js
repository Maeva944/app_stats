const express = require("express");
const app = express();

app.get("/", (req, res) => {
    res.send("API backend fonctionne !");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur en écoute sur le port ${PORT}`));
