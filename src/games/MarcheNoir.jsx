import React, { useState } from 'react';
import RoundHeader from '../components/RoundHeader.jsx';
import MarcheNoirHost from '../manette/MarcheNoirHost.jsx';
import { IconCamembertVote } from '../components/icons.jsx';
import { objetTeleAchatAleatoire } from '../data/objetsTeleAchat.js';

// Marché Noir enchaîne 15 objets d'affilée dans la même manche. Chacun
// démarre avec un portefeuille fixe qui s'épuise achat après achat — à
// sec, impossible de remporter la moindre enchère. Chaque objet cache un
// bonus ou un piège révélé seulement une fois gagné.
const NB_OBJETS = 15;
const PORTEFEUILLE_DEPART = 300;

function genererBonus() {
  const v = Math.floor(Math.random() * 15) - 6; // -6..+8
  return v;
}

export default function MarcheNoir({ manche, joueurs, remote, onTermine }) {
  const [tour, setTour] = useState(0);
  const [objet, setObjet] = useState(objetTeleAchatAleatoire);
  const [bonus, setBonus] = useState(genererBonus);
  const [portefeuilles, setPortefeuilles] = useState(() => Object.fromEntries(joueurs.map((n) => [n, PORTEFEUILLE_DEPART])));
  const [scoresCumules, setScoresCumules] = useState({});

  const surTermine = ({ scores, portefeuilles: nouveauxPortefeuilles }) => {
    const suivant = { ...scoresCumules };
    Object.entries(scores || {}).forEach(([nom, pts]) => { suivant[nom] = (suivant[nom] || 0) + pts; });
    const toutLeMondeASec = Object.values(nouveauxPortefeuilles).every((p) => p <= 0);
    if (tour + 1 >= NB_OBJETS || toutLeMondeASec) { onTermine({ scores: suivant }); return; }
    setScoresCumules(suivant);
    setPortefeuilles(nouveauxPortefeuilles);
    setTour((t) => t + 1);
    setObjet(objetTeleAchatAleatoire());
    setBonus(genererBonus());
  };

  return (
    <div className="stage" style={{ display: 'flex', flexDirection: 'column' }}>
      <RoundHeader icone={<IconCamembertVote color="var(--outline)" />} iconBg="var(--accent-violet)" titre="Marché Noir" sousTitre={`Manche ${manche} · objet ${tour + 1}/${NB_OBJETS} · ${objet}`} couleurTitre="var(--accent-violet)" />
      <MarcheNoirHost
        key={tour}
        remote={remote}
        joueurs={joueurs}
        objet={objet}
        bonus={bonus}
        portefeuilles={portefeuilles}
        onTermine={surTermine}
      />
    </div>
  );
}
