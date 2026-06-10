function foret() {
    changerImage("foret.jpg");
    s.PV -= 1;
    addLines(["", "Vous vous enfoncez petit à petit à travers l'épaisse végétation sombre et humide.", "Après avoir marché 3 heures au milieu des moustiques assoiffés de sang et trébuché à travers d'innombrables racines (-1 PV),", "vous n'avez plus qu'une idée en tête : sortir de cette jungle oppressante.", "Vous arrivez à un croisement."]);
    if (s.PV <= 0) return declareDefeat(null);
    addChoice("Tourner à droite sur une belle route entretenue",    () => processLieu(11));
    addChoice("Tourner à gauche en direction d'un sombre sentier de boue", () => processLieu(12));
}

function foretGauche() {
    changerImage("gobelin.jpg");
    addLines(["", "Vous avancez vaillamment dans cette direction, le cou baigné d'une chaleur timide.", "Au bout de quelques kilomètres, une petite créature s'approche docilement de vous. Elle semble vous observer."]);
    addChoice("Tirer votre arme pour l'attaquer",                        () => processLieu(13));
    addChoice("Tenter d'établir la communication avec cette créature",   () => processLieu(14));
    addChoice("Continuer votre chemin",                                  () => suiteForetApresDealer());
}

function combatGobelin() {
    changerImage("gobelin.jpg");
    s.g = 0;
    addLines(["", "Vous sortez votre épée de son étui, et armez votre bras afin de lui porter un coup fatal.", "Mais le gobelin, au moment même où la lame allait le trancher en deux, esquive habilement l'arme et détale dans la forêt en ricanant.", "Vous êtes surpris par cette réaction inattendue, mais reprenez vos esprits et décidez d'aller de l'avant."]);
    addChoice("Continuer", () => suiteForetApresDealer());
}

function dealChampignons() {
    changerImage("gobelin.jpg");
    addLines(["", "Vous vous avancez vers le gobelin.", "Ce dernier sort alors de dessous son manteau une panoplie d'objets à l'apparence douteuse, en s'exclamant : \"Tu veux des champignons ?\".", "Ces champignons aux nombreux bienfaits vous coûteront 2 pièces d'or par unité, mais vous permettront de regagner 2 PV et 1 PA si vous les mangez lors d'un combat.", `(Or disponible : ${s.OR}) — Combien en prenez-vous ?`]);
    const max = Math.floor(s.OR / 2);
    for (let i = 0; i <= Math.min(max, 6); i++) {
        addChoice(`${i} champignon(s)`, () => {
            if (i === 0) {
                addLines(["", "Le gobelin s'en va, déçu de ne pas avoir pu commercer avec vous."]);
            } else if (i * 2 > s.OR) {
                s.OR = 0; s.g = 0;
                addLines(["", "Le gobelin s'insurge : \"Vous avez tenté de m'arnaquer !\"", "Il s'enfuit et vous réalisez que votre bourse a été subtilisée.", "Vous reprenez alors votre chemin, encore plus pauvre et démuni que vous l'étiez auparavant."]);
            } else {
                s.inventory.mushrooms += i; s.OR -= i * 2; s.g = 2;
                addLines(["", "Le gobelin s'en va en sifflotant, ravi de vous avoir extorqué quelques pièces."]);
            }
            addChoice("Continuer", () => suiteForetApresDealer());
        });
    }
}

function suiteForetApresDealer() {
    s.gobelinFait = true;
    if (!s.banditsFait) processLieu(11);
    else { s.foretFaite = true; processLieu(19); }
}

function bandits() {
    changerImage("bandit.jpg");
    addLines(["", "Vous continuez votre chemin dans cette direction, et le sentier s'élargit.", "Vous avancez, réjoui de pouvoir enfin progresser sans trébucher ni vous faire fouetter par les basses branches.", "Cependant, cette paix intérieure ne dura pas longtemps : le chemin se rétrécit à quelques mètres de vous.", "Vous vous arrêtez, hésitant, lorsqu'un groupe de 3 bandits vous saute brusquement dessus !"]);
    const roll = randint(1, 20);
    if (s.PA >= roll) { addLines(["", "Votre instinct de guerrier entre en jeu ! Vous esquivez l'attaque superficiellement (-1 PV)."]); s.PV -= 1; }
    else              { addLines(["", "Vous n'avez pas le temps de réagir. Les bandits vous plaquent violemment au sol (-2 PV)."]); s.PV -= 2; }
    if (s.PV <= 0) return declareDefeat(null);
    startCombat("Le groupe de brigands", 10, 2, () => {
        const gold = randint(3, 5);
        s.OR += gold; s.inventory.axe = { damage: 4, poisoned: false, hasIt: true };
        addLines(["", `En fouillant les cadavres des malfaiteurs, vous trouvez ${gold} pièces d'or, ainsi qu'une hache de bûcheron, infligeant -4 PV.`, "Cette arme étant difficile à manier, une attaque à la hache est moins précise qu'une attaque à l'épée.", "Vous poursuivez votre quête en choisissant finalement de maintenir le cap."]);
        s.banditsFait = true;
        if (!s.gobelinFait) addChoice("Continuer", () => processLieu(12));
        else { s.foretFaite = true; addChoice("Continuer", () => processLieu(19)); }
    });
}

function transition() {
    if (s.montagneFaite && s.gobelinFait && s.banditsFait) {
        changerImage("transdesert.jpg");
        addLines(["", "Jusqu'ici, vous avez survécu et paré le danger. Restez tout de même sur vos gardes.", "Au fur et à mesure que vous avancez, les arbres se raréfient, au profit de la terre desséchée et du sable.", "Vous réalisez alors que vous allez devoir poursuivre votre aventure à travers le tristement célèbre désert de la mort.", "Au creux d'un amas rocheux, vous trouvez une bâche.", "Cependant, n'ayant toujours pas de sac pour transporter vos affaires, vous ne pouvez emporter qu'un seul objet entre votre corde et cette bâche."]);
        addChoice("Garder la corde",  () => processLieu(20));
        addChoice("Prendre la bâche", () => processLieu(21));
    } else if (s.montagneFaite && (!s.gobelinFait || !s.banditsFait)) {
        changerImage("transition.jpg");
        addLines(["", "Le sentier s'élargit et vous sentez enfin la chaleur des rayons du soleil sur votre peau.", "Un large fleuve vous contraint à aller vers l'Est. La végétation dense s'impose devant vous."]);
        addChoice("Continuer", () => processLieu(3));
    } else if ((s.gobelinFait && s.banditsFait) && !s.montagneFaite) {
        changerImage("transition.jpg");
        addLines(["", "Le sentier s'élargit et vous sentez enfin la chaleur des rayons du soleil sur votre peau.", "Un large fleuve vous contraint à aller vers le Nord. Les plaines enneigées s'étalent sous vos yeux."]);
        addChoice("Continuer", () => processLieu(2));
    }
}
