// haptique.js — retours haptiques (vibration) en complément des sons,
// pour les navigateurs mobiles qui le supportent (surtout Android ;
// iOS Safari n'implémente pas l'API Vibration, l'appel est alors un
// no-op silencieux). Volontairement indépendant du réglage "Son" : une
// vibration ne dérange jamais personne d'autre autour de la table, donc
// pas besoin d'un interrupteur séparé pour ça.

function vibrer(pattern) {
  if (typeof navigator === 'undefined' || !navigator.vibrate) return;
  navigator.vibrate(pattern);
}

export function hapticClic() {
  vibrer(10);
}

export function hapticTic() {
  vibrer(8);
}

export function hapticUrgence() {
  vibrer(15);
}

export function hapticSucces() {
  vibrer([20, 40, 20, 40, 30]);
}

export function hapticCatastrophe() {
  vibrer([60, 30, 60]);
}
