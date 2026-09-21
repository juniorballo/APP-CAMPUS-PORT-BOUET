require('dotenv').config(); // Charge les variables du fichier .env
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const sqlite3 = require('sqlite3').verbose();

// Vérification de sécurité pour éviter d'utiliser une clé par défaut en production
if (!process.env.JWT_SECRET) {
    console.error("ERREUR FATALE : La variable d'environnement JWT_SECRET n'est pas définie.");
    process.exit(1);
}

const JWT_SECRET = process.env.JWT_SECRET;
const PORT = process.env.PORT || 3000;

// ... le reste de votre code (initialisation de l'app, routes, etc.)