import React, { useEffect, useRef, useState } from 'react';
import { sonUrgence } from '../lib/son.js';
import { hapticUrgence } from '../lib/haptique.js';

// CountdownRing — anneau conique de compte à rebours (kit : Défi Chrono
// Absurde, Dessine à l'Aveugle). `actif` déclenche le décompte ; `onFin`
// est appelé une fois à zéro. `couleur` définit la teinte de l'anneau et
// du chiffre quand `pulseFinale` est désactivé.

export default function CountdownRing({ secondes, actif, onFin, couleur = 'var(--accent-cyan)', pulseFinale = false, taille = 300 }) {
  const [restant, setRestant] = useState(secondes);
  const intervalRef = useRef(null);
  const onFinRef = useRef(onFin);
  onFinRef.current = onFin;

  useEffect(() => setRestant(secondes), [secondes]);

  useEffect(() => {
    if (!actif) return undefined;
    intervalRef.current = setInterval(() => {
      setRestant((r) => (r <= 1 ? 0 : r - 1));
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [actif]);

  useEffect(() => {
    if (actif && restant === 0) {
      clearInterval(intervalRef.current);
      onFinRef.current && onFinRef.current();
    }
  }, [actif, restant]);

  const fraction = restant / secondes;
  const urgence = pulseFinale && restant <= Math.min(5, secondes);
  const teinte = urgence ? 'var(--accent-magenta)' : couleur;

  useEffect(() => {
    if (actif && urgence && restant > 0) {
      sonUrgence();
      hapticUrgence();
    }
  }, [restant, actif, urgence]);

  return (
    <div
      style={{
        position: 'relative',
        width: taille,
        height: taille,
        borderRadius: '999px',
        background: `conic-gradient(${teinte} ${fraction * 360}deg, var(--bg-panel-raised) ${fraction * 360}deg 360deg)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '6px solid var(--outline)',
        animation: urgence ? 'lc-shake .42s ease-in-out infinite' : 'none',
        transition: 'background 0.3s linear',
      }}
    >
      <div
        style={{
          width: taille - 66,
          height: taille - 66,
          borderRadius: '999px',
          background: 'var(--bg-deep)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
        }}
      >
        <div className="display-title" style={{ fontSize: taille * 0.36, lineHeight: 1, color: teinte, animation: urgence ? 'lc-tick 1s ease-out infinite' : 'none' }}>
          {String(restant).padStart(2, '0')}
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, letterSpacing: '.2em', color: 'var(--text-muted)' }}>SECONDES</div>
      </div>
    </div>
  );
}
