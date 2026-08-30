import React, { useEffect } from 'react';
import { sonClic, sonCatastrophe, sonSucces } from '../../lib/son.js';
import { hapticClic, hapticCatastrophe, hapticSucces } from '../../lib/haptique.js';

// VoteGraduee — grammaire de vote la plus courante (8 mini-jeux sur 10) :
// trois cartes de points, un clic ou une touche 1/2/3.

const CARTES = [
  { points: 1, titre: 'La Cata', sousTitre: "On a rien compris, mais on a ri.", bg: 'var(--bg-panel-raised)', fg: 'var(--text-primary)', shadow: 'var(--shadow-hard-lg)' },
  { points: 3, titre: 'Correct', sousTitre: 'Propre. Personne n\'est mort.', bg: 'var(--accent-yellow)', fg: 'var(--outline)', shadow: 'var(--shadow-hard-lg)' },
  { points: 6, titre: 'Légendaire', sousTitre: 'À raconter au prochain repas de famille.', bg: 'var(--accent-lime)', fg: 'var(--outline)', shadow: '10px 10px 0 var(--accent-magenta)' },
];

export default function VoteGraduee({ joueurActuel, question, onVote, bonusDisponible, onBonus }) {
  const voter = (points) => {
    if (points === 6) {
      sonSucces();
      hapticSucces();
    } else if (points === 1) {
      sonCatastrophe();
      hapticCatastrophe();
    } else {
      sonClic();
      hapticClic();
    }
    onVote(points);
  };

  useEffect(() => {
    const surTouche = (e) => {
      if (e.key === '1') voter(1);
      if (e.key === '2') voter(3);
      if (e.key === '3') voter(6);
    };
    window.addEventListener('keydown', surTouche);
    return () => window.removeEventListener('keydown', surTouche);
  }, [onVote]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32, padding: '48px 24px', textAlign: 'center' }}>
      <div>
        <p className="eyebrow">Verdict de la table</p>
        <h2 className="display-title" style={{ fontSize: 'clamp(28px, 4vw, 48px)', margin: '8px 0' }}>
          {question || `C'était comment, ${joueurActuel} ?`}
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>
          Un seul clic pour tout le monde. Celui qui gueule le plus fort a raison.
        </p>
      </div>

      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
        {CARTES.map((c) => (
          <button
            key={c.points}
            onClick={() => voter(c.points)}
            style={{
              width: 220,
              background: c.bg,
              color: c.fg,
              border: '4px solid var(--outline)',
              borderRadius: 22,
              boxShadow: c.shadow,
              padding: '26px 18px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 10,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            <div className="display-title" style={{ fontSize: 26 }}>{c.titre}</div>
            <div style={{ fontSize: 14, opacity: 0.85 }}>{c.sousTitre}</div>
            <div className="display-title" style={{ fontSize: 20, marginTop: 4 }}>+{c.points}</div>
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap', justifyContent: 'center' }}>
        <span style={{ fontSize: 13, color: 'var(--text-dim)' }}>Touches 1 · 2 · 3 au clavier</span>
        {bonusDisponible && (
          <>
            <span className="vote-graduee-separateur" style={{ width: 1, height: 20, background: 'var(--border-soft)' }} />
            <button
              onClick={onBonus}
              className="btn"
              style={{
                background: 'var(--bg-deep)',
                borderColor: 'var(--accent-magenta)',
                color: 'var(--accent-magenta)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              Bonus moment culte
              <span style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'none', letterSpacing: 0 }}>
                une seule fois par soirée · +5
              </span>
            </button>
          </>
        )}
      </div>

      <style>{`
        @media (max-width: 480px) {
          .vote-graduee-separateur { display: none; }
        }
      `}</style>
    </div>
  );
}
