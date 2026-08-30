// randomSansRepeat.js — évite qu'un tirage aléatoire retombe deux fois de
// suite sur la même entrée (texte, défi, style...). Sans ça, avec des
// listes courtes, "au hasard" donne vite l'impression de revoir toujours
// la même chose.

export function creerPickerAleatoire(liste) {
  let dernierIndex = -1;
  return function tirer() {
    if (liste.length <= 1) return liste[0];
    let index;
    do {
      index = Math.floor(Math.random() * liste.length);
    } while (index === dernierIndex);
    dernierIndex = index;
    return liste[index];
  };
}
