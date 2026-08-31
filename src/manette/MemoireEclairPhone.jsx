import React, { useEffect, useRef, useState } from 'react';

const TOUCHES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '←', '0', 'FINI'];

// MemoireEclairPhone — pavé numérique pour Mémoire Flash Collective. Le
// nombre à retenir s'affiche sur l'écran principal, jamais ici : le
// téléphone ne sert qu'à ressaisir de mémoire. On envoie la saisie
// complète à chaque frappe (comme SequencePhone) pour que l'hôte
// affiche juste "combien de chiffres tapés", jamais lesquels.

export default function MemoireEclairPhone({ payload, onAction }) {
  const [etat, setEtat] = useState('attente'); // attente | memorisation | saisie | envoye
  const [saisie, setSaisie] = useState('');
  const idRef = useRef(null);
  const saisieRef = useRef('');

  useEffect(() => {
    if (!payload) return;
    if (payload.etape === 'memorisation' && payload.id !== idRef.current) {
      idRef.current = payload.id;
      saisieRef.current = '';
      setSaisie('');
      setEtat('memorisation');
    } else if (payload.etape === 'saisie' && payload.id === idRef.current) {
      setEtat('saisie');
    } else if (payload.etape === 'fin' && payload.id === idRef.current) {
      setEtat((e) => (e === 'envoye' ? e : 'envoye'));
    }
  }, [payload]);

  const taper = (touche) => {
    if (etat !== 'saisie') return;
    if (touche === 'FINI') {
      onAction({ prim: 'memoire-eclair', saisie: saisieRef.current, id: idRef.current });
      setEtat('envoye');
      return;
    }
    if (touche === '←') {
      saisieRef.current = saisieRef.current.slice(0, -1);
    } else if (saisieRef.current.length < (payload?.longueur || 5)) {
      saisieRef.current += touche;
    }
    setSaisie(saisieRef.current);
    onAction({ prim: 'memoire-eclair', saisie: saisieRef.current, id: idRef.current });
  };

  if (etat === 'envoye') {
    return (
      <div className="stage" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, textAlign: 'center', padding: 30 }}>
        <div className="display-title" style={{ fontSize: 24 }}>ENVOYÉ</div>
        <p style={{ color: 'var(--text-muted)' }}>Révélation sur l'écran principal.</p>
      </div>
    );
  }

  if (etat === 'memorisation') {
    return (
      <div className="stage" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, textAlign: 'center', padding: 30 }}>
        <div className="display-title" style={{ fontSize: 22 }}>MÉMORISE</div>
        <p style={{ color: 'var(--text-muted)' }}>Regarde l'écran principal, pas ton téléphone.</p>
      </div>
    );
  }

  if (etat !== 'saisie') {
    return (
      <div className="stage" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 30, textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>En attente…</p>
      </div>
    );
  }

  return (
    <div className="stage" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 20, padding: '30px 22px', alignItems: 'center' }}>
      <div className="display-title" style={{ fontSize: 13, color: 'var(--text-dim)' }}>TAPEZ CE DONT VOUS VOUS SOUVENEZ</div>
      <div style={{ minHeight: 48, minWidth: 200, border: '3px solid var(--accent-yellow)', borderRadius: 14, background: 'var(--bg-panel-raised)', display: 'flex', alignItems: 'center', justifyContent: 'center', letterSpacing: 4 }}>
        <span className="display-title" style={{ fontSize: 26 }}>{saisie}</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, width: '100%', maxWidth: 300 }}>
        {TOUCHES.map((t) => (
          <button
            key={t}
            onClick={() => taper(t)}
            className="btn"
            style={{
              padding: '16px 0', fontSize: 18, touchAction: 'manipulation',
              background: t === 'FINI' ? 'var(--accent-lime)' : 'var(--bg-panel-raised)',
              color: t === 'FINI' ? 'var(--outline)' : 'var(--text-primary)',
              border: '3px solid var(--outline)',
            }}
          >
            {t}
          </button>
        ))}
      </div>
      <p style={{ fontSize: 11, color: 'var(--text-dim)' }}>Personne ne voit ce que tu tapes.</p>
    </div>
  );
}
