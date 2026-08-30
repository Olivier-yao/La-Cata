import React, { useState } from 'react';
import VoteGraduee from './VoteGraduee.jsx';

// VoteGradueeMultiple — pour les mini-jeux collectifs (Conversation,
// Improvisation, Mot Surprise) : chacun n'a pas forcément la même
// performance, donc on fait défiler un vote par joueur du cast plutôt que
// de donner les mêmes points à tout le monde d'un seul coup.

export default function VoteGradueeMultiple({ cast, onTermine, bonusDisponible, onBonus }) {
  const [index, setIndex] = useState(0);
  const [points, setPoints] = useState({});
  const [bonusPris, setBonusPris] = useState(false);

  const joueur = cast[index];

  const voter = (pts) => {
    const suivant = { ...points, [joueur]: pts };
    setPoints(suivant);
    if (index + 1 >= cast.length) {
      onTermine(suivant);
    } else {
      setIndex((i) => i + 1);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
      <span className="eyebrow" style={{ color: 'var(--text-dim)' }}>
        Vote {index + 1} / {cast.length}
      </span>
      <VoteGraduee
        key={joueur}
        joueurActuel={joueur}
        question={`C'était comment, ${joueur} ?`}
        onVote={voter}
        bonusDisponible={bonusDisponible && !bonusPris}
        onBonus={() => {
          setBonusPris(true);
          onBonus(joueur);
        }}
      />
    </div>
  );
}
