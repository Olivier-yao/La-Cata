import React from 'react';
import { couleurJoueur } from '../lib/playerColors.js';

// Avatar — pastille ronde colorée avec l'initiale du joueur.
// `index` détermine la couleur (voir playerColors.js) ; `eteint` grise
// l'avatar (joueur sorti/éliminé).

export default function Avatar({ nom, index = 0, taille = 52, eteint = false, contour }) {
  const couleur = couleurJoueur(index);
  return (
    <div
      className="avatar"
      style={{
        width: taille,
        height: taille,
        fontSize: taille * 0.4,
        background: eteint ? 'var(--bg-panel-raised)' : couleur.bg,
        color: eteint ? 'var(--text-dim)' : couleur.fg,
        border: contour ? `3px solid ${contour}` : 'none',
        textDecoration: eteint ? 'line-through' : 'none',
        opacity: eteint ? 0.5 : 1,
      }}
    >
      {(nom || '?').charAt(0).toUpperCase()}
    </div>
  );
}
