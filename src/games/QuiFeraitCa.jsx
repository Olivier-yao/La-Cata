import React, { useState } from 'react';
import RoundHeader from '../components/RoundHeader.jsx';
import QcmHost from '../manette/QcmHost.jsx';
import { IconCamembertVote } from '../components/icons.jsx';
import { promptQuiFeraitAleatoire } from '../data/promptsQuiFerait.js';

export default function QuiFeraitCa({ manche, joueurs, remote, onTermine }) {
  const [prompt] = useState(promptQuiFeraitAleatoire);
  return (
    <div className="stage" style={{ display: 'flex', flexDirection: 'column' }}>
      <RoundHeader icone={<IconCamembertVote color="var(--outline)" />} iconBg="var(--accent-violet)" titre="Qui Ferait Ça ?" sousTitre={`Manche ${manche}`} couleurTitre="var(--accent-violet)" />
      <QcmHost
        remote={remote}
        question={prompt}
        options={joueurs}
        duree={14}
        modeScoring="revele"
        texteEchec="Réponses révélées, aucun point en jeu."
        consigne="Chacun vote pour la personne présente qui colle le mieux. Pas de gagnant ici : juste de quoi rigoler des réponses de la table."
        onTermine={(scores) => onTermine({ scores })}
      />
    </div>
  );
}
