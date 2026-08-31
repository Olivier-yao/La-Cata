import React, { useEffect, useState } from 'react';
import RoundHeader from '../components/RoundHeader.jsx';
import BuzzerHost from '../manette/BuzzerHost.jsx';
import { IconBuzzer } from '../components/icons.jsx';
import { emojiFlouteAleatoire } from '../data/emojisFloutes.js';

export default function VisionFloue({ manche, remote, onTermine }) {
  const [emoji] = useState(emojiFlouteAleatoire);
  const [flou, setFlou] = useState(24);

  useEffect(() => {
    const id = setInterval(() => setFlou((f) => Math.max(0, f - 1)), 700);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="stage" style={{ display: 'flex', flexDirection: 'column' }}>
      <RoundHeader icone={<IconBuzzer color="var(--outline)" />} iconBg="var(--accent-magenta)" titre="Vision Floue" sousTitre={`Manche ${manche}`} couleurTitre="var(--accent-magenta)" />
      <BuzzerHost
        remote={remote}
        consigne="L'image se précise petit à petit sur l'écran. Premier qui devine et buzz gagne."
        enfants={<div style={{ fontSize: 90, filter: `blur(${flou}px)`, transition: 'filter .4s linear' }}>{emoji}</div>}
        onTermine={(scores) => onTermine({ scores })}
      />
    </div>
  );
}
