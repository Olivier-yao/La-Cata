import React, { useEffect, useRef, useState } from 'react';

export default function QcmPhone({ payload, onAction }) {
  const [etat, setEtat] = useState('attente'); // attente | ouvert | envoye | resultat
  const [choixEnvoye, setChoixEnvoye] = useState(null);
  const idRef = useRef(null);

  useEffect(() => {
    if (!payload) return;
    if (payload.etape === 'demarrer' && payload.id !== idRef.current) {
      idRef.current = payload.id;
      setChoixEnvoye(null);
      setEtat('ouvert');
    } else if (payload.etape === 'resultat' && payload.id === idRef.current) {
      setEtat('resultat');
    }
  }, [payload]);

  const choisir = (i) => {
    if (etat !== 'ouvert') return;
    setChoixEnvoye(i);
    setEtat('envoye');
    onAction({ prim: 'qcm', choix: i, id: idRef.current });
  };

  if (etat === 'resultat') {
    const aBonneReponse = payload.bonneReponse != null && choixEnvoye === payload.bonneReponse;
    return (
      <div className="stage" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, textAlign: 'center', padding: 30, background: aBonneReponse ? 'var(--accent-lime)' : 'var(--bg-deep)' }}>
        <div className="display-title" style={{ fontSize: 24, color: aBonneReponse ? 'var(--outline)' : 'var(--text-primary)' }}>
          {choixEnvoye == null ? 'Pas de réponse envoyée' : aBonneReponse ? 'BIEN VU !' : 'Résultat affiché sur l\'écran principal'}
        </div>
      </div>
    );
  }

  if (etat === 'envoye') {
    return (
      <div className="stage" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, textAlign: 'center', padding: 30 }}>
        <div className="display-title" style={{ fontSize: 24 }}>RÉPONSE ENVOYÉE</div>
        <p style={{ color: 'var(--text-muted)' }}>En attente des autres...</p>
      </div>
    );
  }

  return (
    <div className="stage" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 20, padding: '32px 20px', justifyContent: 'center' }}>
      <div className="display-title" style={{ fontSize: 'clamp(18px, 5vw, 24px)', textAlign: 'center', marginBottom: 8 }}>{payload?.question}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {(payload?.options || []).map((opt, i) => (
          <button
            key={i}
            onClick={() => choisir(i)}
            style={{ background: 'var(--outline)', color: 'var(--text-primary)', border: '4px solid var(--outline)', borderRadius: 18, padding: '20px', fontFamily: 'inherit', fontSize: 17, touchAction: 'manipulation' }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
