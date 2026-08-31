import React, { useEffect, useRef, useState } from 'react';

// BuzzerPhone — gros bouton, un seul appui compte. `payload` vient de
// l'action-broadcast de BuzzerHost (ou RouletteHost, qui réutilise ce même
// écran pour son bouton "stop"). `id` change à chaque manche : c'est ce qui
// permet de redevenir "prêt" sans dépendre du texte de la consigne.

export default function BuzzerPhone({ payload, onAction, nom, couleur, labelBouton = 'BUZZ !' }) {
  const [etat, setEtat] = useState('attente'); // attente | pret | appuye | resultat
  const dernierId = useRef(null);

  useEffect(() => {
    if (!payload) return;
    if (payload.etape === 'ouvert' && payload.id !== dernierId.current) {
      dernierId.current = payload.id;
      setEtat('pret');
    } else if (payload.etape === 'resultat' && payload.id === dernierId.current) {
      setEtat('resultat');
    }
  }, [payload]);

  const appuyer = () => {
    if (etat !== 'pret') return;
    setEtat('appuye');
    onAction({ t: Date.now() });
  };

  if (etat === 'resultat') {
    const gagne = payload.gagnant === nom;
    return (
      <div className="stage" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, textAlign: 'center', padding: 30, background: gagne ? 'var(--accent-lime)' : 'var(--bg-deep)' }}>
        <div className="display-title" style={{ fontSize: 28, color: gagne ? 'var(--outline)' : 'var(--accent-magenta)' }}>
          {gagne ? 'GAGNÉ !' : payload.gagnant ? `${payload.gagnant} a été le/la plus rapide` : 'Personne n\'a buzzé'}
        </div>
      </div>
    );
  }

  return (
    <div className="stage" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24, padding: 30 }}>
      {payload?.consigne && <p style={{ color: 'var(--text-muted)', textAlign: 'center', maxWidth: 280 }}>{payload.consigne}</p>}
      <button
        onClick={appuyer}
        disabled={etat !== 'pret'}
        style={{
          width: 200,
          height: 200,
          borderRadius: 999,
          touchAction: 'manipulation',
          background: etat === 'appuye' ? 'var(--bg-panel-raised)' : (couleur?.bg || 'var(--accent-magenta)'),
          color: etat === 'appuye' ? 'var(--text-dim)' : (couleur?.fg || 'var(--outline)'),
          border: '6px solid var(--outline)',
          fontFamily: 'var(--font-display)',
          fontSize: 22,
          boxShadow: etat === 'appuye' ? 'none' : 'var(--shadow-hard-sm)',
        }}
      >
        {etat === 'appuye' ? 'ENVOYÉ' : etat === 'pret' ? labelBouton : 'PATIENTE…'}
      </button>
    </div>
  );
}
