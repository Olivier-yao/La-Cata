import React from 'react';
import RoundHeader from '../components/RoundHeader.jsx';
import SequenceHost from '../manette/SequenceHost.jsx';
import { IconSimon } from '../components/icons.jsx';

export default function SimonDitNumerique({ manche, remote, onTermine }) {
  return (
    <div className="stage" style={{ display: 'flex', flexDirection: 'column' }}>
      <RoundHeader icone={<IconSimon color="var(--outline)" />} iconBg="var(--accent-violet)" titre="Simon Dit Numérique" sousTitre={`Manche ${manche}`} couleurTitre="var(--accent-violet)" />
      <SequenceHost
        remote={remote}
        longueur={5}
        consigne="Regardez tous la séquence de couleurs sur l'écran, puis retapez-la sur vos téléphones."
        onTermine={(scores) => onTermine({ scores })}
      />
    </div>
  );
}
