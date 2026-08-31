import React, { useEffect, useRef, useState } from 'react';
import Avatar from '../components/Avatar.jsx';

// EstimationHost — tout le monde répond en même temps sur son téléphone
// (une estimation numérique), sans buzzer. Pendant le temps imparti,
// l'écran principal montre juste qui a déjà répondu, jamais les valeurs
// — la révélation et le classement n'arrivent qu'à la fin du chrono, qui
// se termine plus tôt si tout le monde a déjà répondu. Le plus proche du
// résultat exact gagne le plus de points. Démarre tout seul au montage
// (Le Compte est Bon Express, futur Calcul Éclair en groupe).

export default function EstimationHost({ remote, joueurs, consigne, cible, duree = 12, onTermine }) {
  const [etape, setEtape] = useState('ouvert'); // ouvert | resultat
  const [tempsRestant, setTempsRestant] = useState(duree);
  const idRef = useRef(Date.now());
  const intervalRef = useRef(null);
  const indexJoueur = Object.fromEntries(joueurs.map((nom, i) => [nom, i]));
  const nomsConnectes = remote.connectes.filter((j) => j.connecte).map((j) => j.nom);

  useEffect(() => {
    remote.resetActions();
    remote.envoyerAction({ prim: 'estimation', etape: 'ouvert', consigne, id: idRef.current });
    intervalRef.current = setInterval(() => setTempsRestant((t) => (t <= 1 ? 0 : t - 1)), 1000);
    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reponses = {}; // nom -> valeur
  Object.entries(remote.actionsRecues).forEach(([nom, payload]) => {
    if (payload?.prim === 'estimation' && payload.id === idRef.current) reponses[nom] = payload.valeur;
  });
  const nbReponses = Object.keys(reponses).length;

  useEffect(() => {
    if (etape === 'ouvert' && nomsConnectes.length > 0 && nbReponses >= nomsConnectes.length) {
      setTempsRestant(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nbReponses]);

  useEffect(() => {
    if (etape === 'ouvert' && tempsRestant === 0) {
      clearInterval(intervalRef.current);
      setEtape('resultat');
      remote.envoyerAction({ prim: 'estimation', etape: 'resultat', cible, id: idRef.current });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tempsRestant, etape]);

  const classement = Object.entries(reponses)
    .map(([nom, valeur]) => ({ nom, valeur, ecart: Math.abs(valeur - cible) }))
    .sort((a, b) => a.ecart - b.ecart);

  const valider = () => {
    const scores = {};
    classement.forEach(({ nom, ecart }, i) => {
      const ecartRelatif = cible !== 0 ? ecart / Math.abs(cible) : ecart;
      scores[nom] = ecartRelatif <= 0.05 ? 6 : ecartRelatif <= 0.15 ? 3 : i === 0 ? 1 : 0;
    });
    onTermine(scores);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, padding: '40px 24px', textAlign: 'center' }}>
      {consigne && <p style={{ color: 'var(--text-muted)', maxWidth: 480 }}>{consigne}</p>}

      {etape === 'ouvert' && (
        <>
          <div className="display-title" style={{ fontSize: 48, color: 'var(--accent-yellow)' }}>{tempsRestant}</div>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
            {nomsConnectes.map((nom) => {
              const aRepondu = reponses[nom] !== undefined;
              return (
                <div key={nom} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, opacity: aRepondu ? 1 : 0.4 }}>
                  <Avatar nom={nom} index={indexJoueur[nom]} taille={44} contour={aRepondu ? 'var(--accent-lime)' : undefined} />
                  <span style={{ fontSize: 11, color: aRepondu ? 'var(--accent-lime)' : 'var(--text-dim)' }}>{aRepondu ? 'répondu' : 'en attente'}</span>
                </div>
              );
            })}
          </div>
        </>
      )}

      {etape === 'resultat' && (
        <>
          <div className="display-title" style={{ fontSize: 20, color: 'var(--text-dim)' }}>Résultat exact : <span style={{ color: 'var(--accent-lime)' }}>{cible}</span></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 400 }}>
            {classement.map(({ nom, valeur }, i) => (
              <div key={nom} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 16px', borderRadius: 12, background: i === 0 ? 'var(--accent-lime)' : 'var(--bg-panel-raised)', color: i === 0 ? 'var(--outline)' : 'var(--text-primary)' }}>
                <span className="display-title" style={{ fontSize: 16 }}>{nom}</span>
                <span className="display-title" style={{ fontSize: 16 }}>{valeur}</span>
              </div>
            ))}
            {nomsConnectes.filter((n) => reponses[n] === undefined).map((nom) => (
              <div key={nom} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 16px', borderRadius: 12, background: 'var(--bg-deep)', color: 'var(--text-dim)' }}>
                <span className="display-title" style={{ fontSize: 16 }}>{nom}</span>
                <span style={{ fontSize: 13 }}>pas répondu</span>
              </div>
            ))}
          </div>
          <button className="btn btn-lime" style={{ fontSize: 18, padding: '16px 36px' }} onClick={valider}>Valider les points</button>
        </>
      )}
    </div>
  );
}
