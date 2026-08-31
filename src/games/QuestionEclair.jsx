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
        consigne="Écoute la question lue à voix haute, buzz dès que tu as la réponse."
        enfants={(
          <div className="hard-card" style={{ maxWidth: 540, textAlign: 'center' }}>
            <div style={{ fontSize: 19 }}>{q.question}</div>
            <div style={{ fontSize: 13, color: 'var(--text-dim)', marginTop: 10 }}>Réponse : {q.options[q.bonneReponse]}</div>
          </div>
        )}
        boutonLabel="Ouvrir les buzzers"
        demanderJugement
        onTermine={(scores) => onTermine({ scores })}
      />
    </div>
  );
}
