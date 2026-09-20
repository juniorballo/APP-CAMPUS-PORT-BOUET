// ==========================================
// CONFIGURATION ET ÉTAT GLOBAL
// ==========================================
const TODAY_STR = new Date().toISOString().split('T')[0];

let state = {
    isAdmin: localStorage.getItem('campus_is_admin') === 'true',
    rating: 0,
    students: JSON.parse(localStorage.getItem('campus_students')) || [
        { id: '1', name: 'Ahui, Djiragbou Ake Moise Alvine', phone: '0798612436', parish: 'PETIT BASSAM' },
        { id: '2', name: 'Bah, Arnorld Dilan', phone: '', parish: 'PETIT BASSAM' },
        { id: '3', name: 'Bini, Kossua Inès', phone: '', parish: 'PETIT BASSAM' },
        { id: '4', name: 'Boizo, Gniha Therese', phone: '', parish: 'PETIT BASSAM' },
        { id: '5', name: 'Djro, Arnaud Thierry Cherubin', phone: '', parish: 'PETIT BASSAM' },
        { id: '6', name: 'Douale, Kpidi Noel Horlance', phone: '', parish: 'PETIT BASSAM' },
        { id: '7', name: 'Fia, Mekapeu Florine', phone: '', parish: 'PETIT BASSAM' },
        { id: '8', name: 'Gbato, Jean David', phone: '', parish: 'PETIT BASSAM' },
        { id: '9', name: 'Gbeuli, Gnateh Christelle', phone: '', parish: 'PETIT BASSAM' },
        { id: '10', name: 'Kambire, Kpekpe Emmanuel', phone: '0508032211', parish: 'PETIT BASSAM' },
        { id: '11', name: 'Koffi, Kouadio Kan Fidèle', phone: '0797942883', parish: 'PETIT BASSAM' },
        { id: '12', name: 'Konan, Anthony Emmanuel', phone: '', parish: 'PETIT BASSAM' },
        { id: '13', name: 'Kouambla, Ninkando Ange Horlane', phone: '', parish: 'PETIT BASSAM' },
        { id: '14', name: 'KOUASSI, Kenou', phone: '', parish: 'PETIT BASSAM' },
        { id: '15', name: 'Kouessan, Dieudonné', phone: '', parish: 'PETIT BASSAM' },
        { id: '16', name: 'Kroupi, Naomie Josiane', phone: '', parish: 'PETIT BASSAM' },
        { id: '17', name: 'Ladje, Hyradie Angenor', phone: '', parish: 'PETIT BASSAM' },
        { id: '18', name: 'Mahan, Siekoulithe David Orly', phone: '', parish: 'PETIT BASSAM' },
        { id: '19', name: 'Molo, Yao Enok', phone: '', parish: 'PETIT BASSAM' },
        { id: '20', name: 'Mon, Guy Cyr Gnonsoua', phone: '', parish: 'PETIT BASSAM' },
        { id: '21', name: 'Monkadehi, Tecle Bertrand', phone: '', parish: 'PETIT BASSAM' },
        { id: '22', name: 'N\'Cho, Chigossan Edwige', phone: '', parish: 'PETIT BASSAM' },
        { id: '23', name: 'N\'Dri, Ahou Ange Ruth Marcelle', phone: '', parish: 'PETIT BASSAM' },
        { id: '24', name: 'N\'drin, Regis Ronald Sokro', phone: '', parish: 'PETIT BASSAM' },
        { id: '25', name: 'Nogbou, Alexis Moise', phone: '', parish: 'PETIT BASSAM' },
        { id: '26', name: 'Taemendjissou Danielle Audrey, Mahan', phone: '', parish: 'PETIT BASSAM' },
        { id: '27', name: 'Togba, Marius Odilon', phone: '', parish: 'PETIT BASSAM' },
        { id: '28', name: 'Ulrich, Goua', phone: '', parish: 'PETIT BASSAM' },
        { id: '29', name: 'Yao, Olive Arnaud', phone: '', parish: 'PETIT BASSAM' },
        { id: '30', name: 'Ake colombe odjo', phone: '', parish: 'ADJOUFFOU' },
        { id: '31', name: 'Amon Amon Alphonse', phone: '', parish: 'ADJOUFFOU' },
        { id: '32', name: 'Diby Yao Michael', phone: '', parish: 'ADJOUFFOU' },
        { id: '33', name: 'Dibo Ange Mariette', phone: '', parish: 'ADJOUFFOU' },
        { id: '34', name: 'Didiehi Gehi Jean Denos', phone: '', parish: 'ADJOUFFOU' },
        { id: '35', name: 'Gbajou Guy Franck Alain', phone: '', parish: 'ADJOUFFOU' },
        { id: '36', name: 'Gobe Dreya Kelly', phone: '', parish: 'ADJOUFFOU' },
        { id: '37', name: 'Gueu zota Darling', phone: '', parish: 'ADJOUFFOU' },
        { id: '38', name: 'Kossonou Yao Daniel', phone: '', parish: 'ADJOUFFOU' },
        { id: '39', name: 'Kouadio Emmanuel', phone: '', parish: 'ADJOUFFOU' },
        { id: '40', name: 'Kouakou Nguessa Sebastien', phone: '', parish: 'ADJOUFFOU' },
        { id: '41', name: 'Moni Beugre Jean Luc', phone: '', parish: 'ADJOUFFOU' },
        { id: '42', name: 'Nianzou Ablan Grace Marie', phone: '', parish: 'ADJOUFFOU' },
        { id: '43', name: 'Nianzou Nguetta Rosine', phone: '', parish: 'ADJOUFFOU' },
        { id: '44', name: 'Rabe fabrice', phone: '', parish: 'ADJOUFFOU' },
        { id: '45', name: 'Yao Ahou Ruth', phone: '', parish: 'ADJOUFFOU' },
        { id: '46', name: 'Yapo Gnako Yann David', phone: '', parish: 'ADJOUFFOU' },
        { id: '47', name: 'Yedoh Jean Corneille', phone: '', parish: 'ADJOUFFOU' },
        { id: '48', name: 'Yoro Jennifer Esthelle', phone: '', parish: 'ADJOUFFOU' },
        { id: '49', name: 'Lebro Serge Pacome', phone: '', parish: 'ADJOUFFOU' },
        { id: '50', name: 'Yoro Annanti', phone: '', parish: 'ADJOUFFOU' },
        { id: '51', name: 'Kpandeou Diane', phone: '', parish: 'ADJOUFFOU' },
        { id: '52', name: 'Nianzou Oceane', phone: '', parish: 'ADJOUFFOU' },
        { id: '53', name: 'Aka Niamkey Nathalie', phone: '', parish: 'JEAN FOLLY 2' },
        { id: '54', name: 'Babo Djezza', phone: '0747990119', parish: 'JEAN FOLLY 2' },
        { id: '55', name: 'Bahoure Tiezie Ashley Nelly Clemence', phone: '0142468040', parish: 'JEAN FOLLY 2' },
        { id: '56', name: 'Agui, Zehima joel', phone: '', parish: 'JEAN FOLLY 2' },
        { id: '57', name: 'Bationo, Arnaud Elfrid', phone: '0759925834', parish: 'JEAN FOLLY 2' },
        { id: '58', name: 'Bationo, Henri Joel', phone: '0707551154', parish: 'JEAN FOLLY 2' },
        { id: '59', name: 'Beni Claudia, Oulobo', phone: '', parish: 'JEAN FOLLY 2' },
        { id: '60', name: 'Bouazo, Djedje Emmanuel', phone: '', parish: 'JEAN FOLLY 2' },
        { id: '61', name: 'Bouazo, Gbagbo Rebecca', phone: '0170296948', parish: 'JEAN FOLLY 2' },
        { id: '62', name: 'Bouazo, Gbehi Abigael', phone: '', parish: 'JEAN FOLLY 2' },
        { id: '63', name: 'Bouazo, Guede Noël', phone: '0717578615', parish: 'JEAN FOLLY 2' },
        { id: '64', name: 'Dahie, Gadji Laurent', phone: '0788831273', parish: 'JEAN FOLLY 2' },
        { id: '65', name: 'Diby, N\'guessan Doria Arlette', phone: '0788263420', parish: 'JEAN FOLLY 2' },
        { id: '66', name: 'Dje, Bi Clement', phone: '', parish: 'JEAN FOLLY 2' },
        { id: '67', name: 'Djédjé, Koukougnon Nicolas Wilfried', phone: '0777606084', parish: 'JEAN FOLLY 2' },
        { id: '68', name: 'Gnadou Billi, Jean Paul', phone: '', parish: 'JEAN FOLLY 2' },
        { id: '69', name: 'Gnangbo, Madou Ange Audrey', phone: '0715474607', parish: 'JEAN FOLLY 2' },
        { id: '70', name: 'Goa bi, boli armand', phone: '0789817912', parish: 'JEAN FOLLY 2' },
        { id: '71', name: 'Kehi, Neuleu Patrick', phone: '0701543807', parish: 'JEAN FOLLY 2' },
        { id: '72', name: 'Konan, Ahou Ida Joelle', phone: '0748251327', parish: 'JEAN FOLLY 2' },
        { id: '73', name: 'Kouadio, Adjoua Dorcas', phone: '0584554237', parish: 'JEAN FOLLY 2' },
        { id: '74', name: 'Kouadio, Kouadio Jean', phone: '0704516470', parish: 'JEAN FOLLY 2' },
        { id: '75', name: 'Kouakou, Behiblo Asa', phone: '0594552775', parish: 'JEAN FOLLY 2' },
        { id: '76', name: 'Koudou, Zadi Jean Bedel', phone: '0594529649', parish: 'JEAN FOLLY 2' },
        { id: '77', name: 'Momine, Kouayo Jean Louis', phone: '0747904342', parish: 'JEAN FOLLY 2' },
        { id: '78', name: 'Sore, Abdoul Latif', phone: '', parish: 'JEAN FOLLY 2' },
        { id: '79', name: 'Sore, Salimata', phone: '', parish: 'JEAN FOLLY 2' },
        { id: '80', name: 'Yao, Kouadio Romaric', phone: '', parish: 'JEAN FOLLY 2' },
        { id: '81', name: 'Youan Lou, Irie Oceanna Jennifer', phone: '', parish: 'JEAN FOLLY 2' },
        { id: '82', name: 'Alex Kouakou', phone: '', parish: 'ATLANTIQUE' },
        { id: '83', name: 'Gnohohi Guehi John Junior', phone: '', parish: 'ATLANTIQUE' },
        { id: '84', name: 'Gnohohi Tape Brice', phone: '', parish: 'ATLANTIQUE' },
        { id: '85', name: 'Goni Cedric Seri', phone: '', parish: 'ATLANTIQUE' },
        { id: '86', name: 'Oulai jean Martial', phone: '', parish: 'ATLANTIQUE' },
        { id: '87', name: 'Sibally Brice Elysee', phone: '', parish: 'ATLANTIQUE' },
        { id: '88', name: 'Segui Breh Boris Wilfred', phone: '', parish: 'ATLANTIQUE' },
        { id: '89', name: 'Dali David', phone: '', parish: 'ATLANTIQUE' },
        { id: '90', name: 'Gnagblo felix', phone: '', parish: 'ATLANTIQUE' },
        { id: '91', name: 'Inago Stephane', phone: '', parish: 'ATLANTIQUE' },
        { id: '92', name: 'Tieyte Junior', phone: '', parish: 'ATLANTIQUE' },
        { id: '93', name: 'Segui Cedric', phone: '', parish: 'ATLANTIQUE' },
        { id: '94', name: 'Bamba Gono Christ', phone: '', parish: 'ATLANTIQUE' },
        { id: '95', name: 'Kakou Ni zahui josias', phone: '', parish: 'ATLANTIQUE' },
        { id: '96', name: 'Elloh Etien Charlene', phone: '', parish: 'ATLANTIQUE' },
        { id: '97', name: 'Gnablo Djessa valerie', phone: '', parish: 'ATLANTIQUE' },
        { id: '98', name: 'Kahou Grace Rolande', phone: '', parish: 'ATLANTIQUE' },
        { id: '99', name: 'Segui mane larsissa Isabelle', phone: '', parish: 'ATLANTIQUE' },
        { id: '100', name: 'Segui Gueugueu Sam Olivia', phone: '', parish: 'ATLANTIQUE' },
        { id: '101', name: 'Tieyte Rachelle', phone: '', parish: 'ATLANTIQUE' },
        { id: '102', name: 'Segui Gnana Carine', phone: '', parish: 'ATLANTIQUE' },
        { id: '103', name: 'Daclou Adjo Nina', phone: '', parish: 'ATLANTIQUE' },
        { id: '104', name: 'Doudou Ahile Lobo', phone: '', parish: 'ATLANTIQUE' },
        { id: '105', name: 'Amouzou kodjo', phone: '', parish: 'ATLANTIQUE' },
        { id: '106', name: 'Amouzou kossi richard', phone: '', parish: 'ATLANTIQUE' },
        { id: '107', name: 'Samuel Armand Assande', phone: '', parish: 'ATLANTIQUE' },
        { id: '108', name: 'Marc Boreba Amvo', phone: '', parish: 'ATLANTIQUE' },
        { id: '109', name: 'Segui Fabrice', phone: '', parish: 'ATLANTIQUE' },
        { id: '110', name: 'Segui frederic Julien', phone: '', parish: 'ATLANTIQUE' },
        { id: '111', name: 'Gbadie joel Gnahore ange marceau', phone: '', parish: 'ATLANTIQUE' },
        { id: '112', name: 'Kassi Moise Gnamgbalo', phone: '', parish: 'ATLANTIQUE' },
        { id: '113', name: 'Gogo Kouame jean sylvain', phone: '', parish: 'ATLANTIQUE' },
        { id: '114', name: 'Gonedre Bi Tiabona', phone: '', parish: 'ATLANTIQUE' },
        { id: '115', name: 'Gouro Armel hamede', phone: '', parish: 'ATLANTIQUE' },
        { id: '116', name: 'Kouame Yves houphouet', phone: '', parish: 'ATLANTIQUE' },
        { id: '117', name: 'kahou ange elie', phone: '', parish: 'ATLANTIQUE' },
        { id: '118', name: 'Kanda Michel Mata Sompa', phone: '', parish: 'ATLANTIQUE' },
        { id: '119', name: 'Kanga Kouassi marcel', phone: '', parish: 'ATLANTIQUE' },
        { id: '120', name: 'Adono Koffi paul', phone: '', parish: 'ATLANTIQUE' },
        { id: '121', name: 'Kouadio Konan Jean christ', phone: '', parish: 'ATLANTIQUE' },
        { id: '122', name: 'Gnabro Kouassi Anicet', phone: '', parish: 'ATLANTIQUE' },
        { id: '123', name: 'Kpaho Oulai prince', phone: '', parish: 'ATLANTIQUE' },
        { id: '124', name: 'Mawuena Emmanuel', phone: '', parish: 'ATLANTIQUE' },
        { id: '125', name: 'Miezan Akangnima', phone: '', parish: 'ATLANTIQUE' },
        { id: '126', name: 'Ble Seri Gildas', phone: '', parish: 'ATLANTIQUE' },
        { id: '127', name: 'Tape Yoro Yves mondesir', phone: '', parish: 'ATLANTIQUE' },
        { id: '128', name: 'Tieti Haipo willis', phone: '', parish: 'ATLANTIQUE' },
        { id: '129', name: 'Tia Emmanuel Richard', phone: '', parish: 'ATLANTIQUE' },
        { id: '130', name: 'Tiekoura Armand', phone: '', parish: 'ATLANTIQUE' },
        { id: '131', name: 'Tieyte Jose Guy Yanick', phone: '', parish: 'ATLANTIQUE' },
        { id: '132', name: 'Titilo Stephane Michee', phone: '', parish: 'ATLANTIQUE' },
        { id: '133', name: 'Towaly Fredy Osel', phone: '', parish: 'ATLANTIQUE' },
        { id: '134', name: 'Wawa Kona', phone: '', parish: 'ATLANTIQUE' },
        { id: '135', name: 'Gnabro Welico Stephane', phone: '', parish: 'ATLANTIQUE' },
        { id: '136', name: 'Zipo Cuitis', phone: '', parish: 'ATLANTIQUE' },
        { id: '137', name: 'Koffi Ossan daniel', phone: '', parish: 'ATLANTIQUE' },
        { id: '138', name: 'Nanh Dansou Rachelle', phone: '', parish: 'PORT BOUET' },
        { id: '139', name: 'Dansou Alladassi Rebecca', phone: '', parish: 'PORT BOUET' },
        { id: '140', name: 'Doho Lou Pascal', phone: '', parish: 'PORT BOUET' },
        { id: '141', name: 'Doho Brayan', phone: '', parish: 'PORT BOUET' },
        { id: '142', name: 'Yao Kouadio Morela', phone: '', parish: 'SIPIM' },
        { id: '143', name: 'Ekondi Jacob', phone: '', parish: 'SIPIM' },
        { id: '144', name: 'Veh Marina', phone: '', parish: 'SIPIM' },
        { id: '145', name: 'Seha France', phone: '', parish: 'SIPIM' },
        { id: '146', name: 'Akouba Agah Parfaite', phone: '', parish: 'SIPIM' },
        { id: '147', name: 'Gouda Vicky', phone: '', parish: 'SIPIM' },
        { id: '148', name: 'Ballo Bi Junior', phone: '', parish: 'JEAN FOLLY 1' },
        { id: '149', name: 'Gbe Donald', phone: '', parish: 'JEAN FOLLY 1' },
        { id: '150', name: 'Kouhon Ruth sarah', phone: '', parish: 'JEAN FOLLY 1' },
        { id: '151', name: 'Ogou Ange', phone: '', parish: 'JEAN FOLLY 1' },
        { id: '152', name: 'Kouassi Aya Leaticia Carmel Leaticia', phone: '', parish: 'JEAN FOLLY 1' },
        { id: '153', name: 'Kouame Kouassi Emmanuel', phone: '', parish: 'JEAN FOLLY 1' },
        { id: '154', name: 'Kumedzro Rabbi Quassi', phone: '', parish: 'JEAN FOLLY 1' },
        { id: '155', name: 'Yoboue kouassi Jean Marc', phone: '', parish: 'JEAN FOLLY 1' },
        { id: '156', name: 'Koffie Amenan Dessie', phone: '', parish: 'JEAN FOLLY 1' },
        { id: '157', name: 'Kouassi Konan Kan Sydney', phone: '', parish: 'JEAN FOLLY 1' },
        { id: '158', name: 'Kouassi Kouadio Innocent Antoine', phone: '', parish: 'JEAN FOLLY 1' },
        { id: '159', name: 'Konan Kya Grace', phone: '', parish: 'JEAN FOLLY 1' },
        { id: '160', name: 'Kya romuald yao', phone: '', parish: 'JEAN FOLLY 1' },
        { id: '161', name: 'Lebe Daniel junior', phone: '', parish: 'AERO CITE' },
        { id: '162', name: 'Kouadio Aya Anne Estelle', phone: '', parish: 'JEAN FOLLY 1' },
        { id: '163', name: 'Kouadio Marie laure', phone: '', parish: 'JEAN FOLLY 1' },
        { id: '164', name: 'Konan Kya Cedric', phone: '', parish: 'JEAN FOLLY 1' },
        { id: '165', name: 'Akyem Samuel', phone: '', parish: 'JEAN FOLLY 1' },
        { id: '166', name: 'N\'dah Jean Hubert', phone: '', parish: 'JEAN FOLLY 1' },
        { id: '167', name: 'Konan Flora Leslie', phone: '', parish: 'JEAN FOLLY 1' },
        { id: '168', name: 'zogbolou Ange', phone: '', parish: 'JEAN FOLLY 1' },
        { id: '169', name: 'Kouame Christophe Amiba', phone: '', parish: 'JEAN FOLLY 1' },
        { id: '170', name: 'Fr Andre', phone: '', parish: 'JEAN FOLLY 1' },
        { id: '171', name: 'Kouassi Ange', phone: '', parish: 'JEAN FOLLY 1' },
        { id: '172', name: 'Lebe Pricille', phone: '', parish: 'JEAN FOLLY 1' },
        { id: '173', name: 'Zougrana Wilfried', phone: '', parish: 'JEAN FOLLY 1' },
        { id: '174', name: 'Lebe Grace Martira', phone: '', parish: 'JEAN FOLLY 1' },
        { id: '175', name: 'Sr Juliana', phone: '', parish: 'JEAN FOLLY 1' },
        { id: '176', name: 'N\'guessan Prisca', phone: '', parish: 'JEAN FOLLY 1' }
    ],
    courses: JSON.parse(localStorage.getItem('campus_courses')) || [
        "Théologie Fondamentale",
        "Histoire de l'Église",
        "Les Écritures Sainte",
        "Doctrine & Alliances"
    ],
    attendanceRecords: JSON.parse(localStorage.getItem('campus_attendance')) || [],
    media: JSON.parse(localStorage.getItem('campus_media')) || [],
    documents: JSON.parse(localStorage.getItem('campus_documents')) || []
};

// URL de votre API backend
const API_URL = 'http://localhost:3000';

let parishChartInstance = null;
let coursesChartInstance = null;

// ==========================================
// AUTHENTIFICATION SÉCURISÉE VIA LE SERVEUR
// ==========================================
async function handleAdminAuth(e) {
    e.preventDefault();
    const inputPwd = document.getElementById('adminPasswordInput').value;

    try {
        const response = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: inputPwd })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            state.isAdmin = true;
            localStorage.setItem('campus_is_admin', 'true');
            closeAdminAuthModal();
            applyAdminUIState();
            showCustomAlert("Accès Autorisé", "Vous êtes connecté en tant qu'administrateur.", "success");
        } else {
            showCustomAlert("Accès Refusé", data.message || "Mot de passe incorrect.", "error");
        }
    } catch (error) {
        showCustomAlert("Erreur de connexion", "Impossible de joindre le serveur d'authentification.", "error");
    }
}

async function handleChangePassword(e) {
    e.preventDefault();
    if (!state.isAdmin) return;

    const currentPwd = document.getElementById('currentPasswordInput').value;
    const newPwd = document.getElementById('newPasswordInput').value;
    const confirmPwd = document.getElementById('confirmPasswordInput').value;

    if (newPwd !== confirmPwd) {
        showCustomAlert("Erreur", "Les nouveaux mots de passe ne correspondent pas.", "error");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/api/auth/change-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ currentPassword: currentPwd, newPassword: newPwd })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            closeChangePasswordModal();
            showCustomAlert("Succès", "Mot de passe administrateur modifié avec succès !", "success");
        } else {
            showCustomAlert("Erreur", data.message || "Impossible de modifier le mot de passe.", "error");
        }
    } catch (error) {
        showCustomAlert("Erreur", "Erreur de communication avec le serveur.", "error");
    }
}

// ==========================================
// INITIALISATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    initDatePicker();
    populateCourseSelects();
    applyAdminUIState();
    renderAttendanceTable();
    renderProfilesTable();
    renderCoursesGrid();
    renderMediaGrid();
    initCharts();

    document.addEventListener('click', (e) => {
        const results = document.getElementById('searchResults');
        const input = document.getElementById('studentSearchInput');
        if (results && !results.contains(e.target) && e.target !== input) {
            results.classList.add('hidden');
        }
    });
});

// ==========================================
// CONTRÔLE DE LA DATE ET ÉMARGEMENT
// ==========================================
function initDatePicker() {
    const filterDateInput = document.getElementById('filterDate');
    if (filterDateInput) {
        filterDateInput.value = TODAY_STR;
        filterDateInput.max = TODAY_STR;
    }
}

function renderAttendanceTable() {
    const filterDateInput = document.getElementById('filterDate');
    if (!filterDateInput) return;

    if (filterDateInput.value > TODAY_STR) {
        filterDateInput.value = TODAY_STR;
        showCustomAlert("Date invalide", "Vous ne pouvez pas consulter ou émarger pour une date future.", "warning");
    }

    const selectedDate = filterDateInput.value;
    const tableBody = document.getElementById('attendanceTable');
    const totalDayRecords = document.getElementById('totalDayRecords');

    if (!tableBody) return;

    const dayRecords = state.attendanceRecords.filter(r => r.date === selectedDate);
    tableBody.innerHTML = '';

    if (dayRecords.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="${state.isAdmin ? 9 : 8}" class="p-6 text-center text-gray-500 italic">
                    Aucune présence enregistrée pour cette date.
                </td>
            </tr>
        `;
    } else {
        dayRecords.forEach((rec, idx) => {
            const totalParticipation = state.attendanceRecords.filter(r => r.studentId === rec.studentId).length;
            const tr = document.createElement('tr');
            tr.className = "hover:bg-gray-50 transition border-b border-gray-100";
            tr.innerHTML = `
                <td class="p-2 whitespace-nowrap text-gray-600 font-medium">${rec.time || '--:--'}</td>
                <td class="p-2 whitespace-nowrap text-center font-bold text-gray-700">${idx + 1}</td>
                <td class="p-2 whitespace-nowrap font-bold text-gray-800 capitalize">${escapeHtml(rec.name)}</td>
                <td class="p-2 whitespace-nowrap text-gray-600">${escapeHtml(rec.phone || 'Non renseigné')}</td>
                <td class="p-2 whitespace-nowrap">
                    <span class="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full">${escapeHtml(rec.parish)}</span>
                </td>
                <td class="p-2 whitespace-nowrap text-gray-700">${escapeHtml(rec.course)}</td>
                <td class="p-2 whitespace-nowrap text-center font-bold text-blue-900">${totalParticipation} cours</td>
                <td class="p-2 whitespace-nowrap">${renderStarsHtml(rec.rating)}</td>
                ${state.isAdmin ? `
                    <td class="p-2 text-center whitespace-nowrap space-x-1">
                        <button onclick="openEditAttendanceModal(${rec.id})" class="text-blue-600 hover:text-blue-800 p-1" title="Modifier"><i data-lucide="edit-3" class="w-4 h-4"></i></button>
                        <button onclick="deleteAttendanceRecord(${rec.id})" class="text-red-600 hover:text-red-800 p-1" title="Supprimer"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                    </td>
                ` : ''}
            `;
            tableBody.appendChild(tr);
        });
    }

    if (totalDayRecords) {
        totalDayRecords.textContent = dayRecords.length;
    }

    if (window.lucide) lucide.createIcons();
}

function filterStudents() {
    const query = document.getElementById('studentSearchInput').value.toLowerCase().trim();
    const resultsContainer = document.getElementById('searchResults');

    if (query.length === 0) {
        resultsContainer.innerHTML = '';
        resultsContainer.classList.add('hidden');
        return;
    }

    const matches = state.students.filter(s => s.name.toLowerCase().includes(query));
    resultsContainer.innerHTML = '';

    if (matches.length === 0) {
        resultsContainer.innerHTML = `<div class="p-2.5 text-xs text-gray-500 text-center">Aucun étudiant trouvé</div>`;
    } else {
        matches.forEach(student => {
            const div = document.createElement('div');
            div.className = "p-2 hover:bg-blue-50 cursor-pointer text-xs font-semibold text-gray-700 flex justify-between border-b last:border-0";
            div.innerHTML = `<span>${escapeHtml(student.name)}</span> <span class="text-gray-400">${escapeHtml(student.parish)}</span>`;
            div.onclick = () => selectStudent(student);
            resultsContainer.appendChild(div);
        });
    }

    resultsContainer.classList.remove('hidden');
}

function selectStudent(student) {
    document.getElementById('studentSearchInput').value = student.name;
    document.getElementById('selectedStudentId').value = student.id;
    document.getElementById('searchResults').classList.add('hidden');

    const count = state.attendanceRecords.filter(r => r.studentId === student.id).length;
    document.getElementById('prevPhone').textContent = student.phone || 'Non renseigné';
    document.getElementById('prevParish').textContent = student.parish;
    document.getElementById('prevCount').textContent = `${count} cours`;
    document.getElementById('studentDetailsPreview').classList.remove('hidden');
}

function setRating(val) {
    state.rating = val;
    const container = document.getElementById('starRating');
    const stars = container.querySelectorAll('i');
    stars.forEach((star, idx) => {
        if (idx < val) {
            star.classList.add('fill-current', 'text-yellow-500');
            star.classList.remove('text-gray-300');
        } else {
            star.classList.remove('fill-current', 'text-yellow-500');
            star.classList.add('text-gray-300');
        }
    });
}

function handleAttendance(e) {
    e.preventDefault();

    const now = new Date();
    const selectedDate = document.getElementById('filterDate').value;

    if (selectedDate > TODAY_STR) {
        showCustomAlert("Date invalide", "Impossible d'émarger pour une date future.", "error");
        return;
    }

    if (!state.isAdmin) {
        const dayOfWeek = now.getDay();
        const currentHour = now.getHours();

        if (dayOfWeek !== 3 || currentHour < 18 || currentHour >= 22) {
            showCustomAlert(
                "Émargement fermé",
                "L'émargement n'est autorisé que les mercredis entre 18H et 22H.",
                "warning"
            );
            return;
        }
    }

    const studentId = document.getElementById('selectedStudentId').value;
    const course = document.getElementById('courseSelect').value;

    if (!studentId) {
        showCustomAlert("Attention", "Veuillez rechercher et sélectionner un étudiant dans la liste.", "warning");
        return;
    }

    const student = state.students.find(s => s.id === studentId);
    if (!student) return;

    const alreadySigned = state.attendanceRecords.some(r => r.studentId === studentId && r.course === course && r.date === selectedDate);
    if (alreadySigned) {
        showCustomAlert("Information", "Cet étudiant a déjà émargé pour ce cours aujourd'hui.", "warning");
        return;
    }

    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newRecord = {
        id: Date.now(),
        studentId: student.id,
        name: student.name,
        phone: student.phone,
        parish: student.parish,
        course: course,
        rating: state.rating || 3,
        date: selectedDate,
        time: timeStr
    };

    state.attendanceRecords.unshift(newRecord);
    saveState();

    document.getElementById('attendanceForm').reset();
    document.getElementById('selectedStudentId').value = '';
    document.getElementById('studentDetailsPreview').classList.add('hidden');
    setRating(0);

    renderAttendanceTable();
    renderProfilesTable();
    updateCharts();
    showCustomAlert("Succès", "Présence enregistrée avec succès !", "success");
}

// ==========================================
// GESTION DES ANNUAIRES & PROFILS (CRUD UTILISATEURS)
// ==========================================
function renderProfilesTable() {
    const tbody = document.getElementById('profilesTable');
    if (!tbody) return;

    tbody.innerHTML = '';
    state.students.forEach((student, idx) => {
        const total = state.attendanceRecords.filter(r => r.studentId === student.id).length;
        const tr = document.createElement('tr');
        tr.className = "hover:bg-gray-50 border-b border-gray-100";
        tr.innerHTML = `
            <td class="p-2 font-bold text-gray-500">${idx + 1}</td>
            <td class="p-2 font-bold text-gray-800 capitalize">${escapeHtml(student.name)}</td>
            <td class="p-2 text-gray-600">${escapeHtml(student.phone || '-')}</td>
            <td class="p-2"><span class="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded border border-blue-100 font-semibold">${escapeHtml(student.parish)}</span></td>
            <td class="p-2 text-center font-bold text-green-700">${total}</td>
            ${state.isAdmin ? `
                <td class="p-2 text-center space-x-1">
                    <button onclick="openEditStudentModal('${student.id}')" class="text-blue-600 hover:text-blue-800 p-1" title="Modifier"><i data-lucide="edit-3" class="w-4 h-4"></i></button>
                    <button onclick="deleteStudent('${student.id}')" class="text-red-600 hover:text-red-800 p-1" title="Supprimer"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                </td>
            ` : ''}
        `;
        tbody.appendChild(tr);
    });

    if (window.lucide) lucide.createIcons();
}

function saveProfile(e) {
    e.preventDefault();
    const name = document.getElementById('newProfName').value.trim();
    const phone = document.getElementById('newProfPhone').value.trim();
    const parish = document.getElementById('newProfParish').value;

    const exists = state.students.some(s => s.name.toLowerCase() === name.toLowerCase());
    if (exists) {
        showCustomAlert("Attention", "Un étudiant avec ce nom existe déjà.", "warning");
        return;
    }

    const newStudent = { id: Date.now().toString(), name, phone, parish };
    state.students.push(newStudent);
    saveState();

    closeProfileModal();
    renderProfilesTable();
    selectStudent(newStudent);
    updateCharts();
    showCustomAlert("Succès", "Profil créé avec succès.", "success");
}

function deleteStudent(studentId) {
    if (!state.isAdmin) return;

    if (confirm("Êtes-vous sûr de vouloir supprimer cet étudiant ?")) {
        state.students = state.students.filter(s => s.id !== studentId);
        state.attendanceRecords = state.attendanceRecords.filter(r => r.studentId !== studentId);

        saveState();
        renderProfilesTable();
        renderAttendanceTable();
        updateCharts();
        showCustomAlert("Suppression", "L'étudiant et ses émargements associés ont été supprimés.", "success");
    }
}

function openEditStudentModal(studentId) {
    const student = state.students.find(s => s.id === studentId);
    if (!student) return;

    document.getElementById('editStudentId').value = student.id;
    document.getElementById('editStudentName').value = student.name;
    document.getElementById('editStudentPhone').value = student.phone || '';
    document.getElementById('editStudentParish').value = student.parish;

    document.getElementById('editStudentModal').classList.remove('hidden');
}

function closeEditStudentModal() {
    document.getElementById('editStudentModal').classList.add('hidden');
}

function saveStudentEdit(e) {
    e.preventDefault();
    if (!state.isAdmin) return;

    const id = document.getElementById('editStudentId').value;
    const name = document.getElementById('editStudentName').value.trim();
    const phone = document.getElementById('editStudentPhone').value.trim();
    const parish = document.getElementById('editStudentParish').value;

    const studentIndex = state.students.findIndex(s => s.id === id);
    if (studentIndex !== -1) {
        state.students[studentIndex] = { ...state.students[studentIndex], name, phone, parish };

        state.attendanceRecords.forEach(rec => {
            if (rec.studentId === id) {
                rec.name = name;
                rec.phone = phone;
                rec.parish = parish;
            }
        });

        saveState();
        closeEditStudentModal();
        renderProfilesTable();
        renderAttendanceTable();
        updateCharts();
        showCustomAlert("Succès", "Informations de l'étudiant mises à jour.", "success");
    }
}

// ==========================================
// PUBLICATION ET GESTION DES CONTENUS (PDF / MEDIAS)
// ==========================================
function handleUploadContent(e) {
    e.preventDefault();
    if (!state.isAdmin) {
        showCustomAlert("Accès refusé", "Seul l'administrateur peut publier du contenu.", "error");
        return;
    }

    const title = document.getElementById('contentTitle').value.trim();
    const category = document.getElementById('contentCategory').value;
    const fileInput = document.getElementById('contentFileInput');

    if (!title || !fileInput.files.length) {
        showCustomAlert("Champs manquants", "Veuillez fournir un titre et sélectionner un fichier.", "warning");
        return;
    }

    const file = fileInput.files[0];

    if (file.size > 5 * 1024 * 1024) {
        showCustomAlert(
            "Fichier trop lourd",
            "Le fichier dépasse 5 Mo. La mémoire locale ('localStorage') du navigateur ne peut pas enregistrer de gros fichiers.",
            "warning"
        );
        return;
    }

    const reader = new FileReader();

    reader.onload = function (event) {
        try {
            const fileUrl = event.target.result;
            const newItem = {
                id: Date.now(),
                title: title,
                date: new Date().toLocaleDateString('fr-FR'),
                url: fileUrl,
                type: file.type
            };

            if (category === 'document' || file.type === 'application/pdf') {
                state.documents.unshift(newItem);
                localStorage.setItem('campus_documents', JSON.stringify(state.documents));
                renderCoursesGrid();
            } else {
                state.media.unshift(newItem);
                localStorage.setItem('campus_media', JSON.stringify(state.media));
                renderMediaGrid();
            }

            closeUploadModal();
            showCustomAlert("Succès", "Le contenu a été publié avec succès !", "success");
        } catch (error) {
            showCustomAlert("Erreur de stockage", "Espace mémoire local saturé. Impossible d'enregistrer ce fichier.", "error");
        }
    };

    reader.readAsDataURL(file);
}

function deleteDocument(docId) {
    if (!state.isAdmin) return;
    if (confirm("Voulez-vous supprimer ce support de cours ?")) {
        state.documents = state.documents.filter(d => d.id !== docId);
        localStorage.setItem('campus_documents', JSON.stringify(state.documents));
        renderCoursesGrid();
        showCustomAlert("Suppression", "Le support a été supprimé.", "success");
    }
}

function deleteMedia(mediaId) {
    if (!state.isAdmin) return;
    if (confirm("Voulez-vous supprimer ce contenu média ?")) {
        state.media = state.media.filter(m => m.id !== mediaId);
        localStorage.setItem('campus_media', JSON.stringify(state.media));
        renderMediaGrid();
        showCustomAlert("Suppression", "Le contenu média a été supprimé.", "success");
    }
}

function renderCoursesGrid() {
    const grid = document.getElementById('coursesGrid');
    if (!grid) return;

    if (state.documents.length === 0) {
        grid.innerHTML = `<p class="text-xs text-gray-500 col-span-3 text-center py-8">Aucun support de cours publié.</p>`;
        return;
    }

    grid.innerHTML = state.documents.map(doc => `
        <div class="bg-white p-4 rounded-lg border shadow-sm flex flex-col justify-between relative">
            ${state.isAdmin ? `
                <button onclick="deleteDocument(${doc.id})" class="absolute top-2 right-2 z-10 text-red-500 hover:text-red-700 p-1" title="Supprimer">
                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                </button>
            ` : ''}
            <div>
                <div class="flex items-center gap-2 text-blue-600 mb-2">
                    <i data-lucide="file-text" class="w-6 h-6"></i>
                    <h3 class="font-bold text-sm text-gray-800 pr-6">${escapeHtml(doc.title)}</h3>
                </div>
                <p class="text-xs text-gray-400 mb-3">Ajouté le ${doc.date}</p>
                
                <div class="w-full h-96 bg-gray-100 rounded border mb-3 overflow-hidden">
                    <iframe src="${doc.url}#view=FitH&toolbar=0" class="w-full h-full border-0"></iframe>
                </div>
            </div>

            <div class="flex gap-2">
                <a href="${doc.url}" target="_blank" class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 text-center rounded text-xs flex justify-center items-center gap-1 transition">
                    <i data-lucide="eye" class="w-4 h-4"></i> Plein écran
                </a>
                <a href="${doc.url}" download="${escapeHtml(doc.title)}.pdf" class="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100 font-semibold py-2 text-center rounded text-xs flex justify-center items-center gap-1 transition">
                    <i data-lucide="download" class="w-4 h-4"></i> Télécharger
                </a>
            </div>
        </div>
    `).join('');

    if (window.lucide) lucide.createIcons();
}

function renderMediaGrid() {
    const grid = document.getElementById('mediaGrid');
    if (!grid) return;

    if (state.media.length === 0) {
        grid.innerHTML = `<p class="text-xs text-gray-500 col-span-3 text-center py-8">Aucun média publié.</p>`;
        return;
    }

    grid.innerHTML = state.media.map(m => {
        let mediaHtml = '';

        if (m.type && m.type.startsWith('image')) {
            mediaHtml = `<img src="${m.url}" class="max-h-48 mx-auto rounded shadow-sm object-cover">`;
        } else if (m.type && m.type.startsWith('video')) {
            mediaHtml = `
                <video controls class="w-full max-h-48 rounded shadow-sm bg-black">
                    <source src="${m.url}" type="${m.type}">
                    Votre navigateur ne supporte pas le lecteur vidéo.
                </video>`;
        } else {
            mediaHtml = `<a href="${m.url}" target="_blank" class="text-blue-600 underline text-xs font-semibold">Visionner / Télécharger le média</a>`;
        }

        return `
            <div class="bg-white rounded-lg border shadow-sm overflow-hidden relative">
                ${state.isAdmin ? `
                    <button onclick="deleteMedia(${m.id})" class="absolute top-2 right-2 z-10 bg-white rounded-full p-1 shadow text-red-500 hover:text-red-700" title="Supprimer">
                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                    </button>
                ` : ''}
                <div class="p-3 font-bold text-sm text-gray-800 border-b pr-8">${escapeHtml(m.title)}</div>
                <div class="p-4 bg-gray-50 text-center">
                    ${mediaHtml}
                </div>
            </div>
        `;
    }).join('');

    if (window.lucide) lucide.createIcons();
}

// ==========================================
// MODIFICATION & SUPPRESSION DES ÉMARGEMENTS (ADMIN)
// ==========================================
function openEditAttendanceModal(recordId) {
    const rec = state.attendanceRecords.find(r => r.id === recordId);
    if (!rec) return;

    document.getElementById('editAttendanceIndex').value = rec.id;
    document.getElementById('editAttName').value = rec.name;
    document.getElementById('editAttPhone').value = rec.phone || '';
    document.getElementById('editAttParish').value = rec.parish;
    document.getElementById('editAttCourse').value = rec.course;
    document.getElementById('editAttRating').value = rec.rating;

    document.getElementById('editAttendanceModal').classList.remove('hidden');
}

function closeEditAttendanceModal() {
    document.getElementById('editAttendanceModal').classList.add('hidden');
}

function saveAttendanceEdit(e) {
    e.preventDefault();
    if (!state.isAdmin) return;

    const id = parseInt(document.getElementById('editAttendanceIndex').value, 10);
    const recIndex = state.attendanceRecords.findIndex(r => r.id === id);

    if (recIndex !== -1) {
        state.attendanceRecords[recIndex].name = document.getElementById('editAttName').value.trim();
        state.attendanceRecords[recIndex].phone = document.getElementById('editAttPhone').value.trim();
        state.attendanceRecords[recIndex].parish = document.getElementById('editAttParish').value;
        state.attendanceRecords[recIndex].course = document.getElementById('editAttCourse').value;
        state.attendanceRecords[recIndex].rating = parseInt(document.getElementById('editAttRating').value, 10);

        saveState();
        closeEditAttendanceModal();
        renderAttendanceTable();
        updateCharts();
        showCustomAlert("Succès", "Émargement mis à jour.", "success");
    }
}

function deleteAttendanceRecord(recordId) {
    if (!state.isAdmin) return;

    if (confirm("Voulez-vous supprimer cet émargement ?")) {
        state.attendanceRecords = state.attendanceRecords.filter(r => r.id !== recordId);
        saveState();
        renderAttendanceTable();
        renderProfilesTable();
        updateCharts();
        showCustomAlert("Suppression", "L'émargement a été supprimé.", "success");
    }
}

// ==========================================
// NAVIGATION ET MODALES ADMIN & MOT DE PASSE
// ==========================================
function toggleAdminMode() {
    if (state.isAdmin) {
        state.isAdmin = false;
        localStorage.removeItem('campus_is_admin');
        window.location.reload();
    } else {
        openAdminAuthModal();
    }
}

function openAdminAuthModal() {
    document.getElementById('adminPasswordInput').value = '';
    document.getElementById('adminAuthModal').classList.remove('hidden');
}

function closeAdminAuthModal() {
    document.getElementById('adminAuthModal').classList.add('hidden');
}

function applyAdminUIState() {
    const btn = document.getElementById('adminToggle');
    const adminCols = document.querySelectorAll('.admin-col, .admin-only');

    if (state.isAdmin) {
        if (btn) {
            btn.textContent = "Mode Admin (Actif)";
            btn.className = "text-xs bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1.5 rounded transition shadow";
        }
        adminCols.forEach(el => el.classList.remove('hidden'));
    } else {
        if (btn) {
            btn.textContent = "Mode Étudiant";
            btn.className = "text-xs bg-yellow-500 hover:bg-yellow-600 text-blue-950 font-bold px-3 py-1.5 rounded transition shadow";
        }
        adminCols.forEach(el => el.classList.add('hidden'));
    }

    renderAttendanceTable();
    renderProfilesTable();
    renderCoursesGrid();
    renderMediaGrid();
}

function openChangePasswordModal() {
    document.getElementById('currentPasswordInput').value = '';
    document.getElementById('newPasswordInput').value = '';
    document.getElementById('confirmPasswordInput').value = '';
    document.getElementById('changePasswordModal').classList.remove('hidden');
}

function closeChangePasswordModal() {
    document.getElementById('changePasswordModal').classList.add('hidden');
}

function switchTab(tabId) {
    const tabs = ['presence', 'profiles', 'cours', 'media', 'stats'];
    tabs.forEach(t => {
        const sec = document.getElementById(`sec-${t}`);
        const tabBtn = document.getElementById(`tab-${t}`);
        if (sec) sec.classList.add('hidden');
        if (tabBtn) tabBtn.classList.remove('active-tab');
    });

    const activeSec = document.getElementById(`sec-${tabId}`);
    const activeBtn = document.getElementById(`tab-${tabId}`);
    if (activeSec) activeSec.classList.remove('hidden');
    if (activeBtn) activeBtn.classList.add('active-tab');

    if (tabId === 'stats') {
        updateCharts();
        renderProgressionTable();
    }
}

function openProfileModal() { document.getElementById('profileModal').classList.remove('hidden'); }
function closeProfileModal() { document.getElementById('profileModal').classList.add('hidden'); document.getElementById('newProfileForm').reset(); }

function openCourseModal() {
    renderCourseManagerList();
    document.getElementById('courseModal').classList.remove('hidden');
}
function closeCourseModal() { document.getElementById('courseModal').classList.add('hidden'); }

function openUploadModal(category) {
    document.getElementById('contentCategory').value = category;
    document.getElementById('uploadModal').classList.remove('hidden');
}
function closeUploadModal() {
    document.getElementById('uploadModal').classList.add('hidden');
    document.getElementById('uploadForm').reset();
}

// ==========================================
// PROGRAMME & LISTE DES COURS
// ==========================================
function populateCourseSelects() {
    const mainSelect = document.getElementById('courseSelect');
    const editSelect = document.getElementById('editAttCourse');
    const statSelect = document.getElementById('statCourse');

    const options = state.courses.map(c => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join('');

    if (mainSelect) mainSelect.innerHTML = options;
    if (editSelect) editSelect.innerHTML = options;
    if (statSelect) statSelect.innerHTML = `<option value="all">Tous les cours</option>${options}`;
}

function addCourse(e) {
    e.preventDefault();
    const input = document.getElementById('newCourseTitleInput');
    const val = input.value.trim();
    if (val && !state.courses.includes(val)) {
        state.courses.push(val);
        saveState();
        populateCourseSelects();
        renderCourseManagerList();
        input.value = '';
    }
}

function renderCourseManagerList() {
    const container = document.getElementById('courseManagerList');
    if (!container) return;
    container.innerHTML = state.courses.map((c, i) => `
        <div class="flex justify-between items-center bg-gray-50 p-2 rounded text-xs border">
            <span>${escapeHtml(c)}</span>
            <button onclick="removeCourse(${i})" class="text-red-500 hover:text-red-700 font-bold">Supprimer</button>
        </div>
    `).join('');
}

function removeCourse(idx) {
    state.courses.splice(idx, 1);
    saveState();
    populateCourseSelects();
    renderCourseManagerList();
}

// ==========================================
// EXPORT EXCEL & CAPTURE
// ==========================================
function exportToExcel() {
    const selectedDate = document.getElementById('filterDate').value;
    const records = state.attendanceRecords.filter(r => r.date === selectedDate);

    if (records.length === 0) {
        showCustomAlert("Information", "Aucune donnée à exporter pour cette date.", "warning");
        return;
    }

    const excelData = records.map((r, i) => ({
        "N° Ordre": i + 1,
        "Heure": r.time || "-",
        "Nom & Prénoms": r.name,
        "Téléphone": r.phone || "Non renseigné",
        "Paroisse": r.parish,
        "Cours": r.course,
        "Note Évaluation": `${r.rating}/5`
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Émargement");

    XLSX.writeFile(workbook, `Emargement_Campus_${selectedDate}.xlsx`);
}

function exportStatsAsImage() {
    const area = document.getElementById('statsCaptureArea');
    if (!area) return;

    html2canvas(area).then(canvas => {
        const link = document.createElement('a');
        link.download = `Statistiques_Campus_${TODAY_STR}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    });
}

// ==========================================
// STATISTIQUES & GRAPHIQUES (CHART.JS)
// ==========================================
function initCharts() {
    const ctxPie = document.getElementById('parishPieChart')?.getContext('2d');
    const ctxBar = document.getElementById('coursesBarChart')?.getContext('2d');

    if (ctxPie) {
        parishChartInstance = new Chart(ctxPie, {
            type: 'pie',
            data: { labels: [], datasets: [{ data: [], backgroundColor: ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1'] }] },
            options: { responsive: true, maintainAspectRatio: false }
        });
    }

    if (ctxBar) {
        coursesChartInstance = new Chart(ctxBar, {
            type: 'bar',
            data: { labels: [], datasets: [{ label: 'Présences', data: [], backgroundColor: '#2563eb' }] },
            options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } }
        });
    }
}

function updateCharts() {
    if (!parishChartInstance || !coursesChartInstance) return;

    const totalStudents = state.students.length;
    const totalFriends = state.students.filter(s => s.parish === 'AMIS').length;

    const elKpiStudents = document.getElementById('kpiTotalStudents');
    const elKpiFriends = document.getElementById('kpiTotalFriends');
    const elKpiRate = document.getElementById('kpiGlobalRate');
    const elKpiRating = document.getElementById('kpiAvgRating');
    const elKpiTopParish = document.getElementById('kpiTopParish');

    if (elKpiStudents) elKpiStudents.textContent = totalStudents;
    if (elKpiFriends) elKpiFriends.textContent = totalFriends;

    const totalPossible = totalStudents * 40;
    const globalRate = totalPossible > 0 ? Math.round((state.attendanceRecords.length / totalPossible) * 100) : 0;
    if (elKpiRate) elKpiRate.textContent = `${globalRate}%`;

    const totalRatings = state.attendanceRecords.reduce((sum, r) => sum + (r.rating || 0), 0);
    const avgRating = state.attendanceRecords.length > 0 ? (totalRatings / state.attendanceRecords.length).toFixed(1) : '0.0';
    if (elKpiRating) elKpiRating.textContent = `${avgRating} / 5 ★`;

    const parishCounts = {};
    state.students.forEach(s => { parishCounts[s.parish] = (parishCounts[s.parish] || 0) + 1; });

    let topParish = '-';
    let maxCount = 0;
    Object.entries(parishCounts).forEach(([p, count]) => {
        if (count > maxCount) {
            maxCount = count;
            topParish = p;
        }
    });
    if (elKpiTopParish) elKpiTopParish.textContent = topParish;

    parishChartInstance.data.labels = Object.keys(parishCounts);
    parishChartInstance.data.datasets[0].data = Object.values(parishCounts);
    parishChartInstance.update();

    const courseCounts = {};
    state.courses.forEach(c => { courseCounts[c] = 0; });
    state.attendanceRecords.forEach(r => { courseCounts[r.course] = (courseCounts[r.course] || 0) + 1; });

    coursesChartInstance.data.labels = Object.keys(courseCounts);
    coursesChartInstance.data.datasets[0].data = Object.values(courseCounts);
    coursesChartInstance.update();
}

function handleStatFiltersChange() {
    renderProgressionTable();
}

function renderProgressionTable() {
    const tbody = document.getElementById('progressionTableBody');
    if (!tbody) return;

    const nameSearchQuery = (document.getElementById('statSearchName')?.value || '').toLowerCase().trim();
    const parishFilter = document.getElementById('statParishFilter')?.value || 'all';
    const courseFilter = document.getElementById('statCourse')?.value || 'all';

    tbody.innerHTML = '';

    let filteredStudents = state.students.filter(s => {
        const matchesName = s.name.toLowerCase().includes(nameSearchQuery);
        const matchesParish = (parishFilter === 'all') || (s.parish === parishFilter);
        return matchesName && matchesParish;
    });

    if (filteredStudents.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="p-6 text-center text-gray-500 italic">
                    Aucun étudiant ou ami ne correspond à vos critères de recherche.
                </td>
            </tr>
        `;
        return;
    }

    filteredStudents.forEach(s => {
        let presencesList = state.attendanceRecords.filter(r => r.studentId === s.id);
        if (courseFilter !== 'all') {
            presencesList = presencesList.filter(r => r.course === courseFilter);
        }

        const presences = presencesList.length;
        const totalPossible = 40;
        const rate = Math.min(Math.round((presences / totalPossible) * 100), 100);

        const tr = document.createElement('tr');
        tr.className = "border-b border-gray-100 hover:bg-gray-50";
        tr.innerHTML = `
            <td class="p-2.5 font-bold text-gray-800 capitalize">${escapeHtml(s.name)}</td>
            <td class="p-2.5">
                <span class="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded border border-blue-100 font-semibold">
                    ${escapeHtml(s.parish)}
                </span>
            </td>
            <td class="p-2.5 text-center font-bold text-blue-600">${presences}</td>
            <td class="p-2.5 text-center text-gray-500">${totalPossible}</td>
            <td class="p-2.5 text-center font-bold">${rate}%</td>
            <td class="p-2.5">
                <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-blue-600 h-2 rounded-full" style="width: ${rate}%"></div>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// ==========================================
// UTILITAIRES DE SAUVEGARDE & AFFICHAGE
// ==========================================
function saveState() {
    localStorage.setItem('campus_students', JSON.stringify(state.students));
    localStorage.setItem('campus_attendance', JSON.stringify(state.attendanceRecords));
    localStorage.setItem('campus_courses', JSON.stringify(state.courses));
    localStorage.setItem('campus_documents', JSON.stringify(state.documents));
    localStorage.setItem('campus_media', JSON.stringify(state.media));
}

function renderStarsHtml(rating) {
    let html = '';
    for (let i = 1; i <= 5; i++) {
        html += `<span class="${i <= rating ? 'text-yellow-500' : 'text-gray-300'} text-sm">★</span>`;
    }
    return html;
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>"']/g, (m) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[m]));
}

function showCustomAlert(title, message, type = 'info') {
    const modal = document.getElementById('customAlertModal');
    const titleEl = document.getElementById('alertTitle');
    const msgEl = document.getElementById('alertMessage');
    const iconContainer = document.getElementById('alertIconContainer');
    const icon = document.getElementById('alertIcon');

    if (!modal) return;

    titleEl.textContent = title;
    msgEl.textContent = message;

    if (type === 'error') {
        iconContainer.className = "w-16 h-16 rounded-full mx-auto flex items-center justify-center bg-red-100 text-red-600";
        icon.setAttribute('data-lucide', 'alert-circle');
    } else if (type === 'success') {
        iconContainer.className = "w-16 h-16 rounded-full mx-auto flex items-center justify-center bg-green-100 text-green-600";
        icon.setAttribute('data-lucide', 'check-circle');
    } else {
        iconContainer.className = "w-16 h-16 rounded-full mx-auto flex items-center justify-center bg-amber-100 text-amber-600";
        icon.setAttribute('data-lucide', 'alert-triangle');
    }

    if (window.lucide) lucide.createIcons();
    modal.classList.remove('hidden');
}

function closeCustomAlert() {
    const modal = document.getElementById('customAlertModal');
    if (modal) modal.classList.add('hidden');
}