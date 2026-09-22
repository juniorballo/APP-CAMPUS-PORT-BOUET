const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const DATA_FILE = path.join(__dirname, "data.json");
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ students: [], attendance: [], courses: ["Doctrine & Alliances", "Le Livre de Mormon", "Histoire de l Eglise"] }, null, 2));
}

app.get("/api/data", (req, res) => {
    try {
        res.json(JSON.parse(fs.readFileSync(DATA_FILE, "utf8")));
    } catch (err) {
        res.status(500).json({ error: "Erreur de lecture" });
    }
});

app.post("/api/data", (req, res) => {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(req.body, null, 2));
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: "Erreur d enregistrement" });
    }
});

app.use(express.static(__dirname));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
