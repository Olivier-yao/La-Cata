import React, { useEffect, useRef, useState } from 'react';
import { STYLE_PAR_JEU } from '../lib/styleJeux.js';

// VoteJeuPhone — entre deux manches, chaque téléphone propose la liste
// des mini-jeux Manette Party : voter POUR un jeu vaut aussi "je suis
// prêt·e", pas besoin d'un bouton séparé. Un seul choix, pas de retour
// (comme QcmPhone) — voir ScoreboardScreen pour le dépouillement. Chaque
// jeu garde son icône et sa couleur de l'écran de choix classique, pour
// rester reconnaissable même dans cette liste compacte.

export default function VoteJeuPhone({ payload, onAction }) {
  const [etat, setEtat] = useState('attente'); // attente | ouvert | envoye
  const [choix, setChoix] = useState(null);
  const dernierId = useRef(null);

  useEffect(() => {
    if (!payload) return;
    if (payload.etape === 'ouvert' && payload.id !== dernierId.current) {
      dernierId.current = payload.id;
      setChoix(null);
      setEtat('ouvert');
    }
  }, [payload]);

  const voter = (jeu) => {
    if (etat !== 'ouvert') return;
    setChoix(jeu);
    setEtat('envoye');
    onAction({ prim: 'vote-jeu', jeuId: jeu.id, id: dernierId.current });
  };

  if (etat === 'envoye') {
    return (
      <div className="stage" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, textAlign: 'center', padding: 30, background: 'var(--accent-lime)' }}>
        <span style={{ fontSize: 40 }}>✓</span>
        <div className="display-title" style={{ fontSize: 20, color: 'var(--outline)' }}>VOTÉ · {choix?.nom}</div>
        <p style={{ color: 'var(--outline)', opacity: 0.75 }}>En attente des autres...</p>
      </div>
    );
  }

  if (etat !== 'ouvert') {
    return (
      <div className="stage" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 30, textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>En attente…</p>
      </div>
    );
  }

  return (
    <div className="stage" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 14, padding: '26px 20px' }}>
      <div className="display-title" style={{ fontSize: 15, textAlign: 'center', color: 'var(--accent-yellow)' }}>CHOISIS LE PROCHAIN MINI-JEU</div>
      <p style={{ fontSize: 12, color: 'var(--text-dim)', textAlign: 'center' }}>Le plus voté sera lancé automatiquement dans quelques secondes.</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, overflowY: 'auto' }}>
        {(payload?.jeux || []).map((jeu) => {
          const style = STYLE_PAR_JEU[jeu.id] || {};
          const Icone = style.Icone;
          return (
            <button
              key={jeu.id}
              onClick={() => voter(jeu)}
              className="btn"
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                padding: '16px 10px', fontSize: 13, textAlign: 'center',
                background: style.bg || 'var(--bg-panel-raised)', color: style.contour ? style.couleur : 'var(--outline)',
                border: `3px solid ${style.contour || 'var(--outline)'}`, borderRadius: 16,
              }}
            >
              {Icone && (
                <span style={{ width: 32, height: 32, borderRadius: 10, background: style.contour ? 'var(--bg-panel-raised)' : 'rgba(0,0,0,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icone color={style.contour ? style.couleur : 'var(--outline)'} size={18} />
                </span>
              )}
              <span style={{ lineHeight: 1.2 }}>{jeu.nom}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
