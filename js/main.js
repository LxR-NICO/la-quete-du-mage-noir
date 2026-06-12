// ==========================================
// CONFIG GITHUB
// ==========================================
const GITHUB_USERNAME = "LxR-NICO";
const GITHUB_REPO     = "la-quete-du-mage-noir";
const GITHUB_BRANCH   = "main";

// ==========================================
// STATE
// ==========================================
let s = {};


const SAVE_KEY = "mageNoir_save";

function autoSave() {
    if (!s || !s.isPlaying || s.combat) return;
    try {
        localStorage.setItem(SAVE_KEY, JSON.stringify(s));
    } catch (e) {
        console.warn("Sauvegarde impossible :", e);
    }
}

function clearSave() {
    try { localStorage.removeItem(SAVE_KEY); } catch (e) {}
}

function tryResume() {
    try {
        const raw = localStorage.getItem(SAVE_KEY);
        if (!raw) return false;
        const saved = JSON.parse(raw);
        if (!saved || !saved.isPlaying) return false;
        s = saved;
        if (s.combat) s.combat = null;
        uiLogText.innerHTML = "";
        clearControls();
        addLines(["", "────────────────────────────────────────────────────────────────────────────────",
            "Partie reprise là où vous l'aviez laissée.",
            "────────────────────────────────────────────────────────────────────────────────"]);
        processLieu(s.lieu);
        return true;
    } catch (e) {
        return false;
    }
}
// ==========================================
// RÉFÉRENCES DOM
// ==========================================
const uiLog      = document.getElementById('log-container');
const uiLogText  = document.getElementById('log-text');
const uiControls = document.getElementById('controls');
const uiStats    = document.getElementById('stats-bar');

// ==========================================
// UTILITAIRES
// ==========================================
function randint(a, b) {
    return Math.floor(Math.random() * (b - a + 1)) + a;
}

function changerImage(imageName) {
    const imgElem = document.getElementById('game-image');
    if (!imageName) {
        imgElem.src = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${GITHUB_REPO}/${GITHUB_BRANCH}/image/caverne.jpg`;
        return;
    }
    imgElem.src = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${GITHUB_REPO}/${GITHUB_BRANCH}/image/${imageName}`;
    imgElem.alt = imageName;
}

function updateStats() {
    if (!s.isPlaying) { uiStats.innerHTML = ""; return; }
    let html = `
        <span>PV <b class="c-pv">${s.PV}/${s.maxPV}</b></span>
        <span>PA <b class="c-pa">${s.PA}/${s.maxPA}</b></span>
        <span>PF <b class="c-pf">${s.PF}</b></span>
        <span>Or <b class="c-or">${s.OR}</b></span>
        <span>EXP <b class="c-exp">${s.EXP}</b></span>
    `;
    if (s.inventory.mushrooms > 0) html += `<span style="color:#90d060">🍄 ${s.inventory.mushrooms}</span>`;
    if (s.inventory.poison > 0)    html += `<span style="color:#a060e0">☠ ${s.inventory.poison}</span>`;
    if (s.inventory.potions > 0)   html += `<span style="color:#e05050">🧪 ${s.inventory.potions}</span>`;
    if (s.inventory.sword.hasIt)   html += `<span style="color:#888">Épée${s.inventory.sword.poisoned?"☠":""} (${s.inventory.sword.damage})${s.inventory.sword.sacred?"✨":""}</span>`;
    if (s.inventory.axe.hasIt)     html += `<span style="color:#888">Hache${s.inventory.axe.poisoned?"☠":""} (${s.inventory.axe.damage})</span>`;
    if (s.inventory.dagger.hasIt)  html += `<span style="color:#888">Dague${s.inventory.dagger.magicRegen?"✨":s.inventory.dagger.poisoned?"☠":""} (${s.inventory.dagger.damage})</span>`;
    if (s.inventory.armor.hasIt && s.inventory.armor.bonus > s.equippedArmorBonus) html += `<span style="color:#888">Armure (Non équipée)</span>`;
    if (s.hasBache)         html += `<span style="color:#a07050">🧢 Bâche</span>`;
    if (s.inventory.onguent) html += `<span style="color:#4a8a2a">🌿 Onguent</span>`;
    uiStats.innerHTML = html;
}

function printLine(text) {
    if (text === "") { uiLogText.appendChild(document.createElement('br')); return; }
    const div = document.createElement('div');
    div.className = "log-line";
    if (text.startsWith("────"))               div.classList.add("log-sep");
    else if (text.startsWith("[ PV") || text.startsWith("[ EXP")) div.classList.add("log-stat");
    else if (text.startsWith("⚔"))             div.classList.add("log-title");
    else if (text.includes("coup critique"))   div.classList.add("log-crit");
    else if (text.includes("Félicitations") || text.includes("vaincu l'adversité")) div.classList.add("log-win");
    else if (text.includes("raté") || text.includes("esquivé in extremis"))         div.classList.add("log-miss");
    else if (text.includes("vous a porté") || text.includes("succombez") ||
             text.includes("douleur")      || text.includes("griffes") ||
             text.includes("s'enfoncent")) div.classList.add("log-hit");
    div.innerHTML = text;
    uiLogText.appendChild(div);
}

function addLines(lines) {
    if (lines.length === 0) return;
    const anchor = document.createElement('div');
    document.getElementById('log-text').appendChild(anchor);







    lines.forEach(printLine);
    updateStats();
    setTimeout(() => anchor.scrollIntoView({ behavior: 'smooth', block: 'start' }), 40);

}

function clearControls() { uiControls.innerHTML = ""; }

function addChoice(label, onClick, styleClass = "btn-choice") {
    const btn = document.createElement('button');
    btn.className = styleClass;
    btn.innerHTML = (styleClass === "btn-choice" ? "▸ " : "› ") + label;
    btn.onclick = () => { clearControls(); onClick(); };
    uiControls.appendChild(btn);
}



// ==========================================
// LEVEL UP
// ==========================================
function checkLevelUp(nextAction) {
    if (s.EXP >= 6) {
        s.EXP -= 6;
        addLines(["", "Vous avez atteint le niveau supérieur d'expérience.", "Dans quel domaine voulez-vous gagner en expérience (+1 point permanent) ?"]);
        const wrapper = document.createElement('div');
        wrapper.style.display = "flex"; wrapper.style.gap = "8px";
        wrapper.style.marginTop = "10px";

        const btnPV = document.createElement('button'); btnPV.className = "btn-lvl"; btnPV.innerText = "+1 PV Max";
        btnPV.onclick = () => { s.maxPV += 1; s.PV += 1; addLines(["Vos PV Max augmentent de 1 !"]); clearControls(); checkLevelUp(nextAction); };

        const btnPA = document.createElement('button'); btnPA.className = "btn-lvl"; btnPA.innerText = "+1 PA Max";
        btnPA.onclick = () => { s.maxPA += 1; s.PA += 1; addLines(["Vos PA Max augmentent de 1 !"]); clearControls(); checkLevelUp(nextAction); };

        const btnPF = document.createElement('button'); btnPF.className = "btn-lvl"; btnPF.innerText = "+1 PF";
        btnPF.onclick = () => { s.PF += 1; addLines(["Vos PF augmentent de 1 !"]); clearControls(); checkLevelUp(nextAction); };

        wrapper.appendChild(btnPV); wrapper.appendChild(btnPA); wrapper.appendChild(btnPF);
        uiControls.appendChild(wrapper);
    } else {
        nextAction();
    }
}

// ==========================================
// DÉFAITE
// ==========================================
function declareDefeat(enemyName) {
    changerImage("defaite.jpg");
    s.isPlaying = false;
    if (enemyName) addLines(["", `${enemyName} a finalement pris l'avantage, et vous succombez de vos blessures.`, "Ainsi, dans la honte et la faiblesse, s'achève votre quête."]);
    addLines([
        "", "────────────────────────────────────────────────────────────────────────────────",
        "Toutes ces épreuves ont eu raison de vous.", "Vous n'étiez pas à la hauteur, faible homme.",
        "Votre clan restera humilié à jamais, et vous, dernier représentant de votre famille, succombez, au cours de cette mission que vous n'avez su mener à bien.",
        "Ainsi l'histoire s'arrête, votre nom effacé à jamais.",
        "────────────────────────────────────────────────────────────────────────────────"
    ]);
    const btn = document.createElement('button');
    btn.className = "btn-main"; btn.innerText = "RÉESSAYER";
    btn.onclick = startGame;
    uiControls.appendChild(btn);
}

// ==========================================
// START GAME
// ==========================================
function startGame() {
    changerImage("Gemini_Generated_Image_m8xgimm8xgimm8xg.png");
    s = {
        isPlaying: true, PV: 20, maxPV: 20, PA: 10, maxPA: 10, PF: 3, EXP: 0, OR: 5,
        lieu: 1, b: 0, g: 1, dunes: 2, corde: true, hasBache: false,
        equippedArmorBonus: 0,
        montagneFaite: false, gobelinFait: false, banditsFait: false,
        foretFaite: false, foretEtape: 0,
        inventory: {
            sword:   { damage: 2, poisoned: false, hasIt: true, sacred: false },
            axe:     { damage: 0, poisoned: false, hasIt: false },
            dagger:  { damage: 0, poisoned: false, magicRegen: false, hasIt: false },
            armor:   { bonus: 0, hasIt: false },
            mushrooms: 0, poison: 0, potions: 0, goldenFeather: false, onguent: false
        },
        ville: {
            jour: 1, fatigue: 0, areneVictoires: 0, missionsCompletes: 0,
            brasDeFerGagne: false, brasDeFerAujourdhui: false, areneVaincus: []
        },
        combat: null
    };
    uiLogText.innerHTML = "";
    clearControls();
    addLines([
        "────────────────────────────────────────────────────────────────────────────────",
        "Soyez le bienvenu, jeune homme.... ou femme/non binaire/ trans/ gender fluid/hélicoptère de combat...., en cet hiver glacial. Votre famille et votre clan ont été décimés par un terrible Mage Noir.",
        "Une mission vous a été confiée : venger votre tribu en tuant cet ignoble sorcier.",
        "Au cours de votre périple, vous devrez faire des choix, affronter des monstres et résoudre des énigmes.",
        "Bon courage ... Vous en aurez besoin ...", "",
        "Vous avez 20 PV (points de vie), 10 PA (points d'agilité) et 3 PF (points de force).",
        "Les PV vous servent à encaisser les dégâts, les blessures, la faim et la soif.",
        "Les PA vous permettent de vous déplacer avec agilité, d'attaquer avec précision et d'esquiver avec souplesse, mais diminueront avec la fatigue.",
        "Les PF s'additionnent avec les dégâts que vous infligez.",
        "Vous disposez initialement d'une épée infligeant -2 PV de dégâts (auxquels s'ajouteront vos PF), ainsi que de 5 pièces d'or et d'une corde.", "",
        "Vous pourrez acquérir de nouveaux équipements et développer de nouvelles compétences au cours de cette aventure afin de devenir plus fort.",
        "Vous pourrez améliorer vos points de base grâce à l'expérience gagnée à chaque ennemi éliminé.", "",
        "Vous vous trouvez à l'entrée de votre village natal. Deux chemins s'offrent à vous :",
        "────────────────────────────────────────────────────────────────────────────────"
    ]);
    addChoice("Passer par les montagnes enneigées au Nord", () => processLieu(2));
    addChoice("Passer la forêt ténébreuse à l'Est",         () => processLieu(3));
}

