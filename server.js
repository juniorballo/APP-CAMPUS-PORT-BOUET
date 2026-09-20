const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3000;

// Clé secrète pour signer les JWT (à configurer via variable d'environnement en production)
const JWT_SECRET = process.env.JWT_SECRET || 'votre_cle_secrete_ultra_securisee_et_complexe';

// 1. Sécurité HTTP et middlewares globaux
app.use(helmet()); // Sécurise les en-têtes HTTP
app.use(cors());
app.use(express.json());

// Limiteur de requêtes pour protéger la route de connexion contre les attaques par force brute
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limite chaque IP à 5 tentatives de connexion par fenêtre
    message: { success: false, message: 'Trop de tentatives de connexion. Veuillez réessayer plus tard.' }
});

// 2. Initialisation de la base de données SQLite (crée un fichier 'campus.db')
const db = new sqlite3.Database('./campus.db', (err) => {
    if (err) {
        console.error('Erreur d\'ouverture de la base de données', err.message);
    } else {
        console.log('Connecté à la base de données SQLite.');

        // Création de la table de configuration admin si elle n'existe pas
        db.run(`CREATE TABLE IF NOT EXISTS admin_config (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            password_hash TEXT NOT NULL
        )`, async (err) => {
            if (!err) {
                // Vérifier s'il y a un mot de passe initial, sinon créer un par défaut ('admin')
                db.get(`SELECT * FROM admin_config WHERE id = 1`, async (err, row) => {
                    if (!row) {
                        const saltRounds = 10;
                        const defaultHash = await bcrypt.hash('admin', saltRounds);
                        db.run(`INSERT INTO admin_config (id, password_hash) VALUES (1, ?)`, [defaultHash]);
                        console.log('Mot de passe admin initialisé par défaut ("admin") et haché.');
                    }
                });
            }
        });
    }
});

// 3. Middleware de vérification du Token JWT (pour protéger les routes sensibles)
function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format attendu : "Bearer <token>"

    if (!token) {
        return res.status(401).json({ success: false, message: 'Accès refusé. Jeton d\'authentification manquant.' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ success: false, message: 'Jeton invalide ou expiré.' });
        }
        req.user = user;
        next();
    });
}

// 4. Route de connexion sécurisée
app.post('/api/auth/login', loginLimiter, (req, res) => {
    const { password } = req.body;

    if (!password) {
        return res.status(400).json({ success: false, message: 'Mot de passe requis.' });
    }

    db.get(`SELECT password_hash FROM admin_config WHERE id = 1`, async (err, row) => {
        if (err || !row) {
            return res.status(500).json({ success: false, message: 'Erreur serveur.' });
        }

        // Comparaison sécurisée du mot de passe saisi avec le hash stocké
        const match = await bcrypt.compare(password, row.password_hash);
        if (match) {
            // Génération d'un jeton JWT valide pendant 2 heures
            const token = jwt.sign({ id: 1, role: 'admin' }, JWT_SECRET, { expiresIn: '2h' });
            res.json({ success: true, token });
        } else {
            res.status(401).json({ success: false, message: 'Mot de passe incorrect.' });
        }
    });
});

// 5. Route de changement de mot de passe sécurisée (protégée par JWT)
app.post('/api/auth/change-password', verifyToken, (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ success: false, message: 'Ancien et nouveau mot de passe requis.' });
    }

    db.get(`SELECT password_hash FROM admin_config WHERE id = 1`, async (err, row) => {
        if (err || !row) {
            return res.status(500).json({ success: false, message: 'Erreur serveur.' });
        }

        // Vérification de l'ancien mot de passe
        const match = await bcrypt.compare(currentPassword, row.password_hash);
        if (match) {
            const saltRounds = 10;
            const newHash = await bcrypt.hash(newPassword, saltRounds);

            // Mise à jour dans la base de données SQLite
            db.run(`UPDATE admin_config SET password_hash = ? WHERE id = 1`, [newHash], (updateErr) => {
                if (updateErr) {
                    res.status(500).json({ success: false, message: 'Erreur lors de la mise à jour.' });
                } else {
                    res.json({ success: true, message: 'Mot de passe modifié avec succès.' });
                }
            });
        } else {
            res.status(400).json({ success: false, message: 'Ancien mot de passe incorrect.' });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Serveur sécurisé démarré sur http://localhost:${PORT}`);
});