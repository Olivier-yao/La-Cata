// playerColors.js — attribue une couleur stable à chaque joueur selon son
// index dans la liste (même rotation que le kit : magenta, citron-vert,
// jaune, violet, cyan, puis on reboucle).

const PALETTE = [
  { bg: 'var(--accent-magenta)', fg: 'var(--outline)' },
  { bg: 'var(--accent-lime)', fg: 'var(--outline)' },
  { bg: 'var(--accent-yellow)', fg: 'var(--outline)' },
  { bg: 'var(--accent-violet)', fg: 'var(--text-primary)' },
  { bg: 'var(--accent-cyan)', fg: 'var(--outline)' },
];

export function couleurJoueur(index) {
  return PALETTE[index % PALETTE.length];
}
