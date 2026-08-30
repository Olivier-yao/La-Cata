import { useEffect, useRef, useState } from 'react';
import { creerConnexionRemote, genererCodeSalle } from './remote.js';

// useRemoteHote — côté PC/tablette (l'écran principal) : ouvre une salle,
// garde la liste des téléphones connectés à jour, et relaie les votes
// individuels reçus pendant un round de vote.

export function useRemoteHote(joueurs) {
  const [actif, setActif] = useState(false);
  const [code] = useState(genererCodeSalle);
  const [connectes, setConnectes] = useState([]); // [{ nom, connecte }]
  const [votesRecus, setVotesRecus] = useState({}); // nom -> points, pour le round en cours
  const connexionRef = useRef(null);
  const joueursRef = useRef(joueurs);
  joueursRef.current = joueurs;

  useEffect(() => () => connexionRef.current && connexionRef.current.fermer(), []);

  useEffect(() => {
    if (actif && connexionRef.current) {
      connexionRef.current.envoyer({ type: 'set-joueurs', joueurs });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(joueurs)]);

  const activer = () => {
    const conn = creerConnexionRemote();
    connexionRef.current = conn;
    conn.sur('player-list', (msg) => setConnectes(msg.joueurs));
    conn.sur('vote-received', (msg) => {
      setVotesRecus((prev) => ({ ...prev, [msg.nom]: msg.points }));
    });
    conn.envoyer({ type: 'host-start', code });
    conn.envoyer({ type: 'set-joueurs', joueurs: joueursRef.current });
    setActif(true);
  };

  const desactiver = () => {
    connexionRef.current && connexionRef.current.fermer();
    connexionRef.current = null;
    setActif(false);
    setConnectes([]);
    setVotesRecus({});
  };

  const demarrerVote = (question) => {
    setVotesRecus({});
    connexionRef.current && connexionRef.current.envoyer({ type: 'vote-start', question });
  };

  const nbConnectes = connectes.filter((j) => j.connecte).length;

  return { actif, code, connectes, nbConnectes, votesRecus, activer, desactiver, demarrerVote };
}
