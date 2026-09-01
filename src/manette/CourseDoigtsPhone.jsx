import React, { useEffect, useRef, useState } from 'react';

// CourseDoigtsPhone — même principe que MashPhone (marteler pour avancer)
// mais avec la même barre de progression que l'écran principal, pour que
// chacun voie son coureur approcher la ligne d'arrivée sur son propre
// téléphone. Une fois la ligne franchie, on arrête de compter et on
// affiche l'attente des autres au lieu de laisser un bouton qui ne sert
// plus à rien.

export default function CourseDoigtsPhone({ payload, onAction }) {
  const [etat, setEtat] = useState('attente'); // attente | ouvert | arrive | fini
  const [affichage, setAffichage] = useState(0);
  const compteRef = useRef(0);
  const dernierEnvoiRef = useRef(0);
  const idRef = useRef(null);
  const cibleRef = useRef(140);

  useEffect(() => {
    if (!payload) return;
    if (payload.etape === 'demarrer' && payload.id !== idRef.current) {
      idRef.current = payload.id;
      cibleRef.current = payload.cible || 140;
      compteRef.current = 0;
      setAffichage(0);
      setEtat('ouvert');
    } else if (payload.etape === 'fin' && payload.id === idRef.current) {
      if (etat === 'ouvert' || etat === 'arrive') onAction({ prim: 'mash', total: compteRef.current, id: idRef.current });
      setEtat('fini');
    }
  }, [payload]);

  const taper = () => {
    if (etat !== 'ouvert') return;
    compteRef.current += 1;
    setAffichage(compteRef.current);
    if (compteRef.current >= cibleRef.current) {
      onAction({ prim: 'mash', total: compteRef.current, id: idRef.current });
      setEtat('arrive');
      return;
    }
    const maintenant = Date.now();
    if (maintenant - dernierEnvoiRef.current > 100) {
      dernierEnvoiRef.current = maintenant;
      onAction({ prim: 'mash', total: compteRef.current, id: idRef.current });
    }
  };

  const pct = Math.min(100, Math.round((affichage / cibleRef.current) * 100));

  if (etat === 'fini') {
    return (
      <div className="stage" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, textAlign: 'center', padding: 30 }}>
        <div className="display-title" style={{ fontSize: 26 }}>TERMINÉ</div>
        <p style={{ color: 'var(--text-muted)' }}>Classement sur l'écran principal.</p>
      </div>
    );
  }

  if (etat === 'arrive') {
    return (
      <div className="stage" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, textAlign: 'center', padding: 30, background: 'var(--accent-lime)' }}>
        <span style={{ fontSize: 40 }}>🏁</span>
        <div className="display-title" style={{ fontSize: 24, color: 'var(--outline)' }}>LIGNE FRANCHIE !</div>
        <p style={{ color: 'var(--outline)', opacity: 0.8 }}>En attente des autres coureurs...</p>
      </div>
    );
  }

  return (
    <div className="stage" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24, padding: 30 }}>
      <div className="display-title" style={{ fontSize: 16, color: 'var(--text-dim)' }}>{etat === 'ouvert' ? 'TAPE VITE !' : 'PRÊT ?'}</div>

      <div style={{ position: 'relative', width: '100%', maxWidth: 260, height: 26, borderRadius: 999, background: 'var(--bg-panel-raised)', border: '3px solid var(--outline)', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, left: 0, width: `${pct}%`, background: 'var(--accent-cyan)', transition: 'width .1s linear' }} />
      </div>

      <button
        onClick={taper}
        disabled={etat !== 'ouvert'}
        style={{
          width: 220,
          height: 220,
          borderRadius: 999,
          touchAction: 'manipulation',
          background: 'var(--accent-lime)',
          border: '6px solid var(--outline)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          userSelect: 'none',
        }}
      >
        <span className="display-title" style={{ fontSize: 40, color: 'var(--outline)' }}>{pct}%</span>
      </button>
    </div>
  );
}
