// calculs.js — génère une opération aléatoire (addition, soustraction,
// multiplication, division) pour "Calcul Éclair". Généré à la volée plutôt
// que piochée dans une liste fixe : les maths ne s'épuisent jamais, donc
// pas besoin d'un système anti-répétition ici.

const OPERATEURS = ['+', '−', '×', '÷'];

function entierEntre(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function genererCalcul() {
  const operateur = OPERATEURS[Math.floor(Math.random() * OPERATEURS.length)];
  let a;
  let b;
  let resultat;

  if (operateur === '+') {
    a = entierEntre(120, 900);
    b = entierEntre(120, 900);
    resultat = a + b;
  } else if (operateur === '−') {
    a = entierEntre(300, 999);
    b = entierEntre(100, a - 50);
    resultat = a - b;
  } else if (operateur === '×') {
    a = entierEntre(12, 89);
    b = entierEntre(11, 79);
    resultat = a * b;
  } else {
    b = entierEntre(3, 19);
    const quotientApprox = entierEntre(15, 90);
    a = b * quotientApprox + entierEntre(0, b - 1);
    resultat = a / b;
  }

  return { a, b, operateur, resultat };
}
