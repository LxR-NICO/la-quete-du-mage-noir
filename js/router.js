function processLieu(lieu) {
    if (s.PV <= 0 && !s.combat) return declareDefeat(null);
    checkLevelUp(() => {
        
        s.lieu = lieu;
        // Monde 1 - Montagne
        if      (lieu === 2)   montagne();
        else if (lieu === 4)   caverne();
        else if (lieu === 7)   montagneEpuise();
        else if (lieu === 9)   chasser();
        else if (lieu === 10)  pecher();
        else if (lieu === 16)  lac();
        else if (lieu === 161) eboulement();
        else if (lieu === 17)  temple();
        // Monde 2 - Forêt
        else if (lieu === 3)   foret();
        else if (lieu === 11)  bandits();
        else if (lieu === 12)  foretGauche();
        else if (lieu === 13)  combatGobelin();
        else if (lieu === 14)  dealChampignons();
        // Transition
        else if (lieu === 19)  transition();
        // Monde 3 - Désert
        else if (lieu === 20 || lieu === 21) desert();
        else if (lieu === 22 || lieu === 23) nomade();
        else if (lieu === 24)  combatNomade();
        else if (lieu === 25)  echangeNomade();
        else if (lieu === 26)  scorpion();
        else if (lieu === 27 || lieu === 28) oasis();
        else if (lieu === 29)  tempeteSable();
        else if (lieu === 30)  tempeteAbri();
        else if (lieu === 31)  tempeteFuite();
        else if (lieu === 32)  tempeteRocher();
        else if (lieu === 33)  falaisesKeth();
        // Ville - Kair Morten
        else if (lieu === 34)  arriveeKairMorten();
        else if (lieu === 35)  auberge();
        else if (lieu === 36)  dorsDehors();
        else if (lieu === 99)  menuVille();
        else if (lieu === 100) arene();
        else if (lieu === 101) combatArene("Le Gladiateur Borgne",  12, 2, 8,   1, "gladiateur");
        else if (lieu === 102) combatArene("Le Berserker Nain",      18, 3, 15,  2, "berserker");
        else if (lieu === 103) combatArene("Le Troll des Arènes",    28, 4, 30,  3, "troll");
        else if (lieu === 104) combatArene("Le Champion Maudit",     40, 5, 60,  5, "champion");
        else if (lieu === 105) combatArene("L'Hydre à Deux Têtes",   55, 6, 90,  6, "hydre");
        else if (lieu === 106) combatArene("Le Golem de Pierre",     70, 7, 130, 8, "golem");
        else if (lieu === 107) combatArene("Le Dragon Enchaîné",     90, 9, 200, 10,"dragon");
        else if (lieu === 110) marche();
        else if (lieu === 120) missions();
        else if (lieu === 130) travail();
        else if (lieu === 131) travailPorter();
        else if (lieu === 132) travailCreuser();
        else if (lieu === 133) travailGarder();
        else if (lieu === 140) taverne();
        else if (lieu === 141) gamesDes();
        else if (lieu === 142) rumeurs();
        else if (lieu === 143) repasRoi();
        else if (lieu === 144) brasDeFer();
        else if (lieu === 150) nuit();
        else if (lieu === 200) quitterVille();
        // Monde 4 - Marécages
        else if (lieu === 201) entreeMarecage();
        else if (lieu === 202) cheminPlanches();
        else if (lieu === 203) vaseEpaisse();
        else if (lieu === 204) arbrePendu();
        else if (lieu === 205) enigmeSorciere();
        else if (lieu === 206) combatSorciere();
        else if (lieu === 207) lacNoir();
        else if (lieu === 208) monstreLac();
        else if (lieu === 209) coeurPutride();
        else if (lieu === 210) autelOublie();
        else if (lieu === 211) sortieMarecage();
    });
}
