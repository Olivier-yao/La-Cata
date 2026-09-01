import React from 'react';
import RoundHeader from '../components/RoundHeader.jsx';
import BuzzerHost from '../manette/BuzzerHost.jsx';
import { IconBuzzer } from '../components/icons.jsx';

// NiVuNiConnu — même buzzer automatique et imprévisible que Le Duel du
// Buzzer, mais la tension est inversée : ici, le premier qui craque et
// appuie PERD la manche. Un vrai jeu de nerfs, pas de réflexes — on
// gagne en NE PAS appuyant, jusqu'à ce que quelqu'un craque.

export default function NiVuNiConnu({ manche, remote, onTermine }) {
  return (
    <div className="stage" style={{ display: 'flex', flexDirection: 'column' }}>
      <RoundHeader icone={<IconBuzzer color="var(--outline)" />} iconBg="var(--accent-magenta)" titre="Ni Vu Ni Connu" sousTitre={`Manche ${manche}`} couleurTitre="var(--accent-magenta)" />
      <BuzzerHost
        remote={remote}
        auto
        perdant
        consigne="Ça peut ouvrir à tout moment. Le premier qui craque et appuie perd la manche — tiens bon !"
        onTermine={(scores) => onTermine({ scores })}
      />
    </div>
  );
}
