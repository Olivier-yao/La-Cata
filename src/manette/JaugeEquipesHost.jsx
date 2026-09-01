import React, { useEffect, useRef, useState } from 'react';

// JaugeEquipesHost — deux équipes s'affrontent en maintenant leur bouton
// appuyé (réutilise JaugePhone tel quel), mais contrairement à une course
// vers un maximum, l'objectif est de se CALIBRER sur un nombre cible tiré
// au sort et de rester le plus près possible jusqu'à la fin du chrono —
// dépasser franchement n'aide pas, il faut doser.

const DUREE = 20;

function genererCible() {
  return 60 + Math.floor(Math.random() * 90); // 60..150
}

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
  const [cible] = useState(genererCible);

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
    if (etape === 'ouvert' && tempsRestant === 0) {
      clearInterval(intervalRef.current);
      setEtape('resultat');
      remote.envoyerAction({ prim: 'jauge', etape: 'fin', id: idRef.current });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tempsRestant, etape]);

  const ecartA = Math.abs(totalA - cible);
  const ecartB = Math.abs(totalB - cible);
  const gagnantA = ecartA < ecartB;
  const egaliteEcarts = ecartA === ecartB;

  const valider = () => {
    const scores = {};
    equipes.A.forEach((n) => { scores[n] = egaliteEcarts ? 3 : gagnantA ? 6 : 2; });
    equipes.B.forEach((n) => { scores[n] = egaliteEcarts ? 3 : !gagnantA ? 6 : 2; });
    onTermine(scores);
  };

  useEffect(() => {
    if (etape === 'resultat') {
      const t = setTimeout(valider, 3000);
      return () => clearTimeout(t);
    }
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [etape]);

  const echelleMax = cible * 1.7;
  const barre = (total, couleur) => (
    <div style={{ position: 'relative', width: 44, height: 180, borderRadius: 999, border: '4px solid var(--outline)', background: 'var(--bg-panel-raised)', overflow: 'visible' }}>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, top: 0, borderRadius: 999, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: `${Math.min(100, (total / echelleMax) * 100)}%`, background: couleur, transition: 'height .15s linear' }} />
      </div>
      <div style={{ position: 'absolute', left: -8, right: -8, bottom: `${Math.min(100, (cible / echelleMax) * 100)}%`, height: 3, background: 'var(--accent-yellow)' }} />
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, padding: '32px 24px', textAlign: 'center' }}>
      <p style={{ color: 'var(--text-muted)', maxWidth: 460 }}>Deux équipes maintiennent leur bouton appuyé — ça redescend si on relâche. Le trait jaune est la cible : à la fin, l'équipe la plus proche gagne, pas la plus haute.</p>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
        <div className="display-title" style={{ fontSize: 32, color: 'var(--accent-yellow)' }}>{tempsRestant}s</div>
        <div className="display-title" style={{ fontSize: 16, color: 'var(--text-dim)' }}>CIBLE : {cible}</div>
      </div>

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
          <div className="display-title" style={{ fontSize: 22, color: egaliteEcarts ? 'var(--accent-yellow)' : 'var(--accent-lime)' }}>
            {egaliteEcarts ? 'Égalité parfaite !' : gagnantA ? 'Équipe magenta gagne, plus proche de la cible !' : 'Équipe cyan gagne, plus proche de la cible !'}
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-dim)' }}>Points appliqués dans un instant...</p>
        </>
      )}
    </div>
  );
}
