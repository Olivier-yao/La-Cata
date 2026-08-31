import React, { useEffect, useRef, useState } from 'react';

// SequenceHost — une séquence de couleurs/emojis est montrée UNE FOIS sur
// l'écran principal (tout le monde regarde en même temps), puis chaque
// téléphone doit la retaper dans l'ordre sur ses boutons (4 par défaut,
// `nbCases` pour en proposer plus — Simon Dit Numérique passe à 8).
// Classement par plus grand préfixe correct. Sert à Simon Dit Numérique
// (couleurs) et Mémoire Flash Collective (emojis, mêmes boutons, juste
// redécorés).

export const COULEURS_SEQUENCE = [
  'var(--accent-lime)', 'var(--accent-magenta)', 'var(--accent-cyan)', 'var(--accent-yellow)',
  'var(--accent-violet)', '#FF8A4D', '#4DFFC8', '#FF4DCF',
];

export default function SequenceHost({ remote, longueur = 5, nbCases = 4, symboles, consigne, onTermine }) {
  const [etape, setEtape] = useState('avant'); // avant | montre | ouvert | resultat
  const [flash, setFlash] = useState(-1);
  const [sequence, setSequence] = useState([]);
  const idRef = useRef(0);
  const timersRef = useRef([]);

  useEffect(() => () => timersRef.current.forEach(clearTimeout), []);

  const demarrer = () => {
    remote.resetActions();
    idRef.current = Date.now();
    const seq = Array.from({ length: longueur }, () => Math.floor(Math.random() * nbCases));
    setSequence(seq);
    setEtape('montre');
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    seq.forEach((c, i) => {
      timersRef.current.push(setTimeout(() => setFlash(c), i * 750));
      timersRef.current.push(setTimeout(() => setFlash(-1), i * 750 + 480));
    });
    timersRef.current.push(setTimeout(() => {
      setEtape('ouvert');
      remote.envoyerAction({ prim: 'sequence', etape: 'ouvert', longueur: seq.length, nbCases, id: idRef.current });
    }, seq.length * 750 + 400));
  };

  const reponses = {}; // nom -> [indices]
  Object.entries(remote.actionsRecues).forEach(([nom, payload]) => {
    if (payload?.prim === 'sequence' && payload.id === idRef.current) reponses[nom] = payload.reponse || [];
  });

  const scoreDe = (reponse) => {
    let n = 0;
    while (n < reponse.length && n < sequence.length && reponse[n] === sequence[n]) n++;
    return n;
  };

  const classement = Object.entries(reponses)
    .map(([nom, reponse]) => ({ nom, bon: scoreDe(reponse) }))
    .sort((a, b) => b.bon - a.bon);

  const terminer = () => {
    const scores = {};
    classement.forEach(({ nom, bon }, i) => {
      scores[nom] = bon === sequence.length ? 6 : i === 0 ? 3 : bon > 0 ? 1 : 0;
    });
    onTermine(scores);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, padding: '40px 24px', textAlign: 'center' }}>
      {consigne && <p style={{ color: 'var(--text-muted)', maxWidth: 480 }}>{consigne}</p>}

      {etape === 'avant' && <button className="btn btn-cyan" style={{ fontSize: 20, padding: '20px 44px' }} onClick={demarrer}>Montrer la séquence</button>}

      {etape === 'montre' && (
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${nbCases > 4 ? 4 : 2}, 1fr)`, gap: 14, width: nbCases > 4 ? 380 : 220, height: nbCases > 4 ? 190 : 220 }}>
          {Array.from({ length: nbCases }, (_, i) => i).map((i) => (
            <div key={i} style={{ borderRadius: 18, background: COULEURS_SEQUENCE[i], opacity: flash === i ? 1 : 0.25, transition: 'opacity .15s', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>
              {symboles ? symboles[i] : ''}
            </div>
          ))}
        </div>
      )}

      {etape === 'ouvert' && (
        <>
          <div className="display-title" style={{ fontSize: 20, color: 'var(--accent-cyan)' }}>Les téléphones retapent la séquence…</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
            {classement.map(({ nom, bon }) => <span key={nom} className="tag">{nom} · {bon}/{sequence.length}</span>)}
          </div>
          <button className="btn btn-lime" style={{ fontSize: 16, padding: '14px 30px' }} onClick={() => setEtape('resultat')}>Voir le résultat</button>
        </>
      )}

      {etape === 'resultat' && (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 380 }}>
            {classement.map(({ nom, bon }, i) => (
              <div key={nom} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 16px', borderRadius: 12, background: i === 0 ? 'var(--accent-lime)' : 'var(--bg-panel-raised)', color: i === 0 ? 'var(--outline)' : 'var(--text-primary)' }}>
                <span className="display-title" style={{ fontSize: 16 }}>{nom}</span>
                <span className="display-title" style={{ fontSize: 16 }}>{bon}/{sequence.length}</span>
              </div>
            ))}
          </div>
          <button className="btn btn-lime" style={{ fontSize: 18, padding: '16px 36px' }} onClick={terminer}>Valider les points</button>
        </>
      )}
    </div>
  );
}
