function startCombat(name, pva, da, onWin, isArene) {
    s.combat = { name, pva, da, poison: false, armorUsed: false, onWin, isArene: isArene || false, roundExp: 0 };
    addLines(["", `⚔ COMBAT — ${name}`]);
    promptCombatAction();
}

function promptCombatAction() {
    updateStats();
    let c = s.combat;

    if (s.inventory.sword.hasIt) {
        let label = `Attaquer à l'épée${s.inventory.sword.poisoned?" (empoisonnée)":""}${s.inventory.sword.sacred?" ✨sacrée":""} — chance sur 12`;
        addChoice(label, () => executeAttack("sword", 12), "btn-action");
    }
    if (s.inventory.axe.hasIt)
        addChoice(`Attaquer à la hache${s.inventory.axe.poisoned?" (empoisonnée)":""} — chance sur 16`, () => executeAttack("axe", 16), "btn-action");
    if (s.inventory.dagger.hasIt) {
        let tags = [];
        if (s.inventory.dagger.magicRegen) tags.push("Vol de vie");
        if (s.inventory.dagger.poisoned)   tags.push("empoisonnée");
        addChoice(`Attaquer à la dague${tags.length?" ("+tags.join(" + ")+")" :""} — chance sur 14`, () => executeAttack("dagger", 14), "btn-action");
    }

    if (s.inventory.armor.hasIt && !c.armorUsed && s.inventory.armor.bonus > s.equippedArmorBonus) {
        let gain = s.inventory.armor.bonus - s.equippedArmorBonus;
        addChoice(`Equiper l'armure (+${gain} PV Max)`, () => {
            s.maxPV += gain; s.PV += gain;
            s.equippedArmorBonus = s.inventory.armor.bonus;
            c.armorUsed = true;
            addLines(["", `Armure équipée ! Vos PV Max ont augmenté de ${gain}.`]);
            enemyAttack();
        }, "btn-action");
    }

    if (s.inventory.mushrooms > 0)
        addChoice(`Manger un champignon, gagne 2 PV et 1 PA (${s.inventory.mushrooms} restant(s))`, () => {
            s.PV = Math.min(s.PV + 2, s.maxPV); s.PA = Math.min(s.PA + 1, s.maxPA);
            s.inventory.mushrooms -= 1;
            addLines(["", "Champignon mangé."]);
            enemyAttack();
        }, "btn-action");

    if (s.inventory.potions > 0)
        addChoice(`Boire potion de soins (+8 PV)`, () => {
            s.PV = Math.min(s.PV + 8, s.maxPV); s.inventory.potions -= 1;
            addLines(["", "Vous buvez la potion et récupérez de la vitalité."]);
            enemyAttack();
        }, "btn-action");

    if (s.inventory.poison > 0)
        addChoice(`Empoisonner la pointe d'une arme (${s.inventory.poison} dose(s))`, () => {
            clearControls();
            if (s.inventory.sword.hasIt  && !s.inventory.sword.poisoned)
                addChoice("Votre épée",  () => { s.inventory.sword.poisoned  = true; s.inventory.poison--; addLines(["", "Votre épée est désormais empoisonnée."]);  promptCombatAction(); }, "btn-action");
            if (s.inventory.axe.hasIt    && !s.inventory.axe.poisoned)
                addChoice("Votre hache", () => { s.inventory.axe.poisoned    = true; s.inventory.poison--; addLines(["", "Votre hache est désormais empoisonnée."]); promptCombatAction(); }, "btn-action");
            if (s.inventory.dagger.hasIt && !s.inventory.dagger.poisoned)
                addChoice(`Votre dague${s.inventory.dagger.magicRegen?" (gardera aussi le vol de vie)":""}`, () => {
                    s.inventory.dagger.poisoned = true; s.inventory.poison--;
                    addLines(["", s.inventory.dagger.magicRegen ? "Votre dague drainera la vie ET empoisonnera l'ennemi !" : "Votre dague est désormais empoisonnée."]);
                    promptCombatAction();
                }, "btn-action");
            addChoice("Annuler", promptCombatAction, "btn-action");
        }, "btn-action");

    // FUITE
    addChoice("Vous enfuir", () => {
        clearControls();
        if (c.isArene) {
            addLines(["", "Vous levez les mains en signe de capitulation. La foule siffle et vous hue.", "Le combat s'arrête. Vous quittez l'arène sous les quolibets, mais vivant."]);
            s.combat = null;
            addChoice("Retourner à l'arène", () => processLieu(100));
            return;
        }
        const roll = randint(1, 3);
        let cb = c.onWin;
        if (roll === 1) {
            addLines(["", "Vous saisissez une fraction de seconde d'inattention de votre adversaire.", `Grâce à votre agilité foudroyante, vous vous éclipsez dans l'obscurité avant que ${c.name} ne réagisse.`]);
            s.combat = null; checkLevelUp(() => cb());
        } else if (roll === 2) {
            s.PV -= c.da;
            addLines(["", `${c.name} vous a porté une attaque dans votre dos au moment de fuir (-${c.da} PV).`, "Vous avez survécu, mais à quel prix ?", "Retenez ceci : un vrai guerrier ne fuit jamais face à l'adversité."]);
            s.combat = null;
            if (s.PV <= 0) return declareDefeat(c.name);
            addChoice("Continuer votre route", () => checkLevelUp(() => cb()));
        } else {
            s.PV -= 2 * c.da;
            addLines(["", `En tentant de fuir, vous trébuchez et ${c.name} en profite pour vous porter une série de coups dévastateurs (-${2*c.da} PV).`, "Vous avez survécu de justesse, mais dans un état pitoyable.", "Retenez ceci : un vrai guerrier ne fuit jamais face à l'adversité."]);
            if (s.PV <= 0) return declareDefeat(c.name);
            s.combat = null;
            addChoice("Continuer votre route", () => checkLevelUp(() => cb()));
        }
    }, "btn-action");
}

function executeAttack(weaponKey, chance) {
    const roll = randint(1, chance);
    let w = s.inventory[weaponKey];
    if (s.PA >= roll) {
        let dmg = w.damage + s.PF;
        let isCrit = (s.PA === roll);
        if (isCrit) { addLines(["", "Vous avez porté un coup critique."]); dmg *= 2; }
        else        { addLines(["", "Vous avez attaqué avec succès."]); }
        s.combat.pva -= dmg;
        addLines([`${s.combat.name} perd ${dmg} PV. (PV restants : ${Math.max(0, s.combat.pva)})`]);
        if (w.poisoned) s.combat.poison = true;
        if (w.magicRegen) { s.PV = Math.min(s.PV + 1, s.maxPV); addLines(["La dague magique absorbe l'énergie vitale ennemie : +1 PV !"]); }
        if (weaponKey === "sword" && w.sacred && randint(1, 3) === 1) {
            s.EXP += 1; s.combat.roundExp += 1;
            addLines(["✨ L'épée sacrée pulse d'une lueur divine et vous insuffle de l'expérience !"]);
        }
    } else {
        addLines(["", "Vous avez raté votre attaque."]);
    }
    s.EXP += 1; s.combat.roundExp += 1;
    enemyAttack();
}

function enemyAttack() {
    let c = s.combat;
    if (c.poison && c.pva > 0) {
        c.pva -= 1;
        addLines([`Le poison ronge ${c.name} (-1 PV). PV restants : ${Math.max(0, c.pva)}`]);
    }
    if (c.pva <= 0) {
        addLines(["", "────────────────────────────────────────────────────────────────────────────────",
            "Félicitations, valeureux guerrier.", "Vous avez vaincu l'adversité avec force et courage."]);
        s.EXP += 1;
        addLines([`[ Total d'expérience remportée pour ce combat : ${c.roundExp + 1} EXP ]`,
            "────────────────────────────────────────────────────────────────────────────────"]);
        let cb = c.onWin; let isArene = c.isArene;
        s.combat = null;
        if (s.PV <= 0) {
            if (isArene) return areneInfirmerie();
            return declareDefeat(null);
        }
        checkLevelUp(() => cb());
        return;
    }
    if (s.PA > randint(1, 50)) {
        addLines(["", `${c.name} vous a porté une attaque, mais vous l'avez esquivé in extremis.`]);
    } else {
        addLines(["", `${c.name} vous a porté une attaque`]);
        s.PV -= c.da;
    }
    if (s.PV <= 0) {
        if (c.isArene) return areneInfirmerie();
        return declareDefeat(c.name);
    }
    promptCombatAction();
}

function areneInfirmerie() {
    changerImage("arene_infirmerie.jpg");
    s.combat = null;
    s.PV = Math.max(1, Math.floor(s.maxPV / 2));
    s.PA = Math.max(1, Math.floor(s.maxPA / 2));
    s.ville.jour += 2;
    addLines([
        "", "────────────────────────────────────────────────────────────────────────────────",
        "Votre adversaire vous porte le coup de grâce. Vous sombrez dans les ténèbres.",
        "Mais la mort ne vous a pas encore réclamé...", "",
        "Vous vous réveillez dans l'infirmerie de l'arène, deux jours plus tard.",
        "Des soigneurs ont pansé vos blessures. Vous êtes affaibli, mais vivant.",
        `Il fait maintenant Jour ${s.ville.jour} à Kair Morten.`,
        "Un vieux médecin vous regarde en secouant la tête : \"Vous avez eu de la chance, l'ami.\"",
        `PV récupérés à ${s.PV}/${s.maxPV}. PA récupérés à ${s.PA}/${s.maxPA}.`,
        "────────────────────────────────────────────────────────────────────────────────"
    ]);
    if (s.ville.jour >= 10) addLines(["", `⚠ Cela fait maintenant ${s.ville.jour} jours que vous traînez à Kair Morten.`, "Des rumeurs courent dans la ville : le Mage Noir a renforcé ses armées.", "On dit qu'il est désormais presque invincible. Chaque jour perdu est une victoire pour lui."]);
    addChoice("Se relever et retourner en ville", () => processLieu(99));
}
