import React, { useEffect, useRef, useState } from 'react';

// TeleAchatPhone — l'acheteur voit les paliers d'enchère (toujours
// croissants, jamais de retour en arrière) et un bouton "achat immédiat"
// à part, plus cher, qui coupe tout instantanément si quelqu'un l'appuie
// en premier — peu importe où en étaient les enchères.

export default function TeleAchatPhone({ payload, onAction }) {
  const [etat, setEtat] = useState('attente'); // attente | ouvert | achete | fini
  const [monOffre, setMonOffre] = useState(0);
  const idRef = useRef(null);

  useEffect(() => {
    if (!payload) return;
    if (payload.etape === 'ouvert' && payload.id !== idRef.current) {
      idRef.current = payload.id;
      setMonOffre(0);
      setEtat('ouvert');
    } else if (payload.etape === 'fin' && payload.id === idRef.current) {
      setEtat((e) => (e === 'achete' ? e : 'fini'));
    }
  }, [payload]);

  const miser = (montant) => {
    if (etat !== 'ouvert' || montant <= monOffre) return;
    setMonOffre(montant);
    onAction({ prim: 'tele-achat', offre: montant, achatImmediat: false, id: idRef.current });
  };

  const acheterMaintenant = () => {
    if (etat !== 'ouvert') return;
    setEtat('achete');
    onAction({ prim: 'tele-achat', offre: payload.achatImmediat, achatImmediat: true, id: idRef.current });
  };

  if (etat === 'achete') {
    return (
      <div className="stage" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, textAlign: 'center', padding: 30, background: 'var(--accent-magenta)' }}>
        <div className="display-title" style={{ fontSize: 26, color: 'var(--outline)' }}>ACHETÉ !</div>
        <p style={{ color: 'var(--outline)' }}>{payload?.achatImmediat} F · tout de suite</p>
      </div>
    );
  }

  if (etat === 'fini') {
    return (
      <div className="stage" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, textAlign: 'center', padding: 30 }}>
        <div className="display-title" style={{ fontSize: 24 }}>VENDU</div>
        <p style={{ color: 'var(--text-muted)' }}>Résultat sur l'écran principal.</p>
      </div>
    );
  }

  if (etat !== 'ouvert') {
    return (
      <div className="stage" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 30, textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>En attente de la vente…</p>
      </div>
    );
  }

  return (
    <div className="stage" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 18, padding: '30px 22px', textAlign: 'center' }}>
      <div className="display-title" style={{ fontSize: 13, letterSpacing: '.16em', color: 'var(--text-dim)' }}>TON OFFRE</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {(payload?.paliers || []).map((montant) => {
          const actif = montant === monOffre;
          const indisponible = montant <= monOffre;
          return (
            <button
              key={montant}
              onClick={() => miser(montant)}
              disabled={indisponible}
              className="btn"
              style={{
                padding: '16px', fontSize: 18,
                background: actif ? 'var(--accent-yellow)' : indisponible ? 'var(--bg-panel-raised)' : 'var(--bg-deep)',
                color: actif ? 'var(--outline)' : indisponible ? 'var(--text-dim)' : 'var(--text-primary)',
                border: '3px solid var(--outline)',
              }}
            >
              {montant} F
            </button>
          );
        })}
      </div>
      <button
        onClick={acheterMaintenant}
        className="btn"
        style={{ marginTop: 8, padding: '20px', fontSize: 17, background: 'var(--accent-magenta)', color: 'var(--outline)', border: '4px solid var(--outline)', borderRadius: 18 }}
      >
        J'ACHÈTE · {payload?.achatImmediat} F
        <div style={{ fontSize: 11, fontWeight: 400, opacity: 0.85 }}>le premier qui appuie remporte tout</div>
      </button>
    </div>
  );
}
