import React from 'react';
import RoundHeader from '../components/RoundHeader.jsx';
import MashHost from '../manette/MashHost.jsx';
import { IconCorde } from '../components/icons.jsx';

export default function LeTrone({ manche, remote, onTermine }) {
  return (
    <div className="stage" style={{ display: 'flex', flexDirection: 'column' }}>
      <RoundHeader icone={<IconCorde color="var(--outline)" />} iconBg="var(--accent-yellow)" titre="Le Trône" sousTitre={`Manche ${manche}`} couleurTitre="var(--accent-yellow)" />
      <MashHost
        remote={remote}
        mode="ffa"
        visuel="trone"
        duree={8}
        consigne="Chacun tape sur son téléphone. Ton trône monte à chaque appui — le plus haut à la fin s'assoit dessus."
        onTermine={(scores) => onTermine({ scores })}
      />
    </div>
  );
}
