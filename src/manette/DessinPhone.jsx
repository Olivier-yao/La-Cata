import React, { useRef, useState } from 'react';

// DessinPhone — canvas tactile plein écran. Envoie chaque point normalisé
// (0..1) au fur et à mesure du trait ; le dessin local sert juste de retour
// visuel immédiat, la version qui compte est celle reconstruite côté hôte.

export default function DessinPhone({ payload, onAction }) {
  const canvasRef = useRef(null);
  const enTrainDeDessiner = useRef(false);
  const [couleurs] = useState(['#241B2F']);

  const estMonTour = payload?.prim === 'dessin' && payload.etape === 'demarrer';

  if (!estMonTour) {
    return (
      <div className="stage" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, textAlign: 'center', padding: 30 }}>
        <div className="display-title" style={{ fontSize: 22 }}>
          {payload?.artiste ? `${payload.artiste} DESSINE` : 'REGARDE L\'ÉCRAN…'}
        </div>
        <p style={{ color: 'var(--text-muted)' }}>Ton tour viendra, reste connecté·e.</p>
      </div>
    );
  }

  const point = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const t = e.touches ? e.touches[0] : e;
    return { x: (t.clientX - rect.left) / rect.width, y: (t.clientY - rect.top) / rect.height };
  };

  const dessinerLocal = (x, y, nouveauTrait) => {
    const ctx = canvasRef.current.getContext('2d');
    const px = x * canvasRef.current.width;
    const py = y * canvasRef.current.height;
    if (nouveauTrait) {
      ctx.beginPath();
      ctx.moveTo(px, py);
    } else {
      ctx.lineTo(px, py);
      ctx.strokeStyle = couleurs[0];
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.stroke();
    }
  };

  const debuter = (e) => {
    e.preventDefault();
    enTrainDeDessiner.current = true;
    const { x, y } = point(e);
    dessinerLocal(x, y, true);
    onAction({ prim: 'dessin', x, y, phase: 'start' });
  };
  const bouger = (e) => {
    if (!enTrainDeDessiner.current) return;
    e.preventDefault();
    const { x, y } = point(e);
    dessinerLocal(x, y, false);
    onAction({ prim: 'dessin', x, y, phase: 'move' });
  };
  const finir = (e) => {
    if (!enTrainDeDessiner.current) return;
    enTrainDeDessiner.current = false;
    const { x, y } = point(e.changedTouches ? { touches: e.changedTouches } : e);
    onAction({ prim: 'dessin', x, y, phase: 'end' });
  };

  return (
    <div className="stage" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: 0 }}>
      <div style={{ padding: '16px 20px', textAlign: 'center' }}>
        <div className="display-title" style={{ fontSize: 16, color: 'var(--accent-cyan)' }}>C'EST TON TOUR</div>
        {payload.consigne && <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>{payload.consigne}</p>}
      </div>
      <canvas
        ref={canvasRef}
        width={360}
        height={500}
        style={{ flex: 1, width: '100%', background: '#F6ECFF', touchAction: 'none' }}
        onMouseDown={debuter}
        onMouseMove={bouger}
        onMouseUp={finir}
        onTouchStart={debuter}
        onTouchMove={bouger}
        onTouchEnd={finir}
      />
    </div>
  );
}
