import React from 'react';

// RolePhone — carte de rôle secret, purement informative (Le Traître,
// Espion Parmi Nous). Pas d'action à envoyer : la partie se joue à voix
// haute autour de la table, le vote de démasquage passe ensuite par
// QcmHost/QcmPhone comme n'importe quel autre vote.

export default function RolePhone({ payload }) {
  if (!payload || payload.prim !== 'role-secret') {
    return (
      <div className="stage" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 30, textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>En attente du rôle secret…</p>
      </div>
    );
  }

  const special = payload.special;

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
    </div>
  );
}
