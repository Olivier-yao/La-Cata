// son.js — petits sons d'interface synthétisés via Web Audio, sans aucun
// fichier audio à charger ni licence à gérer. Le contexte audio n'est créé
// qu'au premier geste utilisateur (politique des navigateurs sur l'audio).

let contexte = null;
let actif = true;

function obtenirContexte() {
  if (!contexte) {
    const AudioContextClasse = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClasse) return null;
    contexte = new AudioContextClasse();
  }
  if (contexte.state === 'suspended') contexte.resume();
  return contexte;
}

export function definirSonActif(valeur) {
  actif = valeur;
}

export function sonActifEst() {
  return actif;
}

function jouerTon({ frequence, duree, type = 'sine', volume = 0.12, glissandoVers }) {
  if (!actif) return;
  const ctx = obtenirContexte();
  if (!ctx) return;
  const oscillateur = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillateur.type = type;
  oscillateur.frequency.setValueAtTime(frequence, ctx.currentTime);
  if (glissandoVers) {
    oscillateur.frequency.exponentialRampToValueAtTime(glissandoVers, ctx.currentTime + duree);
  }
  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duree);
  oscillateur.connect(gain).connect(ctx.destination);
  oscillateur.start();
  oscillateur.stop(ctx.currentTime + duree);
}

export function sonClic() {
  jouerTon({ frequence: 480, duree: 0.07, type: 'square', volume: 0.07 });
}

export function sonTic() {
  jouerTon({ frequence: 900, duree: 0.045, type: 'sine', volume: 0.07 });
}

export function sonUrgence() {
  jouerTon({ frequence: 260, duree: 0.09, type: 'sawtooth', volume: 0.1 });
}

export function sonSucces() {
  jouerTon({ frequence: 523, duree: 0.13, volume: 0.13 });
  setTimeout(() => jouerTon({ frequence: 659, duree: 0.13, volume: 0.13 }), 90);
  setTimeout(() => jouerTon({ frequence: 784, duree: 0.22, volume: 0.14 }), 180);
}

export function sonCatastrophe() {
  jouerTon({ frequence: 320, duree: 0.4, type: 'sawtooth', volume: 0.1, glissandoVers: 110 });
}
