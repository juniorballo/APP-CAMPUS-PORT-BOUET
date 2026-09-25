const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const app = express();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});
const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 * 1024 }
});

app.use(express.json({ limit: '2147483648' }));
app.use(express.urlencoded({ limit: '2147483648', extended: true }));

app.get('/uploads/:filename', (req, res, next) => {
    const filePath = path.join(__dirname, 'uploads', req.params.filename);

    if (!fs.existsSync(filePath)) {
        return next();
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    const ext = path.extname(filePath).toLowerCase();
    let contentType = 'video/mp4';
    if (ext === '.webm') contentType = 'video/webm';
    else if (ext === '.ogg') contentType = 'video/ogg';
    else if (ext === '.mov') contentType = 'video/quicktime';
    else if (ext === '.mkv') contentType = 'video/x-matroska';

    if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

        if (start >= fileSize) {
            res.status(416).setHeader('Content-Range', `bytes */${fileSize}`);
            return res.end();
        }

        const chunksize = (end - start) + 1;
        const file = fs.createReadStream(filePath, { start, end });
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': contentType,
        };

        res.writeHead(206, head);
        file.pipe(res);
        file.on('error', (err) => {
            console.error('Erreur lors du streaming partiel :', err);
        });
        return;
    } else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': contentType,
            'Accept-Ranges': 'bytes'
        };
        res.writeHead(200, head);
        const file = fs.createReadStream(filePath);
        file.pipe(res);
        file.on('error', (err) => {
            console.error('Erreur lors du streaming complet :', err);
        });
        return;
    }
});

app.use(express.static(path.join(__dirname)));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const DATA_FILE = path.join(__dirname, "data.json");

function readAppData() {
    if (fs.existsSync(DATA_FILE)) {
        try {
            const jsonData = fs.readFileSync(DATA_FILE, 'utf8');
            return JSON.parse(jsonData);
        } catch (e) {
            console.error("Erreur lecture data.json", e);
        }
    }
    return { students: [], attendance: [], courses: [], pdfs: [], media: [] };
}

app.get('/api/data', (req, res) => {
    try {
        const data = readAppData();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/data', (req, res) => {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(req.body, null, 2));
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de l'enregistrement" });
    }
});

app.post('/api/upload', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "Aucun fichier reçu." });
        }

        const { category, titre } = req.body;
        const fileUrl = `/uploads/${req.file.filename}`;
        const currentDate = new Date().toLocaleDateString('fr-FR');

        const fileData = {
            titre: titre || req.file.originalname,
            fileType: req.file.mimetype.startsWith('video') ? 'video' : (req.file.mimetype.startsWith('image') ? 'image' : 'pdf'),
            url: fileUrl,
            date: currentDate
        };

        const appData = readAppData();
        if (category === 'document') {
            if (!appData.pdfs) appData.pdfs = [];
            appData.pdfs.push(fileData);
        } else if (category === 'media') {
            if (!appData.media) appData.media = [];
            appData.media.push(fileData);
        }

        fs.writeFileSync(DATA_FILE, JSON.stringify(appData, null, 2));
        res.json(appData);
    } catch (err) {
        console.error("Erreur upload serveur :", err);
        res.status(500).json({ error: "Erreur interne lors de l'upload du fichier." });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});