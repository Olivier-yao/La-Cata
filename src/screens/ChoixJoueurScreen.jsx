import React from 'react';
import Avatar from '../components/Avatar.jsx';

// ChoixJoueurScreen — entre deux tours d'un même mini-jeu, l'hôte choisit
// qui passe ensuite parmi les joueurs qui n'ont pas encore joué à ce
// mini-jeu, ou laisse le tirage au hasard décider.

export default function ChoixJoueurScreen({ nomJeu, joueurs, joueursRestants, onChoisir, onHasard }) {
  return (
    <div className="stage" style={{ padding: '40px 44px', display: 'flex', flexDirection: 'column', gap: 26, alignItems: 'center', textAlign: 'center' }}>
      <div className="stripes-bg" />
      <div style={{ position: 'relative' }}>
        <p className="eyebrow" style={{ color: 'var(--accent-yellow)' }}>{nomJeu}</p>
        <h1 className="display-title" style={{ fontSize: 'clamp(24px, 3.6vw, 36px)', margin: '6px 0 0' }}>Qui passe maintenant ?</h1>
      </div>

      <div style={{ position: 'relative', display: 'flex', gap: 18, flexWrap: 'wrap', justifyContent: 'center' }}>
        {joueursRestants.map((nom) => (
          <button
            key={nom}
            onClick={() => onChoisir(nom)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
          >
            <Avatar nom={nom} index={joueurs.indexOf(nom)} taille={72} contour="var(--outline)" />
            <span className="display-title" style={{ fontSize: 15, color: 'var(--text-primary)' }}>{nom}</span>
          </button>
        ))}
      </div>

      <p style={{ position: 'relative', color: 'var(--text-dim)', fontSize: 13 }}>
        {joueurs.length - joueursRestants.length} / {joueurs.length} ont déjà joué à ce mini-jeu cette manche.
      </p>

      <button className="btn btn-lime" style={{ position: 'relative' }} onClick={onHasard}>
        Au hasard parmi eux
      </button>
    </div>
  );
}
