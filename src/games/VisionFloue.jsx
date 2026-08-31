import React, { useEffect, useState } from 'react';
import RoundHeader from '../components/RoundHeader.jsx';
import BuzzerHost from '../manette/BuzzerHost.jsx';
import { IconBuzzer } from '../components/icons.jsx';
import { EMOJIS_FLOUTES, emojiFlouteAleatoire } from '../data/emojisFloutes.js';

function optionsAvecDistracteurs(cible, nbOptions) {
  const autres = EMOJIS_FLOUTES.filter((e) => e !== cible).sort(() => Math.random() - 0.5).slice(0, nbOptions - 1);
  const melange = [...autres, cible].sort(() => Math.random() - 0.5);
  return { options: melange, bonneReponse: melange.indexOf(cible) };
}

export default function VisionFloue({ manche, remote, onTermine }) {
  const [emoji] = useState(emojiFlouteAleatoire);
  const [flou, setFlou] = useState(24);
  const [{ options, bonneReponse }] = useState(() => optionsAvecDistracteurs(emoji, 4 + Math.floor(Math.random() * 3)));

  useEffect(() => {
    const id = setInterval(() => setFlou((f) => Math.max(0, f - 1)), 700);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="stage" style={{ display: 'flex', flexDirection: 'column' }}>
      <RoundHeader icone={<IconBuzzer color="var(--outline)" />} iconBg="var(--accent-magenta)" titre="Vision Floue" sousTitre={`Manche ${manche}`} couleurTitre="var(--accent-magenta)" />
      <BuzzerHost
        remote={remote}
        auto
        consigne="L'image se précise petit à petit. Premier qui buzz choisit la bonne réponse sur son téléphone."
        enfants={<div style={{ fontSize: 90, filter: `blur(${flou}px)`, transition: 'filter .4s linear' }}>{emoji}</div>}
        options={options}
        bonneReponse={bonneReponse}
        dureeReponse={8}
        onTermine={(scores) => onTermine({ scores })}
      />
    </div>
  );
}
