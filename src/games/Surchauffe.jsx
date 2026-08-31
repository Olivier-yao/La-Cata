import React, { useState } from 'react';
import RoundHeader from '../components/RoundHeader.jsx';
import JaugeHost from '../manette/JaugeHost.jsx';
import { IconCorde } from '../components/icons.jsx';

export default function Surchauffe({ manche, joueurs, remote, onTermine }) {
  const [objectif] = useState(() => {
    const base = joueurs.length * (55 + Math.floor(Math.random() * 35));
    return Math.max(90, Math.round(base / 10) * 10);
  });
  return (
    <div className="stage" style={{ display: 'flex', flexDirection: 'column' }}>
      <RoundHeader icone={<IconCorde color="var(--outline)" />} iconBg="var(--accent-magenta)" titre="Surchauffe" sousTitre={`Manche ${manche} · objectif collectif`} couleurTitre="var(--accent-magenta)" />
      <JaugeHost
        remote={remote}
        joueurs={joueurs}
        objectif={objectif}
        duree={12}
        consigne={`Maintenez le bouton appuyé sur votre téléphone — il refroidit dès que vous relâchez. Ensemble, dépassez ${objectif}° avant la fin du chrono.`}
        onTermine={(scores) => onTermine({ scores })}
      />
    </div>
  );
}
