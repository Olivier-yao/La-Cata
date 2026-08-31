import React, { useState } from 'react';
import RoundHeader from '../components/RoundHeader.jsx';
import QcmHost from '../manette/QcmHost.jsx';
import { IconCamembertVote } from '../components/icons.jsx';
import { situationHonteAleatoire } from '../data/voteHonte.js';

export default function VoteDeLaHonte({ manche, remote, onTermine }) {
  const [s] = useState(situationHonteAleatoire);
  return (
    <div className="stage" style={{ display: 'flex', flexDirection: 'column' }}>
      <RoundHeader icone={<IconCamembertVote color="var(--outline)" />} iconBg="var(--accent-magenta)" titre="Vote de la Honte" sousTitre={`Manche ${manche}`} couleurTitre="var(--accent-magenta)" />
      <QcmHost
        remote={remote}
        question={s.situation}
        options={s.options}
        duree={14}
        modeScoring="majorite"
        texteReussite="TU ES DANS LA MAJORITÉ"
        texteEchec="Voix isolée — assume ton choix."
        texteEgalite="Vote coupé en deux, personne n'a honte de plus que l'autre."
        consigne="Vote ta vraie réaction. Ceux qui pensent comme la majorité gagnent des points."
        onTermine={(scores) => onTermine({ scores })}
      />
    </div>
  );
}
