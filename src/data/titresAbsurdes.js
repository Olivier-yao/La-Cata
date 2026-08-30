import { creerPickerAleatoire } from '../lib/randomSansRepeat.js';

// titresAbsurdes.js — titres de films/séries absurdes à pitcher en 30s
// comme si on vendait vraiment le film à un producteur.

export const TITRES_ABSURDES = [
  'Le Retour du Frigo Vengeur',
  'Gbaka 2 : Retour de Manivelle',
  'Mon Beau-Père est un Drone',
  'L\'Attiéké qui Voulait Voir la Mer',
  'Trois Mariages et un Groupe WhatsApp',
  'La Vengeance du Coiffeur de Nuit',
  'Sacré Bognan',
  'Le Dernier Maquis sur la Lune',
  'Ma Grand-Mère est une Espionne Russe',
  'Le Complot des Chaussettes Dépareillées',
  'Docteur Gbairai',
  'Le Perroquet qui Savait Trop',
  'Nuit Blanche à la CIE',
  'Le Mari de ma Voisine est un Robot',
  'La Malédiction du Plantain Brûlé',
  'Opération Enjaillement',
  'Le Facteur ne Sonne qu\'une Fois, Sauf le Weekend',
  'Confession d\'un Vendeur de Crédit Orange',
  'La Panthère et le Percepteur',
  'Le Jour où le Wifi s\'est Éteint',
  'L\'Attaque des Chaussettes Dépareillées',
  'Gbaka 2 : La Revanche du Bouchon',
  'La Malédiction de la Télécommande Perdue',
  'Opération Attiéké : Mission Impossible',
  'Le Dernier des Parapluies',
  'Confessions d\'un Ventilateur Fatigué',
  'La Nuit où les Ronds-Points ont Pris le Pouvoir',
  'Maquis Story : Origines',
  'L\'Empire Contre-Attaque : Édition Vaisselle Sale',
  'Les Chroniques du Coussin Perdu',
  'Fast and Gbaka : Course Contre la Montre',
  'Le Seigneur des Bouchons de Circulation',
  'Rencontre du Troisième Type au Maquis',
  'Mission Casserole : Sauvetage Express',
  'La Guerre des Chargeurs de Téléphone',
  'Le Justicier des Poubelles Mal Triées',
  'Attiéké Wars : L\'Éveil du Piment',
  '24h Chrono : À la Recherche des Clés Perdues',
  'Le Dernier Voyage du Bus 12',
];

export const titreAbsurdeAleatoire = creerPickerAleatoire(TITRES_ABSURDES);
