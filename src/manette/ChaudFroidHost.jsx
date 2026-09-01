import React, { useEffect, useRef, useState } from 'react';
import Avatar from '../components/Avatar.jsx';

// ChaudFroidHost — devine un nombre secret en DEUX manches, pas une :
// la première est à l'aveugle, comme Compte est Bon Express, mais elle
// ne rapporte aucun point — elle sert juste à révéler collectivement
// "trop haut" ou "trop bas". La seconde manche, avec cet indice commun,
// est celle qui compte vraiment. Contrairement à une estimation en un
// coup, ici le jeu, c'est d'écouter l'indice et corriger le tir ensemble.

const DUREE = 10;

function genererCible() {
  return 1 + Math.floor(Math.random() * 99);
}

export default function ChaudFroidHost({ remote, joueurs, onTermine }) {
  const [manche, setManche] = useState(1); // 1 | 2
  const [etape, setEtape] = useState('ouvert'); // ouvert | indice | resultat
  const [cible] = useState(genererCible);
  const [indice, setIndice] = useState(null); // 'haut' | 'bas'
  const [tempsRestant, setTempsRestant] = useState(DUREE);
  const idRef = useRef(Date.now());
  const intervalRef = useRef(null);
  const indexJoueur = Object.fromEntries(joueurs.map((nom, i) => [nom, i]));
  const nomsConnectes = remote.connectes.filter((j) => j.connecte).map((j) => j.nom);

  // `numeroManche`/`indiceActuel` passés en paramètres plutôt que lus dans
  // la fermeture : `setManche`/`setIndice` n'ont pas encore pris effet au
  // moment où `passerManche2` appelle cette fonction dans le même tick.
  const demarrerManche = (id, numeroManche, indiceActuel) => {
    remote.resetActions();
    idRef.current = id;
    setTempsRestant(DUREE);
    const consigne = numeroManche === 1
      ? 'Devine le nombre secret (1 à 100) — cette manche ne rapporte pas de points, elle sert juste d\'indice.'
      : `Indice : le nombre est plus ${indiceActuel === 'haut' ? 'GRAND' : 'PETIT'} que la moyenne de tout à l'heure. À vous de préciser !`;
    remote.envoyerAction({ prim: 'estimation', etape: 'ouvert', consigne, id });
    intervalRef.current = setInterval(() => setTempsRestant((t) => (t <= 1 ? 0 : t - 1)), 1000);
  };

  useEffect(() => {
    demarrerManche(idRef.current, 1, null);
    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reponses = {};
  Object.entries(remote.actionsRecues).forEach(([nom, payload]) => {
    if (payload?.prim === 'estimation' && payload.id === idRef.current) reponses[nom] = payload.valeur;
  });
  const nbReponses = Object.keys(reponses).length;

  useEffect(() => {
    if (etape === 'ouvert' && nomsConnectes.length > 0 && nbReponses >= nomsConnectes.length) setTempsRestant(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nbReponses]);

  useEffect(() => {
    if (etape !== 'ouvert' || tempsRestant !== 0) return;
    clearInterval(intervalRef.current);
    const valeurs = Object.values(reponses);
    if (manche === 1) {
      const moyenne = valeurs.length ? valeurs.reduce((a, b) => a + b, 0) / valeurs.length : cible;
      setIndice(moyenne < cible ? 'haut' : 'bas');
      setEtape('indice');
    } else {
      setEtape('resultat');
      remote.envoyerAction({ prim: 'estimation', etape: 'resultat', cible, id: idRef.current });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tempsRestant, etape]);

  const passerManche2 = () => {
    setManche(2);
    setEtape('ouvert');
    demarrerManche(Date.now(), 2, indice);
  };

  const classement = Object.entries(reponses)
    .map(([nom, valeur]) => ({ nom, valeur, ecart: Math.abs(valeur - cible) }))
    .sort((a, b) => a.ecart - b.ecart);

  const valider = () => {
    const scores = {};
    classement.forEach(({ nom }, i) => { scores[nom] = i === 0 ? 6 : i === 1 ? 3 : 1; });
    onTermine(scores);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, padding: '36px 24px', textAlign: 'center' }}>
      <div className="display-title" style={{ fontSize: 13, color: 'var(--text-dim)' }}>MANCHE {manche} SUR 2</div>

      {etape === 'ouvert' && (
        <>
          <p style={{ color: 'var(--text-muted)', maxWidth: 420 }}>
            {manche === 1 ? 'Devine à l\'aveugle — ça ne rapporte rien, ça sert juste d\'indice pour la manche suivante.' : `Indice de la manche 1 : le nombre est plus ${indice === 'haut' ? 'GRAND' : 'PETIT'} que ce que vous pensiez. Cette manche compte pour de vrai !`}
          </p>
          <div className="display-title" style={{ fontSize: 40, color: 'var(--accent-yellow)' }}>{tempsRestant}</div>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
            {nomsConnectes.map((nom) => {
              const aRepondu = reponses[nom] !== undefined;
              return (
                <div key={nom} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, opacity: aRepondu ? 1 : 0.4 }}>
                  <Avatar nom={nom} index={indexJoueur[nom]} taille={40} contour={aRepondu ? 'var(--accent-lime)' : undefined} />
                  <span style={{ fontSize: 11, color: aRepondu ? 'var(--accent-lime)' : 'var(--text-dim)' }}>{aRepondu ? 'répondu' : 'en attente'}</span>
                </div>
              );
            })}
          </div>
        </>
      )}

      {etape === 'indice' && (
        <>
          <div className="display-title" style={{ fontSize: 22, color: 'var(--accent-cyan)' }}>
            C'EST PLUS {indice === 'haut' ? 'GRAND' : 'PETIT'} QUE ÇA !
          </div>
          <p style={{ color: 'var(--text-dim)' }}>La moyenne du groupe était {indice === 'haut' ? 'trop basse' : 'trop haute'}. À la manche 2, ça compte !</p>
          <button className="btn btn-lime" style={{ fontSize: 18, padding: '16px 36px' }} onClick={passerManche2}>Manche 2 · pour de vrai</button>
        </>
      )}

      {etape === 'resultat' && (
        <>
          <div className="display-title" style={{ fontSize: 20, color: 'var(--text-dim)' }}>LE NOMBRE SECRET ÉTAIT <span style={{ color: 'var(--accent-lime)' }}>{cible}</span></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 380 }}>
            {classement.map(({ nom, valeur }, i) => (
              <div key={nom} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 16px', borderRadius: 12, background: i === 0 ? 'var(--accent-lime)' : 'var(--bg-panel-raised)', color: i === 0 ? 'var(--outline)' : 'var(--text-primary)' }}>
                <span className="display-title" style={{ fontSize: 15 }}>{nom}</span>
                <span className="display-title" style={{ fontSize: 15 }}>{valeur}</span>
              </div>
            ))}
            {nomsConnectes.filter((n) => reponses[n] === undefined).map((nom) => (
              <div key={nom} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 16px', borderRadius: 12, background: 'var(--bg-deep)', color: 'var(--text-dim)' }}>
                <span className="display-title" style={{ fontSize: 15 }}>{nom}</span>
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
