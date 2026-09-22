const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const DATA_FILE = path.join(__dirname, "data.json");
const initialData = {
    students: [],
    attendance: [],
    courses: ["Doctrine & Alliances", "Le Livre de Mormon", "Histoire de l Eglise", "Principes de l Evangile"]
};

// Sécurisation totale pour éviter tout plantage (Exit status 1) au démarrage
try {
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
    }
} catch (e) {
    console.log("Mode lecture seule ou erreur fichier :", e.message);
}

app.get("/api/data", (req, res) => {
    try {
        if (fs.existsSync(DATA_FILE)) {
            const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
            return res.json(data);
        }
    } catch (err) {}
    res.json(initialData);
});

app.post("/api/data", (req, res) => {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(req.body, null, 2));
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: "Erreur enregistrement" });
    }
});

app.use(express.static(__dirname));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
