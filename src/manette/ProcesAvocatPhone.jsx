import React, { useState } from 'react';

// ProcesAvocatPhone — l'avocat de la défense a trois preuves privées et
// peut en révéler chacune à tout moment pendant la plaidoirie (jamais
// l'inverse : une fois montrée, elle reste montrée). On envoie la liste
// complète des indices déjà révélés à chaque clic, pas juste le dernier
// index, car l'hôte ne garde que le dernier payload reçu par joueur.

export default function ProcesAvocatPhone({ payload, onAction }) {
  const [revelees, setRevelees] = useState([]);

  if (!payload || payload.prim !== 'proces-avocat') {
    return (
      <div className="stage" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 30, textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>En attente du dossier…</p>
      </div>
    );
  }

  const reveler = (i) => {
    if (revelees.includes(i)) return;
    const nouvelles = [...revelees, i];
    setRevelees(nouvelles);
    onAction({ prim: 'proces-avocat', indices: nouvelles });
  };

  return (
    <div className="stage" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 18, padding: '30px 22px', textAlign: 'center' }}>
      <div className="display-title" style={{ fontSize: 13, letterSpacing: '.16em', color: 'var(--accent-lime)' }}>AVOCAT DE LA DÉFENSE · TES 3 PREUVES</div>
      <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Révéler est irréversible. Choisis le bon moment.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {(payload.preuves || []).map((preuve, i) => {
          const revelee = revelees.includes(i);
          return (
            <div key={i} style={{ border: '3px solid var(--accent-lime)', borderRadius: 16, padding: '14px 16px', textAlign: 'left', background: revelee ? 'var(--bg-panel-raised)' : 'var(--bg-deep)' }}>
              <p style={{ fontSize: 14, color: 'var(--text-primary)', marginBottom: 10 }}>{preuve}</p>
              <button
                onClick={() => reveler(i)}
                disabled={revelee}
                className="btn"
                style={{ width: '100%', padding: '10px', fontSize: 13, background: revelee ? 'var(--bg-panel-raised)' : 'var(--accent-lime)', color: revelee ? 'var(--text-dim)' : 'var(--outline)', border: '3px solid var(--outline)' }}
              >
                {revelee ? 'DÉJÀ RÉVÉLÉE' : 'MONTRER À TOUS'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
