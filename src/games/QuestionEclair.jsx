import React, { useState } from 'react';
import RoundHeader from '../components/RoundHeader.jsx';
import BuzzerHost from '../manette/BuzzerHost.jsx';
import { IconBuzzer } from '../components/icons.jsx';
import { questionEclairAleatoire } from '../data/questionsEclair.js';

export default function QuestionEclair({ manche, remote, onTermine }) {
  const [q] = useState(questionEclairAleatoire);
  return (
    <div className="stage" style={{ display: 'flex', flexDirection: 'column' }}>
      <RoundHeader icone={<IconBuzzer color="var(--outline)" />} iconBg="var(--accent-yellow)" titre="Question Éclair" sousTitre={`Manche ${manche}`} couleurTitre="var(--accent-yellow)" />
      <BuzzerHost
        remote={remote}
        auto
        consigne="Lisez la question ensemble. Premier qui buzz répond sur son téléphone, avec un temps réduit."
        enfants={(
          <div className="hard-card" style={{ maxWidth: 540, textAlign: 'center' }}>
            <div style={{ fontSize: 19 }}>{q.question}</div>
          </div>
        )}
        options={q.options}
        bonneReponse={q.bonneReponse}
        dureeReponse={7}
        onTermine={(scores) => onTermine({ scores })}
      />
    </div>
  );
}
