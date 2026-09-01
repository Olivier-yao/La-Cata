import React, { useState } from 'react';
import RoundHeader from '../components/RoundHeader.jsx';
import MarcheNoirHost from '../manette/MarcheNoirHost.jsx';
import { IconCamembertVote } from '../components/icons.jsx';
import { objetTeleAchatAleatoire } from '../data/objetsTeleAchat.js';

export default function MarcheNoir({ manche, joueurs, remote, onTermine }) {
  const [objet] = useState(objetTeleAchatAleatoire);
  return (
    <div className="stage" style={{ display: 'flex', flexDirection: 'column' }}>
      <RoundHeader icone={<IconCamembertVote color="var(--outline)" />} iconBg="var(--accent-violet)" titre="Marché Noir" sousTitre={`Manche ${manche} · ${objet}`} couleurTitre="var(--accent-violet)" />
      <MarcheNoirHost remote={remote} joueurs={joueurs} objet={objet} onTermine={(scores) => onTermine({ scores })} />
    </div>
  );
}
