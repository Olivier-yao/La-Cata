import React from 'react';

// VoteBinaire — verdict à deux issues (Sans Rire : craqué / tenu bon).

export default function VoteBinaire({ question, sousTitre, optionA, optionB, onVote }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, padding: '48px 24px', textAlign: 'center' }}>
      <p className="eyebrow" style={{ color: 'var(--accent-magenta)' }}>Verdict de la table</p>
      <h2 className="display-title" style={{ fontSize: 'clamp(24px, 3.6vw, 40px)' }}>{question}</h2>
      {sousTitre && <p style={{ color: 'var(--text-muted)' }}>{sousTitre}</p>}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          className="btn"
          style={{ background: 'var(--bg-panel-raised)', color: 'var(--text-primary)' }}
          onClick={() => onVote(optionA.points)}
        >
          {optionA.label}
        </button>
        <button
          className="btn btn-primary"
          onClick={() => onVote(optionB.points)}
        >
          {optionB.label}
        </button>
      </div>
    </div>
  );
}
