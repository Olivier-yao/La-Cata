// chants.js — Paroles inventées pour "Chant Imposé", écrites différemment
// selon le style tiré au sort (l'opéra n'a pas le même rythme que le rap).
// Chaque ligne porte sa PROPRE durée (`duree`, en ms) : un couplet ne se
// chante jamais à vitesse constante, certains vers filent, d'autres
// s'étirent pour l'effet dramatique. La bande de progression (voir
// LyricsScroll) se remplit sur cette durée pour indiquer le rythme.

import { creerPickerAleatoire } from '../lib/randomSansRepeat.js';

function ligne(texte, duree) {
  return { texte, duree };
}

export const CHANSONS = {
  'Opéra': {
    lignes: [
      ligne('Ô nuit profonde, entends mon âme qui vacille', 4800),
      ligne('Le frigo est vide et mon cœur se déchire', 3400),
      ligne('Pourquoi, pourquoi as-tu mangé le dernier yaourt', 5200),
      ligne("Sans un mot, sans un cri, tu as scellé mon sort", 3000),
      ligne('Je chanterai ta trahison jusqu\'à l\'aube', 4200),
      ligne("Et je pardonnerai, peut-être, s'il en reste une part", 5600),
      ligne('Ô destin cruel qui m\'as privé de dessert', 3800),
      ligne('Ainsi s\'achève ce chant, dans les larmes et le beurre', 5000),
    ],
  },
  'Comptine': {
    lignes: [
      ligne('Petit chat, petit chat, où as-tu mis mes clés', 2800),
      ligne('Sous le tapis, dans le vase, ou bien dans mes souliers', 3600),
      ligne('Tourne, tourne la maison, cherche encore un peu', 2600),
      ligne('Petit chat rigolo, tu ne diras pas où', 3200),
      ligne('La lune rit là-haut, les étoiles aussi', 2400),
      ligne('Et mes clés dans sa gueule, il s\'enfuit dans la nuit', 3800),
      ligne('Demain matin peut-être, il les aura rendues', 3000),
      ligne('Petit chat, petit chat, la comptine est finie', 2600),
    ],
  },
  'Rap': {
    lignes: [
      ligne('Ouais, ouais, c\'est le rythme du salon', 1400),
      ligne('Micro dans la main, j\'ai plus de raison', 1400),
      ligne('Ma mixtape sort direct du grille-pain', 1600),
      ligne('Chaque tartine, c\'est un nouveau refrain', 1300),
      ligne('J\'ai le flow du frigo qui vibre à minuit', 2200),
      ligne('Personne m\'arrête, j\'improvise à l\'envi', 1500),
      ligne('Le beat, c\'est la machine à laver du bas', 1700),
      ligne('Et je conclus ce texte sans savoir pourquoi', 2400),
    ],
  },
  'Métal': {
    lignes: [
      ligne('DANS LES TÉNÈBRES DU COULOIR SANS LUMIÈRE', 2600),
      ligne('J\'AI PERDU LA TÉLÉCOMMANDE, C\'EST LA GUERRE', 1800),
      ligne('MES POINGS SE LÈVENT VERS LE PLAFOND DE PLÂTRE', 2400),
      ligne('LE VOISIN DU DESSUS VA ENTENDRE CE CHAPITRE', 1600),
      ligne('JE HURLE MA RAGE FACE À CE CANAPÉ', 2000),
      ligne('PERSONNE NE RANGERA CE SALON DÉVASTÉ', 1700),
      ligne('LA FIN DU MONDE N\'EST RIEN FACE À CETTE SOIRÉE', 2200),
      ligne('ET JE M\'ÉCROULE, VAINQUEUR, SUR LE PARQUET CIRÉ', 3200),
    ],
  },
  'Chanson de Noël': {
    lignes: [
      ligne('Il neige doucement sur le toit du voisin', 3600),
      ligne('Le chocolat chaud fume déjà dans nos mains', 3000),
      ligne('Les guirlandes clignotent un peu de travers', 2600),
      ligne('Mais le sapin sourit malgré l\'hiver', 3400),
      ligne('Grand-mère a caché les cadeaux sous son lit', 2800),
      ligne('On les trouvera bien avant minuit', 3200),
      ligne('Joyeux Noël à ceux qui sont là ce soir', 3000),
      ligne('Et à ceux qui nous manquent, on pense encore', 4400),
    ],
  },
  'Reggaeton': {
    lignes: [
      ligne('Dale, dale, la soirée commence', 1800),
      ligne('Le voisin du dessous perd patience', 2600),
      ligne('On bouge les hanches sur le carrelage', 2200),
      ligne('Personne ne dort avant le lever du jour', 3000),
      ligne('Dale, dale, encore un peu plus fort', 1800),
      ligne('La musique n\'a pas de couvre-feu ce soir', 2800),
      ligne('Même la théière danse sur la cuisinière', 2400),
      ligne('Dale, dale, jusqu\'à la lumière', 2200),
    ],
  },
  'Coupé-Décalé': {
    lignes: [
      ligne('Eh, on est ensemble, ce soir on s\'enjaille grave', 2400),
      ligne('Le boucan-là, personne ne peut l\'arrêter', 1800),
      ligne('Même si j\'ai coulé, ce soir je suis milliardaire', 2600),
      ligne('Chaque pas que je fais, c\'est un pas de légende', 1700),
      ligne('Anitché, la piste est à moi jusqu\'au matin', 2200),
      ligne('Bouge ton corps comme si demain n\'existait pas', 1600),
      ligne('Je te bognan, DJ, remets-moi ce son-là', 2000),
      ligne('Coupé, décalé, et on recommence encore', 2800),
    ],
  },
};

export const STYLES_CHANT = Object.keys(CHANSONS);

export const styleChantAleatoire = creerPickerAleatoire(STYLES_CHANT);
