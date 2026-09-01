import React, { useEffect, useState } from 'react';
import RoundHeader from '../components/RoundHeader.jsx';
import CountdownRing from '../components/CountdownRing.jsx';
import QcmHost from '../manette/QcmHost.jsx';
import { IconMasque } from '../components/icons.jsx';

const DUREE_DISCUSSION = 60;

export default function LeTraitre({ manche, remote, onTermine }) {
  const [phase, setPhase] = useState('avant'); // avant | discussion | alerte | vote
  const [declencheur, setDeclencheur] = useState(null);
  const [traitre] = useState(() => {
    const noms = remote.connectes.filter((j) => j.connecte).map((j) => j.nom);
    return noms[Math.floor(Math.random() * noms.length)];
  });
  const joueursConnectes = remote.connectes.filter((j) => j.connecte).map((j) => j.nom);

  if (joueursConnectes.length < 3) {
    return (
      <div className="stage" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, padding: 40, textAlign: 'center', minHeight: 420 }}>
        <div className="display-title" style={{ fontSize: 26, color: 'var(--accent-magenta)' }}>Il manque des téléphones</div>
        <p style={{ color: 'var(--text-muted)', maxWidth: 420 }}>Le Traître demande au moins 3 téléphones connectés.</p>
      </div>
    );
  }

  const distribuerRoles = () => {
    remote.resetActions();
    const parJoueur = {};
    joueursConnectes.forEach((nom) => {
      parJoueur[nom] = nom === traitre
        ? { prim: 'role-secret', role: 'traitre', special: true, titre: 'TU ES LE TRAÎTRE', consigne: 'Personne ne doit deviner. Mets discrètement des bâtons dans les roues pendant la discussion.', voteDeclenchable: true }
        : { prim: 'role-secret', role: 'loyal', special: false, titre: 'TU ES LOYAL', consigne: 'Un traître se cache parmi vous. Discutez et repérez-le. Dès que vous êtes prêts, n\'importe qui peut déclencher le vote.', voteDeclenchable: true };
    });
    remote.envoyerActionPrivee(parJoueur);
    setPhase('discussion');
  };

  useEffect(() => { distribuerRoles(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Ne dépend pas de `phase` : une fois déclenché, `appelAuVote` doit
  // rester stable (pas retomber à `null`) pour que l'effet ci-dessous ne
  // relance pas son nettoyage — et donc n'annule pas le minuteur — dès que
  // la phase passe à 'alerte'.
  const appelAuVote = remote.ordreActions.find((nom) => remote.actionsRecues[nom]?.action === 'declencher-vote');

  useEffect(() => {
    if (!appelAuVote || phase !== 'discussion') return undefined;
    setDeclencheur(appelAuVote);
    setPhase('alerte');
    const t = setTimeout(() => setPhase('vote'), 2200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appelAuVote]);

  // Le traître ne peut pas voter contre lui-même : si c'est le vote qu'il a
  // envoyé, on l'ignore avant de recompter la majorité.
  const surResultatVote = ({ choix }) => {
    const indexTraitre = joueursConnectes.indexOf(traitre);
    const choixValides = { ...choix };
    if (choixValides[traitre] === indexTraitre) delete choixValides[traitre];
    const tally = joueursConnectes.map((_, i) => Object.values(choixValides).filter((c) => c === i).length);
    const max = Math.max(...tally);
    const meilleurs = tally.reduce((acc, v, i) => (v === max && v > 0 ? [...acc, i] : acc), []);
    const indexMajoritaire = meilleurs.length === 1 ? meilleurs[0] : -1;
    if (indexMajoritaire === -1) {
      onTermine({ scores: Object.fromEntries(joueursConnectes.map((n) => [n, 0])), resultat: 'Vote coupé en deux, le traître s\'en sort.' });
      return;
    }
    const elimine = joueursConnectes[indexMajoritaire];
    const traitreDemasque = elimine === traitre;
    const scores = {};
    joueursConnectes.forEach((nom) => {
      if (nom === traitre) scores[nom] = traitreDemasque ? 0 : 6;
      else scores[nom] = traitreDemasque ? 4 : 0;
    });
    onTermine({ scores, resultat: traitreDemasque ? `${elimine} est éliminé — c'était bien le traître !` : `${elimine} est éliminé à tort, ${traitre} s'en sort.` });
  };

  return (
    <div className="stage" style={{ display: 'flex', flexDirection: 'column' }}>
      <RoundHeader icone={<IconMasque color="var(--outline)" />} iconBg="var(--accent-magenta)" titre="Le Traître" sousTitre={`Manche ${manche}`} couleurTitre="var(--accent-magenta)" />

      {phase === 'discussion' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, padding: '44px 24px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', maxWidth: 460 }}>Discutez à voix haute : qui a un comportement louche ? Le traître doit rester discret. Le vote peut être déclenché depuis n'importe quel téléphone.</p>
          <CountdownRing secondes={DUREE_DISCUSSION} actif onFin={() => setPhase('vote')} couleur="var(--accent-magenta)" pulseFinale taille={180} />
          <button className="btn btn-secondary" onClick={() => setPhase('vote')}>Passer directement au vote</button>
        </div>
      )}

      {phase === 'alerte' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, padding: '70px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: 72, animation: 'lc-shake 0.4s ease-in-out infinite' }}>🚨</div>
          <div className="display-title" style={{ fontSize: 30, color: 'var(--accent-magenta)' }}>VOTE DÉCLENCHÉ</div>
          <p style={{ color: 'var(--text-muted)' }}>{declencheur} a sonné l'alerte. Le vote commence...</p>
        </div>
      )}

      {phase === 'vote' && (
        <QcmHost
          remote={remote}
          question="Qui est le traître ?"
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
