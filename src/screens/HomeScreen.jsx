import React, { useEffect } from 'react';

// HomeScreen — le splash. Il ne se clique plus : la séquence se joue
// toute seule (1,2 s), puis bascule automatiquement vers le lobby — voir
// le kit de design "Manette Party", section 34-36bis pour la chronologie
// exacte. Un clic n'importe où saute directement à la suite, pour ceux
// qui ont déjà vu l'intro cent fois.

const DUREE_SORTIE = 300;
const DELAI_SORTIE = 1200;

export default function HomeScreen({ onCommencer }) {
  useEffect(() => {
    const t = setTimeout(onCommencer, DELAI_SORTIE + DUREE_SORTIE);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="stage" style={{ minHeight: 480, display: 'flex', cursor: 'pointer' }} onClick={onCommencer}>
      <div className="stripes-bg" />
      <div style={{ position: 'absolute', width: 260, height: 260, borderRadius: 999, background: 'radial-gradient(circle, rgba(124,77,255,.5), transparent 68%)', top: -100, left: -60 }} />
      <div style={{ position: 'absolute', width: 220, height: 220, borderRadius: 999, background: 'radial-gradient(circle, rgba(200,255,77,.28), transparent 68%)', bottom: -90, right: -50 }} />

      {[
        { top: 40, left: 50, size: 22, color: 'var(--accent-yellow)', delai: 0, rond: false },
        { top: 20, left: 300, size: 16, color: 'var(--accent-cyan)', delai: 120, rond: true },
        { top: 60, right: 90, size: 20, color: 'var(--accent-magenta)', delai: 240, rond: false },
        { top: 30, right: 260, size: 14, color: 'var(--accent-lime)', delai: 360, rond: true },
        { top: 80, left: 460, size: 18, color: 'var(--accent-yellow)', delai: 480, rond: false },
      ].map((c, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: c.top,
            left: c.left,
            right: c.right,
            width: c.size,
            height: c.size,
            background: c.color,
            borderRadius: c.rond ? 999 : 0,
            transform: c.rond ? undefined : 'rotate(18deg)',
            animation: `lc-fall .75s cubic-bezier(.22,.9,.3,1) ${c.delai}ms both`,
          }}
        />
      ))}

      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 26, padding: '60px 40px', textAlign: 'center' }}>
        <h1
          className="display-title"
          style={{
            fontSize: 'clamp(56px, 11vw, 120px)',
            color: 'var(--accent-lime)',
            animation: `lc-logoin .42s cubic-bezier(.18,.9,.24,1) both, lc-shadowin .4s ease-out .3s both, lc-logout ${DUREE_SORTIE}ms ease-in ${DELAI_SORTIE}ms both`,
          }}
        >
          LA CATA
        </h1>
        <div className="display-title" style={{ fontSize: 15, letterSpacing: '.3em', color: 'var(--accent-yellow)', animation: 'lc-wobble 3s ease-in-out infinite' }}>
          2 À 8 JOUEURS · UN ÉCRAN, VOS TÉLÉPHONES
        </div>
      </div>
    </div>
  );
}
