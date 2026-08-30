import React from 'react';
import { IconAveugle } from './icons.jsx';

// PrepBanner — bandeau cyan pleine largeur affiché avant tout mini-jeu qui
// demande autre chose qu'une voix (papier, espace dégagé, se lever). Le
// chrono reste à l'arrêt tant que personne n'a cliqué.

export default function PrepBanner({ texte }) {
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '20px 34px',
        background: 'var(--accent-cyan)',
        borderBottom: '4px solid var(--outline)',
      }}
    >
      <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--outline)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
        <IconAveugle color="var(--accent-cyan)" size={24} />
      </div>
      <div className="display-title" style={{ fontSize: 16, color: 'var(--outline)' }}>{texte}</div>
    </div>
  );
}
