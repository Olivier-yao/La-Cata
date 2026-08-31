import React, { useEffect, useRef, useState } from 'react';

// MashHost — jauge/appuis répétés. `mode: 'equipes'` (Tir à la Corde) sépare
// les téléphones en deux camps qui s'affrontent ; `mode: 'ffa'` (Le Trône,
// Marathon des Doigts, Surchauffe) classe chacun individuellement. En mode
// coopératif (`cooperatif: true`), on compare la somme des appuis à un
// objectif au lieu de départager les joueurs entre eux.

export default function MashHost({ remote, mode = 'ffa', equipes, cooperatif = false, objectif = 80, duree = 8, consigne, onTermine }) {
  const [etape, setEtape] = useState('avant'); // avant | ouvert | resultat
  const [tempsRestant, setTempsRestant] = useState(duree);
  const intervalRef = useRef(null);
  const idRef = useRef(0);

  const demarrer = () => {
    remote.resetActions();
    idRef.current = Date.now();
    setTempsRestant(duree);
    setEtape('ouvert');
    if (mode === 'equipes' && equipes) {
      const parJoueur = {};
      (equipes.A || []).forEach((nom) => { parJoueur[nom] = { prim: 'mash', etape: 'demarrer', equipe: 'A', id: idRef.current }; });
      (equipes.B || []).forEach((nom) => { parJoueur[nom] = { prim: 'mash', etape: 'demarrer', equipe: 'B', id: idRef.current }; });
      remote.envoyerActionPrivee(parJoueur);
    } else {
      remote.envoyerAction({ prim: 'mash', etape: 'demarrer', id: idRef.current });
    }
    intervalRef.current = setInterval(() => {
      setTempsRestant((t) => (t <= 1 ? 0 : t - 1));
    }, 1000);
  };

  useEffect(() => {
    if (etape === 'ouvert' && tempsRestant === 0) {
      clearInterval(intervalRef.current);
      setEtape('resultat');
      remote.envoyerAction({ prim: 'mash', etape: 'fin', id: idRef.current });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tempsRestant, etape]);

  useEffect(() => () => clearInterval(intervalRef.current), []);

  const totaux = {};
  Object.entries(remote.actionsRecues).forEach(([nom, payload]) => {
    if (payload?.prim === 'mash' && payload.id === idRef.current) totaux[nom] = payload.total || 0;
  });

  let contenuResultat = null;
  const scoresAAppliquer = {};

  if (mode === 'equipes' && equipes) {
    const totalA = (equipes.A || []).reduce((s, n) => s + (totaux[n] || 0), 0);
    const totalB = (equipes.B || []).reduce((s, n) => s + (totaux[n] || 0), 0);
    const total = totalA + totalB || 1;
    const pourcentA = Math.round((totalA / total) * 100);
    contenuResultat = (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', width: '100%', maxWidth: 480 }}>
        <div style={{ display: 'flex', width: '100%', height: 34, borderRadius: 999, overflow: 'hidden', border: '3px solid var(--outline)' }}>
          <div style={{ width: `${pourcentA}%`, background: 'var(--accent-magenta)', transition: 'width .3s' }} />
          <div style={{ width: `${100 - pourcentA}%`, background: 'var(--accent-cyan)', transition: 'width .3s' }} />
        </div>
        <div className="display-title" style={{ fontSize: 22 }}>
          {totalA === totalB ? 'Égalité parfaite !' : totalA > totalB ? 'Équipe magenta gagne !' : 'Équipe cyan gagne !'}
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-dim)' }}>{totalA} contre {totalB} appuis</div>
      </div>
    );
    (equipes.A || []).forEach((n) => { scoresAAppliquer[n] = totalA >= totalB ? 6 : 2; });
    (equipes.B || []).forEach((n) => { scoresAAppliquer[n] = totalB >= totalA ? 6 : 2; });
  } else if (cooperatif) {
    const totalGroupe = Object.values(totaux).reduce((s, n) => s + n, 0);
    const reussi = totalGroupe >= objectif;
    contenuResultat = (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}>
        <div className="display-title" style={{ fontSize: 40, color: reussi ? 'var(--accent-lime)' : 'var(--accent-magenta)' }}>{totalGroupe} / {objectif}</div>
        <div className="display-title" style={{ fontSize: 20 }}>{reussi ? 'Objectif atteint, bravo à tous !' : 'Objectif manqué de peu...'}</div>
      </div>
    );
    Object.keys(totaux).forEach((n) => { scoresAAppliquer[n] = reussi ? 5 : 1; });
  } else {
    const classement = Object.entries(totaux).sort((a, b) => b[1] - a[1]);
    contenuResultat = (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 420 }}>
        {classement.map(([nom, total], i) => (
          <div key={nom} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 16px', borderRadius: 12, background: i === 0 ? 'var(--accent-lime)' : 'var(--bg-panel-raised)', color: i === 0 ? 'var(--outline)' : 'var(--text-primary)' }}>
            <span className="display-title" style={{ fontSize: 16 }}>{i + 1}. {nom}</span>
            <span className="display-title" style={{ fontSize: 16 }}>{total}</span>
          </div>
        ))}
      </div>
    );
    classement.forEach(([nom], i) => { scoresAAppliquer[nom] = i === 0 ? 6 : i === 1 ? 3 : 1; });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, padding: '44px 24px', textAlign: 'center' }}>
      {consigne && <p style={{ color: 'var(--text-muted)', maxWidth: 480 }}>{consigne}</p>}
      {etape === 'avant' && <button className="btn btn-cyan" style={{ fontSize: 20, padding: '20px 44px' }} onClick={demarrer}>Lancer ({duree}s)</button>}
      {etape === 'ouvert' && (
        <>
          <div className="display-title" style={{ fontSize: 48, color: 'var(--accent-yellow)' }}>{tempsRestant}</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
            {Object.entries(totaux).map(([nom, total]) => <span key={nom} className="tag">{nom} · {total}</span>)}
          </div>
        </>
      )}
      {etape === 'resultat' && (
        <>
          {contenuResultat}
          <button className="btn btn-lime" style={{ fontSize: 18, padding: '16px 36px' }} onClick={() => onTermine(scoresAAppliquer)}>Valider les points</button>
        </>
      )}
    </div>
  );
}
