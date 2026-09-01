import React, { useState } from 'react';
import RoundHeader from '../components/RoundHeader.jsx';
import QcmHost from '../manette/QcmHost.jsx';
import { IconCamembertVote } from '../components/icons.jsx';
import { affirmationVraiIntoxAleatoire } from '../data/affirmationsVraiIntox.js';

export default function VraiOuIntox({ manche, remote, onTermine }) {
  const [a] = useState(affirmationVraiIntoxAleatoire);
  return (
    <div className="stage" style={{ display: 'flex', flexDirection: 'column' }}>
      <RoundHeader icone={<IconCamembertVote color="var(--outline)" />} iconBg="var(--accent-lime)" titre="Vrai ou Intox" sousTitre={`Manche ${manche}`} couleurTitre="var(--accent-lime)" />
      <QcmHost
        remote={remote}
        question={a.affirmation}
        options={['Vrai', 'Intox']}
        duree={10}
        modeScoring="correct"
        bonneReponse={a.vrai ? 0 : 1}
        pointsGagnant={5}
        texteReussite="BIEN VU, VOUS AVIEZ RAISON !"
        texteEchec="Raté, la vraie réponse s'affiche sur l'écran."
        consigne="Chacun tranche en secret sur son téléphone."
        onTermine={(scores) => onTermine({ scores })}
      />
    </div>
  );
}
