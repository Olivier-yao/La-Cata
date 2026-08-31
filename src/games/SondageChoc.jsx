import React, { useState } from 'react';
import RoundHeader from '../components/RoundHeader.jsx';
import QcmHost from '../manette/QcmHost.jsx';
import { IconCamembertVote } from '../components/icons.jsx';
import { sondageChocAleatoire } from '../data/sondagesChoc.js';

export default function SondageChoc({ manche, remote, onTermine }) {
  const [s] = useState(sondageChocAleatoire);
  return (
    <div className="stage" style={{ display: 'flex', flexDirection: 'column' }}>
      <RoundHeader icone={<IconCamembertVote color="var(--outline)" />} iconBg="var(--accent-yellow)" titre="Sondage Choc" sousTitre={`Manche ${manche}`} couleurTitre="var(--accent-yellow)" />
      <QcmHost
        remote={remote}
        question={s.question}
        options={s.options}
        duree={14}
        modeScoring="majorite"
        consigne="Chacun vote en secret sur son téléphone. Ceux qui votent avec la majorité gagnent des points."
        onTermine={(scores) => onTermine({ scores })}
      />
    </div>
  );
}
