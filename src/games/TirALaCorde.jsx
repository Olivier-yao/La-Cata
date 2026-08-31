import React, { useState } from 'react';
import RoundHeader from '../components/RoundHeader.jsx';
import MashHost from '../manette/MashHost.jsx';
import { IconCorde } from '../components/icons.jsx';

function equipesAleatoires(noms) {
  const melanges = [...noms].sort(() => Math.random() - 0.5);
  const milieu = Math.ceil(melanges.length / 2);
  return { A: melanges.slice(0, milieu), B: melanges.slice(milieu) };
}

export default function TirALaCorde({ manche, remote, onTermine }) {
  const [equipes] = useState(() => equipesAleatoires(remote.connectes.filter((j) => j.connecte).map((j) => j.nom)));
  return (
    <div className="stage" style={{ display: 'flex', flexDirection: 'column' }}>
      <RoundHeader icone={<IconCorde color="var(--outline)" />} iconBg="var(--accent-cyan)" titre="Tir à la Corde" sousTitre={`Manche ${manche} · magenta contre cyan`} couleurTitre="var(--accent-cyan)" />
      <MashHost
        remote={remote}
        mode="equipes"
        equipes={equipes}
        duree={8}
        consigne={`Équipe magenta : ${equipes.A.join(', ') || '—'} · Équipe cyan : ${equipes.B.join(', ') || '—'}. Martelez le bouton pour tirer la corde de votre côté.`}
        onTermine={(scores) => onTermine({ scores })}
      />
    </div>
  );
}
