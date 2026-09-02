import React from 'react';
import RoundHeader from '../components/RoundHeader.jsx';
import BraqueMoiHost from '../manette/BraqueMoiHost.jsx';
import { IconMasque } from '../components/icons.jsx';

export default function BraqueMoi({ manche, remote, onTermine }) {
  return (
    <div className="stage" style={{ display: 'flex', flexDirection: 'column' }}>
      <RoundHeader icone={<IconMasque color="var(--outline)" />} iconBg="var(--accent-magenta)" titre="Braque-moi" sousTitre={`Manche ${manche}`} couleurTitre="var(--accent-magenta)" />
      <BraqueMoiHost remote={remote} onTermine={(scores) => onTermine({ scores })} />
    </div>
  );
}
