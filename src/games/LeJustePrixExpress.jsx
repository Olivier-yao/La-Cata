import React, { useState } from 'react';
import RoundHeader from '../components/RoundHeader.jsx';
import QcmHost from '../manette/QcmHost.jsx';
import BuzzerHost from '../manette/BuzzerHost.jsx';
import { IconCamembertVote } from '../components/icons.jsx';
import { justePrixAleatoire } from '../data/justePrix.js';

// Le Juste Prix Express enchaîne, après l'estimation classique, un objet
// mystère à acheter (premier qui appuie) avec un bonus caché — personne
// ne connaît son effet à l'avance. L'acheteur choisit ensuite en secret
// sur qui l'utiliser : ça peut l'avantager ou le désavantager.
function genererBonus() {
  return Math.floor(Math.random() * 13) - 5; // -5..+7
}

export default function LeJustePrixExpress({ manche, joueurs, remote, onTermine }) {
  const [phase, setPhase] = useState('prix'); // prix | achat | cible | resultat
  const [q] = useState(justePrixAleatoire);
  const [scoresPrix, setScoresPrix] = useState({});
  const [acheteur, setAcheteur] = useState(null);
  const [bonus] = useState(genererBonus);
  const [cible, setCible] = useState(null);

  const surTerminePrix = (scores) => {
    setScoresPrix(scores);
    setPhase('achat');
  };

  const surAchat = (scoresAchat) => {
    const nom = Object.keys(scoresAchat)[0];
    if (!nom) { onTermine({ scores: scoresPrix }); return; }
    setAcheteur(nom);
    setPhase('cible');
  };

  const surCible = ({ choix }) => {
    const indexCible = choix[acheteur];
    const nomCible = indexCible != null ? joueurs[indexCible] : null;
    const scoresFinaux = { ...scoresPrix };
    if (nomCible) scoresFinaux[nomCible] = (scoresFinaux[nomCible] || 0) + bonus;
    setCible(nomCible);
    setPhase('resultat');
    setTimeout(() => onTermine({ scores: scoresFinaux }), 2800);
  };

  return (
    <div className="stage" style={{ display: 'flex', flexDirection: 'column' }}>
      <RoundHeader icone={<IconCamembertVote color="var(--outline)" />} iconBg="var(--accent-lime)" titre="Le Juste Prix Express" sousTitre={`Manche ${manche}`} couleurTitre="var(--accent-lime)" />

      {phase === 'prix' && (
        <QcmHost
          remote={remote}
          question={q.question}
          options={q.options}
          duree={12}
          modeScoring="correct"
          bonneReponse={q.bonneReponse}
          pointsGagnant={6}
          texteReussite="PRIX EXACT !"
          texteEchec="Raté, ce n'était pas le bon prix."
          consigne="Estime le bon prix sur ton téléphone."
          onTermine={surTerminePrix}
        />
      )}

      {phase === 'achat' && (
        <BuzzerHost
          remote={remote}
          ouvertureInstantanee
          pointsGagnant={0}
          consigne="Un objet mystère avec un bonus caché est en vente — premier qui appuie l'achète. Personne ne connaît son effet à l'avance."
          onTermine={surAchat}
        />
      )}

      {phase === 'cible' && (
        <QcmHost
          remote={remote}
          question={`${acheteur}, choisis sur qui utiliser ton objet mystère`}
          options={joueurs}
          duree={12}
          modeScoring="aucun"
          votantsEligibles={[acheteur]}
          onResultat={surCible}
          consigne={`${acheteur} choisit sa cible en secret, seul·e.`}
        />
      )}

      {phase === 'resultat' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, padding: '40px 24px', textAlign: 'center' }}>
          <div className="display-title" style={{ fontSize: 26, color: bonus >= 0 ? 'var(--accent-lime)' : 'var(--accent-magenta)' }}>
            {cible ? `${acheteur} utilise l'objet sur ${cible} : ${bonus >= 0 ? '+' : ''}${bonus} !` : `${acheteur} n'a choisi personne, l'objet ne sert à rien.`}
          </div>
        </div>
      )}
    </div>
  );
}
