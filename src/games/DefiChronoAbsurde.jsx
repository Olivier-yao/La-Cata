import React, { useState } from 'react';
import CountdownRing from '../components/CountdownRing.jsx';
import RoundHeader from '../components/RoundHeader.jsx';
import { IconChrono } from '../components/icons.jsx';
import { defiAleatoire } from '../data/defis.js';

export default function DefiChronoAbsurde({ joueurActuel, manche, onTermine }) {
  const [defi] = useState(defiAleatoire);
  const [demarre, setDemarre] = useState(false);
  const [termine, setTermine] = useState(false);

  return (
    <div className="stage" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="stripes-bg" style={{ animation: demarre ? 'lc-stripes 1.2s linear infinite' : 'lc-stripes 5s linear infinite' }} />
      <RoundHeader
        icone={<IconChrono color="var(--outline)" />}
        iconBg="var(--accent-cyan)"
        titre="Défi Chrono Absurde"
        sousTitre={`Manche ${manche} · ${joueurActuel}`}
        couleurTitre="var(--accent-cyan)"
      />
      <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center', gap: 40, padding: '40px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <div style={{ flex: '1 1 320px', display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 460 }}>
          <p className="eyebrow" style={{ color: 'var(--text-muted)', letterSpacing: '.2em' }}>Consigne</p>
          <div style={{ background: 'var(--bg-deep)', border: '5px solid var(--outline)', borderRadius: 26, boxShadow: '12px 12px 0 var(--accent-cyan)', padding: '32px 34px', transform: 'rotate(-1deg)' }}>
            <div className="display-title" style={{ fontSize: 'clamp(26px, 3.4vw, 40px)', lineHeight: 1.1 }}>{defi.texte}</div>
          </div>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Pas de texte à lire ici. Debout, à voix haute, devant tout le monde.</p>
          {!demarre ? (
            <button className="btn btn-lime" onClick={() => setDemarre(true)}>C'est parti</button>
          ) : termine ? (
            <button className="btn btn-yellow" onClick={() => onTermine()}>Temps écoulé · voter</button>
          ) : null}
        </div>
        <div style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
          <CountdownRing secondes={defi.secondes} actif={demarre} onFin={() => setTermine(true)} couleur="var(--accent-cyan)" pulseFinale taille={260} />
        </div>
      </div>
    </div>
  );
}
