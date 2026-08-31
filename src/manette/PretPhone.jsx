import React, { useEffect, useRef, useState } from 'react';

// PretPhone — entre deux manches, le téléphone propose "JE SUIS PRÊT·E"
// (voir ScoreboardScreen pour le décompte "X/N prêts" côté écran
// principal). Ce n'est jamais un verrou : l'hôte peut lancer la manche
// suivante à tout moment, même sans personne de prêt — voir juste une
// indication visuelle plus honnête qu'un chrono qui ignore que quelqu'un
// est parti aux toilettes.

export default function PretPhone({ payload, onAction, nom, scores }) {
  const [pret, setPret] = useState(false);
  const dernierId = useRef(null);

  useEffect(() => {
    if (payload && payload.id !== dernierId.current) {
      dernierId.current = payload.id;
      setPret(false);
    }
  }, [payload]);

  const confirmer = () => {
    setPret(true);
    onAction({ prim: 'pret', id: payload?.id });
  };

  if (pret) {
    return (
      <div className="stage" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, textAlign: 'center', padding: 30, background: 'var(--accent-lime)' }}>
        <span style={{ fontSize: 40 }}>✓</span>
        <div className="display-title" style={{ fontSize: 22, color: 'var(--outline)' }}>PRÊTE POUR LA SUITE</div>
        <p style={{ color: 'var(--outline)', opacity: 0.75 }}>En attente des autres...</p>
      </div>
    );
  }

  return (
    <div className="stage" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, padding: 30, textAlign: 'center' }}>
      <p style={{ color: 'var(--text-muted)' }}>{nom} · {scores?.[nom] || 0} PTS</p>
      <button className="btn btn-lime" style={{ fontSize: 18, padding: '20px 44px' }} onClick={confirmer}>JE SUIS PRÊT·E</button>
    </div>
  );
}
