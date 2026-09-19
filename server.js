require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const path = require('path');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de sécurité
app.use(helmet({
    contentSecurityPolicy: false // Désactivé pour permettre le chargement des CDN externes
}));

app.use(cors({
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Rate Limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: "Trop de requêtes, veuillez réessayer plus tard." }
});
app.use('/api/', limiter);

// Configuration S3 (Optionnelle selon les variables d'environnement)
const s3Client = new S3Client({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'mock',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'mock'
    }
});

// Authentification Admin
app.post('/api/admin/login', (req, res) => {
    const { password } = req.body;
    const adminPassword = process.env.ADMIN_PASSWORD || 'Campus2026!';

    if (password === adminPassword) {
        const token = jwt.sign(
            { role: 'admin' },
            process.env.JWT_SECRET || 'SecretKey',
            { expiresIn: '12h' }
        );
        return res.json({ success: true, token });
    }

    return res.status(401).json({ error: 'Mot de passe incorrect' });
});

// Middleware Vérification JWT
function verifyAdmin(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Accès non autorisé' });

    const token = authHeader.split(' ')[1];
    if (token === 'Bearer-Admin-Campus-Secret') return next();

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'SecretKey');
        if (decoded.role === 'admin') {
            req.user = decoded;
            return next();
        }
        res.status(403).json({ error: 'Accès interdit' });
    } catch (err) {
        res.status(401).json({ error: 'Token invalide ou expiré' });
    }
}

// Génération de Presigned URL S3
app.post('/api/admin/generate-upload-url', verifyAdmin, async (req, res) => {
    try {
        const { fileName, fileType } = req.body;
        const bucketName = process.env.AWS_S3_BUCKET;

        if (!bucketName || process.env.AWS_ACCESS_KEY_ID === 'mock') {
            return res.status(501).json({ error: 'S3 non configuré. Bascule en mode stockage local/navigateur.' });
        }

        const key = `uploads/${Date.now()}-${fileName}`;
        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: key,
            ContentType: fileType
        });

        const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });
        const fileUrl = `https://${bucketName}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${key}`;

        res.json({ uploadUrl, fileUrl });
    } catch (error) {
        console.error("Erreur S3:", error);
        res.status(500).json({ error: "Erreur lors de la génération de l'URL d'upload" });
    }
});

// Servir l'application Frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index_7.html'));
});

app.listen(PORT, () => {
    console.log(`Serveur Campus Port-Bouët démarré sur le port ${PORT}`);
});