import React, { useEffect, useRef, useState } from 'react';

// JaugePhone — pas de tapotement : on MAINTIENT le bouton appuyé pour faire
// monter sa jauge, et elle redescend toute seule dès qu'on relâche. Il faut
// donc doser l'appui plutôt que marteler (Surchauffe). Envoi throttled de la
// valeur courante (pas un cumul) toutes les 100ms.

const VITESSE_CHARGE = 42; // points par seconde en maintenant
const VITESSE_DECHARGE = 26; // points par seconde relâché

export default function JaugePhone({ payload, onAction }) {
  const [etat, setEtat] = useState('attente'); // attente | ouvert | fini
  const [affichage, setAffichage] = useState(0);
  const valeurRef = useRef(0);
  const maintenuRef = useRef(false);
  const dernierEnvoiRef = useRef(0);
  const dernierTsRef = useRef(0);
  const idRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!payload) return;
    if (payload.etape === 'demarrer' && payload.id !== idRef.current) {
      idRef.current = payload.id;
      valeurRef.current = 0;
      setAffichage(0);
      setEtat('ouvert');
    } else if (payload.etape === 'fin' && payload.id === idRef.current) {
      setEtat('fini');
    }
  }, [payload]);

  useEffect(() => {
    const boucle = (ts) => {
      if (dernierTsRef.current) {
        const dt = (ts - dernierTsRef.current) / 1000;
        if (maintenuRef.current) {
          valeurRef.current = Math.min(100, valeurRef.current + VITESSE_CHARGE * dt);
        } else {
          valeurRef.current = Math.max(0, valeurRef.current - VITESSE_DECHARGE * dt);
        }
        setAffichage(Math.round(valeurRef.current));
        const maintenant = Date.now();
        if (maintenant - dernierEnvoiRef.current > 100) {
          dernierEnvoiRef.current = maintenant;
          onAction({ prim: 'jauge', valeur: Math.round(valeurRef.current), id: idRef.current });
        }
      }
      dernierTsRef.current = ts;
      rafRef.current = requestAnimationFrame(boucle);
    };
    if (etat === 'ouvert') rafRef.current = requestAnimationFrame(boucle);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); dernierTsRef.current = 0; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [etat]);

  if (etat === 'fini') {
    return (
      <div className="stage" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, textAlign: 'center', padding: 30 }}>
        <div className="display-title" style={{ fontSize: 26 }}>TERMINÉ</div>
        <p style={{ color: 'var(--text-muted)' }}>Regarde le résultat sur l'écran</p>
      </div>
    );
  }

  return (
    <div className="stage" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, padding: 30 }}>
      <div className="display-title" style={{ fontSize: 16, color: 'var(--text-dim)' }}>{etat === 'ouvert' ? 'MAINTIENS APPUYÉ !' : 'PRÊT ?'}</div>
      <button
        onPointerDown={() => { maintenuRef.current = true; }}
        onPointerUp={() => { maintenuRef.current = false; }}
        onPointerLeave={() => { maintenuRef.current = false; }}
        disabled={etat !== 'ouvert'}
        style={{
          width: 220,
          height: 220,
          borderRadius: 999,
          touchAction: 'none',
          background: `radial-gradient(circle at 50% ${100 - affichage}%, var(--accent-magenta) 0%, var(--bg-panel-raised) 70%)`,
          border: '6px solid var(--outline)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          userSelect: 'none',
        }}
      >
        <span className="display-title" style={{ fontSize: 36, color: 'var(--text-primary)' }}>{affichage}°</span>
      </button>
    </div>
  );
}
