import React, { useState } from 'react';
import RoundHeader from '../components/RoundHeader.jsx';
import SequenceHost from '../manette/SequenceHost.jsx';
import { IconSimon } from '../components/icons.jsx';
import { EMOJIS_FLOUTES } from '../data/emojisFloutes.js';

function quatreEmojis() {
  const melanges = [...EMOJIS_FLOUTES].sort(() => Math.random() - 0.5);
  return melanges.slice(0, 4);
}

export default function MemoireFlashCollective({ manche, remote, onTermine }) {
  const [symboles] = useState(quatreEmojis);
  return (
    <div className="stage" style={{ display: 'flex', flexDirection: 'column' }}>
      <RoundHeader icone={<IconSimon color="var(--outline)" />} iconBg="var(--accent-cyan)" titre="Mémoire Flash Collective" sousTitre={`Manche ${manche}`} couleurTitre="var(--accent-cyan)" />
      <SequenceHost
        remote={remote}
        longueur={4}
        symboles={symboles}
        consigne="Même principe que Simon, avec des émojis : mémorisez l'ordre puis reproduisez-le sur vos téléphones."
        onTermine={(scores) => onTermine({ scores })}
      />
    </div>
  );
}
