import React from 'react';
import RoundHeader from '../components/RoundHeader.jsx';
import CoffreFortHost from '../manette/CoffreFortHost.jsx';
import { IconCadenas } from '../components/icons.jsx';

export default function CoffreFort({ manche, remote, onTermine }) {
  return (
    <div className="stage" style={{ display: 'flex', flexDirection: 'column' }}>
      <RoundHeader icone={<IconCadenas color="var(--outline)" size={26} />} iconBg="var(--accent-violet)" titre="Coffre Fort" sousTitre={`Manche ${manche}`} couleurTitre="var(--accent-violet)" />
      <CoffreFortHost remote={remote} onTermine={(scores) => onTermine({ scores })} />
    </div>
  );
}
