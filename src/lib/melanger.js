// melanger.js — mélange Fisher-Yates, utilisé partout où il faut tirer un
// sous-groupe de joueurs au hasard (Conversation, Speed Dating Improbable).

export function melanger(liste) {
  const copie = [...liste];
  for (let i = copie.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copie[i], copie[j]] = [copie[j], copie[i]];
  }
  return copie;
}
