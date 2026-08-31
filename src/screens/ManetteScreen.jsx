import React, { useEffect, useRef, useState } from 'react';
import { creerConnexionRemote } from '../lib/remote.js';
import { couleurJoueur } from '../lib/playerColors.js';
import { COMPOSANTS_MANETTE_PAR_PRIM } from '../lib/composantsManette.js';

// ManetteScreen — ce que voit un joueur sur SON téléphone quand il rejoint
// la soirée. Volontairement minimal : jamais le texte à lire, jamais les
// scores des autres, juste "à toi de voter" au bon moment. Voir
// server/remote-server.mjs pour le protocole, et RoundScreen.jsx côté
// hôte pour l'autre bout du fil.

function paramsUrl() {
  const p = new URLSearchParams(window.location.search);
  return { code: (p.get('code') || '').toUpperCase() };
}

const CARTES_DEFAUT = [
  { points: 1, titre: 'La Cata' },
  { points: 3, titre: 'Correct' },
  { points: 6, titre: 'Légendaire' },
];

// Petites phrases qui tournent sur l'écran d'attente — sans ça, un
// téléphone qui ne sert à rien pendant 3-4 minutes d'affilée (le gros de
// l'action se joue sur l'écran principal) a l'air complètement mort.
const PHRASES_ATTENTE = [
  'Fais style que tu regardes l\'écran...',
  'Prépare ton meilleur regard de circonstance.',
  'Le sort choisit sa prochaine victime...',
  'Reste discret·e, ça peut retomber sur toi.',
  'Ton téléphone est calme. Ça ne va pas durer.',
  'Respire. Tout va bien. Pour l\'instant.',
  'Quelqu\'un, quelque part, prépare un gage pour toi.',
  'Ne lâche pas ton téléphone, on ne sait jamais.',
];

export default function ManetteScreen() {
  const [code, setCode] = useState(paramsUrl().code);
  const [nom, setNom] = useState('');
  const [phase, setPhase] = useState('rejoindre'); // rejoindre | attente | vote | envoye | hote-parti
  const [erreur, setErreur] = useState('');
  const [index, setIndex] = useState(0);
  const [question, setQuestion] = useState('');
  const [optionsVote, setOptionsVote] = useState(null);
  const [contexte, setContexte] = useState(null); // { jeu, joueur }
  const [scores, setScores] = useState({});
  const [actionPayload, setActionPayload] = useState(null);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const connexionRef = useRef(null);

  useEffect(() => {
    const intervalle = setInterval(() => setPhraseIndex((i) => (i + 1) % PHRASES_ATTENTE.length), 3600);
    return () => clearInterval(intervalle);
  }, []);

  useEffect(() => () => connexionRef.current && connexionRef.current.fermer(), []);

  const rejoindre = () => {
    const propreCode = code.trim().toUpperCase();
    const propreNom = nom.trim();
    if (!propreCode || !propreNom) return;
    setErreur('');
    const conn = creerConnexionRemote({
      // Rejoué à chaque (re)connexion : si le téléphone perd le Wi-Fi une
      // seconde ou que le petit serveur redémarre, on redevient "Léa"
      // automatiquement dès que la connexion revient.
      onOuverte: () => conn.envoyer({ type: 'player-join', code: propreCode, nom: propreNom }),
    });
    connexionRef.current = conn;
    conn.sur('joined', (msg) => {
      setIndex(msg.index);
      setPhase('attente');
    });
    conn.sur('join-error', (msg) => {
      setErreur(msg.message);
      conn.fermer();
      connexionRef.current = null;
    });
    conn.sur('vote-start', (msg) => {
      setQuestion(msg.question || '');
      setOptionsVote(msg.options && msg.options.length ? msg.options : null);
      setPhase('vote');
    });
    conn.sur('host-left', () => setPhase('hote-parti'));
    // contexte/scores arrivent entre les manches (nouveau joueur actif,
    // nouveaux points) : ça marque la fin du round précédent, donc on
    // repasse à l'écran d'attente (avec le score) plutôt que de rester
    // bloqué sur "vote envoyé" jusqu'au prochain vote-start.
    conn.sur('contexte', (msg) => {
      setContexte({ jeu: msg.jeu, joueur: msg.joueur });
      setPhase((p) => (p === 'vote' ? p : 'attente'));
    });
    conn.sur('scores', (msg) => {
      setScores(msg.scores || {});
      setPhase((p) => (p === 'vote' ? p : 'attente'));
    });
    // Un des 20 mini-jeux manette démarre : le payload porte son propre
    // `prim` (buzzer/mash/qcm/sequence/dessin/role-secret) qui choisit le
    // composant à afficher — voir composantsManette.js.
    conn.sur('action-broadcast', (msg) => {
      setActionPayload(msg.payload);
      setPhase('jeu');
    });
  };

  const voter = (points) => {
    connexionRef.current.envoyer({ type: 'vote', points });
    setPhase('envoye');
  };

  const envoyerAction = (payload) => {
    connexionRef.current && connexionRef.current.envoyer({ type: 'action', payload });
  };

  const couleur = couleurJoueur(index);

  if (phase === 'rejoindre') {
    return (
      <div className="stage" style={{ padding: '40px 28px', display: 'flex', flexDirection: 'column', gap: 22, minHeight: '100vh' }}>
        <div className="stripes-bg" />
        <div style={{ position: 'relative', textAlign: 'center' }}>
          <h1 className="display-title" style={{ fontSize: 'clamp(30px, 8vw, 44px)', color: 'var(--accent-lime)' }}>LA CATA</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 8 }}>Manette · rejoins la soirée en cours</p>
        </div>

        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 14, marginTop: 20 }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span className="display-title" style={{ fontSize: 12, letterSpacing: '.16em', color: 'var(--accent-yellow)' }}>Code de la soirée</span>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="EX. K7QM"
              maxLength={4}
              style={{ padding: '18px', borderRadius: 16, border: '3px solid var(--accent-yellow)', background: 'var(--bg-panel-raised)', color: 'var(--text-primary)', fontSize: 26, textAlign: 'center', letterSpacing: '.3em', fontFamily: 'var(--font-display)' }}
            />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span className="display-title" style={{ fontSize: 12, letterSpacing: '.16em', color: 'var(--accent-magenta)' }}>Ton prénom</span>
            <input
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && rejoindre()}
              placeholder="Comme sur l'écran principal"
              style={{ padding: '18px', borderRadius: 16, border: '3px solid var(--accent-magenta)', background: 'var(--bg-panel-raised)', color: 'var(--text-primary)', fontSize: 18, textAlign: 'center' }}
            />
          </label>
          {erreur && <p style={{ color: 'var(--accent-magenta)', fontSize: 13, textAlign: 'center' }}>{erreur}</p>}
          <button className="btn btn-lime" style={{ padding: '18px', fontSize: 18, marginTop: 8 }} onClick={rejoindre}>
            Rejoindre
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'hote-parti') {
    return (
      <div className="stage" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 30, textAlign: 'center' }}>
        <div className="display-title" style={{ fontSize: 24, color: 'var(--accent-magenta)' }}>L'écran principal a coupé la connexion</div>
        <p style={{ color: 'var(--text-muted)' }}>Reviens à la table pour voir ce qui se passe.</p>
      </div>
    );
  }

  if (phase === 'jeu') {
    const ComposantManette = COMPOSANTS_MANETTE_PAR_PRIM[actionPayload?.prim];
    if (!ComposantManette) return null;
    return <ComposantManette payload={actionPayload} onAction={envoyerAction} nom={nom} couleur={couleur} />;
  }

  if (phase === 'vote') {
    return (
      <div className="stage" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 24, padding: '32px 20px', background: couleur.bg }}>
        <div style={{ textAlign: 'center' }}>
          <div className="display-title" style={{ fontSize: 15, letterSpacing: '.18em', color: couleur.fg }}>À TOI DE NOTER</div>
          <div className="display-title" style={{ fontSize: 'clamp(20px, 6vw, 28px)', color: couleur.fg, marginTop: 8 }}>{question || `C'était comment ?`}</div>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16, justifyContent: 'center' }}>
          {(optionsVote || CARTES_DEFAUT).map((c, i) => (
            <button
              key={i}
              onClick={() => voter(c.points)}
              style={{ background: 'var(--outline)', color: 'var(--text-primary)', border: '4px solid var(--outline)', borderRadius: 24, padding: '28px', display: 'flex', flexDirection: 'column', gap: 6, cursor: 'pointer', fontFamily: 'inherit' }}
            >
              <span className="display-title" style={{ fontSize: 24 }}>{c.label || c.titre}</span>
              <span className="display-title" style={{ fontSize: 18, opacity: 0.7 }}>+{c.points}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (phase === 'envoye') {
    return (
      <div className="stage" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 30, textAlign: 'center', background: couleur.bg }}>
        <div className="display-title" style={{ fontSize: 26, color: couleur.fg }}>VOTE ENVOYÉ</div>
        <p style={{ color: couleur.fg, opacity: 0.75 }}>En attente des autres joueurs...</p>
      </div>
    );
  }

  // attente
  const classement = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const monRang = classement.findIndex(([n]) => n === nom) + 1;
  const monScore = scores[nom] || 0;

  return (
    <div className="stage" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: 0 }}>
      <div className="stripes-bg" />
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, padding: 30, textAlign: 'center', animation: 'lc-cardin 320ms ease-out both' }}>
        <div style={{ position: 'relative', width: 100, height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: 999, border: `3px solid ${couleur.bg}`, animation: 'lc-pulse-ring 2.4s ease-in-out infinite' }} />
          <div style={{ width: 90, height: 90, borderRadius: 999, background: couleur.bg, color: couleur.fg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 34, boxShadow: 'var(--shadow-hard-sm)' }}>
            {nom.charAt(0).toUpperCase()}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 9, height: 9, borderRadius: 999, background: 'var(--accent-lime)', animation: 'lc-blink 1.8s ease-in-out infinite' }} />
          <div className="display-title" style={{ fontSize: 22 }}>{nom}</div>
        </div>
        <p key={phraseIndex} style={{ color: 'var(--text-muted)', minHeight: 22, animation: 'lc-letterin 300ms ease-out both' }}>{PHRASES_ATTENTE[phraseIndex]}</p>
        {contexte?.jeu && (
          <p style={{ color: 'var(--text-dim)', fontSize: 14, maxWidth: 280 }}>
            {contexte.joueur === nom
              ? `C'est ton tour ! ${contexte.jeu}.`
              : contexte.joueur
              ? `${contexte.joueur} joue à ${contexte.jeu}.`
              : `Manche en cours : ${contexte.jeu}.`}{' '}
            Regarde l'écran, pas ton téléphone.
          </p>
        )}
      </div>
      {classement.length > 0 && (
        <div style={{ position: 'relative', padding: '18px 24px', background: 'var(--bg-deep)', borderTop: '3px solid var(--outline)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div className="display-title" style={{ fontSize: 11, letterSpacing: '.14em', color: 'var(--text-dim)' }}>TON SCORE</div>
            <div className="display-title" style={{ fontSize: 22, color: 'var(--accent-violet)' }}>{monScore} PTS</div>
          </div>
          {monRang > 0 && (
            <span className="tag">{monRang}E SUR {classement.length}</span>
          )}
        </div>
      )}
    </div>
  );
}
