import React, { useEffect, useRef, useState } from 'react';
import Avatar from '../components/Avatar.jsx';

// JaugeHost — jauge collective coopérative. Contrairement à MashHost, la
// valeur de chaque joueur n'est pas cumulative : elle reflète l'état
// courant de sa jauge (qui redescend s'il relâche), donc il faut que le
// groupe reste synchronisé pour maintenir le total au-dessus de l'objectif.
// Termine plus tôt si l'objectif est atteint. Démarre tout seul au montage.

export default function JaugeHost({ remote, joueurs, consigne, objectif, duree = 10, onTermine }) {
  const [etape, setEtape] = useState('ouvert'); // ouvert | resultat
  const [tempsRestant, setTempsRestant] = useState(duree);
  const idRef = useRef(Date.now());
  const intervalRef = useRef(null);
  const indexJoueur = Object.fromEntries(joueurs.map((nom, i) => [nom, i]));
  const nomsConnectes = remote.connectes.filter((j) => j.connecte).map((j) => j.nom);

  useEffect(() => {
    remote.resetActions();
    remote.envoyerAction({ prim: 'jauge', etape: 'demarrer', consigne, id: idRef.current });
    intervalRef.current = setInterval(() => setTempsRestant((t) => (t <= 1 ? 0 : t - 1)), 1000);
    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const valeurs = {};
  Object.entries(remote.actionsRecues).forEach(([nom, payload]) => {
    if (payload?.prim === 'jauge' && payload.id === idRef.current) valeurs[nom] = payload.valeur || 0;
  });
  const total = Object.values(valeurs).reduce((s, v) => s + v, 0);
  const pourcent = Math.min(100, Math.round((total / objectif) * 100));

  useEffect(() => {
    if (etape === 'ouvert' && total >= objectif) {
      clearInterval(intervalRef.current);
      setEtape('resultat');
      remote.envoyerAction({ prim: 'jauge', etape: 'fin', id: idRef.current });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total]);

  useEffect(() => {
    if (etape === 'ouvert' && tempsRestant === 0) {
      clearInterval(intervalRef.current);
      setEtape('resultat');
      remote.envoyerAction({ prim: 'jauge', etape: 'fin', id: idRef.current });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tempsRestant, etape]);

  const reussi = total >= objectif;

  const valider = () => {
    const scores = {};
    nomsConnectes.forEach((n) => { scores[n] = reussi ? 5 : 1; });
    onTermine(scores);
  };

  useEffect(() => {
    if (etape === 'resultat') {
      const t = setTimeout(valider, 2500);
      return () => clearTimeout(t);
    }
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [etape]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, padding: '32px 24px', textAlign: 'center' }}>
      {consigne && <p style={{ color: 'var(--text-muted)', maxWidth: 480 }}>{consigne}</p>}
      <div className="display-title" style={{ fontSize: 40, color: 'var(--accent-yellow)' }}>{tempsRestant}s</div>

      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 26 }}>
        <div style={{ position: 'relative', width: 44, height: 190, borderRadius: 999, border: '4px solid var(--outline)', background: 'var(--bg-panel-raised)', overflow: 'hidden', boxShadow: 'var(--shadow-hard-sm)' }}>
          <div
            style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              height: `${Math.min(100, pourcent)}%`,
              background: pourcent >= 100 ? 'var(--accent-lime)' : 'var(--accent-magenta)',
              transition: 'height .15s linear',
            }}
          />
          {pourcent >= 80 && (
            <div style={{ position: 'absolute', top: 4, left: 0, right: 0, textAlign: 'center', fontSize: 20, animation: 'lc-wave 0.5s ease-in-out infinite' }}>🔥</div>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8 }}>
          <div className="display-title" style={{ fontSize: 28, color: 'var(--text-primary)' }}>{total} / {objectif}</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {nomsConnectes.map((nom) => (
              <div key={nom} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <Avatar nom={nom} index={indexJoueur[nom]} taille={32} contour={(valeurs[nom] || 0) > 50 ? 'var(--accent-magenta)' : undefined} />
                <span style={{ fontSize: 10, color: 'var(--text-dim)' }}>{Math.round(valeurs[nom] || 0)}°</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {etape === 'resultat' && (
        <>
          <div className="display-title" style={{ fontSize: 22, color: reussi ? 'var(--accent-lime)' : 'var(--accent-magenta)' }}>
            {reussi ? 'Surchauffe atteinte, bravo à tous !' : 'Refroidi avant l\'objectif...'}
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-dim)' }}>Points appliqués dans un instant...</p>
        </>
      )}
    </div>
  );
}
