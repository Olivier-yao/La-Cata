import React, { useState } from 'react';
import RoundHeader from '../components/RoundHeader.jsx';
import EstimationHost from '../manette/EstimationHost.jsx';
import { IconBuzzer } from '../components/icons.jsx';
import { genererCalcul } from '../data/calculs.js';

export default function CompteEstBonExpress({ manche, joueurs, remote, onTermine }) {
  const [calcul] = useState(genererCalcul);
  return (
    <div className="stage" style={{ display: 'flex', flexDirection: 'column' }}>
      <RoundHeader icone={<IconBuzzer color="var(--outline)" />} iconBg="var(--accent-lime)" titre="Le Compte est Bon Express" sousTitre={`Manche ${manche}`} couleurTitre="var(--accent-lime)" />
      <div style={{ padding: '20px 30px 0', textAlign: 'center' }}>
        <div className="hard-card" style={{ display: 'inline-block', fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 6vw, 56px)', padding: '20px 40px' }}>
          {calcul.a} {calcul.operateur} {calcul.b}
        </div>
      </div>
      <EstimationHost
        remote={remote}
        joueurs={joueurs}
        consigne="Entre ton résultat sur ton téléphone. Tout le monde répond en même temps, la révélation attend la fin du chrono."
        cible={calcul.resultat}
        duree={10}
        onTermine={(scores) => onTermine({ scores })}
      />
    </div>
  );
}
