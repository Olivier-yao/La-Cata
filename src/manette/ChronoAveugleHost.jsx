import React, { useEffect, useRef, useState } from 'react';

// ChronoAveugleHost — un chrono invisible tourne, chacun a un seul appui
// "STOP" sur son téléphone (réutilise BuzzerPhone tel quel, comme
// RouletteHost). Personne ne voit le temps qui passe : c'est une pure
// épreuve de sens du temps, sans aucun repère visuel — le plus proche de
// l'objectif secret l'emporte, dépasser coûte plus cher que d'être en
// dessous.

const DUREE_MAX = 16; // secondes, fenêtre d'appui la plus longue possible

function genererObjectif() {
  return 5 + Math.random() * 8; // entre 5 et 13 secondes
}

export default function ChronoAveugleHost({ remote, onTermine }) {
  const [etape, setEtape] = useState('avant'); // avant | ouvert | resultat
  const [objectif] = useState(genererObjectif);
  const debutRef = useRef(0);
  const idRef = useRef(0);
  const timeoutRef = useRef(null);
  const joueursConnectes = remote.connectes.filter((j) => j.connecte).map((j) => j.nom);

  const demarrer = () => {
    remote.resetActions();
    idRef.current = Date.now();
    debutRef.current = idRef.current;
    setEtape('ouvert');
    remote.envoyerAction({ prim: 'buzzer', etape: 'ouvert', consigne: 'Appuie quand tu penses que le temps secret est écoulé.', id: idRef.current });
    timeoutRef.current = setTimeout(() => setEtape('resultat'), DUREE_MAX * 1000);
  };

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const resultats = {}; // nom -> { tempsSec, ecart, aTemps }
  Object.entries(remote.actionsRecues).forEach(([nom, payload]) => {
    if (payload?.t == null) return;
    const tempsSec = (payload.t - debutRef.current) / 1000;
    const ecart = tempsSec - objectif;
    resultats[nom] = { tempsSec, ecart };
  });

  useEffect(() => {
    if (etape === 'ouvert' && joueursConnectes.length > 0 && Object.keys(resultats).length >= joueursConnectes.length) {
      clearTimeout(timeoutRef.current);
      setEtape('resultat');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Object.keys(resultats).length]);

  const classement = Object.entries(resultats)
    .map(([nom, r]) => ({
      nom,
      ...r,
      // Un dépassement du temps secret pique plus qu'un arrêt trop tôt :
      // s'arrêter pile avant l'objectif reste une "quasi-réussite".
      score: r.ecart > 0 ? r.ecart * 1.6 : Math.abs(r.ecart),
    }))
    .sort((a, b) => a.score - b.score);

  const valider = () => {
    const scores = {};
    classement.forEach(({ nom }, i) => { scores[nom] = i === 0 ? 6 : i === 1 ? 3 : 1; });
    joueursConnectes.filter((n) => !(n in scores)).forEach((n) => { scores[n] = 0; });
    onTermine(scores);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, padding: '40px 24px', textAlign: 'center' }}>
      {etape === 'avant' && (
        <>
          <p style={{ color: 'var(--text-muted)', maxWidth: 440 }}>Un temps secret est fixé. Personne ne voit de chrono, ni sur l'écran ni sur le téléphone — au signal, chacun appuie STOP quand il pense que le temps est écoulé. Le plus proche gagne.</p>
          <button className="btn btn-cyan" style={{ fontSize: 20, padding: '20px 44px' }} onClick={demarrer}>Démarrer le chrono secret</button>
        </>
      )}

      {etape === 'ouvert' && (
        <>
          <div className="display-title" style={{ fontSize: 40, color: 'var(--accent-magenta)', animation: 'lc-wobble 1s ease-in-out infinite' }}>⏱️ ???</div>
          <p style={{ color: 'var(--text-dim)' }}>{Object.keys(resultats).length} / {joueursConnectes.length} ont déjà appuyé</p>
        </>
      )}

      {etape === 'resultat' && (
        <>
          <div className="display-title" style={{ fontSize: 18, color: 'var(--text-dim)' }}>LE TEMPS SECRET ÉTAIT <span style={{ color: 'var(--accent-lime)' }}>{objectif.toFixed(2)}s</span></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 380 }}>
            {classement.map(({ nom, tempsSec, ecart }, i) => (
              <div key={nom} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 16px', borderRadius: 12, background: i === 0 ? 'var(--accent-lime)' : 'var(--bg-panel-raised)', color: i === 0 ? 'var(--outline)' : 'var(--text-primary)' }}>
                <span className="display-title" style={{ fontSize: 15 }}>{nom}</span>
                <span className="display-title" style={{ fontSize: 15 }}>{tempsSec.toFixed(2)}s · {ecart > 0 ? `+${ecart.toFixed(2)}` : ecart.toFixed(2)}</span>
              </div>
            ))}
            {joueursConnectes.filter((n) => !(n in resultats)).map((nom) => (
              <div key={nom} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 16px', borderRadius: 12, background: 'var(--bg-deep)', color: 'var(--text-dim)' }}>
                <span className="display-title" style={{ fontSize: 15 }}>{nom}</span>
                <span style={{ fontSize: 13 }}>n'a pas appuyé</span>
              </div>
            ))}
          </div>
          <button className="btn btn-lime" style={{ fontSize: 18, padding: '16px 36px' }} onClick={valider}>Valider les points</button>
        </>
      )}
    </div>
  );
}
