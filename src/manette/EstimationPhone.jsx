import React, { useEffect, useRef, useState } from 'react';

// EstimationPhone — un champ numérique, pas de bouton buzzer. On peut
// changer d'avis tant qu'on n'a pas validé ; une fois validé, on attend
// la révélation (qui n'arrive qu'à la fin du chrono côté hôte).

export default function EstimationPhone({ payload, onAction }) {
  const [etat, setEtat] = useState('attente'); // attente | ouvert | envoye | resultat
  const [valeur, setValeur] = useState('');
  const dernierId = useRef(null);

  useEffect(() => {
    if (!payload) return;
    if (payload.etape === 'ouvert' && payload.id !== dernierId.current) {
      dernierId.current = payload.id;
      setValeur('');
      setEtat('ouvert');
    } else if (payload.etape === 'resultat') {
      setEtat('resultat');
    }
  }, [payload]);

  const valider = () => {
    const nombre = parseFloat(valeur.replace(',', '.'));
    if (Number.isNaN(nombre)) return;
    onAction({ prim: 'estimation', valeur: nombre, id: dernierId.current });
    setEtat('envoye');
  };

  if (etat === 'resultat') {
    return (
      <div className="stage" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, textAlign: 'center', padding: 30 }}>
        <div className="display-title" style={{ fontSize: 24 }}>RÉSULTAT SUR L'ÉCRAN</div>
      </div>
    );
  }

  if (etat === 'envoye') {
    return (
      <div className="stage" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, textAlign: 'center', padding: 30 }}>
        <div className="display-title" style={{ fontSize: 24 }}>ENVOYÉ · {valeur}</div>
        <p style={{ color: 'var(--text-muted)' }}>En attente de la fin du chrono...</p>
      </div>
    );
  }

  if (etat !== 'ouvert') {
    return (
      <div className="stage" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, textAlign: 'center', padding: 30 }}>
        <p style={{ color: 'var(--text-muted)' }}>{payload?.consigne || 'En attente...'}</p>
      </div>
    );
  }

  return (
    <div className="stage" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22, padding: 30 }}>
      <div className="display-title" style={{ fontSize: 16, color: 'var(--text-dim)' }}>TA RÉPONSE</div>
      <input
        type="text"
        inputMode="decimal"
        value={valeur}
        onChange={(e) => setValeur(e.target.value)}
        autoFocus
        style={{ width: '80%', padding: '18px', borderRadius: 16, border: '3px solid var(--accent-yellow)', background: 'var(--bg-panel-raised)', color: 'var(--text-primary)', fontSize: 30, textAlign: 'center', fontFamily: 'var(--font-display)' }}
      />
      <button className="btn btn-lime" style={{ padding: '16px 40px', fontSize: 18 }} onClick={valider} disabled={valeur.trim() === ''}>
        Valider
      </button>
    </div>
  );
}
