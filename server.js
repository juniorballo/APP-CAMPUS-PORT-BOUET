const cookieParser = require('cookie-parser');
﻿const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.static('.'));

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { success: false, message: 'Trop de tentatives, réessayez plus tard.' }
});

const db = new sqlite3.Database('./campus.db', (err) => {
    if (err) console.error('Erreur DB:', err.message);
    else console.log('Connecté à la base de données SQLite.');
});

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS admin_config (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        password_hash TEXT NOT NULL
    )`, async (err) => {
        if (!err) {
            db.get(`SELECT * FROM admin_config WHERE id = 1`, async (err, row) => {
                if (!row) {
                    const defaultHash = await bcrypt.hash('admin', 10);
                    db.run(`INSERT INTO admin_config (id, password_hash) VALUES (1, ?)`, [defaultHash]);
                }
            });
        }
    });
});

app.post('/api/auth/login', loginLimiter, (req, res) => {
    const { password } = req.body;
    if (!password) {
        return res.status(400).json({ success: false, message: 'Mot de passe requis.' });
    }
    db.get(`SELECT password_hash FROM admin_config WHERE id = 1`, async (err, row) => {
        if (err || !row) {
            return res.status(500).json({ success: false, message: 'Erreur serveur.' });
        }
        bcrypt.compare(password, row.password_hash).then((match) => {
            if (match) {
                const token = jwt.sign({ id: 1, role: 'admin' }, JWT_SECRET, { expiresIn: '2h' });
                res.json({ success: true, token });
            } else {
                res.status(401).json({ success: false, message: 'Mot de passe incorrect.' });
            }
        });
    });
});

app.listen(PORT, () => {
    console.log(`Serveur sécurisé démarré sur http://localhost:${PORT}`);
});
// --- Middleware de vérification du JWT ---
function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: 'Accès refusé. Jeton manquant.' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ success: false, message: 'Jeton invalide ou expiré.' });
        }
        req.user = user;
        next();
    });
}

// --- Route protégée de changement de mot de passe ---
app.post('/api/auth/change-password', verifyToken, async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
        return res.status(400).json({ success: false, message: 'Tous les champs sont requis.' });
    }

    db.get('SELECT password_hash FROM admin_config WHERE id = 1', async (err, row) => {
        if (err || !row) {
            return res.status(500).json({ success: false, message: 'Erreur serveur.' });
        }

        const match = await bcrypt.compare(currentPassword, row.password_hash);
        if (!match) {
            return res.status(401).json({ success: false, message: 'Mot de passe actuel incorrect.' });
        }

        const newHash = await bcrypt.hash(newPassword, 10);
        db.run('UPDATE admin_config SET password_hash = ? WHERE id = 1', [newHash], (updateErr) => {
            if (updateErr) {
                return res.status(500).json({ success: false, message: 'Erreur lors de la mise à jour.' });
            }
            res.json({ success: true, message: 'Mot de passe modifié avec succès.' });
        });
    });
});
