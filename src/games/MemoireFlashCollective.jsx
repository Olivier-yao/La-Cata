import React from 'react';
import RoundHeader from '../components/RoundHeader.jsx';
import MemoireEclairHost from '../manette/MemoireEclairHost.jsx';
import { IconSimon } from '../components/icons.jsx';

export default function MemoireFlashCollective({ manche, remote, onTermine }) {
  return (
    <div className="stage" style={{ display: 'flex', flexDirection: 'column' }}>
      <RoundHeader icone={<IconSimon color="var(--outline)" />} iconBg="var(--accent-cyan)" titre="Mémoire Flash Collective" sousTitre={`Manche ${manche}`} couleurTitre="var(--accent-cyan)" />
      <MemoireEclairHost remote={remote} onTermine={(scores) => onTermine({ scores })} />
    </div>
  );
}
