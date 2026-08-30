import React, { useState } from 'react';
import RoundHeader from '../components/RoundHeader.jsx';
import LyricsScroll from '../components/LyricsScroll.jsx';
import { IconChant } from '../components/icons.jsx';
import { STYLES_CHANT, styleChantAleatoire, CHANSONS } from '../data/chants.js';

export default function ChantImpose({ joueurActuel, manche, onTermine }) {
  const [style] = useState(styleChantAleatoire);
  const [pret, setPret] = useState(false);
  const [termine, setTermine] = useState(false);
  const [ligneActuelle, setLigneActuelle] = useState(0);
  const chanson = CHANSONS[style];

  if (!pret) {
    return (
      <div className="stage" style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="stripes-bg" style={{ background: 'repeating-linear-gradient(115deg, rgba(255,201,77,.12) 0 34px, transparent 34px 68px)', animation: 'lc-stripes 4.5s linear infinite' }} />
        <RoundHeader
          icone={<IconChant color="var(--outline)" />}
          iconBg="var(--accent-yellow)"
          titre="Chant Imposé"
          sousTitre={`Manche ${manche} · ${joueurActuel}`}
          couleurTitre="var(--accent-yellow)"
        />
        <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24, padding: '44px 30px', textAlign: 'center' }}>
          <p className="eyebrow" style={{ letterSpacing: '.22em', color: 'var(--text-muted)' }}>Tu chanteras en style</p>
          <div style={{ position: 'relative', background: 'var(--accent-yellow)', border: '5px solid var(--outline)', borderRadius: 28, boxShadow: '14px 14px 0 var(--accent-violet)', padding: '26px 60px', transform: 'rotate(-2deg)', animation: 'lc-pop 2.6s ease-out infinite' }}>
            <div className="display-title" style={{ fontSize: 'clamp(34px, 5vw, 70px)', color: 'var(--outline)' }}>{style.toUpperCase()}</div>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
            {STYLES_CHANT.map((s) => (
              <span key={s} className={s === style ? 'tag tag-active' : 'tag'}>{s.toLowerCase()}</span>
            ))}
          </div>
          <p style={{ color: 'var(--text-muted)', maxWidth: 520 }}>
            Une chanson complète t'attend, écrite pour ce style précis. Les paroles défilent comme sur une appli de musique : suis le rythme.
          </p>
          <button className="btn btn-lime" onClick={() => setPret(true)}>Je suis prêt·e</button>
        </div>
      </div>
    );
  }

  return (
    <div className="stage" style={{ display: 'flex', flexDirection: 'column' }}>
      <RoundHeader
        icone={<IconChant color="var(--outline)" />}
        iconBg="var(--accent-yellow)"
        titre={`Chant Imposé · ${style}`}
        sousTitre={joueurActuel}
        couleurTitre="var(--accent-yellow)"
        droite={
          <span className="display-title" style={{ fontSize: 14, color: 'var(--text-muted)' }}>
            Ligne {ligneActuelle + 1} / {chanson.lignes.length}
          </span>
        }
      />
      <div style={{ padding: '40px 30px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
        <LyricsScroll
          lignes={chanson.lignes}
          couleur="var(--accent-yellow)"
          onIndexChange={setLigneActuelle}
          onTermine={() => setTermine(true)}
        />
        {termine && (
          <button className="btn btn-lime" onClick={() => onTermine()}>C'est chanté · on vote</button>
        )}
      </div>
    </div>
  );
}
