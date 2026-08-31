import React, { useState } from 'react';
import Avatar from './Avatar.jsx';
import CodeQR from './CodeQR.jsx';
import { IconTelephone } from './icons.jsx';

const MAX_JOUEURS = 8;

// PlayerSetup — le lobby de la soirée. Deux façons d'ajouter un joueur, qui
// alimentent la même liste : l'hôte tape un prénom au clavier, OU un
// téléphone scanne le QR code et tape le sien tout seul (voir
// ManetteScreen.jsx + useRemoteHote.js pour le "joueurs-sync"). `joueurs`
// et `onChangerJoueurs` sont contrôlés par App.jsx pour que la même liste
// serve pendant tout le lobby ET pendant la partie.

export default function PlayerSetup({ joueurs, onChangerJoueurs, remote, onValider }) {
  const [nom, setNom] = useState('');
  const [erreur, setErreur] = useState('');

  const nomsConnectes = new Set((remote?.connectes || []).filter((j) => j.connecte).map((j) => j.nom.toLowerCase()));

  const ajouter = () => {
    const propre = nom.trim();
    if (!propre) return;
    if (joueurs.some((j) => j.toLowerCase() === propre.toLowerCase())) {
      setErreur(`Il y a déjà un(e) ${propre}. Ajoute une lettre, un surnom, un numéro.`);
      return;
    }
    if (joueurs.length >= MAX_JOUEURS) return;
    onChangerJoueurs([...joueurs, propre]);
    setNom('');
    setErreur('');
  };

  const retirer = (j) => onChangerJoueurs(joueurs.filter((x) => x !== j));

  const urlManette = remote?.actif && remote.code
    ? `${window.location.origin}${window.location.pathname}?manette=1&code=${remote.code}`
    : null;

  return (
    <div className="stage playersetup-layout">
      <div className="stripes-bg" style={{ background: 'repeating-linear-gradient(115deg, rgba(124,77,255,.10) 0 30px, transparent 30px 60px)' }} />
      <div className="playersetup-col playersetup-col-form" style={{ position: 'relative', padding: '48px 40px', display: 'flex', flexDirection: 'column', gap: 22, background: 'var(--bg-deep)', borderRight: '3px solid var(--outline)' }}>
        <h2 className="display-title" style={{ fontSize: 'clamp(28px, 4vw, 40px)', lineHeight: 1 }}>
          Qui se<br />sacrifie ?
        </h2>
        <p style={{ color: 'var(--text-muted)' }}>
          Chacun peut scanner le code à droite pour s'ajouter depuis son téléphone, ou tu tapes les prénoms ici toi-même. Deux minimum, huit maximum.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <p className="display-title" style={{ fontSize: 12, letterSpacing: '.18em', color: 'var(--accent-yellow)' }}>Ajouter au clavier</p>
          <div style={{ display: 'flex', gap: 12 }}>
            <input
              value={nom}
              onChange={(e) => { setNom(e.target.value); setErreur(''); }}
              onKeyDown={(e) => e.key === 'Enter' && ajouter()}
              placeholder="Karim"
              style={{
                flex: 1,
                minWidth: 0,
                background: 'var(--bg-panel-raised)',
                border: '3px solid var(--accent-magenta)',
                borderRadius: 14,
                padding: '16px 18px',
                fontSize: 20,
                fontWeight: 700,
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-body)',
              }}
            />
            <button
              onClick={ajouter}
              className="display-title"
              style={{
                width: 60,
                flex: '0 0 auto',
                background: 'var(--accent-magenta)',
                border: '3px solid var(--outline)',
                borderRadius: 14,
                boxShadow: 'var(--shadow-hard-sm)',
                fontSize: 26,
                color: 'var(--outline)',
                cursor: 'pointer',
              }}
            >
              +
            </button>
          </div>
          <span style={{ fontSize: 12, color: erreur ? 'var(--accent-magenta)' : 'var(--text-dim)' }}>
            {erreur || "Entrée pour ajouter · Retour arrière sur champ vide pour supprimer le dernier"}
          </span>
        </div>

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            className="btn btn-lime"
            style={{ width: '100%', fontSize: 20, padding: '18px 24px' }}
            disabled={joueurs.length < 2}
            onClick={onValider}
          >
            {joueurs.length < 2 ? 'Ajoute au moins 2 joueurs' : `C'est parti · ${joueurs.length} joueurs`}
          </button>
          <span style={{ fontSize: 12, color: 'var(--text-dim)', textAlign: 'center' }}>
            Grisé tant qu'il n'y a pas 2 prénoms
          </span>
        </div>
      </div>

      <div className="playersetup-col playersetup-col-list" style={{ position: 'relative', padding: '48px 44px', display: 'flex', flexDirection: 'column', gap: 22 }}>
        {urlManette && (
          <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap', background: 'var(--bg-panel-raised)', border: '3px solid var(--accent-cyan)', borderRadius: 18, padding: '18px 20px' }}>
            <CodeQR url={urlManette} taille={92} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: '1 1 200px', minWidth: 0 }}>
              <span className="display-title" style={{ fontSize: 12, letterSpacing: '.16em', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <IconTelephone color="var(--accent-cyan)" size={16} /> Connecte ton téléphone
              </span>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Scanne le code ou tape-le sur ton téléphone, même Wi-Fi que cet écran.</span>
              <span className="display-title" style={{ fontSize: 26, color: 'var(--text-primary)', letterSpacing: '.15em', marginTop: 4 }}>{remote.code}</span>
              <span style={{ fontSize: 12, color: 'var(--accent-lime)' }}>Ton prénom t'ajoute automatiquement à la liste.</span>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <span className="display-title" style={{ fontSize: 20 }}>Sur la ligne de départ</span>
          <span className="display-title" style={{ fontSize: 20, color: 'var(--accent-yellow)' }}>{joueurs.length} / {MAX_JOUEURS}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
          {joueurs.map((j, i) => {
            const viaTelephone = nomsConnectes.has(j.toLowerCase());
            return (
              <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'var(--bg-panel-raised)', border: `3px solid ${viaTelephone ? 'var(--accent-cyan)' : 'var(--outline)'}`, borderRadius: 18, padding: '14px 16px' }}>
                <Avatar nom={j} index={i} taille={48} />
                <span className="display-title" style={{ fontSize: 18, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>{j.toUpperCase()}</span>
                {viaTelephone && (
                  <span title="Rejoint depuis un téléphone" style={{ color: 'var(--accent-cyan)', flex: '0 0 auto', display: 'flex' }}>
                    <IconTelephone color="var(--accent-cyan)" size={16} />
                  </span>
                )}
                <button
                  onClick={() => retirer(j)}
                  style={{ width: 30, height: 30, flex: '0 0 auto', borderRadius: 999, border: '2px solid var(--text-dim)', color: 'var(--text-dim)', background: 'none', cursor: 'pointer', fontSize: 16 }}
                >
                  ×
                </button>
              </div>
            );
          })}
          {joueurs.length === 0 && (
            <div style={{ gridColumn: '1 / -1', border: '3px dashed var(--border-soft)', borderRadius: 18, padding: '20px', color: 'var(--text-dim)', fontSize: 15, textAlign: 'center' }}>
              Personne. Le silence. Scanne le QR code ou tape un prénom, n'importe lequel, même celui du chat.
            </div>
          )}
        </div>

        <div style={{ marginTop: 'auto', display: 'flex', gap: 16, alignItems: 'center', background: 'var(--bg-deep)', border: '3px solid var(--outline)', borderRadius: 18, padding: '16px 20px' }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--accent-violet)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', flex: '0 0 auto' }}>!</div>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>
            Deux à six joueurs : grille large. Au-delà, les cartes se resserrent — la soirée tient quand même à huit.
          </p>
        </div>
      </div>

      <style>{`
        .playersetup-layout { display: flex; flex-wrap: wrap; }
        .playersetup-col-form { flex: 1 1 320px; max-width: 420px; min-width: 0; }
        .playersetup-col-list { flex: 2 1 400px; min-width: 0; }
        @media (max-width: 620px) {
          .playersetup-col-form, .playersetup-col-list { flex: 1 1 100%; max-width: 100%; }
          .playersetup-col-form { border-right: none !important; padding: 32px 24px !important; }
          .playersetup-col-list { padding: 24px 24px 32px !important; }
        }
      `}</style>
    </div>
  );
}
