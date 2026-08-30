import React, { useState } from 'react';
import CountdownRing from '../components/CountdownRing.jsx';
import RoundHeader from '../components/RoundHeader.jsx';
import { IconVirelangue } from '../components/icons.jsx';
import { texteCorseAleatoire } from '../data/textesCorses.js';

function dureeTexte(texte) {
  const mots = texte.split(' ').length;
  return Math.round(mots * 0.45) + 3;
}

export default function TexteCorse({ joueurActuel, manche, onTermine }) {
  const [texte] = useState(texteCorseAleatoire);
  const [demarre, setDemarre] = useState(false);
  const [phase, setPhase] = useState('attente'); // attente | reussi | rate

  return (
    <div className="stage" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="stripes-bg" style={{ background: 'repeating-linear-gradient(115deg, rgba(255,77,141,.1) 0 30px, transparent 30px 60px)' }} />
      <RoundHeader
        icone={<IconVirelangue />}
        iconBg="var(--accent-magenta)"
        titre="Texte Corsé"
        sousTitre={`Manche ${manche} · ${joueurActuel}`}
        couleurTitre="var(--accent-magenta)"
      />

      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24, padding: '36px 50px', textAlign: 'center' }}>
        <p className="eyebrow" style={{ color: phase === 'rate' ? 'var(--accent-magenta)' : 'var(--text-muted)', letterSpacing: '.18em' }}>
          {phase === 'rate' ? 'Temps écoulé' : "À lire en entier, sans s'arrêter, avant la fin du chrono"}
        </p>
        <div className="hard-card" style={{ maxWidth: 720, textAlign: 'left' }}>
          <p style={{ fontSize: 'clamp(17px, 2vw, 21px)', fontWeight: 700, lineHeight: 1.5 }}>{texte}</p>
        </div>

        {phase === 'attente' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            {demarre && (
              <CountdownRing
                secondes={dureeTexte(texte)}
                actif={demarre}
                onFin={() => setPhase('rate')}
                couleur="var(--accent-magenta)"
                pulseFinale
                taille={110}
              />
            )}
            {!demarre ? (
              <button className="btn btn-lime" onClick={() => setDemarre(true)}>C'est parti</button>
            ) : (
              <button className="btn btn-lime" onClick={() => setPhase('reussi')}>J'ai fini · voter</button>
            )}
          </div>
        )}

        {phase === 'reussi' && (
          <button className="btn btn-yellow" onClick={() => onTermine()}>Lu jusqu'au bout · voter</button>
        )}

        {phase === 'rate' && (
          <>
            <p style={{ color: 'var(--text-muted)', maxWidth: 520 }}>
              {joueurActuel} n'a pas fini le texte à temps. La table juge quand même la lecture.
            </p>
            <button className="btn btn-primary" onClick={() => onTermine()}>
              On vote
            </button>
          </>
        )}
      </div>
    </div>
  );
}
