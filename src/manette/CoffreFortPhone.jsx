import React, { useEffect, useRef, useState } from 'react';

const TOUCHES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '←', '0', 'FINI'];
const COULEUR_INDICE = { exact: 'var(--accent-lime)', present: 'var(--accent-yellow)', absent: 'var(--bg-deep)' };

// CoffreFortPhone — chacun propose librement des combinaisons à 4
// chiffres, autant de fois qu'il veut pendant le chrono. Chaque tentative
// reçoit un indice façon Mastermind (exact / présent ailleurs / absent),
// privé à celui qui a tenté — la progression collective (chiffres déjà
// verrouillés pour de bon) se lit sur l'écran principal.

export default function CoffreFortPhone({ payload, onAction }) {
  const [etat, setEtat] = useState('attente'); // attente | ouvert | feedback | fini
  const [saisie, setSaisie] = useState('');
  const [feedback, setFeedback] = useState(null);
  const idRef = useRef(null);
  const seqRef = useRef(0);
  const dernierSeqAffiche = useRef(-1);

  useEffect(() => {
    if (!payload) return;
    if (payload.etape === 'ouvert' && payload.id !== idRef.current) {
      idRef.current = payload.id;
      seqRef.current = 0;
      dernierSeqAffiche.current = -1;
      setSaisie('');
      setFeedback(null);
      setEtat('ouvert');
    } else if (payload.etape === 'feedback' && payload.id === idRef.current && payload.seq !== dernierSeqAffiche.current) {
      dernierSeqAffiche.current = payload.seq;
      setFeedback(payload.feedback);
      setEtat('feedback');
    } else if (payload.etape === 'fin' && payload.id === idRef.current) {
      setEtat('fini');
    }
  }, [payload]);

  const taper = (t) => {
    if (etat !== 'ouvert') return;
    if (t === 'FINI') {
      if (saisie.length !== (payload?.longueur || 4)) return;
      seqRef.current += 1;
      onAction({ prim: 'coffre-fort', guess: saisie.split('').map(Number), seq: seqRef.current, id: idRef.current });
      setSaisie('');
      return;
    }
    if (t === '←') { setSaisie((s) => s.slice(0, -1)); return; }
    setSaisie((s) => (s.length < (payload?.longueur || 4) ? s + t : s));
  };

  if (etat === 'fini') {
    return (
      <div className="stage" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, textAlign: 'center', padding: 30 }}>
        <div className="display-title" style={{ fontSize: 24 }}>TERMINÉ</div>
        <p style={{ color: 'var(--text-muted)' }}>Résultat sur l'écran principal.</p>
      </div>
    );
  }

  if (etat === 'feedback') {
    return (
      <div className="stage" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, padding: 30, textAlign: 'center' }}>
        <div className="display-title" style={{ fontSize: 14, color: 'var(--text-dim)' }}>TA TENTATIVE</div>
        <div style={{ display: 'flex', gap: 10 }}>
          {(feedback || []).map((f, i) => (
            <div key={i} style={{ width: 44, height: 44, borderRadius: 10, background: COULEUR_INDICE[f], border: '3px solid var(--outline)' }} />
          ))}
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', maxWidth: 260 }}>Vert = bien placé · Jaune = présent ailleurs · Sombre = absent</p>
        <button className="btn btn-lime" style={{ padding: '14px 30px' }} onClick={() => setEtat('ouvert')}>Retenter</button>
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
    <div className="stage" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 18, padding: '28px 22px', alignItems: 'center' }}>
      <div className="display-title" style={{ fontSize: 13, color: 'var(--text-dim)' }}>TENTE UNE COMBINAISON</div>
      <div style={{ minHeight: 48, minWidth: 180, border: '3px solid var(--accent-yellow)', borderRadius: 14, background: 'var(--bg-panel-raised)', display: 'flex', alignItems: 'center', justifyContent: 'center', letterSpacing: 4 }}>
        <span className="display-title" style={{ fontSize: 26 }}>{saisie}</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, width: '100%', maxWidth: 280 }}>
        {TOUCHES.map((t) => (
          <button
            key={t}
            onClick={() => taper(t)}
            className="btn"
            style={{
              padding: '16px 0', fontSize: 16, touchAction: 'manipulation',
              background: t === 'FINI' ? 'var(--accent-lime)' : 'var(--bg-panel-raised)',
              color: t === 'FINI' ? 'var(--outline)' : 'var(--text-primary)',
              border: '3px solid var(--outline)',
            }}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}
