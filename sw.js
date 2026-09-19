const CACHE_NAME = 'campus-app-v3';

// Ressources locales indispensables au fonctionnement de l'application
const CORE_ASSETS = [
    './',
    './index_6.html',
    './app.js'
];

// Bibliothèques CDN externes nécessaires au style et aux fonctionnalités
const EXTERNAL_ASSETS = [
    'https://cdn.tailwindcss.com',
    'https://unpkg.com/lucide@latest',
    'https://cdn.jsdelivr.net/npm/chart.js',
    'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.28/jspdf.plugin.autotable.min.js'
];

// 1. Installation résiliente : Mise en cache sans bloquer en cas d'erreur CDN
self.addEventListener('install', (e) => {
    self.skipWaiting(); // Activation immédiate du nouveau Service Worker
    e.waitUntil(
        caches.open(CACHE_NAME).then(async (cache) => {
            // Mettre en cache les fichiers locaux
            await cache.addAll(CORE_ASSETS);

            // Mettre en cache les dépendances CDN externes indépendamment
            return Promise.allSettled(
                EXTERNAL_ASSETS.map(url =>
                    fetch(url, { mode: 'no-cors' })
                        .then(response => cache.put(url, response))
                        .catch(err => console.warn(`[PWA] Échec de mise en cache pour : ${url}`, err))
                )
            );
        })
    );
});

// 2. Activation et suppression des anciens caches (ex: v2)
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        }).then(() => self.clients.claim()) // Prise de contrôle immédiate des clients
    );
});

// 3. Interception des requêtes HTTP (Stratégie Network-First avec repli Cache)
self.addEventListener('fetch', (e) => {
    // Filtrer uniquement les requêtes de lecture (GET)
    if (e.request.method !== 'GET') return;

    // Ignorer les requêtes d'API vers Supabase
    if (e.request.url.includes('supabase.co')) return;

    e.respondWith(
        fetch(e.request)
            .then((networkResponse) => {
                // Mise à jour dynamique du cache si le réseau répond avec succès
                if (networkResponse && networkResponse.status === 200) {
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(e.request, responseClone));
                }
                return networkResponse;
            })
            .catch(() => {
                // Repli sur le cache en cas d'absence de réseau (Mode Hors-ligne)
                return caches.match(e.request).then((cachedResponse) => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    // Redirection de secours pour la navigation HTML
                    if (e.request.headers.get('accept')?.includes('text/html')) {
                        return caches.match('./index_6.html');
                    }
                });
            })
    );
});