function desert() {
    changerImage("desert.jpg");
    if (s.lieu === 21) { s.corde = false; s.hasBache = true; }
    addLines(["", "Après avoir fait ce choix crucial, vous poursuivez votre quête avec détermination.", "La chaleur commence à se faire sentir, et toute trace de vie disparaît.", "Au loin devant vous s'étalent les dunes à perte de vue.", "Un sentier délimité, effacé par le vent et les années, continue sur votre droite."]);
    addChoice("Continuer tout droit vers les dunes",    () => processLieu(22));
    addChoice("Continuer à droite vers le sentier",    () => processLieu(23));
}

function nomade() {
    changerImage("nomade.jpg");
    if (s.lieu === 23) s.dunes += 1;
    s.PV -= 1;
    addLines(["", "Ainsi vous avancez dans cette direction, malgré la chaleur qui s'intensifie.", "Après quelques heures de marche étouffantes (- 1PV), vous faites la rencontre d'un nomade du désert à dos de dromadaire, faiblement armé."]);
    if (s.PV <= 0) return declareDefeat(null);
    addChoice("Sortir votre arme et combattre",  () => processLieu(24));
    addChoice("Établir la communication",        () => processLieu(25));
}

function combatNomade() {
    changerImage("nomade.jpg");
    startCombat("Le nomade", 6, 1, () => {
        s.OR += 1; s.PV -= 3;
        addLines(["", "En fouillant son cadavre, vous trouvez 1 pièce d'or, ainsi qu'une bouteille d'eau malheureusement vide.", "Les effets de la déshydratation commencent à se faire sentir (-2 PV).", "Vous enfourchez votre nouvelle monture et continuez à travers le désert.", "Un énorme scorpion mutant, surgissant de l'obscurité, vous renverse du dos de votre dromadaire."]);
        testChuteDromadaire();
    });
}

function echangeNomade() {
    changerImage("nomade.jpg");
    s.PV -= 1; s.PV = Math.min(s.PV + 2, s.maxPV);
    addLines(["", "Vous vous approchez en lui faisant des signes de main. Le vagabond vous confie une bouteille d'eau.", "Vous buvez goulûment, ravi d'avoir évité la déshydratation. (+2 PV)", "Il vous offre également son dromadaire, que vous acceptez avec de chaleureux remerciements.", "Un énorme scorpion mutant, surgissant de l'obscurité, vous renverse du dos de votre dromadaire."]);
    testChuteDromadaire();
}

function testChuteDromadaire() {
    const roll = randint(1, 20);
    if (s.PA >= roll) addLines(["", "Instinctivement, vous roulez sur le côté et amortissez parfaitement votre chute ! Vous vous relevez sans une égratignure."]);
    else { s.PV -= 1; addLines(["", "Vous chutez lourdement sur le sol sableux (-1 PV). Étourdi, vous vous relevez en grimaçant."]); }
    if (s.PV <= 0) return declareDefeat(null);
    addChoice("Affronter la créature", () => processLieu(26));
}

function scorpion() {
    changerImage("scorpion.jpg");
    startCombat("Le scorpion mutant", s.dunes * 6, s.dunes, () => {
        s.inventory.poison = 2;
        addLines(["", "Vous récupérez le venin de la créature dans la gourde du nomade, remontez sur votre dromadaire et reprenez la route.", "Si vous imbibez une de vos armes de ce venin lors d'un combat, l'attaque empoisonnera votre adversaire, lui infligeant -1 PV par tour jusqu'à sa mort.", "La dose récupérée vous permettra d'imbiber deux de vos armes."]);
        if (s.dunes === 2) { addLines(["", "Le trajet s'éternise et impossible de trouver de la nourriture (-2 PV)."]); s.PV -= 2; }
        if (s.PV <= 0) return declareDefeat(null);
        addLines(["", "Alors que, blessé, vous continuez d'avancer, vous apercevez un oasis au milieu des dunes."]);
        addChoice("Continuer tout droit vers l'oasis",         () => processLieu(27));
        addChoice("Continuer à droite et s'éloigner des dunes", () => processLieu(28));
    });
}

function oasis() {
    changerImage("oasis.jpg");
    if (s.lieu === 27) {
        s.PV = Math.min(s.PV + 3, s.maxPV);
        s.inventory.dagger = { damage: 1, poisoned: false, magicRegen: true, hasIt: true };
        addLines(["", "Vous guidez votre dromadaire vers l'oasis. Des palmiers chargés de dattes et une source d'eau limpide.", "Vous buvez à satiété et cueillez des dattes (+3 PV).", "À l'ombre des palmiers, vous trouvez les ossements d'un aventurier moins chanceux.", "Parmi ses affaires, une étrange dague dont la lame émet une faible lueur écarlate.", "C'est une arme vampirique ! Elle n'inflige qu'1 dégât (plus vos PF), mais draine l'essence vitale de l'ennemi pour vous soigner de 1 PV à chaque coup porté.", "Vous la glissez dans votre ceinture."]);
    } else {
        s.PV = Math.min(s.PV - 1 + 5, s.maxPV); s.OR += 8;
        addLines(["", "Vous longez les dunes par la droite (-1 PV), évitant les zones de sables mouvants.", "Au détour d'un rocher, un caravanier mort de soif, 8 pièces d'or et une fiole d'élixir de vitalité dans ses sacoches.", "Vous buvez l'élixir sur le champ : une chaleur bienfaisante (+5 PV). +8 or."]);
    }
    if (s.PV <= 0) return declareDefeat(null);
    addChoice("Continuer", () => processLieu(29));
}

function tempeteSable() {
    changerImage("tempete.jpg");
    addLines(["", "Vous progressez depuis plusieurs heures lorsque le ciel vire soudainement au jaune orangé.", "Un rugissement sourd monte de l'horizon : une tempête de sable approche à toute vitesse.", "Vous n'avez que quelques instants pour réagir."]);
    if (s.hasBache) {
        addChoice("🧢 Vous abriter sous votre bâche (meilleure protection)", () => {
            addLines(["", "Vous déployez votre grande bâche et vous en enveloppez entièrement.", "La bâche résiste admirablement. Vous émergez sans une égratignure.", "Votre dromadaire s'est enfui dans la tempête. Vous êtes désormais à pied.", "Au loin, les premiers contreforts des Falaises de Keth se dessinent."]);
            s.hasBache = false;
            addChoice("Continuer vers les falaises", () => processLieu(33));
        });
    }
    addChoice("Vous allonger derrière votre dromadaire et vous couvrir", () => processLieu(30));
    addChoice("Foncer à toute allure pour tenter de la devancer",        () => processLieu(31));
    addChoice("Chercher un abri rocheux à proximité",                    () => processLieu(32));
}

function tempeteAbri() {
    changerImage("tempete.jpg");
    s.PV -= 1;
    addLines(["", "Vous vous aplatissez derrière votre dromadaire. Le sable s'infiltre partout (-1 PV).", "Votre dromadaire s'est enfui dans la tempête. Vous êtes désormais à pied.", "Les Falaises de Keth se profilent au loin."]);
    if (s.PV <= 0) return declareDefeat("La tempête de sable");
    addChoice("Continuer vers les falaises", () => processLieu(33));
}

function tempeteFuite() {
    changerImage("tempete.jpg");
    s.PV -= 3;
    addLines(["", "La tempête est bien plus rapide que vous. Elle vous rattrape et vous projette à terre (-3 PV).", "Votre dromadaire disparaît. Vous vous relevez, meurtri mais vivant.", "Les Falaises de Keth se dessinent sous un ciel enfin dégagé."]);
    if (s.PV <= 0) return declareDefeat("La tempête de sable");
    addChoice("Continuer vers les falaises", () => processLieu(33));
}

function tempeteRocher() {
    changerImage("tempeteabris.jpg");
    s.OR += 5; s.maxPA += 1; s.PA += 1;
    addLines(["", "Votre instinct vous guide vers un amas rocheux. Vous vous faufilez juste à temps dans une crevasse.", "Dans la crevasse, un vieux feu de camp abandonné. Sous une pierre plate : 5 pièces d'or et un parchemin.", "C'est une carte partielle des Falaises de Keth. (+1 PA Max)", "Une fois la tempête passée, vous reprenez la route."]);
    addChoice("Continuer vers les falaises", () => processLieu(33));
}

function falaisesKeth() {
    changerImage("falaise.jpg");
    addLines(["", "Les Falaises de Keth se dressent devant vous comme une muraille naturelle de grès rouge sang.", "Un chemin taillé à même la roche serpente le long de la falaise.", "Alors que vous commencez l'ascension, une ombre immense vous survole en poussant un cri strident.", "Un Griffon des sables fond sur vous depuis les hauteurs !"]);
    startCombat("Le Griffon des sables", 18, 3, () => {
        s.inventory.goldenFeather = true;
        addLines(["", "La créature s'effondre dans un fracas de plumes et de griffes.", "Dans son nid, une plume d'or pur — un trophée rare qui vaut une fortune.", "Au sommet des falaises : une vaste plaine et, au bout, les tours dorées de KAIR MORTEN."]);
        addChoice("Descendre les falaises et foncer vers la ville", () => processLieu(34));
    });
}
