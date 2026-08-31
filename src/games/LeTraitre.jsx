import React, { useState } from 'react';
import RoundHeader from '../components/RoundHeader.jsx';
import CountdownRing from '../components/CountdownRing.jsx';
import QcmHost from '../manette/QcmHost.jsx';
import { IconMasque } from '../components/icons.jsx';

const DUREE_DISCUSSION = 60;

export default function LeTraitre({ manche, remote, onTermine }) {
  const [phase, setPhase] = useState('avant'); // avant | discussion | vote
  const [traitre] = useState(() => {
    const noms = remote.connectes.filter((j) => j.connecte).map((j) => j.nom);
    return noms[Math.floor(Math.random() * noms.length)];
  });
  const joueursConnectes = remote.connectes.filter((j) => j.connecte).map((j) => j.nom);

  const distribuerRoles = () => {
    const parJoueur = {};
    joueursConnectes.forEach((nom) => {
      parJoueur[nom] = nom === traitre
        ? { prim: 'role-secret', role: 'traitre', special: true, titre: 'TU ES LE TRAÎTRE', consigne: 'Personne ne doit deviner. Mets discrètement des bâtons dans les roues pendant la discussion.' }
        : { prim: 'role-secret', role: 'loyal', special: false, titre: 'TU ES LOYAL', consigne: 'Un traître se cache parmi vous. Discutez et repérez-le.' };
    });
    remote.envoyerActionPrivee(parJoueur);
    setPhase('discussion');
  };

  const surResultatVote = ({ indexMajoritaire }) => {
    const accuse = joueursConnectes[indexMajoritaire];
    const traitreDemasque = accuse === traitre;
    const scores = {};
    joueursConnectes.forEach((nom) => {
      if (nom === traitre) scores[nom] = traitreDemasque ? 0 : 6;
      else scores[nom] = traitreDemasque ? 4 : 0;
    });
    onTermine({ scores, resultat: traitreDemasque ? `${traitre} était le traître, démasqué !` : `${traitre} s'en sort, c'était bien le traître.` });
  };

  return (
    <div className="stage" style={{ display: 'flex', flexDirection: 'column' }}>
      <RoundHeader icone={<IconMasque color="var(--outline)" />} iconBg="var(--accent-magenta)" titre="Le Traître" sousTitre={`Manche ${manche}`} couleurTitre="var(--accent-magenta)" />

      {phase === 'avant' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, padding: '48px 24px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', maxWidth: 460 }}>
            Chaque téléphone va recevoir un rôle secret : un traître, et le reste loyal. Personne ne doit montrer son écran.
          </p>
          <button className="btn btn-primary" style={{ fontSize: 20, padding: '20px 44px' }} onClick={distribuerRoles}>Distribuer les rôles</button>
        </div>
      )}

      {phase === 'discussion' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, padding: '44px 24px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', maxWidth: 460 }}>Discutez à voix haute : qui a un comportement louche ? Le traître doit rester discret.</p>
          <CountdownRing secondes={DUREE_DISCUSSION} actif onFin={() => setPhase('vote')} couleur="var(--accent-magenta)" pulseFinale taille={180} />
          <button className="btn btn-secondary" onClick={() => setPhase('vote')}>Passer directement au vote</button>
        </div>
      )}

      {phase === 'vote' && (
        <QcmHost
          remote={remote}
          question="Qui est le traître ?"
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
