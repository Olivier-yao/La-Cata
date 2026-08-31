import React from 'react';
import RoundHeader from '../components/RoundHeader.jsx';
import RouletteHost from '../manette/RouletteHost.jsx';
import { IconRoue } from '../components/icons.jsx';

export default function LaRoueDuDestin({ manche, remote, onTermine }) {
  return (
    <div className="stage" style={{ display: 'flex', flexDirection: 'column' }}>
      <RoundHeader icone={<IconRoue color="var(--outline)" />} iconBg="var(--accent-yellow)" titre="La Roue du Destin" sousTitre={`Manche ${manche}`} couleurTitre="var(--accent-yellow)" />
      <RouletteHost
        remote={remote}
        consigne="La roue tourne en continu. Chacun a un bouton STOP sur son téléphone — arrête-le sur une case gagnante."
        onTermine={(scores) => onTermine({ scores })}
      />
    </div>
  );
}
