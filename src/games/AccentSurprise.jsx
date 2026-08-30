import React, { useState } from 'react';
import ScrollingText from '../components/ScrollingText.jsx';
import RoundHeader from '../components/RoundHeader.jsx';
import { IconAccent } from '../components/icons.jsx';
import { ACCENTS, accentAleatoire, texteNeutreAleatoire } from '../data/accents.js';

export default function AccentSurprise({ joueurActuel, manche, vitesseReglage, onTermine }) {
  const [accent] = useState(accentAleatoire);
  const [texte] = useState(texteNeutreAleatoire);
  const [pret, setPret] = useState(false);
  const [termine, setTermine] = useState(false);

  if (!pret) {
    return (
      <div className="stage" style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="stripes-bg" />
        <RoundHeader
          icone={<IconAccent color="var(--outline)" />}
          iconBg="var(--accent-yellow)"
          titre="Accent Surprise"
          sousTitre={`Manche ${manche}`}
          couleurTitre="var(--accent-yellow)"
        />
        <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24, padding: '48px 40px', textAlign: 'center' }}>
          <p className="eyebrow" style={{ color: 'var(--text-muted)', letterSpacing: '.24em' }}>{joueurActuel} lira avec un accent</p>
          <div style={{ position: 'relative', background: 'var(--accent-yellow)', border: '5px solid var(--outline)', borderRadius: 28, boxShadow: '14px 14px 0 var(--accent-magenta)', padding: '30px 60px', transform: 'rotate(-1.5deg)' }}>
            <div className="display-title" style={{ fontSize: 'clamp(36px, 6vw, 80px)', color: 'var(--outline)' }}>{accent}</div>
            <div style={{ position: 'absolute', top: -20, right: -20, background: 'var(--accent-magenta)', border: '4px solid var(--outline)', borderRadius: 999, padding: '7px 16px', fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--outline)', transform: 'rotate(8deg)' }}>
              Tiré au sort
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 620 }}>
            {ACCENTS.map((a) => (
              <span key={a} className={a === accent ? 'tag tag-active' : 'tag'}>{a.replace(/^Accent |^Voix de /, '').toLowerCase()}</span>
            ))}
          </div>
          <button className="btn btn-lime" onClick={() => setPret(true)}>Je suis prêt·e</button>
        </div>
      </div>
    );
  }

  return (
    <div className="stage" style={{ display: 'flex', flexDirection: 'column' }}>
      <RoundHeader
        icone={<IconAccent color="var(--outline)" />}
        iconBg="var(--accent-yellow)"
        titre={`Accent Surprise · ${accent}`}
        sousTitre={joueurActuel}
        couleurTitre="var(--accent-yellow)"
      />
      <div style={{ padding: '40px 30px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
        <ScrollingText texte={texte} vitesseInitiale={0.6} reglageVitesse={vitesseReglage} couleurBande="var(--accent-yellow)" onTermine={() => setTermine(true)} />
        {termine && (
          <button className="btn btn-yellow" onClick={() => onTermine()}>Terminé · voter</button>
        )}
      </div>
    </div>
  );
}
