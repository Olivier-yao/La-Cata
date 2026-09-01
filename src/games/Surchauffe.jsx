import React from 'react';
import RoundHeader from '../components/RoundHeader.jsx';
import JaugeCibleHost from '../manette/JaugeCibleHost.jsx';
import { IconCorde } from '../components/icons.jsx';

export default function Surchauffe({ manche, joueurs, remote, onTermine }) {
  return (
    <div className="stage" style={{ display: 'flex', flexDirection: 'column' }}>
      <RoundHeader icone={<IconCorde color="var(--outline)" />} iconBg="var(--accent-magenta)" titre="Surchauffe" sousTitre={`Manche ${manche} · chacun sa jauge`} couleurTitre="var(--accent-magenta)" />
      <JaugeCibleHost remote={remote} joueurs={joueurs} onTermine={(scores) => onTermine({ scores })} />
    </div>
  );
}
