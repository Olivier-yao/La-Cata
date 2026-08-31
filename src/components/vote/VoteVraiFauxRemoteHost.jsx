import React, { useEffect, useRef, useState } from 'react';
import Avatar from '../Avatar.jsx';

// VoteVraiFauxRemoteHost — Le Menteur, voté depuis les téléphones plutôt
// qu'à main levée compté par l'hôte. Deux temps comme la version locale :
// vote (Vrai/Bidon) puis révélation, sauf que le décompte est automatique.

export default function VoteVraiFauxRemoteHost({ joueurActuel, affirmation, estVraie, joueurs, connectes, votesRecus, onDemarrerVote, onTermine }) {
  const [revele, setRevele] = useState(false);
  const demarreRef = useRef(false);

  useEffect(() => {
    if (!demarreRef.current) {
      demarreRef.current = true;
      onDemarrerVote(`${joueurActuel} disait-il vrai ?`, [
        { label: 'VRAI', points: 1 },
        { label: 'BIDON', points: 0 },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const indexJoueur = Object.fromEntries(joueurs.map((nom, i) => [nom, i]));
  const nomsConnectes = connectes.filter((j) => j.connecte).map((j) => j.nom);
  const nbVotes = Object.keys(votesRecus).length;
  const vrai = Object.values(votesRecus).filter((p) => p === 1).length;
  const faux = Object.values(votesRecus).filter((p) => p === 0).length;
  const majoriteCroitVrai = vrai >= faux;
  const menteurAGagne = estVraie ? majoriteCroitVrai : !majoriteCroitVrai;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26, padding: '48px 24px', textAlign: 'center' }}>
      <p className="eyebrow" style={{ color: 'var(--accent-cyan)' }}>Le Menteur · verdict depuis les téléphones</p>
      <h2 className="display-title" style={{ fontSize: 'clamp(24px, 3.6vw, 40px)' }}>{joueurActuel} disait-il vrai ?</h2>
      <p style={{ color: 'var(--text-muted)', maxWidth: 560 }}>« {affirmation} »</p>

      {!revele ? (
        <>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
            <div style={{ width: 160, background: 'var(--accent-lime)', color: 'var(--outline)', border: '5px solid var(--outline)', borderRadius: 24, boxShadow: 'var(--shadow-hard)', padding: '20px 16px' }}>
              <div className="display-title" style={{ fontSize: 20 }}>VRAI</div>
              <div className="display-title" style={{ fontSize: 32 }}>{vrai}</div>
            </div>
            <div style={{ width: 160, background: 'var(--accent-magenta)', color: 'var(--outline)', border: '5px solid var(--outline)', borderRadius: 24, boxShadow: 'var(--shadow-hard)', padding: '20px 16px' }}>
              <div className="display-title" style={{ fontSize: 20 }}>BIDON</div>
              <div className="display-title" style={{ fontSize: 32 }}>{faux}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 560 }}>
            {nomsConnectes.map((nom) => {
              const aVote = votesRecus[nom] !== undefined;
              return (
                <div key={nom} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, opacity: aVote ? 1 : 0.45 }}>
                  <Avatar nom={nom} index={indexJoueur[nom]} taille={40} contour={aVote ? 'var(--accent-lime)' : undefined} />
                  <span style={{ fontSize: 11, color: aVote ? 'var(--accent-lime)' : 'var(--text-dim)' }}>{nom}</span>
                </div>
              );
            })}
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-dim)' }}>{nbVotes} / {nomsConnectes.length} ont voté.</p>
          <button className="btn btn-yellow" onClick={() => setRevele(true)}>Révéler la vérité</button>
        </>
      ) : (
        <>
          <div
            style={{
              fontFamily: 'var(--font-display)', fontSize: 28, textTransform: 'uppercase', color: 'var(--outline)',
              background: estVraie ? 'var(--accent-lime)' : 'var(--accent-magenta)', border: '4px solid var(--outline)', borderRadius: 20, padding: '18px 32px',
            }}
          >
            {estVraie ? "C'était vrai" : 'Totalement inventé'}
          </div>
          <p style={{ color: 'var(--text-muted)' }}>
            {menteurAGagne ? `${joueurActuel} a berné la majorité de la table.` : `La table n'a pas mordu à l'hameçon.`}
          </p>
          <button className="btn btn-lime" onClick={() => onTermine(menteurAGagne ? 4 : 1)}>
            {menteurAGagne ? 'Menteur récompensé (+4)' : 'Points de consolation (+1)'}
          </button>
        </>
      )}
    </div>
  );
}
