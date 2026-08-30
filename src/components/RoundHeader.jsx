import React from 'react';

// RoundHeader — bandeau en tête d'un écran de manche : pastille d'icône,
// titre du mini-jeu + sous-titre, et un slot libre à droite (joueur en
// cours, chrono, jauge...).

export default function RoundHeader({ icone, iconBg = 'var(--accent-magenta)', titre, sousTitre, couleurTitre, droite, bordure }) {
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        padding: '18px 26px',
        background: 'var(--bg-deep)',
        borderBottom: bordure || '3px solid var(--outline)',
        flexWrap: 'wrap',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 14,
            background: iconBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: '0 0 auto',
          }}
        >
          {icone}
        </div>
        <div>
          <div className="display-title" style={{ fontSize: 19, color: couleurTitre || 'var(--text-primary)' }}>
            {titre}
          </div>
          {sousTitre && <div style={{ fontSize: 13, color: 'var(--text-dim)' }}>{sousTitre}</div>}
        </div>
      </div>
      {droite && <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>{droite}</div>}
    </div>
  );
}
