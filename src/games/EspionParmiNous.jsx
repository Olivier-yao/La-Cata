import React, { useState } from 'react';
import RoundHeader from '../components/RoundHeader.jsx';
import CountdownRing from '../components/CountdownRing.jsx';
import QcmHost from '../manette/QcmHost.jsx';
import { IconMasque } from '../components/icons.jsx';
import { lieuEspionAleatoire } from '../data/lieuxEspion.js';

const DUREE_DISCUSSION = 75;

export default function EspionParmiNous({ manche, remote, onTermine }) {
  const [phase, setPhase] = useState('avant'); // avant | discussion | vote
  const [lieu] = useState(lieuEspionAleatoire);
  const [espion] = useState(() => {
    const noms = remote.connectes.filter((j) => j.connecte).map((j) => j.nom);
    return noms[Math.floor(Math.random() * noms.length)];
  });
  const joueursConnectes = remote.connectes.filter((j) => j.connecte).map((j) => j.nom);

  const distribuerRoles = () => {
    const parJoueur = {};
    joueursConnectes.forEach((nom) => {
      parJoueur[nom] = nom === espion
        ? { prim: 'role-secret', role: 'espion', special: true, titre: 'TU ES L\'ESPION', consigne: 'Tu ne connais pas le lieu. Écoute les questions et réponses des autres pour deviner sans te faire repérer.' }
        : { prim: 'role-secret', role: 'temoin', special: false, titre: 'LE LIEU SECRET', consigne: 'Un espion parmi vous ne connaît pas ce lieu. Posez-vous des questions sur ce lieu sans le nommer, et démasquez-le.', motSecret: lieu };
    });
    remote.envoyerActionPrivee(parJoueur);
    setPhase('discussion');
  };

  const surResultatVote = ({ indexMajoritaire }) => {
    const accuse = joueursConnectes[indexMajoritaire];
    const espionDemasque = accuse === espion;
    const scores = {};
    joueursConnectes.forEach((nom) => {
      if (nom === espion) scores[nom] = espionDemasque ? 0 : 6;
      else scores[nom] = espionDemasque ? 4 : 0;
    });
    onTermine({ scores, resultat: espionDemasque ? `${espion} était l'espion, démasqué !` : `${espion} s'en sort — le lieu était : ${lieu}.` });
  };

  return (
    <div className="stage" style={{ display: 'flex', flexDirection: 'column' }}>
      <RoundHeader icone={<IconMasque color="var(--outline)" />} iconBg="var(--accent-cyan)" titre="Espion Parmi Nous" sousTitre={`Manche ${manche}`} couleurTitre="var(--accent-cyan)" />

      {phase === 'avant' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, padding: '48px 24px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', maxWidth: 460 }}>
            Tout le monde reçoit le même lieu secret sur son téléphone, sauf un espion tiré au sort. Questions à voix haute, sans jamais nommer le lieu.
          </p>
          <button className="btn btn-cyan" style={{ fontSize: 20, padding: '20px 44px' }} onClick={distribuerRoles}>Distribuer les rôles</button>
        </div>
      )}

      {phase === 'discussion' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, padding: '44px 24px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', maxWidth: 460 }}>Posez-vous des questions sur le lieu sans le dire à voix haute. L'espion doit deviner ou bluffer.</p>
          <CountdownRing secondes={DUREE_DISCUSSION} actif onFin={() => setPhase('vote')} couleur="var(--accent-cyan)" pulseFinale taille={180} />
          <button className="btn btn-secondary" onClick={() => setPhase('vote')}>Passer directement au vote</button>
        </div>
      )}

      {phase === 'vote' && (
        <QcmHost
          remote={remote}
          question="Qui est l'espion ?"
          options={joueursConnectes}
          duree={16}
          modeScoring="aucun"
          onResultat={surResultatVote}
          consigne="Chacun vote en secret pour la personne qu'il/elle soupçonne."
        />
      )}
    </div>
  );
}
