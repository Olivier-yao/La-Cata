import React from 'react';
import { STYLE_PAR_JEU } from '../lib/styleJeux.js';

// ReglesJeuScreen — explique le mini-jeu choisi avant de le lancer :
// affiché systématiquement, que le choix vienne d'un clic sur une carte ou
// du tirage au hasard, pour que la table sache toujours dans quoi elle
// s'embarque.

export default function ReglesJeuScreen({ jeu, onLancer, onChangerDeJeu }) {
  const { Icone, bg, couleur, contour } = STYLE_PAR_JEU[jeu.id];

  return (
    <div className="stage" style={{ padding: '48px 44px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26, textAlign: 'center' }}>
      <div className="stripes-bg" />
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 76, height: 76, borderRadius: 22, background: bg, border: contour ? `4px solid ${contour}` : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icone color={contour ? couleur : 'var(--outline)'} size={38} />
        </div>
        <p className="eyebrow" style={{ color: couleur, letterSpacing: '.22em' }}>Règles du jeu</p>
        <h1 className="display-title" style={{ fontSize: 'clamp(28px, 4.4vw, 44px)' }}>{jeu.nom}</h1>
      </div>

      <div className="hard-card" style={{ position: 'relative', maxWidth: 620, textAlign: 'left' }}>
        <p style={{ fontSize: 17, lineHeight: 1.6, color: 'var(--text-primary)' }}>{jeu.regles}</p>
      </div>

      <div style={{ position: 'relative', display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button className="btn btn-secondary" onClick={onChangerDeJeu}>Changer de jeu</button>
        <button className="btn" style={{ background: couleur, color: couleur === 'var(--accent-violet)' ? 'var(--text-primary)' : 'var(--outline)', fontSize: 17, padding: '16px 36px' }} onClick={onLancer}>
          C'est parti
        </button>
      </div>
    </div>
  );
}
