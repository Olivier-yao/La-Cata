import React, { useMemo, useState } from 'react';
import Avatar from '../components/Avatar.jsx';
import CountdownRing from '../components/CountdownRing.jsx';
import RoundHeader from '../components/RoundHeader.jsx';
import { IconImprovisation } from '../components/icons.jsx';
import { personnageSpeedDatingAleatoire } from '../data/personnagesSpeedDating.js';
import { melanger } from '../lib/melanger.js';

export default function SpeedDatingImprobable({ joueurs, manche, onTermine }) {
  const cast = useState(() => melanger(joueurs).slice(0, 2))[0];
  const personnages = useState(() => {
    const a = personnageSpeedDatingAleatoire();
    let b = personnageSpeedDatingAleatoire();
    while (b === a) b = personnageSpeedDatingAleatoire();
    return [a, b];
  })[0];
  const indexJoueur = useMemo(() => Object.fromEntries(joueurs.map((nom, i) => [nom, i])), [joueurs]);

  const [demarre, setDemarre] = useState(false);
  const [termine, setTermine] = useState(false);

  return (
    <div className="stage" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="stripes-bg" />
      <RoundHeader
        icone={<IconImprovisation color="var(--outline)" />}
        iconBg="var(--accent-yellow)"
        titre="Speed Dating Improbable"
        sousTitre={`Manche ${manche}`}
        couleurTitre="var(--accent-yellow)"
      />
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 26, padding: '36px 50px', textAlign: 'center' }}>
        <p className="eyebrow" style={{ color: 'var(--text-muted)', letterSpacing: '.2em' }}>Rencontre chronométrée</p>
        <div style={{ display: 'flex', gap: 22, flexWrap: 'wrap', justifyContent: 'center' }}>
          {cast.map((nom, i) => (
            <div key={nom} className="hard-card" style={{ width: 220, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
              <Avatar nom={nom} index={indexJoueur[nom]} taille={56} />
              <span className="display-title" style={{ fontSize: 16 }}>{nom}</span>
              <span style={{ fontSize: 14, color: 'var(--accent-yellow)', fontWeight: 700 }}>{personnages[i]}</span>
            </div>
          ))}
        </div>
        {!demarre ? (
          <button className="btn btn-lime" onClick={() => setDemarre(true)}>C'est parti</button>
        ) : termine ? (
          <button className="btn btn-yellow" onClick={() => onTermine({ cast })}>Scène terminée · voter</button>
        ) : (
          <CountdownRing secondes={45} actif={demarre} onFin={() => setTermine(true)} couleur="var(--accent-yellow)" pulseFinale taille={130} />
        )}
      </div>
    </div>
  );
}
