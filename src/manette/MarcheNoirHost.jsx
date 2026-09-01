import React, { useEffect, useRef, useState } from 'react';
import Avatar from '../components/Avatar.jsx';

// MarcheNoirHost — enchère scellée simultanée (réutilise EstimationPhone
// tel quel) pour un objet mystère dont la valeur n'est JAMAIS révélée à
// l'avance — contrairement à Compte est Bon Express (deviner un résultat
// exact), ici il n'y a rien à deviner juste : miser gros gagne l'objet
// mais coûte cher, miser bas ne coûte rien mais ne rapporte rien. Une
// vraie prise de risque, pas une question de précision.

export default function MarcheNoirHost({ remote, joueurs, objet, onTermine }) {
  const [etape, setEtape] = useState('ouvert'); // ouvert | resultat
  const [tempsRestant, setTempsRestant] = useState(12);
  const idRef = useRef(Date.now());
  const intervalRef = useRef(null);
  const indexJoueur = Object.fromEntries(joueurs.map((nom, i) => [nom, i]));
  const nomsConnectes = remote.connectes.filter((j) => j.connecte).map((j) => j.nom);

  useEffect(() => {
    remote.resetActions();
    remote.envoyerAction({ prim: 'estimation', etape: 'ouvert', consigne: `Mise ce que tu veux pour "${objet}" — en secret, personne ne voit les offres des autres.`, id: idRef.current });
    intervalRef.current = setInterval(() => setTempsRestant((t) => (t <= 1 ? 0 : t - 1)), 1000);
    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mises = {};
  Object.entries(remote.actionsRecues).forEach(([nom, payload]) => {
    if (payload?.prim === 'estimation' && payload.id === idRef.current) mises[nom] = payload.valeur;
  });
  const nbMises = Object.keys(mises).length;

  useEffect(() => {
    if (etape === 'ouvert' && nomsConnectes.length > 0 && nbMises >= nomsConnectes.length) setTempsRestant(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nbMises]);

  useEffect(() => {
    if (etape === 'ouvert' && tempsRestant === 0) {
      clearInterval(intervalRef.current);
      setEtape('resultat');
      remote.envoyerAction({ prim: 'estimation', etape: 'resultat', cible: 0, id: idRef.current });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tempsRestant, etape]);

  const classement = Object.entries(mises)
    .map(([nom, valeur]) => ({ nom, valeur }))
    .sort((a, b) => b.valeur - a.valeur);
  const gagnant = classement[0];

  const valider = () => {
    const scores = {};
    if (gagnant && gagnant.valeur > 0) {
      scores[gagnant.nom] = Math.max(1, 10 - Math.round(gagnant.valeur / 50));
    }
    onTermine(scores);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, padding: '40px 24px', textAlign: 'center' }}>
      <p style={{ color: 'var(--text-muted)', maxWidth: 460 }}>Personne ne connaît la vraie valeur de l'objet. Mise ce que tu veux sur ton téléphone, en secret — la plus grosse mise remporte l'objet, mais paie le prix fort.</p>

      {etape === 'ouvert' && (
        <>
          <div className="display-title" style={{ fontSize: 40, color: 'var(--accent-yellow)' }}>{tempsRestant}</div>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
            {nomsConnectes.map((nom) => {
              const aMise = mises[nom] !== undefined;
              return (
                <div key={nom} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, opacity: aMise ? 1 : 0.4 }}>
                  <Avatar nom={nom} index={indexJoueur[nom]} taille={40} contour={aMise ? 'var(--accent-lime)' : undefined} />
                  <span style={{ fontSize: 11, color: aMise ? 'var(--accent-lime)' : 'var(--text-dim)' }}>{aMise ? 'a misé' : 'réfléchit'}</span>
                </div>
              );
            })}
          </div>
        </>
      )}

      {etape === 'resultat' && (
        <>
          <div className="display-title" style={{ fontSize: 20, color: 'var(--text-dim)' }}>
            {gagnant ? <>{gagnant.nom} remporte l'objet pour <span style={{ color: 'var(--accent-lime)' }}>{gagnant.valeur}</span></> : 'Personne n\'a misé'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 380 }}>
            {classement.map(({ nom, valeur }, i) => (
              <div key={nom} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 16px', borderRadius: 12, background: i === 0 ? 'var(--accent-lime)' : 'var(--bg-panel-raised)', color: i === 0 ? 'var(--outline)' : 'var(--text-primary)' }}>
                <span className="display-title" style={{ fontSize: 16 }}>{nom}</span>
                <span className="display-title" style={{ fontSize: 16 }}>{valeur}</span>
              </div>
            ))}
            {nomsConnectes.filter((n) => mises[n] === undefined).map((nom) => (
              <div key={nom} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 16px', borderRadius: 12, background: 'var(--bg-deep)', color: 'var(--text-dim)' }}>
                <span className="display-title" style={{ fontSize: 16 }}>{nom}</span>
                <span style={{ fontSize: 13 }}>n'a pas misé</span>
              </div>
            ))}
          </div>
          <button className="btn btn-lime" style={{ fontSize: 18, padding: '16px 36px' }} onClick={valider}>Valider les points</button>
        </>
      )}
    </div>
  );
}
