import React, { useState } from 'react';
import RoundHeader from '../components/RoundHeader.jsx';
import QcmHost from '../manette/QcmHost.jsx';
import { IconCamembertVote } from '../components/icons.jsx';
import { plusOuMoinsAleatoire } from '../data/plusOuMoins.js';

export default function PlusOuMoins({ manche, remote, onTermine }) {
  const [q] = useState(plusOuMoinsAleatoire);
  return (
    <div className="stage" style={{ display: 'flex', flexDirection: 'column' }}>
      <RoundHeader icone={<IconCamembertVote color="var(--outline)" />} iconBg="var(--accent-cyan)" titre="Plus ou Moins" sousTitre={`Manche ${manche}`} couleurTitre="var(--accent-cyan)" />
      <QcmHost
        remote={remote}
        question={q.question}
        options={[...q.options, 'À peu près égal']}
        duree={10}
        modeScoring="correct"
        bonneReponse={q.bonneReponse}
        pointsGagnant={5}
        texteReussite="DANS LE MILLE !"
        texteEchec="Perdu, ce n'était pas la bonne réponse."
        consigne="Chacun choisit sur son téléphone. Bonne réponse = points."
        onTermine={(scores) => onTermine({ scores })}
      />
    </div>
  );
}
