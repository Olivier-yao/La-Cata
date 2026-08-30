import React from 'react';
import Avatar from '../Avatar.jsx';

// VoteDesignation — grammaire de Statue Surprise : pas de note, on clique
// un visage. Aucun score en jeu, c'est une manche de rupture de rythme.

export default function VoteDesignation({ joueurs, onTermine }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26, padding: '48px 24px', textAlign: 'center' }}>
      <p className="eyebrow" style={{ color: 'var(--accent-violet)' }}>Statue Surprise · élimination</p>
      <h2 className="display-title" style={{ fontSize: 'clamp(24px, 3.6vw, 38px)' }}>Qui a bougé en dernier ?</h2>

      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
        {joueurs.map((nom, i) => (
          <button
            key={nom}
            onClick={() => onTermine(nom)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
          >
            <Avatar nom={nom} index={i} taille={78} contour="var(--outline)" />
            <span className="display-title" style={{ fontSize: 13, color: 'var(--text-muted)' }}>{nom}</span>
          </button>
        ))}
      </div>

      <p style={{ color: 'var(--text-muted)', maxWidth: 460 }}>
        Pas de note ici : on clique sur un visage. Les autres restent en jeu.
      </p>
      <button className="btn btn-secondary" onClick={() => onTermine(null)}>Égalité · personne ne sort</button>
    </div>
  );
}
