import { useEffect, useRef, useState } from 'react';
import { creerConnexionRemote, genererCodeSalle } from './remote.js';

// useRemoteHote — côté PC/tablette (l'écran principal) : ouvre une salle,
// garde la liste des téléphones connectés à jour, relaie les votes
// individuels reçus pendant un round de vote, et sert de bus générique
// pour les mini-jeux "manette" (buzzer, mash, QCM, séquence, dessin...)
// via envoyerAction/actionsRecues. Instancié une seule fois dans App.jsx
// pour toute la durée de vie de l'appli : le lobby (PlayerSetup) et la
// partie (RoundScreen) partagent la même connexion, le même code.

export function useRemoteHote(joueurs, { onNouveauJoueur } = {}) {
  const [actif, setActif] = useState(false);
  const [code, setCode] = useState('');
  const [connectes, setConnectes] = useState([]); // [{ nom, connecte }]
  const [votesRecus, setVotesRecus] = useState({}); // nom -> points, pour le round en cours
  const [actionsRecues, setActionsRecues] = useState({}); // nom -> payload, pour le round manette en cours
  const [ordreActions, setOrdreActions] = useState([]); // noms dans l'ordre d'arrivée (buzzer)
  const connexionRef = useRef(null);
  const joueursRef = useRef(joueurs);
  joueursRef.current = joueurs;
  const onNouveauJoueurRef = useRef(onNouveauJoueur);
  onNouveauJoueurRef.current = onNouveauJoueur;

  useEffect(() => () => connexionRef.current && connexionRef.current.fermer(), []);

  useEffect(() => {
    if (actif && connexionRef.current) {
      connexionRef.current.envoyer({ type: 'set-joueurs', joueurs });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(joueurs)]);

  const activer = () => {
    // Un code neuf à chaque activation : si l'hôte relance une soirée, on
    // ne veut pas qu'un vieux téléphone resté sur l'ancien QR code se
    // retrouve mélangé à la nouvelle salle.
    const nouveauCode = genererCodeSalle();
    setCode(nouveauCode);
    const conn = creerConnexionRemote({
      // Rejoué à chaque (re)connexion, pas seulement la première fois : si
      // le petit serveur redémarre en pleine soirée, l'hôte reprend sa
      // salle automatiquement dès que la connexion revient.
      onOuverte: () => {
        conn.envoyer({ type: 'host-start', code: nouveauCode });
        conn.envoyer({ type: 'set-joueurs', joueurs: joueursRef.current });
      },
    });
    connexionRef.current = conn;
    conn.sur('player-list', (msg) => setConnectes(msg.joueurs));
    conn.sur('vote-received', (msg) => {
      setVotesRecus((prev) => ({ ...prev, [msg.nom]: msg.points }));
    });
    conn.sur('action', (msg) => {
      setActionsRecues((prev) => ({ ...prev, [msg.nom]: msg.payload }));
      setOrdreActions((prev) => (prev.includes(msg.nom) ? prev : [...prev, msg.nom]));
    });
    // Un téléphone qui rejoint depuis le lobby s'ajoute lui-même à la
    // liste des joueurs côté serveur — on répercute ça dans l'état React
    // de l'hôte (voir PlayerSetup.jsx) pour que la même liste serve
    // partout, qu'un prénom vienne du clavier de l'hôte ou d'un téléphone.
    conn.sur('joueurs-sync', (msg) => {
      const connus = new Set(joueursRef.current.map((j) => j.toLowerCase()));
      (msg.joueurs || []).forEach((nom) => {
        if (!connus.has(nom.toLowerCase())) {
          connus.add(nom.toLowerCase());
          onNouveauJoueurRef.current && onNouveauJoueurRef.current(nom);
        }
      });
    });
    setActif(true);
  };

  const desactiver = () => {
    connexionRef.current && connexionRef.current.fermer();
    connexionRef.current = null;
    setActif(false);
    setCode('');
    setConnectes([]);
    setVotesRecus({});
    setActionsRecues({});
    setOrdreActions([]);
  };

  const demarrerVote = (question) => {
    setVotesRecus({});
    connexionRef.current && connexionRef.current.envoyer({ type: 'vote-start', question });
  };

  // Pour l'écran "en attente" des manettes : qui joue, à quoi, et où j'en
  // suis moi-même (score + rang) — voir ManetteScreen.jsx.
  const envoyerContexte = (jeu, joueur) => {
    connexionRef.current && connexionRef.current.envoyer({ type: 'contexte', jeu, joueur });
  };

  const envoyerScores = (scores) => {
    connexionRef.current && connexionRef.current.envoyer({ type: 'scores', scores });
  };

  // Bus générique pour les mini-jeux manette : un seul payload arbitraire,
  // toute la logique de jeu (buzzer, mash, QCM, séquence, dessin...) vit
  // dans les composants React de chaque côté — voir src/manette/.
  const resetActions = () => {
    setActionsRecues({});
    setOrdreActions([]);
  };

  const envoyerAction = (payload) => {
    connexionRef.current && connexionRef.current.envoyer({ type: 'action-broadcast', payload });
  };

  // Variante "un payload différent par joueur" (ex. rôle secret du
  // Traître) : parJoueur = { nom: payload }.
  const envoyerActionPrivee = (parJoueur) => {
    connexionRef.current && connexionRef.current.envoyer({ type: 'action-broadcast-prive', parJoueur });
  };

  const nbConnectes = connectes.filter((j) => j.connecte).length;

  return {
    actif,
    code,
    connectes,
    nbConnectes,
    votesRecus,
    actionsRecues,
    ordreActions,
    activer,
    desactiver,
    demarrerVote,
    envoyerContexte,
    envoyerScores,
    resetActions,
    envoyerAction,
    envoyerActionPrivee,
  };
}
