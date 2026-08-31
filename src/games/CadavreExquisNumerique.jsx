import React from 'react';
import RoundHeader from '../components/RoundHeader.jsx';
import DessinHost from '../manette/DessinHost.jsx';
import { IconCrayonTactile } from '../components/icons.jsx';

export default function CadavreExquisNumerique({ manche, remote, onTermine }) {
  return (
    <div className="stage" style={{ display: 'flex', flexDirection: 'column' }}>
      <RoundHeader icone={<IconCrayonTactile color="var(--outline)" />} iconBg="var(--accent-yellow)" titre="Cadavre Exquis Numérique" sousTitre={`Manche ${manche}`} couleurTitre="var(--accent-yellow)" />
      <DessinHost
        remote={remote}
        dureeParTour={15}
        consigne="Chacun dessine à son tour sur son téléphone, en direct sur le dessin collectif ci-dessous. Personne ne sait ce que le résultat final donnera."
        onTermine={(scores) => onTermine({ scores })}
      />
    </div>
  );
}
