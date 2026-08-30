// memoire.js — Textes pour "Mémoire Flash". Volontairement précis (chiffres,
// noms, détails) pour que la restitution EXACTE soit un vrai défi, pas
// juste une paraphrase approximative.

import { creerPickerAleatoire } from '../lib/randomSansRepeat.js';

export const TEXTES_MEMOIRE = [
  "Le chat de Sandrine s'appelle Roquefort, il a sept ans, trois pattes blanches, et déteste absolument le jeudi.",
  "À la boulangerie du coin, le pain au chocolat coûte un euro quarante, et le vendeur s'appelle Momo depuis douze ans.",
  "Mon oncle Bernard a gagné trois fois de suite au loto local avec les numéros quatre, dix-sept et vingt-neuf.",
  "La recette demande deux œufs, cent grammes de sucre, une pincée de sel, et vingt-trois minutes de cuisson exactement.",
  "Le code du digicode est sept-B-quarante-deux, changé tous les mardis depuis l'incident du printemps dernier.",
  "Elle a déménagé cinq fois en huit ans, toujours un vendredi, toujours dans une ville qui commence par un B.",
  "Le film dure deux heures et dix-sept minutes, sort un mercredi, et le réalisateur s'appelle Julien Vasseur.",
  "Il collectionne les capsules de bière depuis 2011, il en a mille deux cent six, rangées par pays d'origine.",
  "La réunion est déplacée à quatorze heures trente, salle B, avec Nadia, Farid, et un café pour six personnes.",
  "Son grand-père a construit cette table en 1978 avec du chêne, trois clous tordus, et beaucoup trop de patience.",
  "Le maquis de Tantie Aya ferme à minuit pile, sauf le vendredi où le dernier client part vers deux heures du matin.",
  "Le chauffeur du gbaka numéro douze s'appelle Yacouba, il conduit cette ligne depuis six ans sans un seul accident.",
  "Le prix de l'attiéké-poisson est passé à mille cinq cents francs depuis lundi, à cause du poisson qui a coulé au port.",
  'Le 14 mars, Kouassi a acheté 3 kg d\'attiéké à 1200 francs chez Mariam, au troisième maquis après le rond-point.',
  'À 16h37, le gbaka numéro 12 est parti de la gare avec 4 passagers de retard.',
  'Adjoua a payé 2500 francs pour deux plats de garba chez Tantie Aya, mardi dernier.',
  'Le vendeur du coin a vendu 7 sachets d\'eau glacée à 50 francs chacun avant midi.',
  'Yao a rendez-vous chez le coiffeur à 15h15, au deuxième étage du bâtiment bleu.',
  'La réunion de famille commence à 18h, chez tonton Serge, avec 9 invités confirmés.',
  'Fatou a commandé 3 boîtes de biscuits et 2 bouteilles de jus au supermarché du quartier.',
  'Le match a commencé avec 20 minutes de retard, score final 2 à 1 pour l\'équipe locale.',
  'Bintou a économisé 15 000 francs en trois semaines pour acheter un nouveau téléphone.',
  'Le taxi a facturé 1800 francs pour un trajet de 25 minutes jusqu\'au centre-ville.',
  'Aminata a planté 6 pieds de tomates et 4 pieds de piment dans son jardin ce week-end.',
  'Le cours de maths commence à 8h précises, salle B12, avec le professeur Kouadio.',
  'Awa a acheté 5 mètres de tissu wax à 3000 francs le mètre pour sa robe.',
  'Le bus scolaire passe à 6h50 devant la pharmacie, jamais plus tard que 6h55.',
  'Moussa a gagné 4000 francs au pari sportif après le match de samedi soir.',
  'La cérémonie commence à 10h30 précises, avec 45 chaises prévues pour les invités.',
  'Le marché du village ouvre à 5h du matin, trois jours par semaine seulement.',
  'Séraphine a préparé 8 portions de kedjenou pour la fête de dimanche.',
  'Le vol pour Bouaké décolle à 13h20 depuis le terminal numéro 2.',
  'Le boutiquier a rendu 300 francs de monnaie après un achat de 4700 francs.',
  'La formation dure 6 semaines, deux jours par semaine, de 9h à midi.',
  'Zeinab a payé son loyer de 45 000 francs le 3 du mois, avec un jour de retard.',
  'Le concert commence à 20h, mais les portes ouvrent dès 18h30.',
  'Ibrahim a couru 5 kilomètres en 28 minutes lors de son entraînement du matin.',
  'La tontine se réunit chaque premier samedi du mois chez Madame Koné, à 14h.',
];

export const texteMemoireAleatoire = creerPickerAleatoire(TEXTES_MEMOIRE);
