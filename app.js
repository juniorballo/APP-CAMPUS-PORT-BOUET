let appData = { students: [], attendance: [], courses: [] };
let isAdmin = localStorage.getItem("campus_is_admin") === "true";

async function loadData() {
    try {
        const res = await fetch("/api/data");
        if (res.ok) {
            const data = await res.json();
            if (data) appData = data;
        }
    } catch (e) {
        console.log("Erreur chargement API", e);
    }
    updateUI();
    populateCourses();
}

function populateCourses() {
    const selects = document.querySelectorAll("select");
    selects.forEach(select => {
        const currentVal = select.value;
        select.innerHTML = `<option value="">-- Sélectionnez un cours --</option>`;
        if (appData.courses && appData.courses.length > 0) {
            appData.courses.forEach(c => {
                const opt = document.createElement("option");
                opt.value = c;
                opt.textContent = c;
                select.appendChild(opt);
            });
        }
        select.value = currentVal;
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
}

function toggleAdminMode() {
    if (isAdmin) {
        localStorage.removeItem("campus_is_admin");
        isAdmin = false;
        alert("Mode Étudiant activé.");
        location.reload();
    } else {
        const pwd = prompt("Entrez le mot de passe administrateur :");
        if (pwd === "admin123" || pwd === "campus2026") {
            localStorage.setItem("campus_is_admin", "true");
            isAdmin = true;
            alert("Mode Administrateur activé !");
            location.reload();
        } else if (pwd !== null) {
            alert("Mot de passe incorrect.");
        }
    }
}

function updateUI() {
    document.querySelectorAll(".admin-col, .admin-only").forEach(el => {
        if (isAdmin) el.classList.remove("hidden");
        else el.classList.add("hidden");
    });
    const adminToggleBtn = document.getElementById("adminToggle");
    if (adminToggleBtn) {
        adminToggleBtn.textContent = isAdmin ? "Mode Admin (Actif)" : "Mode Étudiant";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    if (typeof lucide !== "undefined") lucide.createIcons();
    loadData();
});
