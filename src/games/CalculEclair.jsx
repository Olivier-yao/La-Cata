import React, { useState } from 'react';
import CountdownRing from '../components/CountdownRing.jsx';
import RoundHeader from '../components/RoundHeader.jsx';
import { IconCalcul } from '../components/icons.jsx';
import { genererCalcul } from '../data/calculs.js';

const DUREE = 14;

function arrondi(nombre) {
  return Math.round(nombre * 10) / 10;
}

export default function CalculEclair({ joueurActuel, manche, onTermine }) {
  const [calcul] = useState(genererCalcul);
  const [reponse, setReponse] = useState('');
  const [phase, setPhase] = useState('jeu'); // jeu | revelation
  const [resultatManche, setResultatManche] = useState(null); // { points, label }

  const terminerChrono = () => {
    const valeur = parseFloat(reponse.replace(',', '.'));
    if (Number.isNaN(valeur)) {
      setResultatManche({ points: 0, label: 'Aucune réponse à temps' });
    } else {
      const erreur = Math.abs(valeur - calcul.resultat) / calcul.resultat;
      if (erreur <= 0.05) setResultatManche({ points: 6, label: 'Légendaire' });
      else if (erreur <= 0.15) setResultatManche({ points: 3, label: 'Correct' });
      else setResultatManche({ points: 1, label: 'La Cata' });
    }
    setPhase('revelation');
  };

  return (
    <div className="stage" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="stripes-bg" style={{ background: 'repeating-linear-gradient(115deg, rgba(200,255,77,.1) 0 30px, transparent 30px 60px)' }} />
      <RoundHeader
        icone={<IconCalcul color="var(--outline)" />}
        iconBg="var(--accent-lime)"
        titre="Calcul Éclair"
        sousTitre={`Manche ${manche} · ${joueurActuel}`}
        couleurTitre="var(--accent-lime)"
      />

      {phase === 'jeu' ? (
        <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 26, padding: '40px', textAlign: 'center' }}>
          <p className="eyebrow" style={{ color: 'var(--text-muted)', letterSpacing: '.18em' }}>
            Une estimation à voix haute suffit, pas besoin d'être exact
          </p>
          <div className="hard-card" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(38px, 6.6vw, 76px)', padding: '30px 46px' }}>
            {calcul.a} {calcul.operateur} {calcul.b}
          </div>
          <CountdownRing secondes={DUREE} actif onFin={terminerChrono} couleur="var(--accent-lime)" pulseFinale taille={140} />
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
            <input
              type="text"
              inputMode="decimal"
              value={reponse}
              onChange={(e) => setReponse(e.target.value)}
              placeholder="Ce que le joueur a annoncé"
              style={{ width: 260, padding: '14px 18px', borderRadius: 999, border: '3px solid var(--accent-lime)', background: 'var(--bg-panel-raised)', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: 18, textAlign: 'center' }}
            />
            <button className="btn btn-lime" onClick={terminerChrono}>Verrouiller la réponse</button>
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-dim)' }}>À la fin du chrono, plus aucune réponse n'est acceptée.</p>
        </div>
      ) : (
        <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, padding: '40px', textAlign: 'center' }}>
          <p className="eyebrow" style={{ color: 'var(--accent-yellow)', letterSpacing: '.18em' }}>Résultat exact</p>
          <div className="display-title" style={{ fontSize: 'clamp(36px, 6vw, 64px)' }}>
            {calcul.a} {calcul.operateur} {calcul.b} = {arrondi(calcul.resultat)}
          </div>
          <p style={{ color: 'var(--text-muted)' }}>
            {reponse
              ? `${joueurActuel} avait annoncé ${reponse}.`
              : `${joueurActuel} n'a rien annoncé avant la fin du chrono.`}
          </p>
          <div className="display-title" style={{ fontSize: 28, color: 'var(--accent-lime)' }}>
            {resultatManche.label} · +{resultatManche.points}
          </div>
          <button className="btn btn-lime" onClick={() => onTermine({ points: resultatManche.points })}>
            Manche suivante
          </button>
        </div>
      )}
    </div>
  );
}
