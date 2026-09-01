import React from 'react';
import RoundHeader from '../components/RoundHeader.jsx';
import ChaiseMusicaleHost from '../manette/ChaiseMusicaleHost.jsx';
import { IconCorde } from '../components/icons.jsx';

export default function ChaiseMusicale({ manche, remote, onTermine }) {
  return (
    <div className="stage" style={{ display: 'flex', flexDirection: 'column' }}>
      <RoundHeader icone={<IconCorde color="var(--outline)" />} iconBg="var(--accent-magenta)" titre="Chaise Musicale Numérique" sousTitre={`Manche ${manche}`} couleurTitre="var(--accent-magenta)" />
      <ChaiseMusicaleHost remote={remote} onTermine={(scores) => onTermine({ scores })} />
    </div>
  );
}
