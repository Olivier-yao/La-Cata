import React, { useState } from 'react';
import Avatar from '../components/Avatar.jsx';

// ParisScreen — "Paris du jour" : accessible à tout moment depuis l'écran
// de choix du jeu (et en fin de soirée), pas un mini-jeu comme les autres.
// Chacun peut parier sur un événement de la soirée ; l'hôte coche ensuite
// si le pari s'est réalisé. Purement pour le fun, aucun impact sur le score.

export default function ParisScreen({ joueurs, paris, onAjouter, onBasculerRealise, onRetour }) {
  const [joueurChoisi, setJoueurChoisi] = useState(joueurs[0]);
  const [texte, setTexte] = useState('');

  const ajouter = () => {
    if (!texte.trim()) return;
    onAjouter(joueurChoisi, texte.trim());
    setTexte('');
  };

  const enAttente = paris.filter((p) => p.realise === null);
  const tranches = paris.filter((p) => p.realise !== null);

  return (
    <div className="stage" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="stripes-bg" style={{ background: 'repeating-linear-gradient(115deg, rgba(255,77,141,.1) 0 30px, transparent 30px 60px)' }} />

      <div style={{ position: 'relative', padding: '22px 30px 16px', background: 'var(--bg-deep)', borderBottom: '3px solid var(--outline)', display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 48, height: 48, borderRadius: 14, background: 'var(--bg-deep)', border: '3px solid var(--accent-magenta)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
          <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
            <path d="M16 4l3.4 7.6L27 13l-5.6 5.2L23 26l-7-4-7 4 1.6-7.8L5 13l7.6-1.4z" stroke="var(--accent-magenta)" strokeWidth="3" strokeLinejoin="round" />
          </svg>
        </div>
        <div>
          <div className="display-title" style={{ fontSize: 20, color: 'var(--accent-magenta)' }}>Paris du jour</div>
          <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>
            {paris.length === 0 ? "Aucun point en jeu. Juste l'honneur." : `${paris.length} pari${paris.length > 1 ? 's' : ''} · ${enAttente.length} en attente`}
          </div>
        </div>
      </div>

      <div style={{ position: 'relative', flex: 1, padding: '24px 30px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {paris.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, textAlign: 'center', padding: '20px 10px' }}>
            <div style={{ width: 100, height: 100, borderRadius: 28, background: 'var(--bg-deep)', border: '4px dashed var(--accent-magenta)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="48" height="48" viewBox="0 0 32 32" fill="none">
                <path d="M16 4l3.4 7.6L27 13l-5.6 5.2L23 26l-7-4-7 4 1.6-7.8L5 13l7.6-1.4z" stroke="var(--text-dim)" strokeWidth="3" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="display-title" style={{ fontSize: 22 }}>Personne n'a encore rien parié</div>
            <p style={{ color: 'var(--text-muted)', maxWidth: 440 }}>
              « Léa parie que Margot va renverser son verre. » Voilà l'idée. On vérifiera à la fin de la soirée.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {enAttente.length > 0 && (
              <span className="display-title" style={{ fontSize: 11, letterSpacing: '.16em', color: 'var(--text-dim)' }}>En attente</span>
            )}
            {enAttente.map((p) => (
              <div key={p.id} className="hard-card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Avatar nom={p.nom} index={joueurs.indexOf(p.nom)} taille={36} />
                  <span className="display-title" style={{ fontSize: 14 }}>{p.nom.toUpperCase()} PARIE QUE</span>
                </div>
                <p style={{ fontSize: 17, margin: 0 }}>{p.texte}</p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-lime" style={{ flex: 1, padding: '12px', fontSize: 13 }} onClick={() => onBasculerRealise(p.id, true)}>Réalisé</button>
                  <button className="btn btn-secondary" style={{ flex: 1, padding: '12px', fontSize: 13 }} onClick={() => onBasculerRealise(p.id, false)}>Raté</button>
                </div>
              </div>
            ))}

            {tranches.length > 0 && (
              <span className="display-title" style={{ fontSize: 11, letterSpacing: '.16em', color: 'var(--text-dim)', marginTop: 8 }}>Tranchés</span>
            )}
            {tranches.map((p) => (
              <div
                key={p.id}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12, background: 'var(--bg-deep)',
                  border: `3px solid ${p.realise ? 'var(--accent-lime)' : 'var(--bg-panel-raised)'}`,
                  borderRadius: 18, padding: '12px 16px', opacity: p.realise ? 1 : 0.6,
                }}
              >
                <div style={{ width: 30, height: 30, borderRadius: 8, background: p.realise ? 'var(--accent-lime)' : 'var(--bg-panel-raised)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                  {p.realise ? (
                    <svg width="18" height="18" viewBox="0 0 32 32" fill="none"><path d="M6 17l7 7L27 9" stroke="var(--outline)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 32 32" fill="none"><path d="M9 9l14 14M23 9L9 23" stroke="var(--text-dim)" strokeWidth="4" strokeLinecap="round" /></svg>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, textDecoration: p.realise ? 'none' : 'line-through', color: p.realise ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                    {p.nom} parie que {p.texte}
                  </div>
                  <div className="display-title" style={{ fontSize: 10, color: p.realise ? 'var(--accent-lime)' : 'var(--text-dim)', marginTop: 2 }}>
                    {p.realise ? 'RÉALISÉ' : 'RATÉ'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ position: 'relative', padding: '18px 30px 24px', background: 'var(--bg-deep)', borderTop: '3px solid var(--outline)', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span className="display-title" style={{ fontSize: 11, letterSpacing: '.16em', color: 'var(--accent-yellow)' }}>Qui parie</span>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {joueurs.map((nom, i) => (
              <button
                key={nom}
                onClick={() => setJoueurChoisi(nom)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, borderRadius: 999 }}
              >
                <Avatar nom={nom} index={i} taille={48} contour={joueurChoisi === nom ? 'var(--accent-lime)' : undefined} />
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-panel)', border: '3px solid var(--accent-magenta)', borderRadius: 16, padding: '14px 16px' }}>
          <span style={{ fontSize: 15, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{joueurChoisi} parie que</span>
          <input
            value={texte}
            onChange={(e) => setTexte(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && ajouter()}
            placeholder="…"
            style={{ flex: 1, minWidth: 0, background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: 15, fontFamily: 'inherit' }}
          />
        </div>
        <button className="btn btn-secondary" style={{ padding: '16px' }} onClick={ajouter}>Ajouter le pari</button>
        <button className="btn" style={{ background: 'var(--bg-panel-raised)', padding: '14px' }} onClick={onRetour}>Retour</button>
      </div>
    </div>
  );
}
