import React from 'react';

export default function HomeScreen({ onCommencer }) {
  return (
    <div className="stage" style={{ minHeight: 480, display: 'flex' }}>
      <div className="stripes-bg" />
      <div style={{ position: 'absolute', width: 260, height: 260, borderRadius: 999, background: 'radial-gradient(circle, rgba(124,77,255,.5), transparent 68%)', top: -100, left: -60 }} />
      <div style={{ position: 'absolute', width: 220, height: 220, borderRadius: 999, background: 'radial-gradient(circle, rgba(200,255,77,.28), transparent 68%)', bottom: -90, right: -50 }} />
      <div style={{ position: 'absolute', top: 40, left: 50, width: 22, height: 22, background: 'var(--accent-yellow)', transform: 'rotate(18deg)', animation: 'lc-float 2.6s ease-in-out infinite alternate' }} />
      <div style={{ position: 'absolute', top: 90, right: 80, width: 16, height: 16, borderRadius: 999, background: 'var(--accent-cyan)', animation: 'lc-float 3.4s ease-in-out infinite alternate' }} />
      <div style={{ position: 'absolute', bottom: 70, left: 90, width: 18, height: 18, background: 'var(--accent-magenta)', transform: 'rotate(45deg)', animation: 'lc-float 3s ease-in-out infinite alternate' }} />

      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 26, padding: '60px 40px', textAlign: 'center' }}>
        <div className="display-title" style={{ fontSize: 15, letterSpacing: '.3em', color: 'var(--accent-yellow)', animation: 'lc-wobble 3s ease-in-out infinite' }}>
          Jeu de soirée · 2 à 8 joueurs
        </div>
        <h1 className="display-title" style={{ fontSize: 'clamp(56px, 11vw, 120px)', color: 'var(--accent-lime)', textShadow: '7px 7px 0 var(--accent-magenta), 14px 14px 0 var(--outline)' }}>
          LA CATA
        </h1>
        <p style={{ color: 'var(--text-primary)', fontSize: 18, maxWidth: 520 }}>
          Un texte défile. Tu le lis à voix haute. Le reste de la table décide si c'était digne.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, marginTop: 4 }}>
          <button className="btn btn-primary" style={{ fontSize: 20, padding: '20px 46px' }} onClick={onCommencer}>
            Lancer la soirée
          </button>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Espace ou clic · les téléphones se connectent juste après</span>
        </div>
      </div>
    </div>
  );
}
