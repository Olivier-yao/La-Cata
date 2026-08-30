import React, { useState } from 'react';
import CountdownRing from '../components/CountdownRing.jsx';
import RoundHeader from '../components/RoundHeader.jsx';
import { IconVirelangue } from '../components/icons.jsx';
import { themeAlphabetAleatoire, lettreAleatoire } from '../data/themesAlphabet.js';

const DUREE_INITIALE = 3.5;
const DUREE_PLANCHER = 1.3;
const PAS = 0.25;

export default function AlphabetExpress({ joueurActuel, manche, onTermine }) {
  const [theme] = useState(themeAlphabetAleatoire);
  const [demarre, setDemarre] = useState(false);
  const [bloque, setBloque] = useState(false);
  const [lettre, setLettre] = useState(lettreAleatoire);
  const [tour, setTour] = useState(0);
  const [duree, setDuree] = useState(DUREE_INITIALE);

  const motSuivant = () => {
    setTour((t) => t + 1);
    setDuree((d) => Math.max(DUREE_PLANCHER, d - PAS));
    setLettre(lettreAleatoire());
  };

  return (
    <div className="stage" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="stripes-bg" />
      <RoundHeader
        icone={<IconVirelangue color="var(--outline)" />}
        iconBg="var(--accent-cyan)"
        titre="Alphabet Express"
        sousTitre={`Manche ${manche} · ${joueurActuel} · thème : ${theme}`}
        couleurTitre="var(--accent-cyan)"
        droite={demarre && !bloque ? <span className="display-title" style={{ fontSize: 14, color: 'var(--text-muted)' }}>Lettre {tour + 1}</span> : null}
      />
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 26, padding: '40px', textAlign: 'center' }}>
        {!demarre && (
          <>
            <p style={{ color: 'var(--text-muted)', maxWidth: 480 }}>
              À chaque lettre, un mot sur le thème « {theme} ». Le rythme accélère à chaque tour, jusqu'au blocage.
            </p>
            <button className="btn btn-lime" onClick={() => setDemarre(true)}>C'est parti</button>
          </>
        )}

        {demarre && !bloque && (
          <>
            <div className="hard-card" style={{ width: 160, height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="display-title" style={{ fontSize: 80, color: 'var(--accent-cyan)' }}>{lettre}</span>
            </div>
            <CountdownRing key={tour} secondes={Math.round(duree)} actif couleur="var(--accent-cyan)" pulseFinale taille={100} onFin={() => setBloque(true)} />
            <button className="btn btn-secondary" onClick={motSuivant}>Mot dit · lettre suivante</button>
          </>
        )}

        {bloque && (
          <>
            <p className="eyebrow" style={{ color: 'var(--accent-cyan)', letterSpacing: '.18em' }}>Blocage</p>
            <div className="display-title" style={{ fontSize: 'clamp(24px, 3.4vw, 36px)' }}>
              {tour} lettre{tour > 1 ? 's' : ''} enchaînée{tour > 1 ? 's' : ''} sur « {theme} »
            </div>
            <button className="btn btn-yellow" onClick={() => onTermine()}>On vote</button>
          </>
        )}
      </div>
    </div>
  );
}
