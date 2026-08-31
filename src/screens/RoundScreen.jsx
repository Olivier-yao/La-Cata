import React, { useEffect, useRef, useState } from 'react';
import { GAMES, jeuAleatoire } from '../data/games.js';
import { creerPickerAleatoire } from '../lib/randomSansRepeat.js';
import GameSelectScreen from './GameSelectScreen.jsx';
import ReglesJeuScreen from './ReglesJeuScreen.jsx';
import ChoixJoueurScreen from './ChoixJoueurScreen.jsx';
import ScoreboardScreen from './ScoreboardScreen.jsx';
import PodiumScreen from './PodiumScreen.jsx';
import ParisScreen from './ParisScreen.jsx';
import VoteGraduee from '../components/vote/VoteGraduee.jsx';
import VoteGradueeMultiple from '../components/vote/VoteGradueeMultiple.jsx';
import VoteGradueeRemoteHost from '../components/vote/VoteGradueeRemoteHost.jsx';
import VoteBinaire from '../components/vote/VoteBinaire.jsx';
import VoteVraiFaux from '../components/vote/VoteVraiFaux.jsx';

import VirelangueExpress from '../games/VirelangueExpress.jsx';
import AccentSurprise from '../games/AccentSurprise.jsx';
import SansRire from '../games/SansRire.jsx';
import DefiChronoAbsurde from '../games/DefiChronoAbsurde.jsx';
import DoublageSauvage from '../games/DoublageSauvage.jsx';
import DevineLeBruit from '../games/DevineLeBruit.jsx';
import ChantImpose from '../games/ChantImpose.jsx';
import DessineAlAveugle from '../games/DessineAlAveugle.jsx';
import LeMenteur from '../games/LeMenteur.jsx';
import StatueSurprise from '../games/StatueSurprise.jsx';
import Conversation from '../games/Conversation.jsx';
import MemoireFlash from '../games/MemoireFlash.jsx';
import Improvisation from '../games/Improvisation.jsx';
import CalculEclair from '../games/CalculEclair.jsx';
import TexteCorse from '../games/TexteCorse.jsx';
import MotSurprise from '../games/MotSurprise.jsx';
import ImprovisationTitre from '../games/ImprovisationTitre.jsx';
import AlphabetExpress from '../games/AlphabetExpress.jsx';
import MemoireDeGroupe from '../games/MemoireDeGroupe.jsx';
import SondagePredictif from '../games/SondagePredictif.jsx';
import LeDetective from '../games/LeDetective.jsx';
import CategoriesChrono from '../games/CategoriesChrono.jsx';
import AssociationChaine from '../games/AssociationChaine.jsx';
import HistoirePlusieursVoix from '../games/HistoirePlusieursVoix.jsx';
import SpeedDatingImprobable from '../games/SpeedDatingImprobable.jsx';
import ProcesFictif from '../games/ProcesFictif.jsx';
import EmissionTeleAchat from '../games/EmissionTeleAchat.jsx';
import EvasionExpress from '../games/EvasionExpress.jsx';
import Declaration from '../games/Declaration.jsx';
import TextoSousPression from '../games/TextoSousPression.jsx';
import DuelDuBuzzer from '../games/DuelDuBuzzer.jsx';
import VisionFloue from '../games/VisionFloue.jsx';
import QuestionEclair from '../games/QuestionEclair.jsx';
import CompteEstBonExpress from '../games/CompteEstBonExpress.jsx';
import TirALaCorde from '../games/TirALaCorde.jsx';
import LeTrone from '../games/LeTrone.jsx';
import Surchauffe from '../games/Surchauffe.jsx';
import MarathonDesDoigts from '../games/MarathonDesDoigts.jsx';
import SondageChoc from '../games/SondageChoc.jsx';
import QuiFeraitCa from '../games/QuiFeraitCa.jsx';
import PlusOuMoins from '../games/PlusOuMoins.jsx';
import LeJustePrixExpress from '../games/LeJustePrixExpress.jsx';
import VoteDeLaHonte from '../games/VoteDeLaHonte.jsx';
import SimonDitNumerique from '../games/SimonDitNumerique.jsx';
import MemoireFlashCollective from '../games/MemoireFlashCollective.jsx';
import CadavreExquisNumerique from '../games/CadavreExquisNumerique.jsx';
import LeTraitre from '../games/LeTraitre.jsx';
import EspionParmiNous from '../games/EspionParmiNous.jsx';
import LaRoueDuDestin from '../games/LaRoueDuDestin.jsx';
import CroquisEnDirect from '../games/CroquisEnDirect.jsx';

const COMPOSANTS_PAR_JEU = {
  'virelangue-express': VirelangueExpress,
  'accent-surprise': AccentSurprise,
  'sans-rire': SansRire,
  'defi-chrono-absurde': DefiChronoAbsurde,
  'doublage-sauvage': DoublageSauvage,
  'devine-le-bruit': DevineLeBruit,
  'chant-impose': ChantImpose,
  'dessine-a-laveugle': DessineAlAveugle,
  'le-menteur': LeMenteur,
  'statue-surprise': StatueSurprise,
  'conversation': Conversation,
  'memoire-flash': MemoireFlash,
  'improvisation': Improvisation,
  'calcul-eclair': CalculEclair,
  'texte-corse': TexteCorse,
  'mot-surprise': MotSurprise,
  'improvisation-titre': ImprovisationTitre,
  'alphabet-express': AlphabetExpress,
  'memoire-groupe': MemoireDeGroupe,
  'sondage-predictif': SondagePredictif,
  'le-detective': LeDetective,
  'categories-chrono': CategoriesChrono,
  'association-chaine': AssociationChaine,
  'histoire-plusieurs-voix': HistoirePlusieursVoix,
  'speed-dating-improbable': SpeedDatingImprobable,
  'proces-fictif': ProcesFictif,
  'emission-tele-achat': EmissionTeleAchat,
  'evasion-express': EvasionExpress,
  'declaration': Declaration,
  'texto-sous-pression': TextoSousPression,
  'duel-buzzer': DuelDuBuzzer,
  'vision-floue': VisionFloue,
  'question-eclair': QuestionEclair,
  'compte-est-bon-express': CompteEstBonExpress,
  'tir-a-la-corde': TirALaCorde,
  'le-trone': LeTrone,
  'surchauffe': Surchauffe,
  'marathon-des-doigts': MarathonDesDoigts,
  'sondage-choc': SondageChoc,
  'qui-ferait-ca': QuiFeraitCa,
  'plus-ou-moins': PlusOuMoins,
  'juste-prix-express': LeJustePrixExpress,
  'vote-de-la-honte': VoteDeLaHonte,
  'simon-dit-numerique': SimonDitNumerique,
  'memoire-flash-collective': MemoireFlashCollective,
  'cadavre-exquis-numerique': CadavreExquisNumerique,
  'le-traitre': LeTraitre,
  'espion-parmi-nous': EspionParmiNous,
  'roue-du-destin': LaRoueDuDestin,
  'croquis-en-direct': CroquisEnDirect,
};

// Mini-jeux "groupe" où chaque joueur du cast est noté individuellement
// (voir onTermine({ cast })) — chacun n'a pas forcément la même performance.
const JEUX_SCORE_COLLECTIF = ['conversation', 'improvisation', 'mot-surprise', 'histoire-plusieurs-voix'];

// Mini-jeux "groupe" où tout le cast reçoit le même verdict (Speed Dating :
// l'alchimie se juge à deux ; Procès Fictif : le verdict s'applique à
// l'accusé et aux deux avocats).
const JEUX_SCORE_GROUPE_IDENTIQUE = ['speed-dating-improbable', 'proces-fictif'];

export default function RoundScreen({ joueurs, remote, onNouvelleSoiree }) {
  const totalManches = joueurs.length * 3;

  const [jeuCourant, setJeuCourant] = useState(null);
  const [jeuPropose, setJeuPropose] = useState(null);
  const [joueursRestants, setJoueursRestants] = useState([]);
  const [joueurActuel, setJoueurActuel] = useState(null);
  const [mancheNumero, setMancheNumero] = useState(1);
  const [scores, setScores] = useState(() => Object.fromEntries(joueurs.map((j) => [j, 0])));
  const [phase, setPhase] = useState('choix-jeu'); // choix-jeu | regles | choix-joueur | jeu | vote | scores | podium
  const [donneesManche, setDonneesManche] = useState(null);
  const [bonusUtilise, setBonusUtilise] = useState(false);
  const [vitesseReglage, setVitesseReglage] = useState('normale');
  const [modeAuto, setModeAuto] = useState(false);
  const [manchesAutoTotal, setManchesAutoTotal] = useState(null);
  const autoPickerRef = useRef(null);
  const [paris, setParis] = useState([]);
  const [phaseAvantParis, setPhaseAvantParis] = useState('choix-jeu');
  const [selectionJoueur, setSelectionJoueur] = useState('tour'); // 'tour' | 'hasard'

  const ComposantJeu = jeuCourant && COMPOSANTS_PAR_JEU[jeuCourant.id];
  const joueurIndex = joueurActuel ? joueurs.indexOf(joueurActuel) : 0;

  // Écran "en attente" des manettes : dire qui joue à quoi, et le score de
  // chacun, sans jamais montrer le texte de la manche elle-même.
  useEffect(() => {
    if (remote.actif) remote.envoyerContexte(jeuCourant?.nom, joueurActuel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remote.actif, jeuCourant, joueurActuel]);

  useEffect(() => {
    if (remote.actif) remote.envoyerScores(scores);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remote.actif, scores]);

  const proposerJeu = (jeu) => {
    setJeuPropose(jeu);
    setPhase('regles');
  };

  const demarrerCycle = (jeu) => {
    setJeuCourant(jeu);
    setJeuPropose(null);
    setDonneesManche(null);
    if (jeu.groupe) {
      setJoueursRestants([]);
      setJoueurActuel(null);
      setPhase('jeu');
      return;
    }
    if (selectionJoueur === 'hasard') {
      setJoueurActuel(joueurs[Math.floor(Math.random() * joueurs.length)]);
      setJoueursRestants([]);
      setPhase('jeu');
      return;
    }
    // Le setup impose déjà au moins 2 joueurs, donc le choix du joueur a
    // toujours au moins deux options ici.
    setJoueursRestants([...joueurs]);
    setPhase('choix-joueur');
  };

  const choisirJoueur = (nom) => {
    setJoueurActuel(nom);
    setJoueursRestants((prev) => prev.filter((j) => j !== nom));
    setPhase('jeu');
  };

  const appliquerPoints = (points) => {
    if (points && joueurActuel) {
      setScores((prev) => ({ ...prev, [joueurActuel]: (prev[joueurActuel] || 0) + points }));
    }
    setPhase('scores');
  };

  // Vote par joueur pour les mini-jeux collectifs : chacun peut avoir eu
  // une performance différente, donc pas les mêmes points pour tout le cast.
  const appliquerPointsMultiples = (pointsParJoueur) => {
    setScores((prev) => {
      const suivant = { ...prev };
      Object.entries(pointsParJoueur).forEach(([nom, pts]) => {
        if (pts) suivant[nom] = (suivant[nom] || 0) + pts;
      });
      return suivant;
    });
    setPhase('scores');
  };

  // Pour Speed Dating / Procès Fictif : le même verdict s'applique à tout
  // le cast (contrairement au vote multiple des jeux JEUX_SCORE_COLLECTIF).
  const onVoteGenerique = (points) => {
    if (JEUX_SCORE_GROUPE_IDENTIQUE.includes(jeuCourant?.id) && donneesManche?.cast) {
      appliquerPointsMultiples(Object.fromEntries(donneesManche.cast.map((nom) => [nom, points])));
    } else {
      appliquerPoints(points);
    }
  };

  const surBonus = (nom) => {
    const cible = nom || joueurActuel;
    if (cible) {
      setScores((prev) => ({ ...prev, [cible]: (prev[cible] || 0) + 5 }));
    }
    setBonusUtilise(true);
  };

  const manchesuivante = () => {
    if (modeAuto) {
      manchesuivanteAuto();
      return;
    }
    setMancheNumero((n) => n + 1);
    setDonneesManche(null);
    if (jeuCourant?.groupe) {
      setJeuCourant(null);
      setJoueurActuel(null);
      setPhase('choix-jeu');
      return;
    }
    if (selectionJoueur === 'hasard') {
      setJoueurActuel(joueurs[Math.floor(Math.random() * joueurs.length)]);
      setPhase('jeu');
      return;
    }
    if (joueursRestants.length === 0) {
      setJeuCourant(null);
      setJoueurActuel(null);
      setPhase('choix-jeu');
    } else if (joueursRestants.length === 1) {
      setJoueurActuel(joueursRestants[0]);
      setJoueursRestants([]);
      setPhase('jeu');
    } else {
      setPhase('choix-joueur');
    }
  };

  // Mode auto : jeu et joueur tirés au sort à chaque manche, sans repasser
  // par les écrans de choix — pour enchaîner vite sans que l'hôte pilote.
  const lancerMancheAuto = () => {
    const jeu = autoPickerRef.current();
    setJeuCourant(jeu);
    setJeuPropose(null);
    setDonneesManche(null);
    if (jeu.groupe) {
      setJoueurActuel(null);
      setJoueursRestants([]);
    } else {
      setJoueurActuel(joueurs[Math.floor(Math.random() * joueurs.length)]);
      setJoueursRestants([]);
    }
    setPhase('jeu');
  };

  const manchesuivanteAuto = () => {
    setMancheNumero((n) => n + 1);
    lancerMancheAuto();
  };

  const demarrerModeAuto = (idsSelectionnes, nbManches) => {
    const pool = idsSelectionnes.length ? GAMES.filter((g) => idsSelectionnes.includes(g.id)) : GAMES;
    autoPickerRef.current = creerPickerAleatoire(pool);
    setManchesAutoTotal(nbManches);
    setModeAuto(true);
    lancerMancheAuto();
  };

  const ouvrirParis = () => {
    setPhaseAvantParis(phase);
    setPhase('paris');
  };

  const ajouterPari = (nom, texte) => {
    setParis((prev) => [...prev, { id: `${Date.now()}-${Math.random()}`, nom, texte, realise: null }]);
  };

  const basculerRealisePari = (id, valeur) => {
    setParis((prev) => prev.map((p) => (p.id === id ? { ...p, realise: p.realise === valeur ? null : valeur } : p)));
  };

  const quitterModeAuto = () => {
    setModeAuto(false);
    setManchesAutoTotal(null);
    setJeuCourant(null);
    setJoueurActuel(null);
    setJoueursRestants([]);
    setDonneesManche(null);
    setPhase('choix-jeu');
  };

  if (phase === 'podium') {
    return (
      <PodiumScreen
        joueurs={joueurs}
        scores={scores}
        manches={mancheNumero}
        onRemettre={() => {
          setScores(Object.fromEntries(joueurs.map((j) => [j, 0])));
          setMancheNumero(1);
          setJeuCourant(null);
          setJeuPropose(null);
          setJoueurActuel(null);
          setJoueursRestants([]);
          setDonneesManche(null);
          setBonusUtilise(false);
          setPhase('choix-jeu');
        }}
        onNouvelleSoiree={onNouvelleSoiree}
        paris={paris}
        onOuvrirParis={ouvrirParis}
      />
    );
  }

  if (phase === 'paris') {
    return (
      <ParisScreen
        joueurs={joueurs}
        paris={paris}
        onAjouter={ajouterPari}
        onBasculerRealise={basculerRealisePari}
        onRetour={() => setPhase(phaseAvantParis)}
      />
    );
  }

  if (phase === 'choix-jeu') {
    return (
      <GameSelectScreen
        manche={mancheNumero}
        vitesseReglage={vitesseReglage}
        onChangerVitesse={setVitesseReglage}
        onChoisir={proposerJeu}
        onHasard={() => proposerJeu(jeuAleatoire())}
        nbJoueurs={joueurs.length}
        onLancerAuto={demarrerModeAuto}
        nbParis={paris.length}
        onOuvrirParis={ouvrirParis}
        selectionJoueur={selectionJoueur}
        onChangerSelectionJoueur={setSelectionJoueur}
        remote={remote}
      />
    );
  }

  if (phase === 'regles') {
    return (
      <ReglesJeuScreen
        jeu={jeuPropose}
        onLancer={() => demarrerCycle(jeuPropose)}
        onChangerDeJeu={() => {
          setJeuPropose(null);
          setPhase('choix-jeu');
        }}
      />
    );
  }

  if (phase === 'choix-joueur') {
    return (
      <ChoixJoueurScreen
        nomJeu={jeuCourant.nom}
        joueurs={joueurs}
        joueursRestants={joueursRestants}
        onChoisir={choisirJoueur}
        onHasard={() => choisirJoueur(joueursRestants[Math.floor(Math.random() * joueursRestants.length)])}
      />
    );
  }

  if (phase === 'scores') {
    return (
      <ScoreboardScreen
        joueurs={joueurs}
        scores={scores}
        manche={mancheNumero}
        totalManches={modeAuto ? manchesAutoTotal : totalManches}
        onMancheSuivante={manchesuivante}
        onTerminer={() => setPhase('podium')}
        modeAuto={modeAuto}
        onQuitterAuto={quitterModeAuto}
      />
    );
  }

  if (phase === 'vote') {
    if (jeuCourant.voteType === 'graduee') {
      if (JEUX_SCORE_COLLECTIF.includes(jeuCourant.id) && donneesManche?.cast) {
        return (
          <div className="stage">
            <VoteGradueeMultiple
              cast={donneesManche.cast}
              onTermine={appliquerPointsMultiples}
              bonusDisponible={!bonusUtilise}
              onBonus={surBonus}
            />
          </div>
        );
      }
      if (remote.actif && remote.nbConnectes > 0) {
        return (
          <div className="stage">
            <VoteGradueeRemoteHost
              joueurActuel={joueurActuel}
              joueurs={joueurs}
              connectes={remote.connectes}
              votesRecus={remote.votesRecus}
              onDemarrerVote={remote.demarrerVote}
              onValider={onVoteGenerique}
            />
          </div>
        );
      }
      return (
        <div className="stage">
          <VoteGraduee
            joueurActuel={joueurActuel}
            onVote={onVoteGenerique}
            bonusDisponible={!bonusUtilise}
            onBonus={surBonus}
          />
        </div>
      );
    }
    if (jeuCourant.voteType === 'binaire') {
      const estProces = jeuCourant.id === 'proces-fictif';
      return (
        <div className="stage">
          <VoteBinaire
            question={estProces ? 'Le verdict de la table ?' : `${joueurActuel} a-t-il/elle craqué ?`}
            optionA={estProces ? { label: 'Non coupable', points: 4 } : { label: 'Tenu jusqu\'au bout', points: 4 }}
            optionB={estProces ? { label: 'Coupable', points: 1 } : { label: 'A craqué', points: 0 }}
            onVote={onVoteGenerique}
          />
        </div>
      );
    }
    if (jeuCourant.voteType === 'vraifaux') {
      return (
        <div className="stage">
          <VoteVraiFaux
            joueurActuel={joueurActuel}
            affirmation={donneesManche?.affirmation}
            estVraie={donneesManche?.vrai}
            onTermine={appliquerPoints}
          />
        </div>
      );
    }
  }

  // Les 20 mini-jeux "manette" se jouent depuis les téléphones : sans au
  // moins deux appareils connectés, l'écran d'attente n'aurait personne à
  // attendre. On bloque proprement plutôt que de laisser le jeu tourner
  // dans le vide.
  if (jeuCourant.manette && remote.nbConnectes < 2) {
    return (
      <div className="stage" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, padding: 40, textAlign: 'center', minHeight: 420 }}>
        <div className="display-title" style={{ fontSize: 26, color: 'var(--accent-cyan)' }}>Il manque des téléphones</div>
        <p style={{ color: 'var(--text-muted)', maxWidth: 420 }}>
          {jeuCourant.nom} se joue depuis les téléphones connectés — il en faut au moins deux. Fais scanner le QR code de la soirée (visible dans les réglages) avant de relancer.
        </p>
        <span className="tag">{remote.nbConnectes} téléphone{remote.nbConnectes > 1 ? 's' : ''} connecté{remote.nbConnectes > 1 ? 's' : ''}</span>
        <button className="btn btn-cyan" onClick={() => { setJeuCourant(null); setPhase('choix-jeu'); }}>Changer de jeu</button>
      </div>
    );
  }

  return (
    <ComposantJeu
      joueurActuel={joueurActuel}
      joueurIndex={joueurIndex}
      joueurs={joueurs}
      manche={mancheNumero}
      vitesseReglage={vitesseReglage}
      remote={remote}
      onChangerJeu={() => { setJeuCourant(null); setPhase('choix-jeu'); }}
      onTermine={(payload) => {
        if (payload) setDonneesManche(payload);
        if (jeuCourant.voteType === 'aucun') {
          // Un jeu 'aucun' peut soit ne rien noter lui-même (Statue
          // Surprise, pas de payload), soit calculer ses propres points —
          // à un seul joueur (payload.points, ex. Calcul Éclair) ou à
          // plusieurs à la fois (payload.scores, ex. Mémoire de Groupe) —
          // dans tous les cas, pas d'écran de vote externe après.
          if (payload?.scores) {
            appliquerPointsMultiples(payload.scores);
          } else {
            appliquerPoints(payload?.points ?? 0);
          }
        } else {
          setPhase('vote');
        }
      }}
    />
  );
}
