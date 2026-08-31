import React, { useState } from 'react';

// RolePhone — carte de rôle secret (Le Traître, Espion Parmi Nous). La
// partie se joue à voix haute autour de la table, le vote de démasquage
// passe ensuite par QcmHost/QcmPhone comme n'importe quel autre vote.
// Quand `payload.voteDeclenchable` est vrai (Le Traître), un bouton
// d'alerte reste visible en permanence : n'importe qui peut décider, à
// tout moment de la discussion, de déclencher le vote pour la table.

export default function RolePhone({ payload, onAction }) {
  const [declenche, setDeclenche] = useState(false);

  if (!payload || payload.prim !== 'role-secret') {
    return (
      <div className="stage" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 30, textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>En attente du rôle secret…</p>
      </div>
    );
  }

  const special = payload.special;

  const declencherVote = () => {
    if (declenche) return;
    setDeclenche(true);
    onAction({ prim: 'role-secret', action: 'declencher-vote' });
  };

  return (
    <div className="stage" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, padding: 30, textAlign: 'center', background: special ? 'var(--accent-magenta)' : 'var(--bg-deep)' }}>
      <div className="display-title" style={{ fontSize: 13, letterSpacing: '.2em', color: special ? 'var(--outline)' : 'var(--accent-cyan)' }}>
        RÔLE SECRET · NE MONTRE À PERSONNE
      </div>
      <div className="display-title" style={{ fontSize: 30, color: special ? 'var(--outline)' : 'var(--text-primary)' }}>{payload.titre}</div>
      <p style={{ color: special ? 'var(--outline)' : 'var(--text-muted)', maxWidth: 300 }}>{payload.consigne}</p>
      {payload.motSecret && (
        <div className="hard-card" style={{ marginTop: 6, fontSize: 20, padding: '14px 24px' }}>{payload.motSecret}</div>
      )}
      {payload.voteDeclenchable && (
        <button
          onClick={declencherVote}
          disabled={declenche}
          className="btn"
          style={{
            marginTop: 14, padding: '18px 28px', fontSize: 16, borderRadius: 999,
            background: declenche ? 'var(--bg-panel-raised)' : 'var(--accent-yellow)',
            color: declenche ? 'var(--text-dim)' : 'var(--outline)',
            border: '4px solid var(--outline)',
          }}
        >
          {declenche ? 'VOTE DEMANDÉ...' : '🚨 DÉCLENCHER LE VOTE'}
        </button>
      )}
    </div>
  );
}
