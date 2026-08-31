import React from 'react';
import RoundHeader from '../components/RoundHeader.jsx';
import MashHost from '../manette/MashHost.jsx';
import { IconCorde } from '../components/icons.jsx';

export default function MarathonDesDoigts({ manche, remote, onTermine }) {
  return (
    <div className="stage" style={{ display: 'flex', flexDirection: 'column' }}>
      <RoundHeader icone={<IconCorde color="var(--outline)" />} iconBg="var(--accent-lime)" titre="Marathon des Doigts" sousTitre={`Manche ${manche} · 10 secondes chrono`} couleurTitre="var(--accent-lime)" />
      <MashHost
        remote={remote}
        mode="ffa"
        duree={10}
        consigne="Tape le plus vite possible sur ton téléphone pendant 10 secondes. Classement individuel."
        onTermine={(scores) => onTermine({ scores })}
      />
    </div>
  );
}
