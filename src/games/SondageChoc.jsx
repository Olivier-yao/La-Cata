import React, { useState } from 'react';
import RoundHeader from '../components/RoundHeader.jsx';
import QcmHost from '../manette/QcmHost.jsx';
import { IconCamembertVote } from '../components/icons.jsx';
import { sondageChocAleatoire } from '../data/sondagesChoc.js';

// Sondage Choc — au-delà du simple "vote avec la majorité", le vrai
// payoff du jeu est de repérer le mouton noir de la table : la seule
// personne (ou presque) à avoir voté différemment. Ça donne un vainqueur
// ET un anti-héros à chaque manche, pas juste un score.

export default function SondageChoc({ manche, remote, onTermine }) {
  const [s] = useState(sondageChocAleatoire);

  const surResultat = ({ choix, tally, indexMajoritaire, estEgalite }) => {
    const nomsVotants = Object.keys(choix);
    const scores = {};
    nomsVotants.forEach((nom) => { scores[nom] = !estEgalite && choix[nom] === indexMajoritaire ? 3 : 0; });

    let resultat = estEgalite ? 'Vote coupé en deux, pas de mouton noir cette fois.' : null;
    if (!estEgalite) {
      const votesPositifs = tally.filter((v) => v > 0);
      const minVotes = votesPositifs.length ? Math.min(...votesPositifs) : 0;
      const indicesMinoritaires = tally.reduce((acc, v, i) => (v === minVotes && v > 0 ? [...acc, i] : acc), []);
      if (minVotes > 0 && indicesMinoritaires.length === 1 && indicesMinoritaires[0] !== indexMajoritaire) {
        const indexMouton = indicesMinoritaires[0];
        const moutons = nomsVotants.filter((nom) => choix[nom] === indexMouton);
        const mouton = moutons[Math.floor(Math.random() * moutons.length)];
        if (mouton) {
          scores[mouton] = (scores[mouton] || 0) + 1;
          resultat = `${mouton} est le mouton noir de la table (seul·e ou presque à avoir voté « ${s.options[indexMouton]} »).`;
        }
      }
    }
    onTermine({ scores, resultat });
  };

  return (
    <div className="stage" style={{ display: 'flex', flexDirection: 'column' }}>
      <RoundHeader icone={<IconCamembertVote color="var(--outline)" />} iconBg="var(--accent-yellow)" titre="Sondage Choc" sousTitre={`Manche ${manche}`} couleurTitre="var(--accent-yellow)" />
      <QcmHost
        remote={remote}
        question={s.question}
        options={s.options}
        duree={25}
        modeScoring="majorite"
        texteReussite="COMME LA MAJORITÉ !"
        texteEchec="Voix isolée, mais respectée."
        texteEgalite="Vote coupé en deux, personne ne marque de points."
        consigne="Chacun vote en secret sur son téléphone. La majorité marque des points, mais le mouton noir de la table sera démasqué à la fin."
        onResultat={surResultat}
      />
    </div>
  );
}
