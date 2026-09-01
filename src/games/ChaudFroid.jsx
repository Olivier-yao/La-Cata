import React from 'react';
import RoundHeader from '../components/RoundHeader.jsx';
import ChaudFroidHost from '../manette/ChaudFroidHost.jsx';
import { IconCalcul } from '../components/icons.jsx';

export default function ChaudFroid({ manche, joueurs, remote, onTermine }) {
  return (
    <div className="stage" style={{ display: 'flex', flexDirection: 'column' }}>
      <RoundHeader icone={<IconCalcul color="var(--outline)" />} iconBg="var(--accent-cyan)" titre="Chaud-Froid Collectif" sousTitre={`Manche ${manche}`} couleurTitre="var(--accent-cyan)" />
      <ChaudFroidHost remote={remote} joueurs={joueurs} onTermine={(scores) => onTermine({ scores })} />
    </div>
  );
}
