import React, { useEffect, useState } from 'react';
import RoundHeader from '../components/RoundHeader.jsx';
import CountdownRing from '../components/CountdownRing.jsx';
import QcmHost from '../manette/QcmHost.jsx';
import { IconMasque } from '../components/icons.jsx';
import { lieuEspionAleatoire } from '../data/lieuxEspion.js';

const DUREE_DISCUSSION = 75;

export default function EspionParmiNous({ manche, remote, onTermine }) {
  const [phase, setPhase] = useState('avant'); // avant | discussion | alerte | vote
  const [declencheur, setDeclencheur] = useState(null);
  const [lieu] = useState(lieuEspionAleatoire);
  const [espion] = useState(() => {
    const noms = remote.connectes.filter((j) => j.connecte).map((j) => j.nom);
    return noms[Math.floor(Math.random() * noms.length)];
  });
  const joueursConnectes = remote.connectes.filter((j) => j.connecte).map((j) => j.nom);

  if (joueursConnectes.length < 3) {
    return (
      <div className="stage" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, padding: 40, textAlign: 'center', minHeight: 420 }}>
        <div className="display-title" style={{ fontSize: 26, color: 'var(--accent-cyan)' }}>Il manque des téléphones</div>
        <p style={{ color: 'var(--text-muted)', maxWidth: 420 }}>Espion Parmi Nous demande au moins 3 téléphones connectés.</p>
      </div>
    );
  }

  const distribuerRoles = () => {
    remote.resetActions();
    const parJoueur = {};
    joueursConnectes.forEach((nom) => {
      parJoueur[nom] = nom === espion
        ? { prim: 'role-secret', role: 'espion', special: true, titre: 'TU ES L\'ESPION', consigne: 'Tu ne connais pas le lieu. Écoute les questions et réponses des autres pour deviner sans te faire repérer.', voteDeclenchable: true }
        : { prim: 'role-secret', role: 'temoin', special: false, titre: 'LE LIEU SECRET', consigne: 'Un espion parmi vous ne connaît pas ce lieu. Posez-vous des questions sur ce lieu sans le nommer, et démasquez-le. Dès que vous êtes prêts, n\'importe qui peut déclencher le vote.', motSecret: lieu, voteDeclenchable: true };
    });
    remote.envoyerActionPrivee(parJoueur);
    setPhase('discussion');
  };

  useEffect(() => { distribuerRoles(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Ne dépend pas de `phase` (voir Le Traître pour le même besoin) : une
  // fois déclenché, ne doit pas retomber à `null` et annuler le minuteur.
  const appelAuVote = remote.ordreActions.find((nom) => remote.actionsRecues[nom]?.action === 'declencher-vote');

  useEffect(() => {
    if (!appelAuVote || phase !== 'discussion') return undefined;
    setDeclencheur(appelAuVote);
    setPhase('alerte');
    const t = setTimeout(() => setPhase('vote'), 2200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appelAuVote]);

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

      {phase === 'discussion' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, padding: '44px 24px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', maxWidth: 460 }}>Posez-vous des questions sur le lieu sans le dire à voix haute. Le vote peut être déclenché depuis n'importe quel téléphone.</p>
          <CountdownRing secondes={DUREE_DISCUSSION} actif onFin={() => setPhase('vote')} couleur="var(--accent-cyan)" pulseFinale taille={180} />
        </div>
      )}

      {phase === 'alerte' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, padding: '70px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: 72, animation: 'lc-shake 0.4s ease-in-out infinite' }}>🚨</div>
          <div className="display-title" style={{ fontSize: 30, color: 'var(--accent-cyan)' }}>VOTE DÉCLENCHÉ</div>
          <p style={{ color: 'var(--text-muted)' }}>{declencheur} a sonné l'alerte. Le vote commence...</p>
        </div>
      )}

      {phase === 'vote' && (
        <QcmHost
          remote={remote}
          question="Qui est l'espion ?"
          options={joueursConnectes}
          duree={16}
          modeScoring="aucun"
          autoDemarrer={declencheur != null}
          onResultat={surResultatVote}
          consigne="Chacun vote en secret pour la personne qu'il/elle soupçonne."
        />
      )}
    </div>
  );
}
