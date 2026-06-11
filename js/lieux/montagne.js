function montagne() {
    changerImage("montagne.jpg");
    addLines(["", "Vous commencez à grimper laborieusement. La fatigue commence à se faire sentir.", "Vous apercevez finalement une caverne au loin."]);
    addChoice("Aller à la caverne pour passer la nuit", () => processLieu(4));
    addChoice("Passer votre chemin et continuez l'ascension", () => { s.montagneFaite = true; processLieu(7); });
}

function caverne() {
    changerImage("caverne.jpg");
    addLines(["", "Vous avancez dans les ténèbres de la caverne. Le soleil couchant fait refléter la paroi de l'entrée.", "Vous commencez à aménager un coin pour passer la nuit lorsque vous entendez un grognement sinistre dans votre dos.", "Au moment où vous vous retournez, terrifié, vous voyez un ours vous sauter dessus."]);
    if (s.corde) addLines(["", "Vous avez une corde à votre ceinture. En un éclair, vous songez à la jeter autour des pattes de la bête pour la faire trébucher."]);
    if (s.PA >= randint(1, 24)) addLines(["", "Vous parez de justesse l'énorme bête avec votre épée.", "Vous entendez ses longues griffes riper contre la paroi à deux centimètres de votre épaule."]);
    else { addLines(["", "Vous n'avez pas le temps de parer l'énorme bête.", "Ses griffes s'enfoncent dans la chair de votre épaule, vous arrachant un cri de douleur (-3 PV)."]); s.PV -= 3; }
    if (s.PV <= 0) return declareDefeat(null);
    if (s.corde) {
        addLines(["", "Voulez-vous utiliser votre corde pour entraver l'ours avant le combat ?"]);
        addChoice("Utiliser la corde pour entraver l'ours (l'affaiblir de 3 PV et lui réduire les dégâts de 1)", () => {
            addLines(["", "D'un geste précis, vous lancez la corde autour des pattes avant de l'ours.", "La bête trébuche et s'emmêle, vous donnant un avantage décisif pour le combat !"]);
            s.corde = false; startCombat("L'ours (entravé)", 7, 1, onWinOurs);
        });
        addChoice("Ne pas utiliser la corde et combattre directement", () => startCombat("L'ours", 10, 2, onWinOurs));
    } else {
        startCombat("L'ours", 10, 2, onWinOurs);
    }
}

function onWinOurs() {
    changerImage("onWinOurs.jpeg");
    s.inventory.armor = { bonus: 4, hasIt: true };
    addLines(["", "Avec la fourrure de l'ours, vous fabriquez une armure qui vous rapportera 4 PV Max si vous l'équipez lors d'un combat.", "Vous vous reposez dignement après cet affrontement.", "Le lendemain matin, vous reprenez votre chemin, revigoré par ce sommeil amplement mérité.", "Après de longues heures d'effort, vous arrivez enfin au sommet de la montagne. Le vent frais du Nord fouette votre visage.", "Cependant, vous sentez votre ventre gargouiller. Vous n'avez plus une minute à perdre, il faut vous mettre en quête de nourriture."]);
    addChoice("Aller à la chasse aux marmottes à l'aide de pièges", () => processLieu(9));
    addChoice("Aller à la pêche dans le lac",                        () => processLieu(10));
    addChoice("Prendre une large route dégagée allant tout droit",   () => { s.montagneFaite = true; processLieu(19); });
    addChoice("Emprunter le passage escarpé vers le sommet",         () => processLieu(161));
}

function montagneEpuise() {
    changerImage("onWinOurs.jpeg");
    s.PA = Math.max(1, s.PA - 2);
    addLines(["", "Vous reprenez votre chemin. La pause attendra.", "Après de longues heures d'effort, vous arrivez enfin au sommet de la montagne. Le vent frais du Nord fouette votre visage.", "Épuisé, vous vous écroulez au sol et la fatigue accumulée vous fait perdre connaissance (-2 PA).", "Lorsque vous ouvrez les yeux, le soleil est déjà haut dans le ciel.", "Cependant, vous sentez votre ventre gargouiller. Vous n'avez plus une minute à perdre, il faut vous mettre en quête de nourriture."]);
    addChoice("Aller à la chasse aux marmottes à l'aide de pièges", () => processLieu(9));
    addChoice("Aller à la pêche dans le lac",                        () => processLieu(10));
    addChoice("Prendre une large route dégagée allant tout droit",   () => { s.montagneFaite = true; processLieu(19); });
    addChoice("Emprunter le passage escarpé vers le sommet",         () => processLieu(161));
}

function chasser() {
    changerImage("chasser.jpg");
    s.PV -= 1; s.PA = Math.max(1, s.PA - 1);
    addLines(["", "Vous installez des pièges à des endroits judicieux. Cependant 2 heures plus tard les pièges sont toujours vides.", "Vous réalisez alors que vous êtes stupide : les marmottes hibernent en hiver. Quel piètre chasseur vous faites !", "Vous décidez donc d'aller pêcher sur le lac, malgré votre ventre souffrant (-1 PV et -1 PA).", "Vous apercevez progressivement les plages de cailloux et la surface étincelante.", "Vous réalisez alors que le lac est entièrement recouvert d'une épaisse couche de glace."]);
    if (s.PV <= 0) return declareDefeat(null);
    addChoice("Continuer vers le lac",                              () => processLieu(16));
    addChoice("Prendre une large route dégagée allant tout droit", () => { s.montagneFaite = true; processLieu(19); });
    addChoice("Emprunter le passage escarpé vers le sommet",       () => processLieu(161));
}

function pecher() {
    changerImage("lac.jpg");
    addLines(["", "Vous vous dirigez vers le lac. Vous apercevez progressivement ses plages de cailloux et sa surface étincelante.", "Vous réalisez alors que cette dernière est entièrement recouverte d'une épaisse couche de glace."]);
    addChoice("Continuer vers le lac",                              () => processLieu(16));
    addChoice("Aller à la chasse aux marmottes",                   () => processLieu(9));
    addChoice("Prendre une large route dégagée allant tout droit", () => { s.montagneFaite = true; processLieu(19); });
    addChoice("Emprunter le passage escarpé vers le sommet",       () => processLieu(161));
}

function lac() {
    changerImage("pecher.jpg");
    s.PV = Math.min(s.PV + 2, s.maxPV);
    addLines(["", "Vous décidez de ramasser un caillou, ainsi qu'un bâton et quelques insectes qui vous serviront d'appâts.", "Avec le bâton et votre corde, vous confectionnez une canne à pêche, au bout de laquelle vous attachez les insectes et vers de terre.", "Vous brisez la glace avec le caillou, et commencez à attendre patiemment que quelque chose morde.", "Au bout d'une demi-heure, vous avez attrapé 2 poissons, vous offrant la certitude d'un repas consistant (+2 PV)."]);
    if (randint(1, 5) === 1) {
        s.inventory.sword = { damage: 5, poisoned: false, hasIt: true, sacred: true };
        addLines(["", "Alors que vous vous apprêtez à remonter votre canne pour la dernière fois, vous sentez que le fil tend de manière inhabituelle.", "Vous réalisez alors que l'objet que vous avez remonté est une épée sacrée, infligeant -5 PV.", "Cette lame bénie octroie un bonus d'expérience à chaque coup réussi (1 chance sur 3).", "Vous la rangez dans votre fourreau et lancez votre ancienne lame au loin."]);
    }
    addChoice("Prendre une large route dégagée allant tout droit", () => { s.montagneFaite = true; processLieu(19); });
    addChoice("Emprunter le passage escarpé vers le sommet",       () => processLieu(161));
}

function eboulement() {
    changerImage("eboulement.jpg");
    let roll = randint(1, 30);
    addLines(["", "Vous vous engagez sur un sentier rocailleux et très pentu.", "Soudain, un grondement sourd résonne au-dessus de vous. Des rochers se détachent de la paroi !"]);
    if (s.PA >= roll) {
        addLines(["", "Grâce à votre incroyable agilité, vous esquivez l'éboulement de justesse et atteignez le sommet sain et sauf !"]);
        addChoice("Continuer votre ascension",                          () => processLieu(17));
        addChoice("Rebrousser chemin et prendre la route dégagée",     () => { s.montagneFaite = true; processLieu(19); });
    } else {
        s.PV -= 1; s.PA = Math.max(1, s.PA - 1);
        addLines(["", "Vous n'êtes pas assez rapide. Un rocher vous heurte violemment l'épaule, et vous trébuchez dans la poussière (-1 PV, -1 PA)."]);
        if (s.PV <= 0) return declareDefeat("L'éboulement");
        addChoice("Continuer votre ascension",                      () => processLieu(17));
        addChoice("Rebrousser chemin et prendre la route dégagée", () => { s.montagneFaite = true; processLieu(19); });
    }
}

function temple() {
    changerImage("temple.jpg");
    addLines(["", "Toujours avec la même volonté, vous poursuivez votre route à travers un sentier escarpé.", "Épuisé, mais déterminé, vous marchez à travers la montagne, et les nuages commencent à se dissiper dans le ciel.", "Malgré le fait que votre priorité capitale reste la survie, vous avez la certitude que ni la fatigue, ni les blessures ne vous arrêteront.", "Pressant le pas, vous finissez par apercevoir au loin une maison, promesse d'un bon repas et d'un sommeil confortable.", "Le bâtiment se révèle être une sorte de dôme doré. Vous vous approchez, en cherchant un quelconque moyen d'y pénétrer.", "En tournant autour de l'étrange bâtiment, vous trouvez enfin la porte d'entrée, bloquée par un système de sécurité requérant un mot de passe.", "", "Quel est ce mot de passe (en lettres majuscules) ?"]);
    const wrapper = document.createElement('div'); wrapper.className = "input-group";
    const inp = document.createElement('input'); inp.type = "text"; inp.placeholder = "Mot de passe...";
    const btn = document.createElement('button'); btn.className = "btn-main"; btn.style.margin = "0"; btn.innerText = "→";
    btn.onclick = () => {
        const v = inp.value.trim().toUpperCase(); clearControls();
        if (v === "TEMPLE") {
            s.PV = Math.min(s.PV + 3, s.maxPV); s.PA = Math.min(s.PA + 3, s.maxPA); s.EXP += 12;
            addLines(["", "La porte s'ouvre dans un grincement, faisant apparaître un couloir faiblement éclairé.", "Vous entrez à l'intérieur de l'édifice, et traversez le long couloir.", "Il dessert une immense salle, au milieu de laquelle trône une table imposante.", "Vos yeux se mettent à briller : des plats et des mets délicieux s'étalent à foison, tous plus appétissants les uns que les autres.", "Vous vous faites un copieux festin, vous permettant de recharger vos points (+ 3PV et +3 PA).", "Une fois le repas terminé, et après vous être reposé, vous sortez d'ici, le cœur joyeux et le ventre plein."]);
        } else {
            addLines(["", "Malheureusement, la porte reste fermée.", "Vous vous éloignez, déçu de n'avoir pu trouver refuge dans cet étrange bâtiment."]);
        }
        addChoice("Continuer", () => { s.montagneFaite = true; processLieu(19); });
    };
    wrapper.appendChild(inp); wrapper.appendChild(btn); uiControls.appendChild(wrapper);
}
