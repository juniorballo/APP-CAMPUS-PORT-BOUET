const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route de statut de l API
app.get("/api/status", (req, res) => {
    res.json({ status: "online", message: "API Campus Port-Bouët active" });
});

// Servir les fichiers statiques du frontend
app.use(express.static(__dirname));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
