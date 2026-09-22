const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const DATA_FILE = path.join(__dirname, "data.json");

// Initialiser le fichier de données s il n existe pas
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ students: [], attendance: [], courses: [] }, null, 2));
}

// API: Récupérer toutes les données
app.get("/api/data", (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: "Erreur de lecture des données" });
    }
});

// API: Sauvegarder/Mettre à jour les données
app.post("/api/data", (req, res) => {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(req.body, null, 2));
        res.json({ success: true, message: "Données sauvegardées avec succès" });
    } catch (err) {
        res.status(500).json({ error: "Erreur d enregistrement" });
    }
});

// Route de statut
app.get("/api/status", (req, res) => {
    res.json({ status: "online", message: "API Campus Port-Bouët active" });
});

// Servir les fichiers statiques du frontend
app.use(express.static(__dirname));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
