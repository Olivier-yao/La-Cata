import React from 'react';
import Avatar from './Avatar.jsx';

// JoueurChip — pastille "AU TOUR DE ..." avec avatar + libellé.

export default function JoueurChip({ nom, index, libelle, accent = 'var(--bg-panel-raised)', border }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        background: accent,
        border: border || '3px solid var(--outline)',
        borderRadius: 999,
        padding: '6px 20px 6px 6px',
      }}
    >
      <Avatar nom={nom} index={index} taille={38} />
      <span className="display-title" style={{ fontSize: 16, color: 'var(--text-primary)' }}>
        {libelle || `Au tour de ${nom}`}
      </span>
    </div>
  );
}
