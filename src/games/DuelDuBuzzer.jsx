import React from 'react';
import RoundHeader from '../components/RoundHeader.jsx';
import BuzzerHost from '../manette/BuzzerHost.jsx';
import { IconBuzzer } from '../components/icons.jsx';

export default function DuelDuBuzzer({ manche, remote, onTermine }) {
  return (
    <div className="stage" style={{ display: 'flex', flexDirection: 'column' }}>
      <RoundHeader icone={<IconBuzzer color="var(--outline)" />} iconBg="var(--accent-cyan)" titre="Le Duel du Buzzer" sousTitre={`Manche ${manche}`} couleurTitre="var(--accent-cyan)" />
      <BuzzerHost
        remote={remote}
        auto
        consigne="Aucune question, aucune raison : premier qui buzz sur son téléphone gagne la manche. Ça peut ouvrir à tout moment, restez prêts."
        onTermine={(scores) => onTermine({ scores })}
      />
    </div>
  );
}
