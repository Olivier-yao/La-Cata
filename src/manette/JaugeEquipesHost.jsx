import React, { useEffect, useRef, useState } from 'react';

// JaugeEquipesHost — deux équipes s'affrontent en maintenant leur bouton
// appuyé (réutilise JaugePhone tel quel) : contrairement à Surchauffe,
// coopératif, ici c'est une vraie course entre deux jauges qui montent
// et redescendent en direct — la première équipe à atteindre l'objectif
// gagne instantanément, sinon celle qui est devant au bout du chrono.

const OBJECTIF = 160;
const DUREE = 20;

function formerEquipes(noms) {
  const melanges = [...noms].sort(() => Math.random() - 0.5);
  const milieu = Math.ceil(melanges.length / 2);
  return { A: melanges.slice(0, milieu), B: melanges.slice(milieu) };
}

export default function JaugeEquipesHost({ remote, onTermine }) {
  const [etape, setEtape] = useState('ouvert'); // ouvert | resultat
  const [tempsRestant, setTempsRestant] = useState(DUREE);
  const idRef = useRef(Date.now());
  const intervalRef = useRef(null);
  const joueursConnectes = remote.connectes.filter((j) => j.connecte).map((j) => j.nom);
  const [equipes] = useState(() => formerEquipes(joueursConnectes));

  useEffect(() => {
    remote.resetActions();
    const parJoueur = {};
    equipes.A.forEach((nom) => { parJoueur[nom] = { prim: 'jauge', etape: 'demarrer', id: idRef.current }; });
    equipes.B.forEach((nom) => { parJoueur[nom] = { prim: 'jauge', etape: 'demarrer', id: idRef.current }; });
    remote.envoyerActionPrivee(parJoueur);
    intervalRef.current = setInterval(() => setTempsRestant((t) => (t <= 1 ? 0 : t - 1)), 1000);
    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const valeurs = {};
  Object.entries(remote.actionsRecues).forEach(([nom, payload]) => {
    if (payload?.prim === 'jauge' && payload.id === idRef.current) valeurs[nom] = payload.valeur || 0;
  });
  const totalA = equipes.A.reduce((s, n) => s + (valeurs[n] || 0), 0);
  const totalB = equipes.B.reduce((s, n) => s + (valeurs[n] || 0), 0);

  useEffect(() => {
    if (etape === 'ouvert' && (totalA >= OBJECTIF || totalB >= OBJECTIF)) {
      clearInterval(intervalRef.current);
      setEtape('resultat');
      remote.envoyerAction({ prim: 'jauge', etape: 'fin', id: idRef.current });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalA, totalB]);

  useEffect(() => {
    if (etape === 'ouvert' && tempsRestant === 0) {
      clearInterval(intervalRef.current);
      setEtape('resultat');
      remote.envoyerAction({ prim: 'jauge', etape: 'fin', id: idRef.current });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tempsRestant, etape]);

  const gagnantA = totalA >= totalB;

  const valider = () => {
    const scores = {};
    const egalite = totalA === totalB;
    equipes.A.forEach((n) => { scores[n] = egalite ? 3 : gagnantA ? 6 : 2; });
    equipes.B.forEach((n) => { scores[n] = egalite ? 3 : !gagnantA ? 6 : 2; });
    onTermine(scores);
  };

  const barre = (total, couleur) => (
    <div style={{ position: 'relative', width: 44, height: 180, borderRadius: 999, border: '4px solid var(--outline)', background: 'var(--bg-panel-raised)', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: `${Math.min(100, (total / OBJECTIF) * 100)}%`, background: couleur, transition: 'height .15s linear' }} />
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, padding: '32px 24px', textAlign: 'center' }}>
      <p style={{ color: 'var(--text-muted)', maxWidth: 460 }}>Deux équipes maintiennent leur bouton appuyé — ça redescend si on relâche. Première équipe à {OBJECTIF} gagne, sinon celle qui est devant au chrono.</p>
      <div className="display-title" style={{ fontSize: 32, color: 'var(--accent-yellow)' }}>{tempsRestant}s</div>

      <div style={{ display: 'flex', gap: 32, alignItems: 'flex-end' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <span className="display-title" style={{ fontSize: 14, color: 'var(--accent-magenta)' }}>ÉQUIPE MAGENTA</span>
          {barre(totalA, 'var(--accent-magenta)')}
          <span className="display-title" style={{ fontSize: 20 }}>{Math.round(totalA)}</span>
          <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>{equipes.A.join(', ') || '—'}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <span className="display-title" style={{ fontSize: 14, color: 'var(--accent-cyan)' }}>ÉQUIPE CYAN</span>
          {barre(totalB, 'var(--accent-cyan)')}
          <span className="display-title" style={{ fontSize: 20 }}>{Math.round(totalB)}</span>
          <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>{equipes.B.join(', ') || '—'}</span>
        </div>
      </div>

      {etape === 'resultat' && (
        <>
          <div className="display-title" style={{ fontSize: 22, color: totalA === totalB ? 'var(--accent-yellow)' : 'var(--accent-lime)' }}>
            {totalA === totalB ? 'Égalité parfaite !' : gagnantA ? 'Équipe magenta gagne !' : 'Équipe cyan gagne !'}
          </div>
          <button className="btn btn-lime" style={{ fontSize: 18, padding: '16px 36px' }} onClick={valider}>Valider les points</button>
        </>
      )}
    </div>
  );
}
