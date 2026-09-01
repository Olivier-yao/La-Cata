import React, { useState } from 'react';
import RoundHeader from '../components/RoundHeader.jsx';
import DessinHost from '../manette/DessinHost.jsx';
import { IconCrayonTactile } from '../components/icons.jsx';
import { motADessinerAleatoire } from '../data/motsADessiner.js';

export default function DessineEtDevine({ manche, remote, onTermine }) {
  const [mot] = useState(motADessinerAleatoire);
  return (
    <div className="stage" style={{ display: 'flex', flexDirection: 'column' }}>
      <RoundHeader icone={<IconCrayonTactile color="var(--outline)" />} iconBg="var(--accent-cyan)" titre="Dessine et Devine" sousTitre={`Manche ${manche}`} couleurTitre="var(--accent-cyan)" />
      <DessinHost
        remote={remote}
        nbArtistes={1}
        dureeParTour={30}
        demanderJugement
        consigne="Un·e artiste tiré·e au sort dessine un mot secret sur son téléphone (lui seul·e le sait), les autres devinent à voix haute en regardant le trait apparaître ici."
        consigneArtiste={`DESSINE : ${mot}`}
        onTermine={(scores) => onTermine({ scores })}
      />
    </div>
  );
}
