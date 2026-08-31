import React, { useEffect, useRef, useState } from 'react';
import RoundHeader from '../components/RoundHeader.jsx';
import CountdownRing from '../components/CountdownRing.jsx';
import { IconCrayonTactile } from '../components/icons.jsx';
import { dessinAleatoire } from '../data/dessins.js';

const DUREE = 40;

// CroquisEnDirect — contrairement aux 19 autres jeux manette, celui-ci
// suit le flux normal "un joueur à la fois" (choix du joueur, vote graduee
// à la fin) : la seule différence, c'est que la feuille de dessin est le
// téléphone du joueur actif au lieu du papier, streamé en direct ici.

export default function CroquisEnDirect({ joueurActuel, manche, remote, onTermine, onChangerJeu }) {
  const [consigne] = useState(dessinAleatoire);
  const [demarre, setDemarre] = useState(false);
  const canvasRef = useRef(null);
  const dernierPointRef = useRef(null);
  const traiteRef = useRef(null);

  const estConnecte = remote.actif && remote.connectes.some((j) => j.nom === joueurActuel && j.connecte);

  const demarrer = () => {
    remote.resetActions();
    remote.envoyerActionPrivee({ [joueurActuel]: { prim: 'dessin', etape: 'demarrer', consigne } });
    setDemarre(true);
  };

  useEffect(() => {
    if (!demarre) return;
    const payload = remote.actionsRecues[joueurActuel];
    if (!payload || payload.prim !== 'dessin' || payload === traiteRef.current) return;
    traiteRef.current = payload;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const x = payload.x * canvas.width;
    const y = payload.y * canvas.height;
    if (payload.phase === 'start' || !dernierPointRef.current) {
      dernierPointRef.current = { x, y };
      return;
    }
    ctx.strokeStyle = '#241B2F';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(dernierPointRef.current.x, dernierPointRef.current.y);
    ctx.lineTo(x, y);
    ctx.stroke();
    dernierPointRef.current = { x, y };
    if (payload.phase === 'end') dernierPointRef.current = null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remote.actionsRecues, demarre]);

  if (!estConnecte) {
    return (
      <div className="stage" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, padding: 40, textAlign: 'center', minHeight: 420 }}>
        <div className="display-title" style={{ fontSize: 24, color: 'var(--accent-cyan)' }}>Le téléphone de {joueurActuel} n'est pas connecté</div>
        <p style={{ color: 'var(--text-muted)', maxWidth: 420 }}>Croquis en Direct se dessine sur le téléphone du joueur actif. Fais-le·la scanner le QR code de la soirée, ou choisis un autre jeu.</p>
        <button className="btn btn-secondary" onClick={onChangerJeu}>Passer ce jeu</button>
      </div>
    );
  }

  return (
    <div className="stage" style={{ display: 'flex', flexDirection: 'column' }}>
      <RoundHeader icone={<IconCrayonTactile color="var(--outline)" />} iconBg="var(--accent-lime)" titre="Croquis en Direct" sousTitre={`Manche ${manche} · ${joueurActuel}`} couleurTitre="var(--accent-lime)" />
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22, padding: '30px' }}>
        {!demarre ? (
          <>
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', maxWidth: 460 }}>{joueurActuel} va dessiner « {consigne} » directement sur son téléphone, projeté ici en direct.</p>
            <button className="btn btn-lime" style={{ fontSize: 20, padding: '18px 40px' }} onClick={demarrer}>Envoyer la consigne au téléphone</button>
          </>
        ) : (
          <>
            <canvas ref={canvasRef} width={640} height={420} style={{ width: '100%', maxWidth: 640, background: '#F6ECFF', borderRadius: 18, border: '3px solid var(--outline)' }} />
            <CountdownRing secondes={DUREE} actif onFin={() => onTermine()} couleur="var(--accent-lime)" pulseFinale taille={110} />
            <button className="btn btn-lime" onClick={() => onTermine()}>Terminé · voter</button>
          </>
        )}
      </div>
    </div>
  );
}
