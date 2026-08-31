import React, { useState } from 'react';
import RoundHeader from '../components/RoundHeader.jsx';
import MashHost from '../manette/MashHost.jsx';
import { IconCorde } from '../components/icons.jsx';

function formerEquipes(noms) {
  const melanges = [...noms].sort(() => Math.random() - 0.5);
  if (melanges.length >= 4) {
    // Duel de duos : 2 joueurs actifs par camp, le reste regarde cette manche.
    return { A: melanges.slice(0, 2), B: melanges.slice(2, 4), spectateurs: melanges.slice(4) };
  }
  const milieu = Math.ceil(melanges.length / 2);
  return { A: melanges.slice(0, milieu), B: melanges.slice(milieu), spectateurs: [] };
}

export default function TirALaCorde({ manche, remote, onTermine }) {
  const [{ A, B, spectateurs }] = useState(() => formerEquipes(remote.connectes.filter((j) => j.connecte).map((j) => j.nom)));
  const equipes = { A, B };
  return (
    <div className="stage" style={{ display: 'flex', flexDirection: 'column' }}>
      <RoundHeader icone={<IconCorde color="var(--outline)" />} iconBg="var(--accent-cyan)" titre="Tir à la Corde" sousTitre={`Manche ${manche} · magenta contre cyan`} couleurTitre="var(--accent-cyan)" />
      <MashHost
        remote={remote}
        mode="equipes"
        equipes={equipes}
        spectateurs={spectateurs}
        visuel="corde"
        duree={8}
        autoDemarrer={5}
        autoValider
        consigne={`Équipe magenta : ${A.join(', ') || '—'} · Équipe cyan : ${B.join(', ') || '—'}${spectateurs.length ? ` · en tribune : ${spectateurs.join(', ')}` : ''}. Martelez le bouton pour tirer la corde de votre côté — ça démarre tout seul !`}
        onTermine={(scores) => onTermine({ scores })}
      />
    </div>
  );
}
