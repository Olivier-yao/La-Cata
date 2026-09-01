import React, { useState } from 'react';
import RoundHeader from '../components/RoundHeader.jsx';
import BuzzerHost from '../manette/BuzzerHost.jsx';
import { IconBuzzer } from '../components/icons.jsx';
import { questionEclairAleatoire } from '../data/questionsEclair.js';

// Question Éclair — pas d'attente avant l'ouverture des buzzers (dès que
// quelqu'un a la réponse, il buzz) et au moins 10 questions enchaînées
// d'affilée dans la même manche, sans repasser par le choix de jeu entre
// chacune.
const NB_QUESTIONS = 10;

export default function QuestionEclair({ manche, remote, onTermine }) {
  const [tour, setTour] = useState(0);
  const [q, setQ] = useState(questionEclairAleatoire);
  const [scoresCumules, setScoresCumules] = useState({});

  const surTermine = (scores) => {
    const suivant = { ...scoresCumules };
    Object.entries(scores).forEach(([nom, pts]) => { suivant[nom] = (suivant[nom] || 0) + pts; });
    if (tour + 1 >= NB_QUESTIONS) { onTermine({ scores: suivant }); return; }
    setScoresCumules(suivant);
    setTour((t) => t + 1);
    setQ(questionEclairAleatoire());
  };

  return (
    <div className="stage" style={{ display: 'flex', flexDirection: 'column' }}>
      <RoundHeader icone={<IconBuzzer color="var(--outline)" />} iconBg="var(--accent-yellow)" titre="Question Éclair" sousTitre={`Manche ${manche} · question ${tour + 1}/${NB_QUESTIONS}`} couleurTitre="var(--accent-yellow)" />
      <BuzzerHost
        key={tour}
        remote={remote}
        ouvertureInstantanee
        consigne="Lisez la question ensemble. Dès que quelqu'un a la réponse, il buzz — pas d'attente."
        enfants={(
          <div className="hard-card" style={{ maxWidth: 540, textAlign: 'center' }}>
            <div style={{ fontSize: 19 }}>{q.question}</div>
          </div>
        )}
        options={q.options}
        bonneReponse={q.bonneReponse}
        dureeReponse={7}
        onTermine={surTermine}
      />
    </div>
  );
}
