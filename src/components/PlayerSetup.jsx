import React, { useState } from 'react';
import Avatar from './Avatar.jsx';

const MAX_JOUEURS = 8;

export default function PlayerSetup({ onValider }) {
  const [nom, setNom] = useState('');
  const [joueurs, setJoueurs] = useState([]);
  const [erreur, setErreur] = useState('');

  const ajouter = () => {
    const propre = nom.trim();
    if (!propre) return;
    if (joueurs.some((j) => j.toLowerCase() === propre.toLowerCase())) {
      setErreur(`Il y a déjà un(e) ${propre}. Ajoute une lettre, un surnom, un numéro.`);
      return;
    }
    if (joueurs.length >= MAX_JOUEURS) return;
    setJoueurs([...joueurs, propre]);
    setNom('');
    setErreur('');
  };

  const retirer = (j) => setJoueurs(joueurs.filter((x) => x !== j));

  return (
    <div className="stage playersetup-layout">
      <div className="stripes-bg" style={{ background: 'repeating-linear-gradient(115deg, rgba(124,77,255,.10) 0 30px, transparent 30px 60px)' }} />
      <div className="playersetup-col playersetup-col-form" style={{ position: 'relative', padding: '48px 40px', display: 'flex', flexDirection: 'column', gap: 22, background: 'var(--bg-deep)', borderRight: '3px solid var(--outline)' }}>
        <h2 className="display-title" style={{ fontSize: 'clamp(28px, 4vw, 40px)', lineHeight: 1 }}>
          Qui se<br />sacrifie ?
        </h2>
        <p style={{ color: 'var(--text-muted)' }}>
          Ajoute les prénoms un par un. Deux minimum, huit maximum — au-delà, la soirée dure plus que les stocks.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <p className="display-title" style={{ fontSize: 12, letterSpacing: '.18em', color: 'var(--accent-yellow)' }}>Prénom</p>
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
            onClick={() => onValider(joueurs)}
          >
            {joueurs.length < 2 ? 'Ajoute au moins 2 joueurs' : `C'est parti · ${joueurs.length} joueurs`}
          </button>
          <span style={{ fontSize: 12, color: 'var(--text-dim)', textAlign: 'center' }}>
            Grisé tant qu'il n'y a pas 2 prénoms
          </span>
        </div>
      </div>

      <div className="playersetup-col playersetup-col-list" style={{ position: 'relative', padding: '48px 44px', display: 'flex', flexDirection: 'column', gap: 22 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <span className="display-title" style={{ fontSize: 20 }}>Sur la ligne de départ</span>
          <span className="display-title" style={{ fontSize: 20, color: 'var(--accent-yellow)' }}>{joueurs.length} / {MAX_JOUEURS}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
          {joueurs.map((j, i) => (
            <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'var(--bg-panel-raised)', border: '3px solid var(--outline)', borderRadius: 18, padding: '14px 16px' }}>
              <Avatar nom={j} index={i} taille={48} />
              <span className="display-title" style={{ fontSize: 18, flex: 1 }}>{j.toUpperCase()}</span>
              <button
                onClick={() => retirer(j)}
                style={{ width: 30, height: 30, borderRadius: 999, border: '2px solid var(--text-dim)', color: 'var(--text-dim)', background: 'none', cursor: 'pointer', fontSize: 16 }}
              >
                ×
              </button>
            </div>
          ))}
          {joueurs.length === 0 && (
            <div style={{ gridColumn: '1 / -1', border: '3px dashed var(--border-soft)', borderRadius: 18, padding: '20px', color: 'var(--text-dim)', fontSize: 15, textAlign: 'center' }}>
              Personne. Le silence. Tape un prénom, n'importe lequel, même celui du chat.
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
