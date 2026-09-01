import React from 'react';
import RoundHeader from '../components/RoundHeader.jsx';
import JaugeEquipesHost from '../manette/JaugeEquipesHost.jsx';
import { IconCorde } from '../components/icons.jsx';

export default function GuerreDesWatts({ manche, remote, onTermine }) {
  return (
    <div className="stage" style={{ display: 'flex', flexDirection: 'column' }}>
      <RoundHeader icone={<IconCorde color="var(--outline)" />} iconBg="var(--accent-cyan)" titre="Guerre des Watts" sousTitre={`Manche ${manche} · magenta contre cyan`} couleurTitre="var(--accent-cyan)" />
      <JaugeEquipesHost remote={remote} onTermine={(scores) => onTermine({ scores })} />
    </div>
  );
}
