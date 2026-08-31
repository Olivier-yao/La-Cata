import React, { useState } from 'react';
import { STYLE_PAR_JEU } from '../lib/styleJeux.js';

// ReglesJeuScreen — explique le mini-jeu choisi avant de le lancer :
// affiché systématiquement, que le choix vienne d'un clic sur une carte ou
// du tirage au hasard, pour que la table sache toujours dans quoi elle
// s'embarque. Pour les mini-jeux `groupe` (une seule manche par défaut,
// notamment tous les Manette Party), on peut aussi choisir d'enchaîner
// plusieurs manches d'affilée du même jeu avant de revenir au choix.

export default function ReglesJeuScreen({ jeu, onLancer, onChangerDeJeu }) {
  const { Icone, bg, couleur, contour } = STYLE_PAR_JEU[jeu.id];
  const [nbManches, setNbManches] = useState(1);

  return (
    <div className="stage" style={{ padding: '48px 44px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26, textAlign: 'center' }}>
      <div className="stripes-bg" />
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 76, height: 76, borderRadius: 22, background: bg, border: contour ? `4px solid ${contour}` : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'lc-iconpop 420ms ease-out both' }}>
          <Icone color={contour ? couleur : 'var(--outline)'} size={38} />
        </div>
        <div style={{ animation: 'lc-cascadein 320ms ease-out 140ms both' }}>
          <p className="eyebrow" style={{ color: couleur, letterSpacing: '.22em' }}>Règles du jeu</p>
          <h1 className="display-title" style={{ fontSize: 'clamp(28px, 4.4vw, 44px)', margin: '6px 0 0' }}>{jeu.nom}</h1>
        </div>
      </div>

      <div className="hard-card" style={{ position: 'relative', maxWidth: 620, textAlign: 'left', animation: 'lc-cascadein 320ms ease-out 280ms both' }}>
        <p style={{ fontSize: 17, lineHeight: 1.6, color: 'var(--text-primary)' }}>{jeu.regles}</p>
      </div>

      {jeu.groupe && (
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, animation: 'lc-cascadein 320ms ease-out 420ms both' }}>
          <span className="display-title" style={{ fontSize: 12, letterSpacing: '.16em', color: 'var(--text-dim)' }}>MANCHES D'AFFILÉE DE CE JEU</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="btn btn-secondary" style={{ width: 48, height: 48, padding: 0, fontSize: 20 }} onClick={() => setNbManches((n) => Math.max(1, n - 1))}>−</button>
            <div className="display-title" style={{ fontSize: 26, width: 40, color: couleur }}>{nbManches}</div>
            <button className="btn" style={{ width: 48, height: 48, padding: 0, fontSize: 20, background: couleur, color: couleur === 'var(--accent-violet)' ? 'var(--text-primary)' : 'var(--outline)' }} onClick={() => setNbManches((n) => Math.min(5, n + 1))}>+</button>
          </div>
        </div>
      )}

      <div style={{ position: 'relative', display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center', animation: `lc-cascadein 320ms ease-out ${jeu.groupe ? 560 : 420}ms both` }}>
        <button className="btn btn-secondary" onClick={onChangerDeJeu}>Changer de jeu</button>
        <button className="btn" style={{ background: couleur, color: couleur === 'var(--accent-violet)' ? 'var(--text-primary)' : 'var(--outline)', fontSize: 17, padding: '16px 36px' }} onClick={() => onLancer(nbManches)}>
          C'est parti{nbManches > 1 ? ` · ${nbManches} manches` : ''}
        </button>
      </div>
    </div>
  );
}
