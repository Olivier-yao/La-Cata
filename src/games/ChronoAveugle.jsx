import React from 'react';
import RoundHeader from '../components/RoundHeader.jsx';
import ChronoAveugleHost from '../manette/ChronoAveugleHost.jsx';
import { IconChrono } from '../components/icons.jsx';

export default function ChronoAveugle({ manche, remote, onTermine }) {
  return (
    <div className="stage" style={{ display: 'flex', flexDirection: 'column' }}>
      <RoundHeader icone={<IconChrono color="var(--outline)" />} iconBg="var(--accent-magenta)" titre="Chrono Aveugle" sousTitre={`Manche ${manche}`} couleurTitre="var(--accent-magenta)" />
      <ChronoAveugleHost remote={remote} onTermine={(scores) => onTermine({ scores })} />
    </div>
  );
}
