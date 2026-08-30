import React, { useEffect, useState } from 'react';
import RoundHeader from '../components/RoundHeader.jsx';
import { IconMenteur, IconCadenas } from '../components/icons.jsx';
import { menteurAleatoire } from '../data/mensonges.js';

export default function LeMenteur({ joueurActuel, manche, onTermine }) {
  const [{ affirmation, vrai }] = useState(menteurAleatoire);
  const [secondes, setSecondes] = useState(0);
  const [enCours, setEnCours] = useState(false);

  useEffect(() => {
    if (!enCours) return undefined;
    const t = setInterval(() => setSecondes((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [enCours]);

  const min = String(Math.floor(secondes / 60)).padStart(1, '0');
  const sec = String(secondes % 60).padStart(2, '0');

  return (
    <div className="stage" style={{ display: 'flex', flexDirection: 'column', background: 'var(--outline)' }}>
      <RoundHeader
        icone={<IconMenteur color="var(--outline)" />}
        iconBg="var(--accent-magenta)"
        titre="Le Menteur"
        sousTitre="Une affirmation, un plaidoyer, un verdict"
        couleurTitre="var(--accent-magenta)"
        bordure="3px solid var(--bg-panel)"
        droite={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="display-title" style={{ fontSize: 13, color: 'var(--text-dim)' }}>Plaidoirie</span>
            <span className="display-title" style={{ fontSize: 26, color: 'var(--accent-magenta)' }}>{min}:{sec}</span>
          </div>
        }
      />
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22, padding: '44px 30px', textAlign: 'center' }}>
        {!enCours && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg-panel)', border: '3px solid var(--accent-magenta)', borderRadius: 999, padding: '9px 20px' }}>
            <IconCadenas color="var(--accent-magenta)" />
            <span className="display-title" style={{ fontSize: 13, letterSpacing: '.14em', color: 'var(--accent-magenta)' }}>
              Vu par {joueurActuel} seul · les autres ne sauront qu'à la fin
            </span>
          </div>
        )}
        <div style={{ position: 'relative', width: '100%', maxWidth: 720, background: 'var(--bg-panel)', border: '5px dashed var(--accent-magenta)', borderRadius: 26, padding: '38px 40px', boxShadow: '0 0 0 12px rgba(255,77,141,.1)' }}>
          <div style={{ fontSize: 'clamp(22px, 3vw, 36px)', fontWeight: 700, lineHeight: 1.25 }}>« {affirmation} »</div>
          <div style={{ position: 'absolute', top: -18, left: 36, background: 'var(--accent-magenta)', border: '4px solid var(--outline)', borderRadius: 999, padding: '6px 16px', fontFamily: 'var(--font-display)', fontSize: 13, color: 'var(--outline)' }}>
            Affirmation
          </div>
        </div>
        <p style={{ color: 'var(--text-muted)', maxWidth: 620 }}>
          {joueurActuel} raconte. Détails, dates, noms. La table pourra poser des questions avant de trancher.
        </p>
        {!enCours ? (
          <button className="btn btn-primary" onClick={() => setEnCours(true)}>Commencer à plaider</button>
        ) : (
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button className="btn btn-secondary" onClick={() => setSecondes((s) => Math.max(0, s - 30))}>+30s de questions</button>
            <button className="btn btn-primary" onClick={() => onTermine({ affirmation, vrai })}>On a assez entendu · vote</button>
          </div>
        )}
      </div>
    </div>
  );
}
