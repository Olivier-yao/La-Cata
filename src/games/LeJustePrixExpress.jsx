import React, { useState } from 'react';
import RoundHeader from '../components/RoundHeader.jsx';
import QcmHost from '../manette/QcmHost.jsx';
import { IconCamembertVote } from '../components/icons.jsx';
import { justePrixAleatoire } from '../data/justePrix.js';

export default function LeJustePrixExpress({ manche, remote, onTermine }) {
  const [q] = useState(justePrixAleatoire);
  return (
    <div className="stage" style={{ display: 'flex', flexDirection: 'column' }}>
      <RoundHeader icone={<IconCamembertVote color="var(--outline)" />} iconBg="var(--accent-lime)" titre="Le Juste Prix Express" sousTitre={`Manche ${manche}`} couleurTitre="var(--accent-lime)" />
      <QcmHost
        remote={remote}
        question={q.question}
        options={q.options}
        duree={12}
        modeScoring="correct"
        bonneReponse={q.bonneReponse}
        pointsGagnant={6}
        consigne="Estime le bon prix sur ton téléphone."
        onTermine={(scores) => onTermine({ scores })}
      />
    </div>
  );
}
