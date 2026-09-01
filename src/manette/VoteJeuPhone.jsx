import React, { useEffect, useRef, useState } from 'react';

// VoteJeuPhone — entre deux manches, chaque téléphone propose la liste
// des mini-jeux Manette Party : voter POUR un jeu vaut aussi "je suis
// prêt·e", pas besoin d'un bouton séparé. Un seul choix, pas de retour
// (comme QcmPhone) — voir ScoreboardScreen pour le dépouillement.

export default function VoteJeuPhone({ payload, onAction }) {
  const [etat, setEtat] = useState('attente'); // attente | ouvert | envoye
  const [choix, setChoix] = useState(null);
  const dernierId = useRef(null);

  useEffect(() => {
    if (!payload) return;
    if (payload.etape === 'ouvert' && payload.id !== dernierId.current) {
      dernierId.current = payload.id;
      setChoix(null);
      setEtat('ouvert');
    }
  }, [payload]);

  const voter = (jeu) => {
    if (etat !== 'ouvert') return;
    setChoix(jeu);
    setEtat('envoye');
    onAction({ prim: 'vote-jeu', jeuId: jeu.id, id: dernierId.current });
  };

  if (etat === 'envoye') {
    return (
      <div className="stage" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, textAlign: 'center', padding: 30, background: 'var(--accent-lime)' }}>
        <span style={{ fontSize: 40 }}>✓</span>
        <div className="display-title" style={{ fontSize: 20, color: 'var(--outline)' }}>VOTÉ · {choix?.nom}</div>
        <p style={{ color: 'var(--outline)', opacity: 0.75 }}>En attente des autres...</p>
      </div>
    );
  }

  if (etat !== 'ouvert') {
    return (
      <div className="stage" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 30, textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>En attente…</p>
      </div>
    );
  }

  return (
    <div className="stage" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 14, padding: '26px 20px' }}>
      <div className="display-title" style={{ fontSize: 15, textAlign: 'center', color: 'var(--accent-yellow)' }}>CHOISIS LE PROCHAIN MINI-JEU</div>
      <p style={{ fontSize: 12, color: 'var(--text-dim)', textAlign: 'center' }}>Le plus voté sera lancé automatiquement dans quelques secondes.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, overflowY: 'auto' }}>
        {(payload?.jeux || []).map((jeu) => (
          <button
            key={jeu.id}
            onClick={() => voter(jeu)}
            className="btn"
            style={{ padding: '16px', fontSize: 15, textAlign: 'left', background: 'var(--bg-panel-raised)', color: 'var(--text-primary)', border: '3px solid var(--outline)' }}
          >
            {jeu.nom}
          </button>
        ))}
      </div>
    </div>
  );
}
