// defis.js — Actions ridicules à exécuter avant la fin du compte à rebours,
// pour "Défi Chrono Absurde".

import { creerPickerAleatoire } from '../lib/randomSansRepeat.js';

export const DEFIS = [
  { texte: 'Fais 5 pas en canard en chantant le générique de ton dessin animé préféré.', secondes: 20 },
  { texte: "Imite un présentateur télé qui annonce une catastrophe de cuisine.", secondes: 25 },
  { texte: 'Fais une déclaration d\'amour sincère à un objet dans la pièce.', secondes: 20 },
  { texte: 'Invente une danse de la victoire pour quelqu\'un qui a gagné au Uno.', secondes: 20 },
  { texte: 'Explique la météo du jour comme si tu étais un pirate.', secondes: 25 },
  { texte: 'Fais semblant d\'être une porte automatique qui coince.', secondes: 15 },
  { texte: 'Présente-toi comme si tu passais un entretien pour devenir super-héros du quartier.', secondes: 25 },
  { texte: 'Chante "joyeux anniversaire" comme si c\'était une chanson d\'opéra tragique.', secondes: 20 },
  { texte: 'Fais la météo marine pour un lac qui n\'a jamais connu la moindre tempête.', secondes: 20 },
  { texte: 'Négocie le prix d\'un objet imaginaire comme si ta vie en dépendait.', secondes: 25 },
  { texte: 'Explique à la table que tu as coulé ce mois-ci, sans un franc, mais avec tout le style du monde.', secondes: 20 },
  { texte: 'Fais semblant de vendre de l\'attiéké au bord de la route, en criant les prix à tue-tête.', secondes: 20 },
  { texte: 'Imite un chauffeur de gbaka qui annonce les arrêts en criant plus fort que tout le monde.', secondes: 20 },
  { texte: 'Fais la danse de la victoire d\'un joueur qui vient de gagner au dames devant tout le maquis.', secondes: 20 },
  { texte: 'Raconte un mensonge énorme à la table en disant "anitché" après chaque phrase pour qu\'on te croie.', secondes: 25 },
  { texte: 'Déclare ta flamme à la télécommande comme si c\'était ton grand amour perdu.', secondes: 30 },
  { texte: 'Fais la démonstration d\'un produit imaginaire qui n\'existe pas encore.', secondes: 30 },
  { texte: 'Marche comme si le sol était en lave pendant que tu commentes ta traversée.', secondes: 20 },
  { texte: 'Fais un discours de remerciement comme si tu venais de gagner un Oscar du ménage.', secondes: 30 },
  { texte: 'Imite ton animal de compagnie en train de se plaindre de sa journée.', secondes: 20 },
  { texte: 'Négocie avec un coussin pour qu\'il te laisse dormir cette nuit.', secondes: 25 },
  { texte: 'Fais une interview de toi-même comme si tu étais une célébrité fatiguée.', secondes: 30 },
  { texte: 'Explique les règles du football à un extraterrestre qui n\'y comprend rien.', secondes: 35 },
  { texte: 'Fais semblant d\'être un robot qui tombe en panne de batterie petit à petit.', secondes: 20 },
  { texte: 'Chante une berceuse à une plante verte pour qu\'elle pousse plus vite.', secondes: 20 },
  { texte: 'Fais la météo mais uniquement en mimant, sans dire un seul mot.', secondes: 25 },
  { texte: 'Improvise une pub pour vendre de l\'air en bouteille.', secondes: 30 },
  { texte: 'Fais semblant d\'être piégé dans un ascenseur et appelle à l\'aide de façon théâtrale.', secondes: 20 },
  { texte: 'Raconte ta pire journée comme si c\'était l\'intrigue d\'un film d\'action.', secondes: 30 },
  { texte: 'Fais un tutoriel de cuisine pour un plat totalement inventé.', secondes: 30 },
  { texte: 'Improvise un slam sur le sujet : la vaisselle qui s\'accumule dans l\'évier.', secondes: 30 },
  { texte: 'Fais semblant d\'annoncer les résultats d\'une élection présidentielle de ronds-points.', secondes: 25 },
  { texte: 'Explique pourquoi les chaussettes disparaissent au lavage, avec un ton de conférencier.', secondes: 30 },
];

export const defiAleatoire = creerPickerAleatoire(DEFIS);
