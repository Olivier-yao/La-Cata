import React, { useState } from 'react';
import CountdownRing from '../components/CountdownRing.jsx';
import RoundHeader from '../components/RoundHeader.jsx';
import { IconDoublage } from '../components/icons.jsx';
import { objetTeleAchatAleatoire } from '../data/objetsTeleAchat.js';

export default function EmissionTeleAchat({ joueurActuel, manche, onTermine }) {
  const [objet] = useState(objetTeleAchatAleatoire);
  const [demarre, setDemarre] = useState(false);
  const [termine, setTermine] = useState(false);

  return (
    <div className="stage" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="stripes-bg" style={{ animation: demarre ? 'lc-stripes 1.2s linear infinite' : 'lc-stripes 5s linear infinite' }} />
      <RoundHeader
        icone={<IconDoublage color="var(--outline)" />}
        iconBg="var(--accent-yellow)"
        titre="Émission de Télé-Achat"
        sousTitre={`Manche ${manche} · ${joueurActuel}`}
        couleurTitre="var(--accent-yellow)"
      />
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 26, padding: '40px', textAlign: 'center' }}>
        <p className="eyebrow" style={{ color: 'var(--text-muted)', letterSpacing: '.2em' }}>Le produit du siècle</p>
        <div className="hard-card" style={{ maxWidth: 620 }}>
          <div className="display-title" style={{ fontSize: 'clamp(24px, 3.4vw, 36px)' }}>{objet}</div>
        </div>
        <p style={{ color: 'var(--text-muted)', maxWidth: 480 }}>30 secondes pour vendre ça comme si c'était l'invention du siècle.</p>
        {!demarre ? (
          <button className="btn btn-lime" onClick={() => setDemarre(true)}>C'est parti</button>
        ) : termine ? (
          <button className="btn btn-yellow" onClick={() => onTermine()}>Vente terminée · voter</button>
        ) : (
          <CountdownRing secondes={30} actif={demarre} onFin={() => setTermine(true)} couleur="var(--accent-yellow)" pulseFinale taille={140} />
        )}
      </div>
    </div>
  );
}
