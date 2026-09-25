let appData = { students: [], attendance: [], courses: [], pdfs: [], media: [] };
let isAdmin = localStorage.getItem("campus_is_admin") === "true";
let parishChartInstance = null;
let coursesChartInstance = null;

// Variable globale pour stocker la promesse de la modale
let modalResolveCallback = null;

function showCustomModal({ title, message, isPrompt = false, defaultValue = "" }) {
    return new Promise((resolve) => {
        modalResolveCallback = resolve;

        const modal = document.getElementById("customModal");
        const titleEl = document.getElementById("modalTitle");
        const messageEl = document.getElementById("modalMessage");
        const inputContainer = document.getElementById("modalInputContainer");
        const inputField = document.getElementById("modalInputField");

        titleEl.textContent = title || "Notification";
        messageEl.textContent = message || "";

        if (isPrompt) {
            inputContainer.classList.remove("hidden");
            inputField.value = defaultValue;
            inputField.type = title.toLowerCase().includes("mot de passe") ? "password" : "text";
            setTimeout(() => inputField.focus(), 100);
        } else {
            inputContainer.classList.add("hidden");
        }

        modal.classList.remove("hidden");
        if (typeof lucide !== "undefined") lucide.createIcons();
    });
}

function closeCustomModal(isConfirmed) {
    const modal = document.getElementById("customModal");
    const inputField = document.getElementById("modalInputField");

    modal.classList.add("hidden");

    if (modalResolveCallback) {
        if (isConfirmed) {
            const inputContainer = document.getElementById("modalInputContainer");
            if (!inputContainer.classList.contains("hidden")) {
                modalResolveCallback(inputField.value);
            } else {
                modalResolveCallback(true);
            }
        } else {
            modalResolveCallback(null);
        }
        modalResolveCallback = null;
    }
}

async function loadData() {
    try {
        const res = await fetch("/api/data");
        if (res.ok) {
            const data = await res.json();
            if (data) {
                appData = data;
            }
        }
    } catch (e) {
        console.error("Erreur fetch :", e);
    }
    updateUI();
    populateCourses();
    initSearch();
    initAttendanceSubmission();
    updateStatistics();
    renderProgressionTable();
    renderCharts();
    initStatisticsFilters();
    initScreenshotFeature();
    renderStudentsTable();
    initDefaultDate(); // Initialisé avant le rendu du tableau
    renderAttendanceTable();
    renderCourses();
    renderMedia();

    // Écouteur pour rafraîchir le tableau si l'utilisateur change la date du filtre dédié ou de l'input cours
    const filterDateInput = document.getElementById("filterDate");
    if (filterDateInput) {
        filterDateInput.addEventListener("change", () => renderAttendanceTable());
    }

    const dateInput = document.querySelector("input[type='date']") || document.getElementById("courseDate");
    if (dateInput) {
        dateInput.addEventListener("change", () => renderAttendanceTable());
    }

    setInterval(async () => {
        if (document.activeElement && ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
            return;
        }

        const playingVideo = document.querySelector('video:not([paused])');
        if (playingVideo) {
            return;
        }

        try {
            const res = await fetch("/api/data");
            if (res.ok) {
                const data = await res.json();
                if (data) {
                    appData = data;
                    renderCourses();
                    renderMedia();
                    renderStudentsTable();
                    renderAttendanceTable();
                    updateStatistics();
                    renderCharts();
                }
            }
        } catch (e) {
            console.error("Erreur de synchronisation auto :", e);
        }
    }, 10000);
}

function initDefaultDate() {
    const filterDateInput = document.getElementById("filterDate");
    if (filterDateInput) {
        const today = new Date().toISOString().split('T')[0];
        filterDateInput.max = today;
        if (!filterDateInput.value) {
            filterDateInput.value = today;
        }
    }

    // Initialiser aussi l'input admin s'il existe
    const adminDateInput = document.getElementById("adminAttendanceDate");
    if (adminDateInput) {
        const today = new Date().toISOString().split('T')[0];
        if (!adminDateInput.value) {
            adminDateInput.value = today;
        }
    }
}

function updateStatistics() {
    if (!appData.students) return;

    const totalStudents = appData.students.length;
    const totalFriends = appData.students.filter(s => s.paroisse && (s.paroisse.trim().toUpperCase() === "AMIS" || s.paroisse.trim().toUpperCase() === "AMI")).length;

    const uniqueAttendees = new Set(appData.attendance ? appData.attendance.map(a => a.nom) : []).size;
    const rate = totalStudents > 0 ? Math.round((uniqueAttendees / totalStudents) * 100) : 0;

    if (document.getElementById("kpiTotalStudents")) document.getElementById("kpiTotalStudents").textContent = totalStudents;
    if (document.getElementById("kpiTotalFriends")) document.getElementById("kpiTotalFriends").textContent = totalFriends;
    if (document.getElementById("kpiGlobalRate")) document.getElementById("kpiGlobalRate").textContent = rate + "%";

    if (appData.students.length > 0) {
        const parishCounts = {};
        appData.students.forEach(s => {
            if (s.paroisse) {
                const p = s.paroisse.trim().toUpperCase();
                parishCounts[p] = (parishCounts[p] || 0) + 1;
            }
        });
        let topParish = "-";
        let maxCount = 0;
        for (const [parish, count] of Object.entries(parishCounts)) {
            if (count > maxCount) {
                maxCount = count;
                topParish = parish;
            }
        }
        if (document.getElementById("kpiTopParish")) document.getElementById("kpiTopParish").textContent = topParish;
    }

    if (appData.attendance && appData.attendance.length > 0) {
        const ratings = appData.attendance.filter(a => a.avis).map(a => Number(a.avis));
        if (ratings.length > 0) {
            const avg = (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1);
            if (document.getElementById("kpiAvgRating")) document.getElementById("kpiAvgRating").textContent = avg + " / 5 ★";
        }
    }
}

function renderProgressionTable() {
    const tbody = document.getElementById("progressionTableBody");
    if (!tbody) return;
    tbody.innerHTML = "";

    if (!appData.students || appData.students.length === 0) return;

    const searchName = document.getElementById("statSearchName") ? document.getElementById("statSearchName").value.toLowerCase() : "";
    const parishFilter = document.getElementById("statParishFilter") ? document.getElementById("statParishFilter").value : "all";
    const courseFilter = document.getElementById("statCourse") ? document.getElementById("statCourse").value : "";

    // Nombre de séances fixé à 40
    const totalExpectedSessions = 40;

    appData.students.forEach(student => {
        if (searchName && !student.nom.toLowerCase().includes(searchName)) return;
        if (parishFilter !== "all" && student.paroisse && student.paroisse.trim().toUpperCase() !== parishFilter.toUpperCase()) return;

        const userAttendances = appData.attendance ? appData.attendance.filter(a => a.nom && a.nom.toLowerCase() === student.nom.toLowerCase()) : [];
        const effectiveCount = userAttendances.length;

        if (courseFilter && !userAttendances.some(a => a.cours === courseFilter)) return;

        const rate = totalExpectedSessions > 0 ? Math.min(Math.round((effectiveCount / totalExpectedSessions) * 100), 100) : 0;

        const tr = document.createElement("tr");
        tr.className = "border-b border-gray-100 text-xs transition-colors hover:bg-gray-50/80";
        tr.innerHTML = `
            <td class="p-3 font-semibold text-gray-800">${student.nom}</td>
            <td class="p-3 text-gray-600">${student.paroisse || 'N/A'}</td>
            <td class="p-3 text-center font-bold text-blue-700">${effectiveCount}</td>
            <td class="p-3 text-center text-gray-500">${totalExpectedSessions}</td>
            <td class="p-3 text-center font-bold text-green-600">${rate}%</td>
            <td class="p-3">
                <div class="w-full bg-gray-100 rounded-full h-2 shadow-inner overflow-hidden">
                    <div class="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500" style="width: ${rate}%"></div>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function renderStudentsTable() {
    const tbody = document.querySelector("#profilesTable") || document.querySelector("#sec-annuaire table tbody");
    if (!tbody) return;

    tbody.innerHTML = "";

    if (!appData.students || appData.students.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="p-6 text-center text-gray-400 italic">Aucun étudiant inscrit pour le moment.</td></tr>`;
        return;
    }

    appData.students.forEach((student, index) => {
        const userAttendances = appData.attendance ? appData.attendance.filter(a => a.nom && a.nom.toLowerCase() === student.nom.toLowerCase()) : [];
        const totalCourses = userAttendances.length;

        const tr = document.createElement("tr");
        tr.className = "border-b border-gray-100 text-xs hover:bg-blue-50/30 transition-colors";

        let actionsHtml = "-";
        if (isAdmin) {
            actionsHtml = `
                <div class="flex justify-center gap-2">
                    <button onclick="editStudent(${index})" class="text-blue-600 hover:text-white hover:bg-blue-600 font-bold px-2.5 py-1 bg-blue-50 rounded-md transition-all shadow-sm">Modifier</button>
                    <button onclick="deleteStudent(${index})" class="text-red-500 hover:text-white hover:bg-red-500 font-bold px-2.5 py-1 bg-red-50 rounded-md transition-all shadow-sm">Supprimer</button>
                </div>
            `;
        }

        tr.innerHTML = `
            <td class="p-3 text-gray-400 font-medium">${index + 1}</td>
            <td class="p-3 font-semibold text-gray-800">${student.nom}</td>
            <td class="p-3 text-gray-600">${student.telephone || 'N/A'}</td>
            <td class="p-3 text-gray-600">${student.paroisse || 'N/A'}</td>
            <td class="p-3 text-center font-bold text-blue-700">${totalCourses}</td>
            <td class="p-3 text-center">${actionsHtml}</td>
        `;
        tbody.appendChild(tr);
    });
}

function renderAttendanceTable() {
    const tbody = document.getElementById("attendanceTable") || document.querySelector("table tbody");
    if (!tbody) return;

    tbody.innerHTML = "";
    if (!appData.attendance || appData.attendance.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" class="p-6 text-center text-gray-400 italic">Aucun émargement enregistré.</td></tr>`;
        return;
    }

    const filterDateInput = document.getElementById("filterDate");
    const selectedDate = filterDateInput ? filterDateInput.value : "";

    const filteredEntries = selectedDate
        ? appData.attendance.filter(entry => entry.date === selectedDate)
        : appData.attendance;

    if (filteredEntries.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" class="p-6 text-center text-gray-400 italic">Aucun émargement pour cette date.</td></tr>`;
        const countEl = document.getElementById("totalDayRecords");
        if(countEl) countEl.textContent = "0";
        return;
    }

    filteredEntries.forEach((entry, index) => {
        const tr = document.createElement("tr");
        tr.className = "border-b border-gray-100 text-xs hover:bg-blue-50/30 transition-colors";

        let adminActionsHtml = "";
        if (isAdmin) {
            const realIndex = appData.attendance.indexOf(entry);
            adminActionsHtml = `
                <button onclick="editAttendance(${realIndex})" class="text-blue-600 hover:bg-blue-600 hover:text-white font-bold px-2 py-1 bg-blue-50 rounded transition-all shadow-sm mr-1">Modifier</button>
                <button onclick="giveRating(${realIndex})" class="text-yellow-600 hover:bg-yellow-500 hover:text-white font-bold px-2 py-1 bg-yellow-50 rounded transition-all shadow-sm mr-1">Avis</button>
                <button onclick="deleteAttendance(${realIndex})" class="text-red-500 hover:bg-red-500 hover:text-white font-bold px-2 py-1 bg-red-50 rounded transition-all shadow-sm">Supprimer</button>
            `;
        }

        tr.innerHTML = `
            <td class="p-3 text-gray-500 font-medium">${entry.date || 'N/A'} - ${entry.heure || 'N/A'}</td>
            <td class="p-3 text-gray-500 text-center font-medium">${entry.nOrdre || (index + 1)}</td>
            <td class="p-3 font-semibold text-gray-800">${entry.nom}</td>
            <td class="p-3 text-gray-600">${entry.telephone || 'N/A'}</td>
            <td class="p-3 text-gray-600">${entry.paroisse || 'N/A'}</td>
            <td class="p-3 text-gray-700">${entry.cours || 'N/A'}</td>
            <td class="p-3 text-center font-bold text-blue-700">${entry.participationsTotal || 1}</td>
            <td class="p-3 text-center">${entry.avis ? entry.avis + " / 5 ★" : (isAdmin ? "<span class='text-gray-400'>Aucun</span>" : "-")}</td>
            <td class="p-3 text-center admin-col ${isAdmin ? '' : 'hidden'}">${adminActionsHtml}</td>
        `;
        tbody.appendChild(tr);
    });

    const countEl = document.getElementById("totalDayRecords");
    if(countEl) countEl.textContent = filteredEntries.length;
}

async function deleteAttendance(index) {
    if (confirm("Voulez-vous vraiment supprimer cet émargement ?")) {
        appData.attendance.splice(index, 1);
        try {
            await fetch('/api/data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(appData)
            });
            renderAttendanceTable();
            updateStatistics();
            renderCharts();
        } catch (err) {
            console.error(err);
        }
    }
}

async function editAttendance(index) {
    const entry = appData.attendance[index];
    const newName = await showCustomModal({ title: "Modifier l'émargement", message: "Modifier le nom de l'étudiant :", isPrompt: true, defaultValue: entry.nom });
    if (newName === null) return;
    const newCourse = await showCustomModal({ title: "Modifier le cours", message: "Modifier le cours :", isPrompt: true, defaultValue: entry.cours });
    if (newCourse === null) return;

    entry.nom = newName.trim();
    entry.cours = newCourse.trim();

    try {
        const res = await fetch('/api/data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(appData)
        });
        if (res.ok) {
            await showCustomModal({ title: "Succès", message: "Modification enregistrée avec succès !", isPrompt: false });
            renderAttendanceTable();
            updateStatistics();
            renderCharts();
        }
    } catch (err) {
        console.error(err);
    }
}

async function giveRating(index) {
    const entry = appData.attendance[index];
    const ratingStr = await showCustomModal({ title: "Évaluation", message: "Donner un avis (note de 1 à 5) :", isPrompt: true, defaultValue: String(entry.avis || "5") });
    if (ratingStr === null) return;
    const rating = Number(ratingStr);

    if (isNaN(rating) || rating < 1 || rating > 5) {
        await showCustomModal({ title: "Erreur", message: "Veuillez entrer un nombre valide entre 1 et 5.", isPrompt: false });
        return;
    }

    entry.avis = rating;

    try {
        const res = await fetch('/api/data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(appData)
        });
        if (res.ok) {
            await showCustomModal({ title: "Succès", message: "Avis enregistré avec succès !", isPrompt: false });
            renderAttendanceTable();
            updateStatistics();
        }
    } catch (err) {
        console.error(err);
    }
}

async function deleteStudent(index) {
    if (confirm("Voulez-vous vraiment supprimer cet étudiant ?")) {
        appData.students.splice(index, 1);
        try {
            await fetch('/api/data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(appData)
            });
            renderStudentsTable();
            updateStatistics();
            renderCharts();
        } catch (err) {
            console.error(err);
        }
    }
}

async function editStudent(index) {
    const student = appData.students[index];
    const newName = await showCustomModal({ title: "Modifier l'étudiant", message: "Modifier le nom et prénoms :", isPrompt: true, defaultValue: student.nom });
    if (newName === null) return;
    const newPhone = await showCustomModal({ title: "Téléphone", message: "Modifier le numéro de téléphone :", isPrompt: true, defaultValue: student.telephone || "" });
    if (newPhone === null) return;
    const newParish = await showCustomModal({ title: "Paroisse", message: "Modifier la paroisse / statut :", isPrompt: true, defaultValue: student.paroisse || "" });
    if (newParish === null) return;

    student.nom = newName.trim();
    student.telephone = newPhone.trim();
    student.paroisse = newParish.trim().toUpperCase();

    try {
        const res = await fetch('/api/data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(appData)
        });

        if (res.ok) {
            await showCustomModal({ title: "Succès", message: "Étudiant modifié avec succès !", isPrompt: false });
            renderStudentsTable();
            updateStatistics();
            renderCharts();
        } else {
            await showCustomModal({ title: "Erreur", message: "Erreur lors de l'enregistrement sur le serveur.", isPrompt: false });
        }
    } catch (err) {
        console.error(err);
        await showCustomModal({ title: "Erreur", message: "Impossible de joindre le serveur.", isPrompt: false });
    }
}

function initStatisticsFilters() {
    const searchInput = document.getElementById("statSearchName");
    const parishSelect = document.getElementById("statParishFilter");
    const courseSelect = document.getElementById("statCourse");

    if (searchInput) searchInput.addEventListener("input", () => renderProgressionTable());
    if (parishSelect) parishSelect.addEventListener("change", () => renderProgressionTable());
    if (courseSelect) courseSelect.addEventListener("change", () => renderProgressionTable());
}

function initScreenshotFeature() {
    const captureBtn = document.querySelector("button[onclick*='exportStatsAsImage']");
    if (captureBtn && !captureBtn.dataset.initialized) {
        captureBtn.dataset.initialized = "true";
        captureBtn.addEventListener("click", () => {
            const targetElement = document.getElementById("statsCaptureArea") || document.querySelector("main");
            if (typeof html2canvas !== "undefined") {
                html2canvas(targetElement).then(canvas => {
                    const link = document.createElement('a');
                    link.download = 'statistiques-campus.png';
                    link.href = canvas.toDataURL('image/png');
                    link.click();
                }).catch(err => {
                    console.error("Erreur lors de la capture :", err);
                    showCustomModal({ title: "Erreur", message: "Erreur lors de la génération de l'image.", isPrompt: false });
                });
            } else {
                showCustomModal({ title: "Erreur", message: "La bibliothèque de capture (html2canvas) n'est pas chargée.", isPrompt: false });
            }
        });
    }
}

function renderCharts() {
    if (!appData.students) return;

    const parishCounts = {};
    appData.students.forEach(s => {
        let p = s.paroisse ? s.paroisse.trim().toUpperCase() : "INCONNU";
        parishCounts[p] = (parishCounts[p] || 0) + 1;
    });

    const parishLabels = Object.keys(parishCounts);
    const parishDataValues = Object.values(parishCounts);

    const ctxParish = document.getElementById("parishPieChart");
    if (ctxParish) {
        if (parishChartInstance) parishChartInstance.destroy();
        parishChartInstance = new Chart(ctxParish, {
            type: 'doughnut',
            data: {
                labels: parishLabels,
                datasets: [{
                    data: parishDataValues,
                    backgroundColor: ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#6366f1']
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    }

    const courseCounts = {};
    if (appData.attendance) {
        appData.attendance.forEach(a => {
            let c = a.cours ? a.cours : "Autre";
            courseCounts[c] = (courseCounts[c] || 0) + 1;
        });
    }

    const courseLabels = Object.keys(courseCounts);
    const courseDataValues = Object.values(courseCounts);

    const ctxCourses = document.getElementById("coursesBarChart");
    if (ctxCourses) {
        if (coursesChartInstance) coursesChartInstance.destroy();
        coursesChartInstance = new Chart(ctxCourses, {
            type: 'bar',
            data: {
                labels: courseLabels.length > 0 ? courseLabels : ["Aucun cours"],
                datasets: [{
                    label: 'Présences par cours',
                    data: courseDataValues.length > 0 ? courseDataValues : [0],
                    backgroundColor: '#3b82f6'
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    }
}

function populateCourses() {
    document.querySelectorAll("select").forEach(select => {
        if (select.id === "statParishFilter" || select.id === "newProfParish" || select.id === "editStudentParish" || select.id === "editAttParish") return;
        const val = select.value;
        select.innerHTML = `<option value="">-- Sélectionnez un cours --</option>`;
        if (appData.courses) {
            appData.courses.forEach(c => {
                const opt = document.createElement("option");
                opt.value = c;
                opt.textContent = c;
                select.appendChild(opt);
            });
        }
        select.value = val;
    });
}

function switchTab(tabId) {
    document.querySelectorAll("main > section").forEach(sec => sec.classList.add("hidden"));
    document.querySelectorAll("nav button").forEach(btn => btn.classList.remove("active-tab", "text-blue-600"));
    const targetSec = document.getElementById("sec-" + tabId);
    const targetBtn = document.getElementById("tab-" + tabId);
    if (targetSec) targetSec.classList.remove("hidden");
    if (targetBtn) targetBtn.classList.add("active-tab");
    if (typeof lucide !== "undefined") lucide.createIcons();

    if (tabId === 'stats') {
        updateStatistics();
        renderProgressionTable();
        renderCharts();
    } else if (tabId === 'profiles') {
        renderStudentsTable();
    } else if (tabId === 'presence') {
        renderAttendanceTable();
    } else if (tabId === 'cours') {
        renderCourses();
    } else if (tabId === 'media') {
        renderMedia();
    }
}

async function toggleAdminMode() {
    if (isAdmin) {
        localStorage.removeItem("campus_is_admin");
        isAdmin = false;
        await showCustomModal({ title: "Déconnexion", message: "Mode Étudiant activé.", isPrompt: false });
        location.reload();
    } else {
        const pwd = await showCustomModal({
            title: "Accès Administrateur",
            message: "Veuillez entrer le mot de passe administrateur :",
            isPrompt: true
        });

        if (pwd === null) return;

        if (pwd === "admin123" || pwd === "campus2026") {
            localStorage.setItem("campus_is_admin", "true");
            isAdmin = true;
            await showCustomModal({ title: "Succès", message: "Accès Administrateur autorisé !", isPrompt: false });
            location.reload();
        } else {
            await showCustomModal({ title: "Erreur", message: "Mot de passe incorrect !", isPrompt: false });
        }
    }
}

function updateUI() {
    document.querySelectorAll(".admin-col, .admin-only, [data-admin]").forEach(el => {
        if (isAdmin) {
            el.classList.remove("hidden");
            el.style.display = "";
        } else {
            el.classList.add("hidden");
        }
    });

    const btn = document.getElementById("adminToggle");
    if (btn) {
        btn.textContent = isAdmin ? "Mode Admin (Actif)" : "Mode Étudiant";
        if (isAdmin) {
            btn.style.backgroundColor = "#16a34a";
            btn.style.color = "white";
        }
    }
}

function initSearch() {
    const searchInput = document.getElementById("studentSearchInput");
    const resultsBox = document.getElementById("searchResults");
    if (!searchInput || !resultsBox) return;

    searchInput.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase().trim();
        resultsBox.innerHTML = "";

        if (query.length === 0) {
            resultsBox.classList.add("hidden");
            return;
        }

        const matches = appData.students.filter(s =>
            s.nom.toLowerCase().includes(query) || (s.paroisse && s.paroisse.toLowerCase().includes(query))
        ).slice(0, 10);

        if (matches.length === 0) {
            resultsBox.classList.add("hidden");
            return;
        }

        resultsBox.classList.remove("hidden");
        matches.forEach(student => {
            const item = document.createElement("div");
            item.className = "p-2.5 cursor-pointer text-xs hover:bg-gray-100 border-b border-gray-100";
            item.innerHTML = `<strong>${student.nom}</strong> <span class="text-gray-500 text-[11px]">(${student.paroisse || 'N/A'})</span>`;

            item.addEventListener("click", () => {
                searchInput.value = student.nom;
                const hiddenInput = document.getElementById("selectedStudentId");
                if(hiddenInput) hiddenInput.value = student.nom;
                resultsBox.classList.add("hidden");

                const preview = document.getElementById("studentDetailsPreview");
                if (preview) {
                    preview.classList.remove("hidden");
                    document.getElementById("prevPhone").textContent = student.telephone || 'N/A';
                    document.getElementById("prevParish").textContent = student.paroisse || 'N/A';
                    const userAttendances = appData.attendance ? appData.attendance.filter(a => a.nom && a.nom.toLowerCase() === student.nom.toLowerCase()) : [];
                    document.getElementById("prevCount").textContent = userAttendances.length;
                }
            });
            resultsBox.appendChild(item);
        });
    });
}

let currentRating = 5;
function setRating(val) {
    currentRating = val;
    const stars = document.querySelectorAll("#starRating i");
    stars.forEach((star, index) => {
        if (index < val) {
            star.classList.add("fill-current", "text-yellow-500");
            star.classList.remove("text-gray-300");
        } else {
            star.classList.remove("fill-current", "text-yellow-500");
            star.classList.add("text-gray-300");
        }
    });
}

function initAttendanceSubmission() {}

async function handleAttendance(event) {
    event.preventDefault();

    const now = new Date();
    const currentDayOfWeek = now.getDay();
    const currentHour = now.getHours() + now.getMinutes() / 60;

    if (!isAdmin) {
        const isWednesday = (currentDayOfWeek === 3);
        const isWithinTimeWindow = (currentHour >= 18.0 && currentHour <= 22.5);

        if (!isWednesday || !isWithinTimeWindow) {
            await showCustomModal({ title: "Restriction", message: "L'émargement est uniquement autorisé les mercredis entre 18h00 et 22h30.", isPrompt: false });
            return;
        }
    }

    const searchInput = document.getElementById("studentSearchInput");
    const courseSelect = document.getElementById("courseSelect");

    const studentName = searchInput ? searchInput.value.trim() : "";
    const course = courseSelect ? courseSelect.value : "";

    if (!studentName) {
        await showCustomModal({ title: "Champ requis", message: "Veuillez entrer ou sélectionner votre nom !", isPrompt: false });
        return;
    }
    if (!course) {
        await showCustomModal({ title: "Champ requis", message: "Veuillez sélectionner un cours !", isPrompt: false });
        return;
    }

    let targetDateStr = now.toISOString().split('T')[0];
    if (isAdmin) {
        const adminDateInput = document.getElementById("adminAttendanceDate");
        if (adminDateInput && adminDateInput.value) {
            targetDateStr = adminDateInput.value;
        }
    }

    if (!isAdmin) {
        const alreadySignedToday = appData.attendance.some(a =>
            a.nom && a.nom.toLowerCase() === studentName.toLowerCase() && a.date === targetDateStr
        );
        if (alreadySignedToday) {
            await showCustomModal({ title: "Attention", message: "Vous avez déjà émargé pour cette date !", isPrompt: false });
            return;
        }
    }

    let student = appData.students.find(s => s.nom.toLowerCase() === studentName.toLowerCase());
    if (!student) {
        student = { nom: studentName, telephone: "N/A", paroisse: "Non spécifié" };
        appData.students.push(student);
    }

    const timeStr = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    const userAttendance = appData.attendance.filter(a => a.nom && a.nom.toLowerCase() === student.nom.toLowerCase());
    const totalParticipations = userAttendance.length + 1;

    const newEntry = {
        date: targetDateStr,
        heure: timeStr,
        nOrdre: appData.attendance.length + 1,
        nom: student.nom,
        telephone: student.telephone || "N/A",
        paroisse: student.paroisse || "N/A",
        cours: course,
        participationsTotal: totalParticipations,
        avis: currentRating
    };

    appData.attendance.push(newEntry);

    try {
        const res = await fetch('/api/data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(appData)
        });

        if (res.ok) {
            await showCustomModal({ title: "Succès", message: "Présence émargée avec succès pour la date du " + targetDateStr + " !", isPrompt: false });
            if (searchInput) searchInput.value = "";
            if (courseSelect) courseSelect.value = "";
            const preview = document.getElementById("studentDetailsPreview");
            if(preview) preview.classList.add("hidden");

            updateStatistics();
            renderProgressionTable();
            renderCharts();
            renderStudentsTable();
            renderAttendanceTable();
        } else {
            await showCustomModal({ title: "Erreur", message: "Erreur lors de l'enregistrement.", isPrompt: false });
        }
    } catch (err) {
        console.error(err);
        await showCustomModal({ title: "Erreur", message: "Impossible de joindre le serveur.", isPrompt: false });
    }
}

function openProfileModal() { document.getElementById("profileModal").classList.remove("hidden"); }
function closeProfileModal() { document.getElementById("profileModal").classList.add("hidden"); }

async function saveProfile(event) {
    event.preventDefault();
    const name = document.getElementById("newProfName").value.trim();
    const phone = document.getElementById("newProfPhone").value.trim();
    const parish = document.getElementById("newProfParish").value;

    appData.students.push({ nom: name, telephone: phone, paroisse: parish });
    try {
        const res = await fetch('/api/data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(appData)
        });
        if (res.ok) {
            await showCustomModal({ title: "Succès", message: "Profil créé avec succès !", isPrompt: false });
            closeProfileModal();
            renderStudentsTable();
            updateStatistics();
            renderCharts();
        }
    } catch (e) {
        console.error(e);
    }
}

function openCourseModal() { document.getElementById("courseModal").classList.remove("hidden"); renderCourseManagerList(); }
function closeCourseModal() { document.getElementById("courseModal").classList.add("hidden"); }

function renderCourseManagerList() {
    const container = document.getElementById("courseManagerList");
    if (!container) return;
    container.innerHTML = "";
    if(!appData.courses) appData.courses = [];
    appData.courses.forEach((c, index) => {
        const div = document.createElement("div");
        div.className = "flex justify-between items-center p-2.5 bg-white shadow-sm rounded-lg text-xs border border-gray-100 hover:border-blue-200 transition-all";
        div.innerHTML = `<span class="font-medium text-gray-700">${c}</span> <button onclick="deleteCourse(${index})" class="text-red-500 hover:bg-red-500 hover:text-white font-bold px-2.5 py-1 bg-red-50 rounded transition-all">X</button>`;
        container.appendChild(div);
    });
}

async function addCourse(event) {
    event.preventDefault();
    const input = document.getElementById("newCourseTitleInput");
    if(!input.value) return;
    if(!appData.courses) appData.courses = [];
    appData.courses.push(input.value.trim());
    input.value = "";
    await saveAppData();
    renderCourseManagerList();
    populateCourses();
}

async function deleteCourse(index) {
    appData.courses.splice(index, 1);
    await saveAppData();
    renderCourseManagerList();
    populateCourses();
}

function openUploadModal(category) {
    document.getElementById("contentCategory").value = category;
    document.getElementById("contentTitle").value = "";
    document.getElementById("contentFileInput").value = "";
    const modal = document.getElementById("uploadModal");
    if (modal) modal.classList.remove("hidden");
}

function closeUploadModal() {
    const modal = document.getElementById("uploadModal");
    if (modal) modal.classList.add("hidden");
}

async function handleUploadContent(event) {
    event.preventDefault();
    const category = document.getElementById("contentCategory").value;
    const titleInput = document.getElementById("contentTitle");
    const fileInput = document.getElementById("contentFileInput");

    if (!fileInput.files[0]) {
        await showCustomModal({ title: "Fichier requis", message: "Veuillez sélectionner un fichier.", isPrompt: false });
        return;
    }

    const file = fileInput.files[0];
    const MAX_SIZE = 2 * 1024 * 1024 * 1024;

    if (file.size > MAX_SIZE) {
        await showCustomModal({ title: "Fichier trop volumineux", message: "La taille maximale autorisée est de 2 Go.", isPrompt: false });
        return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", category);
    formData.append("titre", titleInput.value.trim() || file.name);

    try {
        const res = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });

        if (res.ok) {
            const resultData = await res.json();
            if (resultData) {
                appData = resultData;
            } else {
                await loadData();
            }
            await showCustomModal({ title: "Succès", message: "Contenu publié avec succès !", isPrompt: false });
            closeUploadModal();
            renderCourses();
            renderMedia();
        } else {
            await showCustomModal({ title: "Erreur", message: "Erreur lors de l'envoi du fichier sur le serveur.", isPrompt: false });
        }
    } catch (err) {
        console.error("Erreur upload :", err);
        await showCustomModal({ title: "Erreur", message: "Impossible de joindre le serveur pour l'envoi du fichier.", isPrompt: false });
    }
}

function renderCourses() {
    const container = document.getElementById("coursesGrid");
    if (!container) return;
    container.innerHTML = "";

    if (!appData.pdfs || appData.pdfs.length === 0) {
        container.innerHTML = `<p class="text-gray-400 text-xs italic col-span-full p-6 text-center">Aucun support PDF disponible pour le moment.</p>`;
        return;
    }

    appData.pdfs.forEach((pdf, index) => {
        const fileUrl = pdf.url || pdf.dataUrl;
        const safeTitle = pdf.titre ? pdf.titre.replace(/'/g, "\\'") : 'Document';
        const card = document.createElement("div");
        card.className = "p-5 bg-white rounded-xl shadow-md border border-gray-100 flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-1";
        card.innerHTML = `
            <div>
                <div class="flex items-center gap-3 mb-3 text-blue-600">
                    <div class="p-2.5 bg-blue-50 rounded-lg"><i data-lucide="file-text" class="w-5 h-5 text-blue-600"></i></div>
                    <h4 class="font-bold text-gray-800 text-sm truncate">${pdf.titre}</h4>
                </div>
                <p class="text-gray-400 text-[11px] mb-4">Ajouté le ${pdf.date || 'Récemment'}</p>
            </div>
            <div class="flex flex-col gap-2 pt-3 border-t border-gray-100">
                <div class="flex gap-2 items-center">
                    <button onclick="openPdfModal('${fileUrl}', '${safeTitle}')" class="flex-grow bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition">
                        <i data-lucide="eye" class="w-4 h-4"></i> Consulter
                    </button>
                    <a href="${fileUrl}" download="${pdf.titre}" target="_blank" rel="noopener noreferrer" class="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3.5 py-2 rounded-lg font-semibold flex items-center gap-1.5 shadow-sm transition-all" title="Télécharger">
                        <i data-lucide="download" class="w-3.5 h-3.5"></i>
                    </a>
                </div>
                ${isAdmin ? `
                    <div class="flex gap-2">
                        <button onclick="editPdf(${index})" class="flex-1 text-blue-600 hover:bg-blue-600 hover:text-white text-xs font-bold py-1.5 bg-blue-50 rounded-lg transition-all">Modifier</button>
                        <button onclick="deletePdf(${index})" class="flex-1 text-red-500 hover:bg-red-500 hover:text-white text-xs font-bold py-1.5 bg-red-50 rounded-lg transition-all">Supprimer</button>
                    </div>
                ` : ''}
            </div>
        `;
        container.appendChild(card);
    });
    if (typeof lucide !== "undefined") lucide.createIcons();
}

function openPdfModal(fileUrl, title) {
    const modal = document.getElementById('pdfModal');
    const iframe = document.getElementById('pdfViewerFrame');
    const container = iframe ? iframe.parentElement : document.querySelector('#pdfModal .p-4') || document.getElementById('pdfModal');
    const titleEl = document.getElementById('pdfModalTitle');

    let safeUrl = fileUrl;
    if (safeUrl && !safeUrl.startsWith('http') && !safeUrl.startsWith('blob:') && !safeUrl.startsWith('data:') && !safeUrl.startsWith('/')) {
        safeUrl = '/' + safeUrl;
    }

    if (container) {
        container.innerHTML = `
            <div class="flex flex-col gap-3 w-full">
                <div class="flex justify-between items-center bg-blue-50 p-2.5 rounded-lg border border-blue-100 text-xs">
                    <span class="text-blue-800 font-medium truncate max-w-[50%]">📄 ${title}</span>
                    <div class="flex gap-2">
                        <a href="${safeUrl}" download="${title}.pdf" class="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md font-semibold flex items-center gap-1.5 transition shadow-sm">
                            <i data-lucide="download" class="w-3.5 h-3.5"></i> Télécharger
                        </a>
                        <a href="${safeUrl}" target="_blank" rel="noopener noreferrer" class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md font-semibold flex items-center gap-1.5 transition shadow-sm">
                            <i data-lucide="external-link" class="w-3.5 h-3.5"></i> Plein écran
                        </a>
                    </div>
                </div>
                <object id="pdfViewerFrame" data="${safeUrl}" type="application/pdf" class="w-full h-[65vh] rounded-lg border bg-gray-50">
                    <div class="flex flex-col items-center justify-center h-64 p-6 text-center bg-gray-50 rounded-lg border">
                        <p class="text-gray-600 mb-3 text-xs">Votre navigateur ne peut pas afficher ce PDF directement dans la page.</p>
                        <a href="${safeUrl}" target="_blank" rel="noopener noreferrer" class="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-blue-700 transition">
                            Cliquez ici pour l'ouvrir dans un nouvel onglet
                        </a>
                    </div>
                </object>
            </div>
        `;
    }

    if (titleEl) {
        titleEl.innerHTML = `<i data-lucide="file-text" class="w-5 h-5 text-yellow-400"></i> ${title}`;
    }

    if (modal) {
        modal.classList.remove('hidden');
    }
    if (typeof lucide !== "undefined") {
        lucide.createIcons();
    }
}

function closePdfModal() {
    const modal = document.getElementById('pdfModal');
    const container = document.getElementById('pdfViewerFrame')?.parentElement?.parentElement;

    if (container) {
        container.innerHTML = `<iframe id="pdfViewerFrame" class="w-full h-[70vh] rounded-lg border" src=""></iframe>`;
    }

    if (modal) {
        modal.classList.add('hidden');
    }
}

function renderMedia() {
    const container = document.getElementById("mediaGrid");
    if (!container) return;
    container.innerHTML = "";

    if (!appData.media || appData.media.length === 0) {
        container.innerHTML = `<p class="text-gray-400 text-xs italic col-span-full p-6 text-center">Aucun contenu multimédia pour le moment.</p>`;
        return;
    }

    appData.media.forEach((item, index) => {
        const card = document.createElement("div");
        card.className = "p-5 bg-white rounded-xl shadow-md border border-gray-100 flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-1";

        let mediaPreview = "";
        const fileSrc = item.url || item.dataUrl;

        if (item.fileType === 'video') {
            mediaPreview = `
                <div class="overflow-hidden rounded-lg shadow-sm mb-3">
                    <video controls preload="metadata" playsinline class="w-full h-44 object-cover bg-black">
                        <source src="${fileSrc}" type="video/mp4">
                        Votre navigateur ne supporte pas la lecture vidéo.
                    </video>
                </div>`;
        } else if (item.fileType === 'image') {
            mediaPreview = `<div class="overflow-hidden rounded-lg shadow-sm mb-3"><img src="${fileSrc}" alt="${item.titre}" class="w-full h-44 object-cover transition-transform duration-500 hover:scale-105" /></div>`;
        } else {
            mediaPreview = `<div class="w-full h-44 bg-gray-50 rounded-lg mb-3 flex items-center justify-center text-gray-400 border"><i data-lucide="file" class="w-10 h-10"></i></div>`;
        }

        card.innerHTML = `
            <div>
                ${mediaPreview}
                <h4 class="font-bold text-gray-800 text-sm mb-1">${item.titre}</h4>
                <p class="text-gray-400 text-[11px] mb-3">Ajouté le ${item.date || 'Récemment'}</p>
            </div>
            <div class="flex justify-between items-center pt-3 border-t border-gray-100">
                <a href="${fileSrc}" download="${item.titre}" target="_blank" rel="noopener noreferrer" class="text-xs text-blue-600 hover:underline font-semibold flex items-center gap-1">Télécharger</a>
                ${isAdmin ? `
                    <div class="flex gap-1.5">
                        <button onclick="editMedia(${index})" class="text-blue-600 hover:bg-blue-600 hover:text-white text-xs font-bold px-2.5 py-1.5 bg-blue-50 rounded-lg transition-all">Modifier</button>
                        <button onclick="deleteMedia(${index})" class="text-red-500 hover:bg-red-500 hover:text-white text-xs font-bold px-2.5 py-1.5 bg-red-50 rounded-lg transition-all">Supprimer</button>
                    </div>
                ` : ''}
            </div>
        `;
        container.appendChild(card);
    });
    if (typeof lucide !== "undefined") lucide.createIcons();
}

async function editPdf(index) {
    const pdf = appData.pdfs[index];
    const newTitle = await showCustomModal({ title: "Modifier le PDF", message: "Modifier le titre du support PDF :", isPrompt: true, defaultValue: pdf.titre });
    if (newTitle === null || !newTitle.trim()) return;

    pdf.titre = newTitle.trim();
    await saveAppData();
    renderCourses();
}

async function editMedia(index) {
    const item = appData.media[index];
    const newTitle = await showCustomModal({ title: "Modifier le média", message: "Modifier le titre du média :", isPrompt: true, defaultValue: item.titre });
    if (newTitle === null || !newTitle.trim()) return;

    item.titre = newTitle.trim();
    await saveAppData();
    renderMedia();
}

async function deletePdf(index) {
    if (confirm("Voulez-vous supprimer ce support PDF ?")) {
        appData.pdfs.splice(index, 1);
        await saveAppData();
        renderCourses();
    }
}

async function deleteMedia(index) {
    if (confirm("Voulez-vous supprimer ce média ?")) {
        appData.media.splice(index, 1);
        await saveAppData();
        renderMedia();
    }
}

async function saveAppData() {
    try {
        await fetch('/api/data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(appData)
        });
    } catch(e) { console.error(e); }
}

function exportToExcel() {
    if (!appData.attendance || appData.attendance.length === 0) {
        showCustomModal({ title: "Exportation", message: "Aucune donnée à exporter.", isPrompt: false });
        return;
    }
    const ws = XLSX.utils.json_to_sheet(appData.attendance);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Emargements");
    XLSX.writeFile(wb, "emargements_campus.xlsx");
}

document.addEventListener("DOMContentLoaded", () => {
    if (typeof lucide !== "undefined") lucide.createIcons();
    loadData();
});