import React, { useEffect, useRef, useState } from 'react';
import { creerConnexionRemote } from '../lib/remote.js';
import { couleurJoueur } from '../lib/playerColors.js';

// ManetteScreen — ce que voit un joueur sur SON téléphone quand il rejoint
// la soirée. Volontairement minimal : jamais le texte à lire, jamais les
// scores des autres, juste "à toi de voter" au bon moment. Voir
// server/remote-server.mjs pour le protocole, et RoundScreen.jsx côté
// hôte pour l'autre bout du fil.

function paramsUrl() {
  const p = new URLSearchParams(window.location.search);
  return { code: (p.get('code') || '').toUpperCase() };
}

const CARTES = [
  { points: 1, titre: 'La Cata' },
  { points: 3, titre: 'Correct' },
  { points: 6, titre: 'Légendaire' },
];

export default function ManetteScreen() {
  const [code, setCode] = useState(paramsUrl().code);
  const [nom, setNom] = useState('');
  const [phase, setPhase] = useState('rejoindre'); // rejoindre | attente | vote | envoye | hote-parti
  const [erreur, setErreur] = useState('');
  const [index, setIndex] = useState(0);
  const [question, setQuestion] = useState('');
  const connexionRef = useRef(null);

  useEffect(() => () => connexionRef.current && connexionRef.current.fermer(), []);

  const rejoindre = () => {
    const propreCode = code.trim().toUpperCase();
    const propreNom = nom.trim();
    if (!propreCode || !propreNom) return;
    setErreur('');
    const conn = creerConnexionRemote();
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
      setPhase('vote');
    });
    conn.sur('host-left', () => setPhase('hote-parti'));
    conn.envoyer({ type: 'player-join', code: propreCode, nom: propreNom });
  };

  const voter = (points) => {
    connexionRef.current.envoyer({ type: 'vote', points });
    setPhase('envoye');
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

  if (phase === 'vote') {
    return (
      <div className="stage" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 24, padding: '32px 20px', background: couleur.bg }}>
        <div style={{ textAlign: 'center' }}>
          <div className="display-title" style={{ fontSize: 15, letterSpacing: '.18em', color: couleur.fg }}>À TOI DE NOTER</div>
          <div className="display-title" style={{ fontSize: 'clamp(20px, 6vw, 28px)', color: couleur.fg, marginTop: 8 }}>{question || `C'était comment ?`}</div>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16, justifyContent: 'center' }}>
          {CARTES.map((c) => (
            <button
              key={c.points}
              onClick={() => voter(c.points)}
              style={{ background: 'var(--outline)', color: 'var(--text-primary)', border: '4px solid var(--outline)', borderRadius: 24, padding: '28px', display: 'flex', flexDirection: 'column', gap: 6, cursor: 'pointer', fontFamily: 'inherit' }}
            >
              <span className="display-title" style={{ fontSize: 24 }}>{c.titre}</span>
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
  return (
    <div className="stage" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, padding: 30, textAlign: 'center' }}>
      <div className="stripes-bg" />
      <div style={{ position: 'relative', width: 90, height: 90, borderRadius: 999, background: couleur.bg, color: couleur.fg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 34 }}>
        {nom.charAt(0).toUpperCase()}
      </div>
      <div className="display-title" style={{ position: 'relative', fontSize: 22 }}>{nom}</div>
      <p style={{ position: 'relative', color: 'var(--text-muted)' }}>Connecté·e. En attente du prochain vote...</p>
    </div>
  );
}
