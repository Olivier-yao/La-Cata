import React, { useEffect, useRef, useState } from 'react';

export default function QcmPhone({ payload, onAction }) {
  const [etat, setEtat] = useState('attente'); // attente | ouvert | envoye | resultat
  const [choixEnvoye, setChoixEnvoye] = useState(null);
  const idRef = useRef(null);

  useEffect(() => {
    if (!payload) return;
    if (payload.etape === 'demarrer' && payload.id !== idRef.current) {
      idRef.current = payload.id;
      setChoixEnvoye(null);
      setEtat('ouvert');
    } else if (payload.etape === 'resultat' && payload.id === idRef.current) {
      setEtat('resultat');
    }
  }, [payload]);

  const choisir = (i) => {
    if (etat !== 'ouvert') return;
    setChoixEnvoye(i);
    setEtat('envoye');
    onAction({ prim: 'qcm', choix: i, id: idRef.current });
  };

  if (etat === 'resultat') {
    const estEgalite = payload.estEgalite;
    const aBonneReponse = !estEgalite && payload.bonneReponse != null && choixEnvoye === payload.bonneReponse;
    const fond = estEgalite ? 'var(--bg-deep)' : aBonneReponse ? 'var(--accent-lime)' : 'var(--bg-deep)';
    const texte = choixEnvoye == null
      ? 'Pas de réponse envoyée'
      : estEgalite
        ? (payload.texteEgalite || 'Égalité — personne ne marque de points.')
        : aBonneReponse
          ? (payload.texteReussite || 'BIEN VU !')
          : (payload.texteEchec || 'Résultat affiché sur l\'écran principal');
    return (
      <div className="stage" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, textAlign: 'center', padding: 30, background: fond }}>
        <div className="display-title" style={{ fontSize: 24, color: !estEgalite && aBonneReponse ? 'var(--outline)' : 'var(--text-primary)' }}>{texte}</div>
        {estEgalite && payload.optionsEgalite?.length > 0 && (
          <p style={{ color: 'var(--text-muted)' }}>Égalité entre {payload.optionsEgalite.join(' et ')}.</p>
        )}
      </div>
    );
  }

  if (etat === 'envoye') {
    return (
      <div className="stage" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, textAlign: 'center', padding: 30 }}>
        <div className="display-title" style={{ fontSize: 24 }}>RÉPONSE ENVOYÉE</div>
        <p style={{ color: 'var(--text-muted)' }}>En attente des autres...</p>
      </div>
    );
  }

  return (
    <div className="stage" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 20, padding: '32px 20px', justifyContent: 'center' }}>
      <div className="display-title" style={{ fontSize: 'clamp(18px, 5vw, 24px)', textAlign: 'center', marginBottom: 8 }}>{payload?.question}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {(payload?.options || []).map((opt, i) => (
          <button
            key={i}
            onClick={() => choisir(i)}
            style={{ background: 'var(--outline)', color: 'var(--text-primary)', border: '4px solid var(--outline)', borderRadius: 18, padding: '20px', fontFamily: 'inherit', fontSize: 17, touchAction: 'manipulation' }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
