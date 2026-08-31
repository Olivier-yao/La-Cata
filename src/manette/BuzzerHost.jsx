import React, { useEffect, useRef, useState } from 'react';

// BuzzerHost — premier qui appuie gagne. Utilisé tel quel par plusieurs
// mini-jeux (Le Duel du Buzzer, Vision Floue, Question Éclair, Le Compte
// est Bon Express) : seul `consigne`/`boutonLabel`/`pointsGagnant` changent
// d'un jeu à l'autre, toute la mécanique de buzz vit ici une seule fois.
// `enfants` permet d'insérer un contenu spécifique au jeu (image floutée,
// question...) entre la consigne et le bouton/statut du buzzer.

export default function BuzzerHost({ remote, consigne, enfants, pointsGagnant = 6, boutonLabel = 'Ouvrir les buzzers', demanderJugement = false, perdant = false, joueursEligibles, onTermine }) {
  const [etape, setEtape] = useState('avant'); // avant | ouvert | resultat
  const [gagnant, setGagnant] = useState(null);
  const idRef = useRef(0);

  const nomsConnectes = (joueursEligibles || remote.connectes.filter((j) => j.connecte).map((j) => j.nom));

  const demarrer = () => {
    remote.resetActions();
    idRef.current = Date.now();
    setGagnant(null);
    setEtape('ouvert');
    const payload = { prim: 'buzzer', etape: 'ouvert', consigne, id: idRef.current };
    if (joueursEligibles) {
      // Duel restreint : seuls les téléphones concernés reçoivent le
      // signal, les autres restent sur leur écran d'attente habituel.
      remote.envoyerActionPrivee(Object.fromEntries(joueursEligibles.map((n) => [n, payload])));
    } else {
      remote.envoyerAction(payload);
    }
  };

  useEffect(() => {
    const ordreFiltre = remote.ordreActions.filter((n) => nomsConnectes.includes(n));
    if (etape === 'ouvert' && ordreFiltre.length > 0) {
      const nom = ordreFiltre[0];
      setGagnant(nom);
      setEtape('resultat');
      remote.envoyerAction({ prim: 'buzzer', etape: 'resultat', gagnant: nom, id: idRef.current });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remote.ordreActions, etape]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, padding: '44px 24px', textAlign: 'center' }}>
      {consigne && <p style={{ color: 'var(--text-muted)', maxWidth: 480, fontSize: 17 }}>{consigne}</p>}
      {enfants}

      {etape === 'avant' && (
        <button className="btn btn-cyan" style={{ fontSize: 20, padding: '20px 44px' }} onClick={demarrer}>{boutonLabel}</button>
      )}

      {etape === 'ouvert' && (
        <>
          <div className="display-title" style={{ fontSize: 22, color: 'var(--accent-cyan)', animation: 'lc-wobble 1s ease-in-out infinite' }}>BUZZERS OUVERTS…</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
            {nomsConnectes.map((n) => <span key={n} className="tag">{n}</span>)}
          </div>
        </>
      )}

      {etape === 'resultat' && perdant && (
        <>
          <div className="display-title" style={{ fontSize: 28, color: 'var(--accent-magenta)' }}>{gagnant} a buzzé en premier… et perd la manche !</div>
          <button
            className="btn btn-lime"
            style={{ fontSize: 18, padding: '16px 36px' }}
            onClick={() => onTermine(Object.fromEntries(nomsConnectes.map((n) => [n, n === gagnant ? 0 : pointsGagnant])))}
          >
            Valider
          </button>
        </>
      )}

      {etape === 'resultat' && !perdant && demanderJugement && (
        <>
          <div className="display-title" style={{ fontSize: 28, color: 'var(--accent-lime)' }}>{gagnant} a buzzé en premier !</div>
          <p style={{ color: 'var(--text-muted)' }}>A répondu juste à voix haute ?</p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button className="btn btn-lime" style={{ fontSize: 16, padding: '14px 28px' }} onClick={() => onTermine({ [gagnant]: pointsGagnant })}>
              Bonne réponse · +{pointsGagnant}
            </button>
            <button className="btn btn-secondary" style={{ fontSize: 16, padding: '14px 28px' }} onClick={() => onTermine({ [gagnant]: 0 })}>
              Mauvaise réponse
            </button>
          </div>
        </>
      )}

      {etape === 'resultat' && !perdant && !demanderJugement && (
        <>
          <div className="display-title" style={{ fontSize: 28, color: 'var(--accent-lime)' }}>{gagnant} a buzzé en premier !</div>
          <button className="btn btn-lime" style={{ fontSize: 18, padding: '16px 36px' }} onClick={() => onTermine({ [gagnant]: pointsGagnant })}>
            Valider · +{pointsGagnant} pour {gagnant}
          </button>
        </>
      )}
    </div>
  );
}
