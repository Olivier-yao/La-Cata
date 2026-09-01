import React, { useEffect, useRef, useState } from 'react';

// ChaiseMusicaleHost — tout le monde martèle son téléphone (réutilise
// MashPhone), mais l'arrêt tombe à un instant totalement imprévisible
// (entre 2 et 7 secondes, jamais annoncé). Dès que "la musique s'arrête",
// celui ou celle qui avait le MOINS appuyé à cet instant précis est
// éliminé·e — contrairement à Marathon des Doigts, ici c'est la panique
// de ne jamais savoir quand ça s'arrête qui fait le jeu, pas la vitesse
// pure sur une durée connue.

function delaiAleatoire() {
  return 2000 + Math.random() * 5000;
}

export default function ChaiseMusicaleHost({ remote, onTermine }) {
  const [etape, setEtape] = useState('avant'); // avant | ouvert | resultat
  const idRef = useRef(0);
  const timeoutRef = useRef(null);
  const joueursConnectes = remote.connectes.filter((j) => j.connecte).map((j) => j.nom);

  const demarrer = () => {
    remote.resetActions();
    idRef.current = Date.now();
    setEtape('ouvert');
    remote.envoyerAction({ prim: 'mash', etape: 'demarrer', id: idRef.current });
    timeoutRef.current = setTimeout(() => {
      setEtape('resultat');
      remote.envoyerAction({ prim: 'mash', etape: 'fin', id: idRef.current });
    }, delaiAleatoire());
  };

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const totaux = {};
  Object.entries(remote.actionsRecues).forEach(([nom, payload]) => {
    if (payload?.prim === 'mash' && payload.id === idRef.current) totaux[nom] = payload.total || 0;
  });

  const classement = joueursConnectes
    .map((nom) => ({ nom, total: totaux[nom] || 0 }))
    .sort((a, b) => b.total - a.total);
  const minimum = classement.length > 0 ? Math.min(...classement.map((c) => c.total)) : null;
  // Égalité pour la dernière place : tout le monde à ce score est éliminé,
  // pas un seul tiré arbitrairement.
  const eliminesSet = new Set(classement.filter((c) => c.total === minimum).map((c) => c.nom));

  const valider = () => {
    const scores = {};
    classement.forEach(({ nom }) => { scores[nom] = eliminesSet.has(nom) ? 0 : 4; });
    onTermine(scores);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, padding: '40px 24px', textAlign: 'center' }}>
      {etape === 'avant' && (
        <>
          <p style={{ color: 'var(--text-muted)', maxWidth: 440 }}>Tout le monde tape sur son téléphone. La musique s'arrête sans prévenir, à n'importe quel moment — celui ou celle qui a le moins tapé à cet instant précis est éliminé·e.</p>
          <button className="btn btn-cyan" style={{ fontSize: 20, padding: '20px 44px' }} onClick={demarrer}>Lancer la musique</button>
        </>
      )}

      {etape === 'ouvert' && (
        <>
          <div className="display-title" style={{ fontSize: 26, color: 'var(--accent-magenta)', animation: 'lc-wobble .6s ease-in-out infinite' }}>🎵 LA MUSIQUE TOURNE… 🎵</div>
          <p style={{ color: 'var(--text-dim)' }}>Ça peut s'arrêter à tout moment. Tape !</p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
            {Object.entries(totaux).map(([nom, total]) => <span key={nom} className="tag">{nom} · {total}</span>)}
          </div>
        </>
      )}

      {etape === 'resultat' && (
        <>
          <div className="display-title" style={{ fontSize: 22, color: 'var(--accent-magenta)' }}>LA MUSIQUE S'EST ARRÊTÉE !</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 380 }}>
            {classement.map(({ nom, total }) => {
              const estElimine = eliminesSet.has(nom);
              return (
                <div key={nom} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 16px', borderRadius: 12, background: estElimine ? 'var(--accent-magenta)' : 'var(--bg-panel-raised)', color: estElimine ? 'var(--outline)' : 'var(--text-primary)' }}>
                  <span className="display-title" style={{ fontSize: 15 }}>{nom}{estElimine ? ' · ÉLIMINÉ·E' : ''}</span>
                  <span className="display-title" style={{ fontSize: 15 }}>{total}</span>
                </div>
              );
            })}
          </div>
          <button className="btn btn-lime" style={{ fontSize: 18, padding: '16px 36px' }} onClick={valider}>Valider les points</button>
        </>
      )}
    </div>
  );
}
