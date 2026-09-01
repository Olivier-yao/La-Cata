import React, { useEffect, useRef, useState } from 'react';
import Avatar from '../components/Avatar.jsx';

// CourseDoigtsHost — Marathon des Doigts : chacun a un coureur sur une
// ligne de départ à ligne d'arrivée (réutilise MashPhone tel quel, chaque
// appui fait avancer). Pas de chrono qui coupe la manche : le premier
// arrivé n'arrête rien, c'est juste le premier d'un classement — la
// manche continue jusqu'à ce que tout le monde ait franchi la ligne (ou
// jusqu'au plafond de sécurité, pour ne pas rester bloqué si quelqu'un
// arrête de jouer). Chaque coureur garde son propre temps de parcours.

const DISTANCE_CIBLE = 140; // appuis pour franchir la ligne — de base ça avance lentement, il faut vraiment marteler
const PLAFOND_SECURITE = 45000; // ms

export default function CourseDoigtsHost({ remote, onTermine }) {
  const [, forceRender] = useState(0);
  const idRef = useRef(Date.now());
  const debutRef = useRef(Date.now());
  const arriveesRef = useRef({}); // nom -> tempsMs
  const termineRef = useRef(false);
  const joueursConnectes = remote.connectes.filter((j) => j.connecte).map((j) => j.nom);

  useEffect(() => {
    remote.resetActions();
    remote.envoyerAction({ prim: 'mash', etape: 'demarrer', id: idRef.current });
    const interval = setInterval(() => forceRender((n) => n + 1), 150);
    const plafond = setTimeout(() => finir(), PLAFOND_SECURITE);
    return () => { clearInterval(interval); clearTimeout(plafond); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totaux = {};
  Object.entries(remote.actionsRecues).forEach(([nom, payload]) => {
    if (payload?.prim === 'mash' && payload.id === idRef.current) totaux[nom] = payload.total || 0;
  });

  joueursConnectes.forEach((nom) => {
    if (arriveesRef.current[nom] == null && (totaux[nom] || 0) >= DISTANCE_CIBLE) {
      arriveesRef.current[nom] = Date.now() - debutRef.current;
    }
  });

  const tousArrives = joueursConnectes.length > 0 && joueursConnectes.every((n) => arriveesRef.current[n] != null);

  const finir = () => {
    if (termineRef.current) return;
    termineRef.current = true;
    remote.envoyerAction({ prim: 'mash', etape: 'fin', id: idRef.current });
    const classement = joueursConnectes
      .map((nom) => ({ nom, arrive: arriveesRef.current[nom] != null, temps: arriveesRef.current[nom], distance: totaux[nom] || 0 }))
      .sort((a, b) => {
        if (a.arrive && b.arrive) return a.temps - b.temps;
        if (a.arrive) return -1;
        if (b.arrive) return 1;
        return b.distance - a.distance;
      });
    const scores = {};
    classement.forEach(({ nom, distance }, i) => { scores[nom] = distance === 0 ? 0 : i === 0 ? 6 : i === 1 ? 3 : 1; });
    setTimeout(() => onTermine(scores), 3200);
    forceRender((n) => n + 1);
  };

  useEffect(() => {
    if (tousArrives) finir();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tousArrives]);

  const classementActuel = joueursConnectes
    .map((nom) => ({ nom, distance: totaux[nom] || 0, arrive: arriveesRef.current[nom] != null, temps: arriveesRef.current[nom] }))
    .sort((a, b) => b.distance - a.distance);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, padding: '36px 24px', textAlign: 'center' }}>
      <p style={{ color: 'var(--text-muted)', maxWidth: 460 }}>Tape le plus vite possible sur ton téléphone pour avancer — de base ça bouge à peine, il faut vraiment marteler. Pas de chrono qui coupe : la manche continue jusqu'à ce que tout le monde ait franchi la ligne.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%', maxWidth: 560 }}>
        {classementActuel.map(({ nom, distance, arrive, temps }, i) => {
          const pct = Math.min(100, Math.round((distance / DISTANCE_CIBLE) * 100));
          return (
            <div key={nom} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-dim)' }}>
                <span>{nom}</span>
                <span>{arrive ? `arrivé·e en ${(temps / 1000).toFixed(1)}s` : `${pct}%`}</span>
              </div>
              <div style={{ position: 'relative', width: '100%', height: 30, borderRadius: 999, background: 'var(--bg-panel-raised)', border: '3px solid var(--outline)', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, left: 0, width: `${pct}%`, background: arrive ? 'var(--accent-lime)' : 'var(--accent-cyan)', transition: 'width .15s linear' }} />
                <div style={{ position: 'absolute', top: '50%', left: `calc(${pct}% - 15px)`, transform: 'translateY(-50%)', transition: 'left .15s linear' }}>
                  <Avatar nom={nom} index={i} taille={26} contour={arrive ? 'var(--accent-lime)' : undefined} />
                </div>
                <div style={{ position: 'absolute', right: 4, top: '50%', transform: 'translateY(-50%)', fontSize: 14 }}>🏁</div>
              </div>
            </div>
          );
        })}
      </div>

      {termineRef.current && <p style={{ fontSize: 13, color: 'var(--text-dim)' }}>Points appliqués dans un instant...</p>}
    </div>
  );
}
