import React, { useEffect, useRef, useState } from 'react';

const TOUCHES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '←', '0', 'FINI'];
const COULEUR_INDICE = { exact: 'var(--accent-lime)', present: 'var(--accent-yellow)', absent: 'var(--bg-deep)' };

// BraqueMoiPhone — trois étapes sur le même téléphone : fixer son propre
// code secret, choisir sa cible, puis tenter des combinaisons contre le
// code de cette cible (même pavé numérique et même indice Mastermind
// privé que Coffre Fort).

export default function BraqueMoiPhone({ payload, onAction }) {
  const [etat, setEtat] = useState('attente'); // attente | code | code-envoye | cible | ouvert | feedback | fini
  const [saisie, setSaisie] = useState('');
  const [feedback, setFeedback] = useState(null);
  const idRef = useRef(null);
  const seqRef = useRef(0);
  const dernierSeqAffiche = useRef(-1);
  const longueur = payload?.longueur || 6;

  useEffect(() => {
    if (!payload) return;
    if (payload.etape === 'code' && payload.id !== idRef.current) {
      idRef.current = payload.id;
      setSaisie('');
      setEtat('code');
    } else if (payload.etape === 'cible') {
      setEtat('cible');
    } else if (payload.etape === 'ouvert' && payload.id === idRef.current) {
      seqRef.current = 0;
      dernierSeqAffiche.current = -1;
      setSaisie('');
      setEtat('ouvert');
    } else if (payload.etape === 'feedback' && payload.id === idRef.current && payload.seq !== dernierSeqAffiche.current) {
      dernierSeqAffiche.current = payload.seq;
      setFeedback(payload.feedback);
      setEtat('feedback');
    } else if (payload.etape === 'fin' && payload.id === idRef.current) {
      setEtat('fini');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payload]);

  const validerCode = () => {
    if (saisie.length !== longueur) return;
    onAction({ prim: 'braque-moi', action: 'code', code: saisie.split('').map(Number), id: idRef.current });
    setEtat('code-envoye');
  };

  const choisirCible = (nom) => {
    onAction({ prim: 'braque-moi', action: 'cible', cible: nom, id: idRef.current });
    setEtat('attente');
  };

  const taperGuess = (t) => {
    if (etat !== 'ouvert') return;
    if (t === 'FINI') {
      if (saisie.length !== longueur) return;
      seqRef.current += 1;
      onAction({ prim: 'braque-moi', action: 'guess', guess: saisie.split('').map(Number), seq: seqRef.current, id: idRef.current });
      setSaisie('');
      return;
    }
    if (t === '←') { setSaisie((s) => s.slice(0, -1)); return; }
    setSaisie((s) => (s.length < longueur ? s + t : s));
  };

  const taperCode = (t) => {
    if (etat !== 'code') return;
    if (t === 'FINI') { validerCode(); return; }
    if (t === '←') { setSaisie((s) => s.slice(0, -1)); return; }
    setSaisie((s) => (s.length < longueur ? s + t : s));
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
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
          {(feedback || []).map((f, i) => (
            <div key={i} style={{ width: 38, height: 38, borderRadius: 10, background: COULEUR_INDICE[f], border: '3px solid var(--outline)' }} />
          ))}
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', maxWidth: 260 }}>Vert = bien placé · Jaune = présent ailleurs · Sombre = absent</p>
        <button className="btn btn-lime" style={{ padding: '14px 30px' }} onClick={() => setEtat('ouvert')}>Retenter</button>
      </div>
    );
  }

  if (etat === 'cible') {
    return (
      <div className="stage" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 14, padding: '28px 20px' }}>
        <div className="display-title" style={{ fontSize: 15, textAlign: 'center', color: 'var(--accent-yellow)' }}>QUI VEUX-TU BRAQUER ?</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {(payload?.joueurs || []).map((nom) => (
            <button
              key={nom}
              onClick={() => choisirCible(nom)}
              className="btn"
              style={{ padding: '16px', fontSize: 16, background: 'var(--bg-panel-raised)', color: 'var(--text-primary)', border: '3px solid var(--outline)' }}
            >
              {nom}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (etat === 'code-envoye') {
    return (
      <div className="stage" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, textAlign: 'center', padding: 30 }}>
        <div className="display-title" style={{ fontSize: 22 }}>CODE ENREGISTRÉ</div>
        <p style={{ color: 'var(--text-muted)' }}>En attente des autres...</p>
      </div>
    );
  }

  if (etat === 'code' || etat === 'ouvert') {
    const surTouche = etat === 'code' ? taperCode : taperGuess;
    return (
      <div className="stage" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 18, padding: '28px 22px', alignItems: 'center' }}>
        <div className="display-title" style={{ fontSize: 13, color: 'var(--text-dim)' }}>{etat === 'code' ? 'CHOISIS TON CODE SECRET' : 'TENTE UNE COMBINAISON CONTRE TA CIBLE'}</div>
        <div style={{ minHeight: 48, minWidth: 180, border: '3px solid var(--accent-yellow)', borderRadius: 14, background: 'var(--bg-panel-raised)', display: 'flex', alignItems: 'center', justifyContent: 'center', letterSpacing: 4 }}>
          <span className="display-title" style={{ fontSize: 24 }}>{saisie}</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, width: '100%', maxWidth: 280 }}>
          {TOUCHES.map((t) => (
            <button
              key={t}
              onClick={() => surTouche(t)}
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

  return (
    <div className="stage" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 30, textAlign: 'center' }}>
      <p style={{ color: 'var(--text-muted)' }}>En attente…</p>
    </div>
  );
}
