import React, { useState } from 'react';
import RoundHeader from '../components/RoundHeader.jsx';
import TeleAchatHost from '../manette/TeleAchatHost.jsx';
import { IconDoublage } from '../components/icons.jsx';
import { objetTeleAchatAleatoire } from '../data/objetsTeleAchat.js';

export default function EmissionTeleAchat({ manche, remote, onTermine }) {
  const [objet] = useState(objetTeleAchatAleatoire);
  return (
    <div className="stage" style={{ display: 'flex', flexDirection: 'column' }}>
      <RoundHeader
        icone={<IconDoublage color="var(--outline)" />}
        iconBg="var(--accent-yellow)"
        titre="Émission de Télé-Achat"
        sousTitre={`Manche ${manche}`}
        couleurTitre="var(--accent-yellow)"
      />
      <TeleAchatHost remote={remote} objet={objet} onTermine={onTermine} />
    </div>
  );
}
