const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connexion à la base de données SQLite (campus.db)
const db = new sqlite3.Database("./campus.db", (err) => {
    if (err) {
        console.error("Erreur de connexion à la base de données SQLite :", err.message);
    } else {
        console.log("Connecté à la base de données SQLite.");
    }
});

// Création de la table admin_config si elle n existe pas
db.run(`CREATE TABLE IF NOT EXISTS admin_config (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    password_hash TEXT NOT NULL
)`);

// Route de vérification/connexion admin ou API backend existantes
app.get("/api/status", (req, res) => {
    res.json({ status: "online", message: "API Campus Port-Bouët active" });
});

// Servir les fichiers statiques du frontend
app.use(express.static(__dirname));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
