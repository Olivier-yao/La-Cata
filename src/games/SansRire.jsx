import React, { useState } from 'react';
import ScrollingText from '../components/ScrollingText.jsx';
import RoundHeader from '../components/RoundHeader.jsx';
import JoueurChip from '../components/JoueurChip.jsx';
import { IconSansRire } from '../components/icons.jsx';
import { texteSansRireAleatoire } from '../data/sansRire.js';

export default function SansRire({ joueurActuel, joueurIndex, manche, vitesseReglage, onTermine }) {
  const [texte] = useState(texteSansRireAleatoire);
  const [termine, setTermine] = useState(false);

  return (
    <div className="stage" style={{ display: 'flex', flexDirection: 'column', background: 'var(--outline)' }}>
      <RoundHeader
        icone={<IconSansRire color="var(--outline)" />}
        iconBg="var(--accent-magenta)"
        titre="Sans Rire"
        sousTitre="Un sourire et la manche tombe à zéro"
        couleurTitre="var(--accent-magenta)"
        bordure="3px solid var(--bg-panel)"
        droite={
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <JoueurChip nom={joueurActuel} index={joueurIndex} libelle={`${joueurActuel} tient bon`} accent="rgba(255,77,141,.12)" border="3px solid var(--accent-magenta)" />
          </div>
        }
      />
      <div style={{ padding: '40px 30px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <p style={{ color: 'var(--text-dim)', textAlign: 'center', maxWidth: 520 }}>
          Les autres joueurs ont le droit de tout faire pour te faire craquer — sauf te toucher.
        </p>
        <ScrollingText texte={texte} vitesseInitiale={0.6} reglageVitesse={vitesseReglage} sombre onTermine={() => setTermine(true)} />
        <div className="display-title" style={{ fontSize: 14, letterSpacing: '.2em', color: 'var(--accent-magenta)', animation: 'lc-blink 1.6s steps(1) infinite', marginTop: 8 }}>
          Ne ris pas
        </div>
      </div>
      {termine && (
        <div style={{ padding: '18px 30px', borderTop: '3px solid var(--bg-panel)', display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn btn-primary" onClick={() => onTermine()}>La table a vu assez · voter</button>
        </div>
      )}
    </div>
  );
}
