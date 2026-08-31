import React, { useEffect, useRef, useState } from 'react';

// QcmHost — question à choix multiples envoyée à tous les téléphones en
// même temps, résultats en direct façon camembert/barres. Sert de socle à
// Sondage Choc, Qui Ferait Ça ?, Plus ou Moins, Le Juste Prix Express,
// Vote de la Honte, et au vote de démasquage du Traître / d'Espion Parmi
// Nous. `modeScoring` change uniquement comment les points sont distribués
// à la fin, pas la mécanique de vote elle-même :
// - 'correct'   : bonneReponse (index) reçoit les points, les autres rien.
// - 'majorite'  : l'option la plus votée fait gagner tout le monde qui l'a
//   choisie (Sondage Choc, Vote de la Honte : "dans le vent").
// - 'cible'     : options = prénoms des joueurs ; l'option la plus votée
//   (le joueur désigné) reçoit les points, peu importe qui a voté quoi
//   (Qui Ferait Ça ?).
// - 'aucun'     : pas de points distribués ici (le jeu appelant gère lui-
//   même via `onResultat`, ex. le vote de démasquage du Traître).

export default function QcmHost({ remote, question, consigne, options, duree = 12, modeScoring = 'majorite', bonneReponse, pointsGagnant = 6, onTermine, onResultat }) {
  const [etape, setEtape] = useState('avant'); // avant | ouvert | resultat
  const [tempsRestant, setTempsRestant] = useState(duree);
  const intervalRef = useRef(null);
  const idRef = useRef(0);

  const demarrer = () => {
    remote.resetActions();
    idRef.current = Date.now();
    setTempsRestant(duree);
    setEtape('ouvert');
    remote.envoyerAction({ prim: 'qcm', etape: 'demarrer', question, options, id: idRef.current });
    intervalRef.current = setInterval(() => setTempsRestant((t) => (t <= 1 ? 0 : t - 1)), 1000);
  };

  useEffect(() => {
    if (etape === 'ouvert' && tempsRestant === 0) {
      clearInterval(intervalRef.current);
      setEtape('resultat');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tempsRestant, etape]);

  useEffect(() => () => clearInterval(intervalRef.current), []);

  const choix = {}; // nom -> index
  Object.entries(remote.actionsRecues).forEach(([nom, payload]) => {
    if (payload?.prim === 'qcm' && payload.id === idRef.current) choix[nom] = payload.choix;
  });

  const tally = options.map((_, i) => Object.values(choix).filter((c) => c === i).length);
  const totalVotes = Object.keys(choix).length;
  const indexMajoritaire = tally.indexOf(Math.max(...tally));

  useEffect(() => {
    if (etape === 'resultat') {
      remote.envoyerAction({ prim: 'qcm', etape: 'resultat', bonneReponse: modeScoring === 'correct' ? bonneReponse : indexMajoritaire, id: idRef.current });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [etape]);

  const valider = () => {
    if (onResultat) {
      onResultat({ choix, tally, indexMajoritaire });
      return;
    }
    const scores = {};
    if (modeScoring === 'correct' && bonneReponse != null) {
      Object.entries(choix).forEach(([nom, c]) => { scores[nom] = c === bonneReponse ? pointsGagnant : 0; });
    } else if (modeScoring === 'cible') {
      if (options[indexMajoritaire]) scores[options[indexMajoritaire]] = pointsGagnant;
    } else {
      Object.entries(choix).forEach(([nom, c]) => { scores[nom] = c === indexMajoritaire ? 3 : 0; });
    }
    onTermine(scores);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, padding: '40px 24px', textAlign: 'center', width: '100%' }}>
      {consigne && <p style={{ color: 'var(--text-muted)', maxWidth: 480 }}>{consigne}</p>}
      <div className="display-title" style={{ fontSize: 'clamp(20px, 3.5vw, 30px)', maxWidth: 620 }}>{question}</div>

      {etape === 'avant' && <button className="btn btn-cyan" style={{ fontSize: 20, padding: '20px 44px' }} onClick={demarrer}>Lancer le vote ({duree}s)</button>}

      {etape !== 'avant' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 520 }}>
          {options.map((opt, i) => {
            const pct = totalVotes ? Math.round((tally[i] / totalVotes) * 100) : 0;
            const estBonneReponse = etape === 'resultat' && modeScoring === 'correct' && i === bonneReponse;
            return (
              <div key={i} style={{ position: 'relative', borderRadius: 14, overflow: 'hidden', border: `3px solid ${estBonneReponse ? 'var(--accent-lime)' : 'var(--outline)'}`, background: 'var(--bg-panel-raised)' }}>
                <div style={{ position: 'absolute', inset: 0, width: `${pct}%`, background: estBonneReponse ? 'var(--accent-lime)' : 'var(--accent-violet)', opacity: 0.35, transition: 'width .3s' }} />
                <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', padding: '12px 16px' }}>
                  <span className="display-title" style={{ fontSize: 15 }}>{opt}</span>
                  <span className="display-title" style={{ fontSize: 15 }}>{tally[i]} · {pct}%</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {etape === 'ouvert' && <div className="display-title" style={{ fontSize: 32, color: 'var(--accent-yellow)' }}>{tempsRestant}s</div>}

      {etape === 'resultat' && (
        <button className="btn btn-lime" style={{ fontSize: 18, padding: '16px 36px' }} onClick={valider}>Valider</button>
      )}
    </div>
  );
}
