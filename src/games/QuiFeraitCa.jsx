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
        modeScoring="cible"
        pointsGagnant={4}
        texteReussite="MÊME AVIS QUE LE GROUPE"
        texteEchec="Vision différente du groupe, mais assumée."
        texteEgalite="Égalité entre deux suspects — personne ne remporte le titre."
        consigne="Chacun vote pour la personne présente qui colle le mieux. Le plus désigné remporte le titre (et les points)."
        onTermine={(scores) => onTermine({ scores })}
      />
    </div>
  );
}
