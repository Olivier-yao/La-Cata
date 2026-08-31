import React, { useEffect, useRef, useState } from 'react';

// RouletteHost — la roue tourne en continu sur l'écran principal, chaque
// téléphone a un bouton "STOP" (réutilise BuzzerPhone tel quel) et gagne
// selon la case sur laquelle la roue se trouvait AU MOMENT de son appui.
// Un seul chrono partagé : Date.now() sert de référence commune entre
// l'écran et les téléphones, pas besoin de synchroniser des horloges.

const PERIODE_MS = 2000;
const SEGMENTS = ['JACKPOT', 'RIEN', 'GAGNANT', 'RIEN', 'GAGNANT', 'RIEN'];
const COULEURS = ['var(--accent-yellow)', 'var(--bg-panel-raised)', 'var(--accent-lime)', 'var(--bg-panel-raised)', 'var(--accent-lime)', 'var(--bg-panel-raised)'];
const POINTS = { JACKPOT: 6, GAGNANT: 3, RIEN: 0 };
const TAILLE_SEGMENT = 360 / SEGMENTS.length;

function segmentA(angleDeg) {
  const idx = Math.floor((((angleDeg % 360) + 360) % 360) / TAILLE_SEGMENT);
  return SEGMENTS[idx];
}

export default function RouletteHost({ remote, consigne, onTermine }) {
  const [etape, setEtape] = useState('avant'); // avant | tourne | resultat
  const [angle, setAngle] = useState(0);
  const debutRef = useRef(0);
  const idRef = useRef(0);
  const rafRef = useRef(null);

  const demarrer = () => {
    remote.resetActions();
    idRef.current = Date.now();
    debutRef.current = idRef.current;
    setEtape('tourne');
    remote.envoyerAction({ prim: 'buzzer', etape: 'ouvert', consigne: 'Tape STOP au bon moment !', id: idRef.current });
    const boucle = () => {
      setAngle(((Date.now() - debutRef.current) / PERIODE_MS) * 360);
      rafRef.current = requestAnimationFrame(boucle);
    };
    rafRef.current = requestAnimationFrame(boucle);
  };

  const arreter = () => {
    cancelAnimationFrame(rafRef.current);
    setEtape('resultat');
  };

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  const resultats = {}; // nom -> { segment, points }
  Object.entries(remote.actionsRecues).forEach(([nom, payload]) => {
    if (payload?.t == null) return;
    const angleAuTap = ((payload.t - debutRef.current) / PERIODE_MS) * 360;
    const segment = segmentA(angleAuTap);
    resultats[nom] = { segment, points: POINTS[segment] };
  });

  const terminer = () => {
    const scores = {};
    Object.entries(resultats).forEach(([nom, r]) => { scores[nom] = r.points; });
    onTermine(scores);
  };

  const gradient = `conic-gradient(${COULEURS.map((c, i) => `${c} ${i * TAILLE_SEGMENT}deg ${(i + 1) * TAILLE_SEGMENT}deg`).join(', ')})`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, padding: '40px 24px', textAlign: 'center' }}>
      {consigne && <p style={{ color: 'var(--text-muted)', maxWidth: 480 }}>{consigne}</p>}

      {etape !== 'avant' && (
        <div style={{ position: 'relative', width: 220, height: 220 }}>
          <div style={{ width: '100%', height: '100%', borderRadius: 999, transform: `rotate(${angle}deg)`, background: gradient, border: '4px solid var(--outline)' }} />
          <div style={{ position: 'absolute', top: -6, left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '10px solid transparent', borderRight: '10px solid transparent', borderTop: '16px solid var(--accent-magenta)' }} />
        </div>
      )}

      {etape === 'avant' && <button className="btn btn-cyan" style={{ fontSize: 20, padding: '20px 44px' }} onClick={demarrer}>Lancer la roue</button>}

      {etape === 'tourne' && (
        <>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
            {Object.keys(resultats).map((n) => <span key={n} className="tag">{n} · {resultats[n].segment}</span>)}
          </div>
          <button className="btn btn-lime" style={{ fontSize: 16, padding: '14px 30px' }} onClick={arreter}>Arrêter et voir le résultat</button>
        </>
      )}

      {etape === 'resultat' && (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 380 }}>
            {Object.entries(resultats).sort((a, b) => b[1].points - a[1].points).map(([nom, r]) => (
              <div key={nom} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 16px', borderRadius: 12, background: r.points === 6 ? 'var(--accent-yellow)' : r.points > 0 ? 'var(--accent-lime)' : 'var(--bg-panel-raised)', color: r.points > 0 ? 'var(--outline)' : 'var(--text-primary)' }}>
                <span className="display-title" style={{ fontSize: 16 }}>{nom}</span>
                <span className="display-title" style={{ fontSize: 16 }}>{r.segment} · +{r.points}</span>
              </div>
            ))}
          </div>
          <button className="btn btn-lime" style={{ fontSize: 18, padding: '16px 36px' }} onClick={terminer}>Valider les points</button>
        </>
      )}
    </div>
  );
}
