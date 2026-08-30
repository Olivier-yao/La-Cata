import React, { useState } from 'react';
import ScrollingText from '../components/ScrollingText.jsx';
import RoundHeader from '../components/RoundHeader.jsx';
import JoueurChip from '../components/JoueurChip.jsx';
import { IconVirelangue } from '../components/icons.jsx';
import { virelangueAleatoire } from '../data/virelangues.js';

export default function VirelangueExpress({ joueurActuel, joueurIndex, manche, vitesseReglage, onTermine }) {
  const [texte] = useState(virelangueAleatoire);
  const [progres, setProgres] = useState(0);
  const [termine, setTermine] = useState(false);

  return (
    <div className="stage" style={{ display: 'flex', flexDirection: 'column' }}>
      <RoundHeader
        icone={<IconVirelangue />}
        iconBg="var(--accent-lime)"
        titre="Virelangue Express"
        sousTitre={`Manche ${manche}`}
        couleurTitre="var(--accent-lime)"
        droite={<JoueurChip nom={joueurActuel} index={joueurIndex} />}
      />

      <div style={{ padding: '40px 30px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', maxWidth: 520 }}>
          Le texte défile à vitesse régulière. Tiens le rythme sans t'emmêler la langue.
        </p>
        <ScrollingText
          texte={texte}
          vitesseInitiale={0.75}
          reglageVitesse={vitesseReglage}
          onProgress={setProgres}
          onTermine={() => setTermine(true)}
          hauteur={540}
          largeurMax={1180}
          tailleTexte={36}
        />
      </div>

      <div style={{ padding: '18px 30px', borderTop: '3px solid var(--outline)', background: 'var(--bg-deep)', display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ flex: 1, height: 12, borderRadius: 999, background: 'var(--bg-panel-raised)', overflow: 'hidden', maxWidth: 400 }}>
          <div style={{ width: `${progres * 100}%`, height: '100%', background: 'linear-gradient(90deg, var(--accent-lime), var(--accent-yellow), var(--accent-magenta))', transition: 'width .1s linear' }} />
        </div>
        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{Math.round(progres * 100)}% du texte</span>
        {termine && (
          <button className="btn btn-yellow" style={{ marginLeft: 'auto' }} onClick={() => onTermine()}>
            Terminé · voter
          </button>
        )}
      </div>
    </div>
  );
}
