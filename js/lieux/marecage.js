function entreeMarecage() {
    changerImage("marecage.jpg");
    addLines(["", "Le paysage change radicalement. Des arbres morts, tordus comme des bras agonisants.", "Une brume épaisse, teintée d'un vert maladif, rampe sur le sol fangeux.", "Vous faites vos premiers pas dans les Marécages Putrides.", "À gauche, les vestiges d'une ancienne passerelle de bois s'enfoncent dans le brouillard.", "À droite, une immense étendue de boue dense qu'il vous faudrait traverser à gué."]);
    addChoice("Emprunter la passerelle de planches pourries",   () => processLieu(202));
    addChoice("S'enfoncer directement dans la vase épaisse",   () => processLieu(203));
}

function cheminPlanches() {
    changerImage("marecage.jpg");
    addLines(["", "Vous vous engagez prudemment sur les planches glissantes. Le bois craque sinistrement.", "Soudain, une planche cède, vous projetant vers les eaux troubles !"]);
    let roll = randint(1, 25);
    if (s.PA >= roll) {
        addLines(["", "Dans un élan de grâce surhumaine, vous bondissez sur le poteau suivant juste à temps !"]);
        addChoice("Continuer d'avancer dans la brume", () => processLieu(204));
    } else {
        s.PV -= 2; s.PA = Math.max(1, s.PA - 1);
        addLines(["", "Vous tombez dans l'eau vaseuse ! Des sangsues géantes s'accrochent à votre chair (-2 PV, -1 PA)."]);
        if (s.PV <= 0) return declareDefeat("Les eaux sangsues du marais");
        addChoice("Vous relever péniblement et continuer", () => processLieu(204));
    }
}

function vaseEpaisse() {
    changerImage("marecage.jpg");
    s.PV -= 1; s.PA = Math.max(1, s.PA - 1);
    addLines(["", "La boue vous monte jusqu'aux cuisses. Chaque pas est une torture (-1 PV, -1 PA).", "Au milieu de cet effort titanesque, vous butez contre un cadavre.", "Une sacoche en cuir semble intacte à sa ceinture. L'eau autour bouillonne étrangement..."]);
    if (s.PV <= 0) return declareDefeat("L'épuisement des marais");
    addChoice("Fouiller le cadavre", () => {
        if (randint(1, 2) === 1) {
            s.inventory.potions += 1; s.OR += 12;
            addLines(["", "Vous arrachez la sacoche avant que rien ne surgisse : 12 pièces d'or et une potion de soins !"]);
            addChoice("Continuer vers les profondeurs du marais", () => processLieu(204));
        } else {
            addLines(["", "La main du cadavre se referme violemment sur votre poignet ! Un Noyé du Marais émerge de la vase !"]);
            startCombat("Le Noyé du Marais", 15, 3, () => {
                addLines(["", "Le cadavre maudit retourne à la fange. Vous récupérez 5 pièces d'or."]);
                s.OR += 5;
                addChoice("Continuer vers les profondeurs du marais", () => processLieu(204));
            });
        }
    });
    addChoice("Ignorer et presser le pas vers la terre ferme", () => {
        addLines(["", "La prudence est mère de sûreté. Vous atteignez un îlot de terre meuble, épuisé mais entier."]);
        addChoice("Continuer vers les profondeurs du marais", () => processLieu(204));
    });
}

function arbrePendu() {
    changerImage("sorciere.jpg");
    addLines(["", "La brume s'entrouvre pour dévoiler une clairière lugubre, dominée par un saule pleureur colossal.", "Ses branches soutiennent des dizaines de cages de fer rouillé avec des ossements humains.", "Au pied des racines tortueuses, un feu verdâtre crépite sous un immense chaudron.", "Une créature hideuse touille la mixture. C'est l'Ermite des Tourbières.", "Ses yeux laiteux se fixent sur vous. « Héhéhé... Tu cherches le Lac Noir, n'est-ce pas ? »", "« Réponds à ma devinette, et je t'offrirai un baume pour survivre aux vapeurs mortelles du Cœur Putride. Échoue, et tes os rejoindront mes cages. »"]);
    addChoice("Accepter de répondre à la devinette", () => processLieu(205));
    addChoice("Sortir votre arme et l'attaquer",      () => processLieu(206));
}

function enigmeSorciere() {
    changerImage("sorciere.jpg");
    addLines(["", "La Mégère révèle ses dents noircies dans un sourire malsain.", "« Écoute bien, mortel... »", "« Je n'ai pas de poumons, mais j'ai cruellement besoin d'air. »", "« Je n'ai pas de bouche, mais l'eau me tue instantanément. »", "« Qui suis-je ? »", "", "(Écrivez votre réponse en majuscules)"]);
    const wrapper = document.createElement('div'); wrapper.className = "input-group";
    const inp = document.createElement('input'); inp.type = "text"; inp.placeholder = "Votre réponse...";
    const btn = document.createElement('button'); btn.className = "btn-main"; btn.style.margin = "0"; btn.innerText = "→";
    btn.onclick = () => {
        const v = inp.value.trim().toUpperCase(); clearControls();
        if (v === "FEU" || v === "LE FEU") {
            s.inventory.onguent = true;
            addLines(["", "La créature pousse un cri strident, moitié de rage, moitié d'admiration.", "Elle vous tend une petite fiole d'onguent verdâtre. « Étale ça sur ton visage quand l'air deviendra poison. »"]);
            addChoice("Continuer vers le Lac Noir", () => processLieu(207));
        } else {
            addLines(["", "« FAAAAUX ! » hurle-t-elle en révélant un corps recouvert d'écailles et des serres effroyables.", "« Tes os sont à moi ! »"]);
            processLieu(206);
        }
    };
    wrapper.appendChild(inp); wrapper.appendChild(btn); uiControls.appendChild(wrapper);
}

function combatSorciere() {
    changerImage("sorciere.jpg");
    startCombat("La Sorcière des Tourbières", 28, 4, () => {
        addLines(["", "Dans un dernier râle agonisant, la sorcière s'effondre dans son propre chaudron.", "En fouillant sa paillasse immonde : 20 pièces d'or et l'Onguent de la Tourbière."]);
        s.OR += 20; s.inventory.onguent = true;
        addChoice("Continuer vers le Lac Noir", () => processLieu(207));
    });
}

function lacNoir() {
    changerImage("lac_noir.jpg");
    addLines(["", "Le sentier boueux débouche sur une immense nappe d'eau stagnante : le Lac Noir. Sa surface, parfaitement lisse, est d'un noir d'encre oppressant.", "Sur la berge, à moitié pourrie, se trouve une petite barque à rames, percée."]);
    if (s.PF >= 6) {
        addLines(["Vos muscles saillants vous permettent d'envisager de ramer malgré les avaries de la barque."]);
        addChoice("Prendre la barque en forçant sur les rames (PF élevés)", () => {
            addLines(["", "Vous ramez avec une puissance herculéenne. Mais à mi-chemin, l'eau bouillonne frénétiquement !"]);
            addChoice("Se préparer à l'impact", () => processLieu(208));
        });
    }
    addChoice("Tenter de nager à travers l'eau poisseuse", () => {
        s.PV -= 3;
        addLines(["", "L'eau est épaisse comme de l'huile. Une mâchoire monstrueuse vous attrape la jambe (-3 PV) !"]);
        if (s.PV <= 0) return declareDefeat("Le prédateur du Lac Noir");
        addLines(["Vous parvenez à vous débattre et à atteindre un banc de vase peu profond !"]);
        addChoice("Affronter le monstre", () => processLieu(208));
    });
}

function monstreLac() {
    changerImage("hydre.jpg");
    addLines(["", "L'eau explose et une créature gigantesque émerge : L'Hydre Fangeuse !"]);
    startCombat("L'Hydre Fangeuse", 45, 5, () => {
        s.inventory.armor = { bonus: 12, hasIt: true };
        addLines(["", "La monstruosité s'affaisse. En découpant ses écailles, vous vous confectionnez une armure (+12 PV Max équipable).", "Haletant et couvert de fange, vous atteignez enfin l'autre rive du lac."]);
        addChoice("S'enfoncer dans le Cœur Putride", () => processLieu(209));
    });
}

function coeurPutride() {
    changerImage("poison.jpg");
    addLines(["", "Vous pénétrez dans la zone la plus ancienne et corrompue des marais : le Cœur Putride.", "Ici, la brume verte n'est plus seulement aveuglante, elle est caustique."]);
    if (s.inventory.onguent) {
        addLines(["", "C'est le moment d'utiliser le présent de la sorcière.", "Vous enduisez généreusement votre visage de l'onguent. Les gaz toxiques glissent sur vous sans vous brûler les poumons.", "Vous traversez cette zone de mort totalement indemne !"]);
    } else {
        s.PV -= 4;
        addLines(["", "Vos poumons crient au martyre. Vous êtes obligé d'inspirer un gaz mortel.", "Vous crachez du sang et titubez à travers le brouillard (-4 PV)."]);
    }
    if (s.PV <= 0) return declareDefeat("Les vapeurs caustiques du Cœur Putride");
    addChoice("Tituber hors du nuage toxique", () => processLieu(210));
}

function autelOublie() {
    changerImage("autel.jpg");
    addLines(["", "Le brouillard commence enfin à s'éclaircir. Devant vous se dresse un autel de pierre noire, parfaitement lisse.", "L'autel palpite d'une étrange énergie sombre. Une inscription indique qu'un sacrifice de sang accordera la vigueur nécessaire."]);
    addChoice("Faire couler votre sang sur l'autel (-2 PV) pour un bonus de Force (+2 PF)", () => {
        s.PV -= 2; s.PF += 2;
        addLines(["", "Une onde de puissance brute envahit vos muscles (-2 PV, +2 PF)."]);
        if (s.PV <= 0) return declareDefeat("L'hémorragie rituelle");
        addChoice("Reprendre la route", () => processLieu(211));
    });
    addChoice("Faire couler votre sang sur l'autel (-2 PV) pour un bonus d'Agilité (+2 PA Max)", () => {
        s.PV -= 2; s.maxPA += 2; s.PA += 2;
        addLines(["", "Vos sens s'aiguisent de façon surnaturelle (-2 PV, +2 PA Max)."]);
        if (s.PV <= 0) return declareDefeat("L'hémorragie rituelle");
        addChoice("Reprendre la route", () => processLieu(211));
    });
    addChoice("Ignorer cette sorcellerie impie et poursuivre", () => {
        addLines(["", "Vous vous détournez de cet autel maudit. Votre âme vous appartient."]);
        addChoice("Reprendre la route", () => processLieu(211));
    });
}

function sortieMarecage() {
    changerImage("forteresse.jpg");
    addLines([
        "", "────────────────────────────────────────────────────────────────────────────────",
        "Le sol spongieux laisse soudainement place à de la roche dure et coupante.",
        "La brume, comme repoussée par une force invisible, se dissipe totalement dans votre dos.",
        "Vous vous tenez au bord d'un gouffre abyssal, d'où s'élèvent des lueurs rougeoyantes.",
        "De l'autre côté du précipice, dominant un paysage de désolation volcanique, s'élève une forteresse titanesque en obsidienne pure.",
        "Des éclairs pourpres déchirent le ciel charbonneux au-dessus de la plus haute tour.", "",
        "Vous avez survécu aux Marécages Putrides. Le domaine du Mage Noir se dresse enfin devant vous.",
        "────────────────────────────────────────────────────────────────────────────────"
    ]);
    s.isPlaying = false;
    const btn = document.createElement('button'); btn.className = "btn-main"; btn.innerText = "A SUIVRE - REJOUER"; btn.onclick = startGame;
    uiControls.appendChild(btn);
}
