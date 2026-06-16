// ==========================================
// ARRIVÉE & HÉBERGEMENT
// ==========================================
function arriveeKairMorten() {
    changerImage("arive.jpg");
    addLines(["", "────────────────────────────────────────────────────────────────────────────────",
        "Enfin !!! Vous voilà arrivé à KAIR MORTEN, la dernière cité humaine avant les terres hostiles.",
        "Au-delà de ses murs, vous ne rencontrerez plus que de vils monstres, barbares et assoiffés de sang.",
        "Mais ce n'est pas le moment de reculer, votre ennemi se renforce de jour en jour et le temps presse.",
        "Heureusement pour vous, KAIR MORTEN est l'endroit idéal pour vous préparer.",
        "Devenez riche, gagnez en expérience, acquérez du matériel de meilleure qualité...",
        "Mais gardez en tête que votre ennemi final devient plus fort de jour en jour.",
        "", "En attendant, la nuit est tombée depuis longtemps. Pour ce soir, voulez-vous prendre une chambre ?"]);
    addChoice("Prendre une chambre à l'auberge du Griffon Boiteux (5 or) — Restaure vos Max PV et PA", () => processLieu(35));
    addChoice("Dormir dehors dans une ruelle (gratuit) — +2 PV",                                        () => processLieu(36));
}

function auberge() {
    changerImage("auberge.jpg");
    if (s.OR < 5) {
        addLines(["", "L'aubergiste vous regarde de haut en bas et secoue la tête.", "\"Désolé l'ami, sans le sou on dort pas ici.\"", "Vous ressortez, penaud, et trouvez un coin de ruelle pour passer la nuit."]);
        _dormir(false);
    } else {
        s.OR -= 5;
        addLines(["", "L'auberge du Griffon Boiteux est bruyante et enfumée, mais le lit est propre et la soupe chaude.", "Vous vous endormez aussitôt la tête posée sur l'oreiller.", "Au matin, vous vous réveillez reposé et ragaillardi (PV et PA max)."]);
        _dormir(true);
    }
}

function dorsDehors() {
    changerImage("rue.jpg");
    addLines(["", "Vous trouvez un coin de ruelle abrité du vent, entre deux tonneaux de bière vides.", "L'épuisement vous terrasse en quelques secondes. Au matin, vous vous réveillez courbaturé mais vivant (+2 PV)."]);
    _dormir(false);
}

function _dormir(hotel) {
    s.ville.brasDeFerAujourdhui = false;
    if (hotel) {
        s.PV = s.maxPV; s.PA = s.maxPA; s.ville.fatigue = Math.max(s.ville.fatigue - 1, 0);
    } else {
        s.PV = Math.min(s.PV + 2, s.maxPV); s.ville.fatigue += 1;
        if (s.ville.fatigue >= 3) {
            addLines(["", "Vous accumulez trop de nuits à la dure. La fatigue chronique vous ronge (-1 PA Max permanent)."]);
            s.maxPA = Math.max(s.maxPA - 1, 1); s.PA = Math.min(s.PA, s.maxPA); s.ville.fatigue = 0;
        }
    }
    s.ville.jour += 1;
    if (s.ville.jour >= 10) addLines(["", `⚠ Cela fait ${s.ville.jour} jours que vous traînez à Kair Morten.`, "Des rumeurs courent dans la ville : le Mage Noir a renforcé ses armées.", "On dit qu'il est désormais presque invincible. Chaque jour perdu est une victoire pour lui."]);
    addChoice("Aller en ville", () => processLieu(99));
}

// ==========================================
// MENU VILLE
// ==========================================
function menuVille() {
    changerImage("ville.jpg");
    addLines(["", `── KAIR MORTEN — Jour ${s.ville.jour} ──`, "Où souhaitez-vous aller ?"]);
    addChoice("🗡  L'Arène — Combattre pour gagner or et expérience",   () => processLieu(100));
    addChoice("🏪  Le Marché — Acheter des équipements",                () => processLieu(110));
    addChoice("📋  Tableau des Missions — Missions contre rémunération", () => processLieu(120));
    addChoice("⚒  Zone de Travail — Travailler pour quelques pièces",  () => processLieu(130));
    addChoice("🍺  La Taverne du Loup Gris — Jeux, rumeurs et détente", () => processLieu(140));
    addChoice("🌙  Dormir — Passer à la journée suivante",              () => processLieu(150));
    addChoice("⚔  Quitter Kair Morten et affronter votre destin",      () => processLieu(200));
}

// ==========================================
// ARÈNE
// ==========================================
const ARENE_ADVERSAIRES = [
    { key: "gladiateur", nom: "Le Gladiateur Borgne",  pv: 12, da: 2, or: 8,   exp: 1,  lieu: 101 },
    { key: "berserker",  nom: "Le Berserker Nain",      pv: 18, da: 3, or: 15,  exp: 2,  lieu: 102 },
    { key: "troll",      nom: "Le Troll des Arènes",    pv: 28, da: 4, or: 30,  exp: 3,  lieu: 103 },
    { key: "champion",   nom: "Le Champion Maudit",     pv: 40, da: 5, or: 60,  exp: 5,  lieu: 104 },
    { key: "hydre",      nom: "L'Hydre à Deux Têtes",   pv: 55, da: 6, or: 90,  exp: 6,  lieu: 105 },
    { key: "golem",      nom: "Le Golem de Pierre",     pv: 70, da: 7, or: 130, exp: 8,  lieu: 106 },
    { key: "dragon",     nom: "Le Dragon Enchaîné",     pv: 90, da: 9, or: 200, exp: 10, lieu: 107 },
];

function arene() {
    changerImage("arene.jpg");
    const v = s.ville.areneVictoires; const vaincus = s.ville.areneVaincus;
    addLines(["", "── L'ARÈNE DE KAIR MORTEN ──", "La foule rugit. L'odeur du sang et de la sueur imprègne l'air brûlant.",
        v === 0 ? "Vous êtes encore un inconnu ici." :
        v < 4  ? "Votre réputation commence à se faire." :
        v < 10 ? "Vous êtes une légende de l'arène." :
                 "Votre nom seul fait trembler les combattants."]);
    let hasChoice = false;
    ARENE_ADVERSAIRES.forEach((adv, idx) => {
        if (idx <= v && !vaincus.includes(adv.key)) {
            addChoice(`${adv.nom} — PV:${adv.pv} DA:${adv.da} → Gain: ${adv.or} or`, () => processLieu(adv.lieu));
            hasChoice = true;
        }
    });
    if (!hasChoice) addLines(["", "Vous avez vaincu tous les adversaires disponibles."]);
    addChoice("Retourner en ville", () => processLieu(99));
}

function combatArene(nom, pva, da, gainOr, gainExp, key) {
    changerImage("arene.jpg");
    if (s.ville.areneVaincus.includes(key)) {
        addLines(["", `${nom} a déjà été vaincu et refuse de remonter sur le sable.`]);
        addChoice("Retourner à l'arène", () => processLieu(100)); return;
    }
    addLines(["", `La foule scande votre nom alors que ${nom} entre dans l'arène en rugissant !`]);
    startCombat(nom, pva, da, () => {
        s.OR += gainOr; s.ville.areneVictoires += 1;
        const v = s.ville.areneVictoires;
        if (!s.ville.areneVaincus.includes(key)) s.ville.areneVaincus.push(key);
        for (let i = 0; i < gainExp - 1; i++) s.EXP += 1;
        addLines(["", `La foule explose de joie ! Vous avez vaincu ${nom} !`, `Vous empochez ${gainOr} pièces d'or.`,
            v === 5 ? "La foule vous couvre de pièces ! (+10 or bonus)" : `${nom} ne remontera plus jamais sur ce sable.`]);
        if (v === 5) s.OR += 10;
        addChoice("Retourner à l'arène", () => processLieu(100));
    }, true);
}

// ==========================================
// MARCHÉ
// ==========================================
const MARCHE_ITEMS = [
    { nom: "Potion de soins",    desc: "Boire en combat : +8 PV",          prix: 12,  effet: () => { s.inventory.potions += 1; } },
    { nom: "Élixir de Force",    desc: "+3 PF permanent",                  prix: 40,  effet: () => { s.PF += 3; addLines(["Vos muscles se gonflent de puissance. +3 PF !"]); } },
    { nom: "Épée en Acier",      desc: "7 dégâts (remplace)",              prix: 35,  effet: () => { s.inventory.sword = { damage: 7, poisoned: s.inventory.sword.poisoned, hasIt: true, sacred: false }; } },
    { nom: "Hache de Guerre",    desc: "10 dégâts, succès sur 14",         prix: 55,  effet: () => { s.inventory.axe   = { damage: 10, poisoned: s.inventory.axe.poisoned, hasIt: true }; } },
    { nom: "Armure de Cuir",     desc: "+6 PV Max équipable",              prix: 30,  effet: () => { s.inventory.armor = { bonus: 6, hasIt: true }; } },
    { nom: "Cotte de Mailles",   desc: "+10 PV Max équipable",             prix: 70,  effet: () => { s.inventory.armor = { bonus: 10, hasIt: true }; } },
    { nom: "Bottes de Vitesse",  desc: "+4 PA Max permanent",              prix: 60,  effet: () => { s.maxPA += 4; s.PA += 4; addLines(["+4 PA Max !"]); } },
    { nom: "Amulette de Vie",    desc: "+8 PV Max permanent",              prix: 80,  effet: () => { s.maxPV += 8; s.PV += 8; addLines(["+8 PV Max !"]); } },
    { nom: "Dose de poison",     desc: "+2 doses pour armes",              prix: 20,  effet: () => { s.inventory.poison += 2; } },
    { nom: "⚡ Épée Légendaire", desc: "15 dégâts",                        prix: 200, effet: () => { s.inventory.sword = { damage: 15, poisoned: false, hasIt: true, sacred: false }; addLines(["La lame vibre d'une énergie mystique."]); } },
    { nom: "⚡ Armure de Dragon",desc: "+20 PV Max équipable",             prix: 250, effet: () => { s.inventory.armor = { bonus: 20, hasIt: true }; addLines(["Les écailles reflètent la lumière."]); } },
    { nom: "⚡ Élixir du Titan", desc: "+5 PF, +5 PA Max, +10 PV Max",    prix: 400, effet: () => { s.PF+=5; s.maxPA+=5; s.PA+=5; s.maxPV+=10; s.PV+=10; addLines(["Vous vous sentez surhumain."]); } },
];

function marche() {
    changerImage("marche.jpg");
    addLines(["", "── LE MARCHÉ DE KAIR MORTEN ──", "Les étals s'étendent à perte de vue.", `Votre bourse : ${s.OR} pièces d'or.`]);
    MARCHE_ITEMS.forEach(item => {
        addChoice(`${item.nom} (${item.prix} or) — ${item.desc}`, () => {
            if (s.OR < item.prix) { addLines(["", `Pas assez d'or. Il vous faut ${item.prix} pièces, vous en avez ${s.OR}.`]); processLieu(110); }
            else { s.OR -= item.prix; item.effet(); addLines(["", `Achat : ${item.nom}. (-${item.prix} or) Or restant : ${s.OR}`]); processLieu(110); }
        });
    });
    if (s.inventory.goldenFeather) {
        addChoice("Vendre votre Plume d'Or (+50 or)", () => {
            s.inventory.goldenFeather = false; s.OR += 50;
            addLines(["", "\"Je n'en avais jamais vu de si belle !\" +50 or !"]);
            processLieu(110);
        });
    }
    addChoice("Retourner en ville", () => processLieu(99));
}

// ==========================================
// MISSIONS
// ==========================================
const MISSIONS = [
    { titre: "Extermination de rats géants",
      intro: ["", "Les réserves de grain fondent à vue d'œil. Vous descendez dans les caves humides.", "Des traces de rongeurs géants sont visibles partout. Soudain, trois immenses silhouettes grises surgissent des ténèbres !"],
      ennemi: ["Les Rats Géants", 10, 1],
      win: () => { s.OR += 15; s.ville.missionsCompletes = Math.max(s.ville.missionsCompletes, 1); addLines(["", "Les rats gisent à vos pieds. 15 pièces d'or. Mission accomplie."]); addChoice("Retour", () => processLieu(99)); }
    },
    { titre: "Escorte du marchand Tolbas",
      intro: ["", "À mi-chemin, trois coupeurs de gorge surgissent d'une impasse !"],
      ennemi: ["Les Coupeurs de gorge", 16, 2],
      win: () => { s.OR += 25; s.ville.missionsCompletes = Math.max(s.ville.missionsCompletes, 2); s.EXP += 1; addLines(["", "Tolbas, soulagé, vous remet 25 pièces d'or."]); addChoice("Retour", () => processLieu(99)); }
    },
    { titre: "La Bête de la Carrière",
      intro: ["", "Un Dévoreur de Pierre, mi-ours mi-sanglier, émerge de l'ombre !"],
      ennemi: ["Le Dévoreur de Pierre", 30, 4],
      win: () => { s.OR += 50; s.inventory.armor = { bonus: 8, hasIt: true }; s.ville.missionsCompletes = Math.max(s.ville.missionsCompletes, 3); s.EXP += 2; addLines(["", "50 or et une armure de carrier renforcée (+8 PV Max équipable)."]); addChoice("Retour", () => processLieu(99)); }
    },
    { titre: "Le Mage Renégat",
      intro: ["", "Au sommet de la tour, le mage lévite à moitié : \"Ta misérable vie s'achève ici !\""],
      ennemi: ["Le Mage Renégat", 22, 5],
      win: () => { s.OR += 80; s.maxPA += 2; s.PA += 2; s.PF += 2; s.ville.missionsCompletes = Math.max(s.ville.missionsCompletes, 4); s.EXP += 3; addLines(["", "+2 PA Max, +2 PF. 80 pièces d'or."]); addChoice("Retour", () => processLieu(99)); }
    }
];

function missions() {
    changerImage("missions.jpg");
    const mc = s.ville.missionsCompletes;
    addLines(["", "── TABLEAU DES MISSIONS ──"]);
    if (mc < 1) addChoice("Extermination de rats géants — 15 or",         () => lancerMission(0));
    if (mc < 2) addChoice("Escorte du marchand Tolbas — 25 or",           () => lancerMission(1));
    if (mc < 3) addChoice("La Bête de la Carrière — 50 or + armure",      () => lancerMission(2));
    if (mc < 4) addChoice("Le Mage Renégat de la Vieille Tour — 80 or",   () => lancerMission(3));
    if (mc >= 4) addLines(["Vous avez accompli toutes les missions disponibles."]);
    addChoice("Retourner en ville", () => processLieu(99));
}

function lancerMission(idx) {
    changerImage("combat_mission.jpg");
    const m = MISSIONS[idx];
    addLines([`── MISSION : ${m.titre} ──`, ...m.intro]);
    startCombat(m.ennemi[0], m.ennemi[1], m.ennemi[2], m.win);
}

// ==========================================
// TRAVAIL
// ==========================================
function travail() {
    changerImage("travail.jpg");
    addLines(["", "── LA ZONE DE TRAVAIL ──", "Des employeurs de toutes sortes cherchent de la main-d'œuvre."]);
    addChoice("Porter des sacs au marché — 6 or (facile, -1 PV)",                      () => processLieu(131));
    addChoice("Creuser des fossés pour les fortifications — 10 or (dur, -2 PV, -1 PA Max)", () => processLieu(132));
    addChoice("Garder la nuit aux portes de la ville — 14 or (risqué, combat possible)", () => processLieu(133));
    addChoice("Retourner en ville",                                                      () => processLieu(99));
}

function travailPorter() {
    changerImage("travail.jpg");
    s.OR += 6; s.PV -= 1;
    addLines(["", "Vous passez la journée à porter des sacs de grains sous un soleil de plomb. 6 pièces d'or (-1 PV)."]);
    if (s.PV <= 0) return declareDefeat("L'épuisement");
    addChoice("Continuer", () => processLieu(99));
}

function travailCreuser() {
    changerImage("travail.jpg");
    s.OR += 10; s.PV -= 2; s.maxPA = Math.max(s.maxPA - 1, 1); s.PA = Math.min(s.PA, s.maxPA);
    addLines(["", "Douze heures de creusage. Vos mains saignent. 10 pièces d'or (-2 PV, -1 PA Max)."]);
    if (s.PV <= 0) return declareDefeat("L'épuisement");
    addChoice("Continuer", () => processLieu(99));
}

function travailGarder() {
    changerImage("travail_garde.jpg");
    addLines(["", "Vous prenez votre poste aux portes nord de la ville à la tombée de la nuit."]);
    if (randint(1, 2) === 1) {
        s.OR += 14;
        addLines(["Un déserteur ivre tente de forcer le passage... il s'effondre sans combat. Quart tranquille. 14 pièces d'or."]);
        addChoice("Continuer", () => processLieu(99));
    } else {
        addLines(["Vers minuit, un espion du Mage Noir surgit et attaque !"]);
        startCombat("L'Espion du Mage Noir", 14, 3, () => {
            s.OR += 20;
            addLines(["", "Vous le livrez aux autorités. 20 pièces d'or."]);
            addChoice("Retour", () => processLieu(99));
        });
    }
}

// ==========================================
// TAVERNE
// ==========================================
function taverne() {
    changerImage("taverne.jpg");
    addLines(["", "── LA TAVERNE DU LOUP GRIS ──", "L'endroit est chaleureux et bruyant. Un ménestrel joue dans un coin.", "Que faites-vous ?"]);
    addChoice(`🎲 Jouer aux dés (mise min. 5 or) — Or : ${s.OR}`, () => processLieu(141));
    addChoice("👂 Écouter les rumeurs (3 or)",                      () => processLieu(142));
    addChoice("🍖 Commander un repas de roi (8 or, +6 PV)",         () => processLieu(143));
    addChoice("💪 Concours de bras de fer (5 or, PF décisif)",       () => processLieu(144));
    addChoice("Retourner en ville",                                   () => processLieu(99));
}

function gamesDes() {
    changerImage("taverne.jpg");
    if (s.OR < 5) { addLines(["", "Vous n'avez pas assez d'or pour jouer."]); addChoice("Retour", () => processLieu(140)); return; }
    addLines(["", "Vous vous installez à la table des dés. Combien misez-vous ?"]);
    [5, 10, 20, 40].filter(m => m <= s.OR).forEach(m => addChoice(`Miser ${m} pièces d'or`, () => lancerDes(m)));
    addChoice("Finalement, ne pas jouer", () => processLieu(140));
}

function lancerDes(mise) {
    s.OR -= mise;
    const monLancer = randint(1, 6) + randint(1, 6); const adverse = randint(2, 12);
    addLines(["", `Vous lancez les dés : ${monLancer}. Votre adversaire fait : ${adverse}.`]);
    if (monLancer > adverse)      { s.OR += mise * 2; addLines([`Vous gagnez ! +${mise * 2} pièces d'or.`]); }
    else if (monLancer === adverse) { s.OR += mise; addLines(["Égalité ! Vous récupérez votre mise."]); }
    else                            { addLines([`Vous perdez. -${mise} pièces d'or.`]); }
    addLines([`Or restant : ${s.OR}`]);
    addChoice("Rejouer", () => processLieu(141)); addChoice("Retour", () => processLieu(140));
}

function rumeurs() {
    changerImage("taverne.jpg");
    if (s.OR < 3) { addLines(["", "Pas assez d'or pour offrir une tournée."]); addChoice("Retour", () => processLieu(140)); return; }
    s.OR -= 3;
    const list = [
        "\"Le Mage Noir aurait une faiblesse : une gemme de lumière peut percer ses défenses...\"",
        "\"Méfiez-vous des Marécages Putrides. L'eau y est aussi perfide que l'air qu'on y respire...\"",
        "\"Le Mage Noir se nourrit des âmes des morts. Plus vous tardez, plus il devient puissant.\"",
        "\"Si vous croisez la Sorcière des Tourbières, ne la mettez pas en colère. Elle aime les devinettes...\"",
        "\"Un trésor fabuleux est caché dans la crypte sous la vieille tour. Celui qui l'a cherché n'est jamais revenu...\"",
        "\"Ne nagez jamais dans le Lac Noir. Quelque chose d'immense rôde sous la surface.\""
    ];
    addLines(["", "Vous offrez une tournée. Les langues se délient.", `Un vieux mercenaire chuchote : ${list[randint(0, 5)]}`]);
    addChoice("Retour", () => processLieu(140));
}

function repasRoi() {
    changerImage("taverne.jpg");
    if (s.OR < 8) { addLines(["", "Vous n'avez pas les moyens de vous offrir ce festin."]); addChoice("Retour", () => processLieu(140)); return; }
    s.OR -= 8; s.PV = Math.min(s.PV + 6, s.maxPV);
    addLines(["", "Un festin de roi : agneau rôti, pain chaud, fromage affiné et bière fraîche. (+6 PV)"]);
    addChoice("Retour", () => processLieu(140));
}

function brasDeFer() {
    changerImage("taverne.jpg");
    if (s.OR < 5)                    { addLines(["", "L'entrée coûte 5 pièces d'or."]); addChoice("Retour", () => processLieu(140)); return; }
    if (s.ville.brasDeFerAujourdhui) { addLines(["", "Les lutteurs refusent de vous affronter à nouveau aujourd'hui. Revenez demain."]); addChoice("Retour", () => processLieu(140)); return; }
    s.OR -= 5; s.ville.brasDeFerAujourdhui = true;
    const score = randint(1, 20) + s.PF;
    addLines(["", "Vous affrontez successivement plusieurs adversaires au bras de fer."]);
    if (score >= 18) {
        s.OR += 30;
        if (!s.ville.brasDeFerGagne) { s.PF += 1; s.ville.brasDeFerGagne = true; addLines(["Vous écrasez tout le monde ! 30 pièces d'or. +1 PF permanent !"]); }
        else                          { addLines(["Vous confirmez votre titre. 30 pièces d'or !"]); }
    } else if (score >= 12) { s.OR += 12; addLines(["Vous arrivez en demi-finale. 12 pièces d'or de consolation."]); }
    else { addLines(["Votre premier adversaire vous tord le bras en quelques secondes. Humiliant."]); }
    addChoice("Retour", () => processLieu(140));
}

// ==========================================
// NUIT & DÉPART
// ==========================================
function nuit() {
    changerImage("nuit.jpg");
    addLines(["", "La nuit tombe sur Kair Morten. Les torches s'allument dans les rues.", "Où dormez-vous cette nuit ?"]);
    addChoice("Chambre à l'auberge du Griffon Boiteux (5 or) — Restaure vos Max PV et PA", () => processLieu(35));
    addChoice("Dormir dehors dans une ruelle (gratuit) — +2 PV",                            () => processLieu(36));
}

function quitterVille() {
    changerImage("depart_ville.jpg");
    addLines([
        "", "────────────────────────────────────────────────────────────────────────────────",
        "Vous bouclez votre sac, vérifiez vos armes une dernière fois, et prenez une grande inspiration.",
        "Les portes massives de Kair Morten s'ouvrent devant vous dans un grondement sourd.",
        "Au-delà, les Terres Hostiles vous attendent. Le chemin vers la forteresse du Mage Noir",
        "commence par la traversée des tristement célèbres Marécages Putrides.", "",
        `Vous quittez la civilisation avec : ${s.PV} PV, ${s.PA} PA, ${s.PF} PF, ${s.OR} pièces d'or.`,
        `Victoires en arène : ${s.ville.areneVictoires}. Missions accomplies : ${s.ville.missionsCompletes}.`,
        "────────────────────────────────────────────────────────────────────────────────"
    ]);
    addChoice("Pénétrer dans les Marécages Putrides", () => processLieu(201), "btn-main");
}
