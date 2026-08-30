import React, { useState } from 'react';
import CountdownRing from '../components/CountdownRing.jsx';
import RoundHeader from '../components/RoundHeader.jsx';
import { IconImprovisation } from '../components/icons.jsx';
import { titreAbsurdeAleatoire } from '../data/titresAbsurdes.js';

export default function ImprovisationTitre({ joueurActuel, manche, onTermine }) {
  const [titre] = useState(titreAbsurdeAleatoire);
  const [demarre, setDemarre] = useState(false);
  const [termine, setTermine] = useState(false);

  return (
    <div className="stage" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="stripes-bg" style={{ animation: demarre ? 'lc-stripes 1.2s linear infinite' : 'lc-stripes 5s linear infinite' }} />
      <RoundHeader
        icone={<IconImprovisation color="var(--outline)" />}
        iconBg="var(--accent-violet)"
        titre="Improvisation Titre"
        sousTitre={`Manche ${manche} · ${joueurActuel}`}
        couleurTitre="var(--accent-violet)"
      />
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 26, padding: '40px', textAlign: 'center' }}>
        <p className="eyebrow" style={{ color: 'var(--text-muted)', letterSpacing: '.2em' }}>Le film à vendre au producteur</p>
        <div className="hard-card" style={{ maxWidth: 620 }}>
          <div className="display-title" style={{ fontSize: 'clamp(26px, 3.6vw, 40px)' }}>{titre}</div>
        </div>
        <p style={{ color: 'var(--text-muted)', maxWidth: 480 }}>30 secondes pour pitcher ce film comme si c'était le prochain carton du box-office.</p>
        {!demarre ? (
          <button className="btn btn-lime" onClick={() => setDemarre(true)}>C'est parti</button>
        ) : termine ? (
          <button className="btn btn-yellow" onClick={() => onTermine()}>Pitch terminé · voter</button>
        ) : (
          <CountdownRing secondes={30} actif={demarre} onFin={() => setTermine(true)} couleur="var(--accent-violet)" pulseFinale taille={140} />
        )}
      </div>
    </div>
  );
}
