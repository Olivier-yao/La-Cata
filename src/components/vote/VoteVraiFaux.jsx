import React, { useState } from 'react';

// VoteVraiFaux — grammaire de vote du Menteur : la table vote à main levée,
// quelqu'un saisit le compte, puis on révèle la vérité. Le menteur marque
// s'il a berné la majorité.

export default function VoteVraiFaux({ joueurActuel, affirmation, estVraie, onTermine }) {
  const [vrai, setVrai] = useState(0);
  const [faux, setFaux] = useState(0);
  const [revele, setRevele] = useState(false);

  const majoriteCroitVrai = vrai >= faux;
  const menteurAGagne = estVraie ? majoriteCroitVrai : !majoriteCroitVrai;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26, padding: '48px 24px', textAlign: 'center' }}>
      <p className="eyebrow" style={{ color: 'var(--accent-magenta)' }}>Le Menteur · verdict</p>
      <h2 className="display-title" style={{ fontSize: 'clamp(24px, 3.6vw, 40px)' }}>
        {joueurActuel} disait-il vrai ?
      </h2>
      <p style={{ color: 'var(--text-muted)', maxWidth: 560 }}>« {affirmation} »</p>

      {!revele ? (
        <>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
            <div style={{ width: 200, background: 'var(--accent-lime)', color: 'var(--outline)', border: '5px solid var(--outline)', borderRadius: 24, boxShadow: 'var(--shadow-hard)', padding: '22px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
              <div className="display-title" style={{ fontSize: 34 }}>VRAI</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button className="btn btn-secondary" onClick={() => setVrai((v) => Math.max(0, v - 1))}>−</button>
                <span className="display-title" style={{ fontSize: 20 }}>{vrai}</span>
                <button className="btn btn-secondary" onClick={() => setVrai((v) => v + 1)}>+</button>
              </div>
            </div>
            <div style={{ width: 200, background: 'var(--accent-magenta)', color: 'var(--outline)', border: '5px solid var(--outline)', borderRadius: 24, boxShadow: 'var(--shadow-hard)', padding: '22px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
              <div className="display-title" style={{ fontSize: 34 }}>BIDON</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button className="btn btn-secondary" onClick={() => setFaux((v) => Math.max(0, v - 1))}>−</button>
                <span className="display-title" style={{ fontSize: 20 }}>{faux}</span>
                <button className="btn btn-secondary" onClick={() => setFaux((v) => v + 1)}>+</button>
              </div>
            </div>
          </div>
          <p style={{ fontSize: 14, color: 'var(--text-dim)', maxWidth: 460 }}>
            Chacun vote à main levée, quelqu'un saisit le compte ci-dessus.
          </p>
          <button className="btn btn-yellow" onClick={() => setRevele(true)}>Révéler la vérité</button>
        </>
      ) : (
        <>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 28,
              textTransform: 'uppercase',
              color: 'var(--outline)',
              background: estVraie ? 'var(--accent-lime)' : 'var(--accent-magenta)',
              border: '4px solid var(--outline)',
              borderRadius: 20,
              padding: '18px 32px',
            }}
          >
            {estVraie ? "C'était vrai" : 'Totalement inventé'}
          </div>
          <p style={{ color: 'var(--text-muted)' }}>
            {menteurAGagne
              ? `${joueurActuel} a berné la majorité de la table.`
              : `La table n'a pas mordu à l'hameçon.`}
          </p>
          <button className="btn btn-lime" onClick={() => onTermine(menteurAGagne ? 4 : 1)}>
            {menteurAGagne ? 'Menteur récompensé (+4)' : 'Points de consolation (+1)'}
          </button>
        </>
      )}
    </div>
  );
}
