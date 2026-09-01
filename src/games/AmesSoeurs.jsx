import React, { useState } from 'react';
import RoundHeader from '../components/RoundHeader.jsx';
import QcmHost from '../manette/QcmHost.jsx';
import { IconMasque } from '../components/icons.jsx';
import { promptAmesSoeursAleatoire } from '../data/promptsAmesSoeurs.js';

// AmesSoeurs — deux joueurs tirés au sort apprennent en privé qu'ils
// forment un duo secret. Tout le monde vote ensuite sur le même petit
// QCM neutre (aucune bonne réponse) — mais seuls les deux âmes sœurs
// marquent gros, et seulement si elles tombent sur la MÊME réponse sans
// s'être concertées. Le reste de la table vote juste pour l'ambiance.

export default function AmesSoeurs({ manche, remote, onTermine }) {
  const [phase, setPhase] = useState('avant'); // avant | vote
  const [prompt] = useState(promptAmesSoeursAleatoire);
  const joueursConnectes = remote.connectes.filter((j) => j.connecte).map((j) => j.nom);
  const [ames] = useState(() => {
    const melanges = [...joueursConnectes].sort(() => Math.random() - 0.5);
    return [melanges[0], melanges[1]];
  });

  if (joueursConnectes.length < 2) {
    return (
      <div className="stage" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, padding: 40, textAlign: 'center', minHeight: 420 }}>
        <div className="display-title" style={{ fontSize: 26, color: 'var(--accent-cyan)' }}>Il manque des téléphones</div>
        <p style={{ color: 'var(--text-muted)', maxWidth: 420 }}>Âmes Sœurs demande au moins 2 téléphones connectés.</p>
      </div>
    );
  }

  const distribuerRoles = () => {
    remote.resetActions();
    remote.envoyerActionPrivee({
      [ames[0]]: { prim: 'role-secret', special: true, titre: 'TU AS UNE ÂME SŒUR', consigne: `${ames[1]} et toi devez tomber sur la même réponse au prochain vote, sans vous parler ni vous regarder.` },
      [ames[1]]: { prim: 'role-secret', special: true, titre: 'TU AS UNE ÂME SŒUR', consigne: `${ames[0]} et toi devez tomber sur la même réponse au prochain vote, sans vous parler ni vous regarder.` },
    });
    setPhase('vote');
  };

  const surResultat = ({ choix }) => {
    const scores = {};
    const memeChoix = choix[ames[0]] !== undefined && choix[ames[0]] === choix[ames[1]];
    if (memeChoix) {
      scores[ames[0]] = 6;
      scores[ames[1]] = 6;
    }
    onTermine({ scores, resultat: memeChoix ? `${ames[0]} et ${ames[1]} étaient bien des âmes sœurs !` : `${ames[0]} et ${ames[1]} n'étaient pas sur la même longueur d'onde.` });
  };

  return (
    <div className="stage" style={{ display: 'flex', flexDirection: 'column' }}>
      <RoundHeader icone={<IconMasque color="var(--outline)" />} iconBg="var(--accent-violet)" titre="Âmes Sœurs" sousTitre={`Manche ${manche}`} couleurTitre="var(--accent-violet)" />

      {phase === 'avant' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, padding: '48px 24px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', maxWidth: 460 }}>
            Deux joueurs tirés au sort apprendront en secret qu'ils forment un duo. Tout le monde vote ensuite sur la même petite question — seul le duo marque des points, et seulement s'il tombe sur la même réponse sans se concerter.
          </p>
          <button className="btn btn-primary" style={{ fontSize: 20, padding: '20px 44px' }} onClick={distribuerRoles}>Révéler les âmes sœurs</button>
        </div>
      )}

      {phase === 'vote' && (
        <QcmHost
          remote={remote}
          question={prompt.question}
          options={prompt.options}
          duree={12}
          modeScoring="aucun"
          texteReussite="MÊME LONGUEUR D'ONDE ?"
          texteEchec="MÊME LONGUEUR D'ONDE ?"
          onResultat={surResultat}
          consigne="Chacun vote en secret. Deux âmes sœurs cachées dans la table espèrent tomber sur la même réponse."
        />
      )}
    </div>
  );
}
