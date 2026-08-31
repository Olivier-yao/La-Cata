import React from 'react';
import RoundHeader from '../components/RoundHeader.jsx';
import MashHost from '../manette/MashHost.jsx';
import { IconCorde } from '../components/icons.jsx';

export default function Surchauffe({ manche, joueurs, remote, onTermine }) {
  const objectif = Math.max(40, joueurs.length * 20);
  return (
    <div className="stage" style={{ display: 'flex', flexDirection: 'column' }}>
      <RoundHeader icone={<IconCorde color="var(--outline)" />} iconBg="var(--accent-magenta)" titre="Surchauffe" sousTitre={`Manche ${manche} · objectif collectif`} couleurTitre="var(--accent-magenta)" />
      <MashHost
        remote={remote}
        mode="ffa"
        cooperatif
        objectif={objectif}
        duree={10}
        consigne={`Tout le monde tape en même temps. Ensemble, atteignez ${objectif} appuis avant la fin du chrono.`}
        onTermine={(scores) => onTermine({ scores })}
      />
    </div>
  );
}
