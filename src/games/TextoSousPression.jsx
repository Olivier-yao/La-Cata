import React, { useState } from 'react';
import CountdownRing from '../components/CountdownRing.jsx';
import RoundHeader from '../components/RoundHeader.jsx';
import { IconClavier } from '../components/icons.jsx';
import { textoPressionAleatoire } from '../data/textosPression.js';

function dureeTexte(texte) {
  const mots = texte.trim().split(/\s+/).length;
  return Math.max(30, Math.round(mots * 1.1) + 6);
}

function calculerPrecision(cible, tape) {
  const motsCible = cible.trim().split(/\s+/);
  const motsTapes = tape.trim().split(/\s+/);
  if (!tape.trim()) return 0;
  let corrects = 0;
  motsCible.forEach((mot, i) => {
    if (motsTapes[i] === mot) corrects++;
  });
  return corrects / motsCible.length;
}

function resultatPour(precision) {
  if (precision >= 0.95) return { points: 6, label: 'Sans faute' };
  if (precision >= 0.7) return { points: 3, label: 'Correct' };
  if (precision > 0) return { points: 1, label: 'La Cata' };
  return { points: 0, label: 'Aucun mot juste' };
}

export default function TextoSousPression({ joueurActuel, manche, onTermine }) {
  const [texte] = useState(textoPressionAleatoire);
  const [tape, setTape] = useState('');
  const [demarre, setDemarre] = useState(false);
  const [phase, setPhase] = useState('jeu'); // jeu | revelation
  const [resultatManche, setResultatManche] = useState(null);

  const duree = dureeTexte(texte);

  const terminer = () => {
    const precision = calculerPrecision(texte, tape);
    setResultatManche({ ...resultatPour(precision), precision: Math.round(precision * 100) });
    setPhase('revelation');
  };

  return (
    <div className="stage" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="stripes-bg" style={{ animation: demarre ? 'lc-stripes 1.2s linear infinite' : 'lc-stripes 5s linear infinite' }} />
      <RoundHeader
        icone={<IconClavier color="var(--outline)" />}
        iconBg="var(--accent-cyan)"
        titre="Texto Sous Pression"
        sousTitre={`Manche ${manche} · ${joueurActuel}`}
        couleurTitre="var(--accent-cyan)"
      />

      {phase === 'jeu' ? (
        <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, padding: '36px 40px', textAlign: 'center' }}>
          <p className="eyebrow" style={{ color: 'var(--text-muted)', letterSpacing: '.18em' }}>À retaper mot pour mot, le plus vite possible</p>
          <div className="hard-card" style={{ maxWidth: 700, textAlign: 'left' }}>
            <p style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.5 }}>{texte}</p>
          </div>

          {!demarre ? (
            <button className="btn btn-lime" onClick={() => setDemarre(true)}>C'est parti</button>
          ) : (
            <>
              <CountdownRing secondes={duree} actif={demarre} onFin={terminer} couleur="var(--accent-cyan)" pulseFinale taille={100} />
              <textarea
                value={tape}
                onChange={(e) => setTape(e.target.value)}
                placeholder="Tape le texte ici, exactement pareil..."
                autoFocus
                style={{
                  width: '100%', maxWidth: 700, minHeight: 100, padding: '16px 20px', borderRadius: 18,
                  border: '3px solid var(--accent-cyan)', background: 'var(--bg-panel-raised)', color: 'var(--text-primary)',
                  fontFamily: 'var(--font-body)', fontSize: 16, resize: 'vertical',
                }}
              />
              <button className="btn btn-yellow" onClick={terminer}>J'ai fini · verrouiller</button>
            </>
          )}
        </div>
      ) : (
        <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, padding: '40px', textAlign: 'center' }}>
          <p className="eyebrow" style={{ color: 'var(--accent-cyan)', letterSpacing: '.18em' }}>Résultat</p>
          <div className="display-title" style={{ fontSize: 'clamp(30px, 5vw, 48px)', color: 'var(--accent-cyan)' }}>{resultatManche.precision}% exact</div>
          <div className="hard-card" style={{ maxWidth: 700, textAlign: 'left' }}>
            <p style={{ fontSize: 14, color: 'var(--text-dim)', marginBottom: 8 }}>Texte original :</p>
            <p style={{ fontSize: 15, lineHeight: 1.5 }}>{texte}</p>
          </div>
          <div className="display-title" style={{ fontSize: 26, color: 'var(--accent-lime)' }}>
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
