import React, { useEffect, useRef, useState } from 'react';

// MashPhone — un gros bouton à marteler. Le compte est gardé localement
// (ref, pas de re-render à chaque tap) et renvoyé de temps en temps
// (throttle 100ms) pour ne pas noyer le petit serveur de messages.

export default function MashPhone({ payload, onAction, couleur }) {
  const [etat, setEtat] = useState('attente'); // attente | ouvert | fini | spectateur
  const [affichage, setAffichage] = useState(0);
  const compteRef = useRef(0);
  const dernierEnvoiRef = useRef(0);
  const idRef = useRef(null);

  useEffect(() => {
    if (!payload) return;
    if (payload.etape === 'demarrer' && payload.id !== idRef.current) {
      idRef.current = payload.id;
      compteRef.current = 0;
      setAffichage(0);
      setEtat('ouvert');
    } else if (payload.etape === 'spectateur' && payload.id !== idRef.current) {
      idRef.current = payload.id;
      setEtat('spectateur');
    } else if (payload.etape === 'fin' && payload.id === idRef.current) {
      if (etat === 'ouvert') onAction({ prim: 'mash', total: compteRef.current, id: idRef.current });
      if (etat !== 'spectateur') setEtat('fini');
    }
  }, [payload]);

  const equipeCouleur = payload?.equipe === 'A' ? 'var(--accent-magenta)' : payload?.equipe === 'B' ? 'var(--accent-cyan)' : (couleur?.bg || 'var(--accent-lime)');

  const taper = () => {
    if (etat !== 'ouvert') return;
    compteRef.current += 1;
    setAffichage(compteRef.current);
    const maintenant = Date.now();
    if (maintenant - dernierEnvoiRef.current > 100) {
      dernierEnvoiRef.current = maintenant;
      onAction({ prim: 'mash', total: compteRef.current, id: idRef.current });
    }
  };

  if (etat === 'fini') {
    return (
      <div className="stage" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, textAlign: 'center', padding: 30 }}>
        <div className="display-title" style={{ fontSize: 26 }}>TERMINÉ</div>
        <p style={{ color: 'var(--text-muted)' }}>{affichage} appuis</p>
      </div>
    );
  }

  if (etat === 'spectateur') {
    return (
      <div className="stage" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, textAlign: 'center', padding: 30 }}>
        <span style={{ fontSize: 40 }}>👀</span>
        <div className="display-title" style={{ fontSize: 22 }}>TU REGARDES CETTE MANCHE</div>
        <p style={{ color: 'var(--text-muted)' }}>Regarde le duel sur l'écran, ton tour reviendra.</p>
      </div>
    );
  }

  return (
    <div className="stage" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, padding: 30 }}>
      <div className="display-title" style={{ fontSize: 16, color: 'var(--text-dim)' }}>{etat === 'ouvert' ? 'TAPE VITE !' : 'PRÊT ?'}</div>
      <button
        onClick={taper}
        disabled={etat !== 'ouvert'}
        style={{
          width: 220,
          height: 220,
          borderRadius: 999,
          touchAction: 'manipulation',
          background: equipeCouleur,
          border: '6px solid var(--outline)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          userSelect: 'none',
        }}
      >
        <span className="display-title" style={{ fontSize: 40, color: 'var(--outline)' }}>{affichage}</span>
      </button>
    </div>
  );
}
