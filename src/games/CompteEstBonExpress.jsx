import React, { useState } from 'react';
import RoundHeader from '../components/RoundHeader.jsx';
import BuzzerHost from '../manette/BuzzerHost.jsx';
import { IconBuzzer } from '../components/icons.jsx';
import { genererCalcul } from '../data/calculs.js';

function arrondi(n) {
  return Math.round(n * 10) / 10;
}

export default function CompteEstBonExpress({ manche, remote, onTermine }) {
  const [calcul] = useState(genererCalcul);
  return (
    <div className="stage" style={{ display: 'flex', flexDirection: 'column' }}>
      <RoundHeader icone={<IconBuzzer color="var(--outline)" />} iconBg="var(--accent-lime)" titre="Le Compte est Bon Express" sousTitre={`Manche ${manche}`} couleurTitre="var(--accent-lime)" />
      <BuzzerHost
        remote={remote}
        consigne="Calcule dans ta tête et buzz dès que tu as le résultat exact."
        enfants={(
          <div className="hard-card" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 6vw, 56px)', padding: '26px 40px' }}>
            {calcul.a} {calcul.operateur} {calcul.b} <span style={{ color: 'var(--text-dim)', fontSize: 18 }}>= {arrondi(calcul.resultat)}</span>
          </div>
        )}
        boutonLabel="Ouvrir les buzzers"
        demanderJugement
        onTermine={(scores) => onTermine({ scores })}
      />
    </div>
  );
}
