import React, { useState } from 'react';
import RoundHeader from '../components/RoundHeader.jsx';
import QcmHost from '../manette/QcmHost.jsx';
import { IconCamembertVote } from '../components/icons.jsx';
import { promptQuiFeraitAleatoire } from '../data/promptsQuiFerait.js';

// Qui Ferait Ça ? enchaîne 5 questions d'affilée dans la même manche, sans
// repasser par le choix de jeu entre chacune — le résultat de l'une
// s'affiche, puis la suivante se lance toute seule.
const NB_QUESTIONS = 5;

export default function QuiFeraitCa({ manche, joueurs, remote, onTermine }) {
  const [tour, setTour] = useState(0);
  const [prompt, setPrompt] = useState(promptQuiFeraitAleatoire);

  const surTermine = () => {
    if (tour + 1 >= NB_QUESTIONS) { onTermine({}); return; }
    setTour((t) => t + 1);
    setPrompt(promptQuiFeraitAleatoire());
  };

  return (
    <div className="stage" style={{ display: 'flex', flexDirection: 'column' }}>
      <RoundHeader icone={<IconCamembertVote color="var(--outline)" />} iconBg="var(--accent-violet)" titre="Qui Ferait Ça ?" sousTitre={`Manche ${manche} · question ${tour + 1}/${NB_QUESTIONS}`} couleurTitre="var(--accent-violet)" />
      <QcmHost
        key={tour}
        remote={remote}
        question={prompt}
        options={joueurs}
        duree={14}
        modeScoring="revele"
        texteEchec="Réponses révélées, aucun point en jeu."
        consigne="Chacun vote pour la personne présente qui colle le mieux. Pas de gagnant ici : juste de quoi rigoler des réponses de la table."
        onTermine={surTermine}
      />
    </div>
  );
}
