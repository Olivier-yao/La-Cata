import React, { useState } from 'react';
import CountdownRing from '../components/CountdownRing.jsx';
import RoundHeader from '../components/RoundHeader.jsx';
import { IconCadenas } from '../components/icons.jsx';
import { enigmeAleatoire } from '../data/enigmes.js';

const DUREE_PAR_INDICE = 25;

export default function EvasionExpress({ joueurs, manche, onTermine }) {
  const [enigme] = useState(enigmeAleatoire);
  const [indiceIndex, setIndiceIndex] = useState(0);
  const [phase, setPhase] = useState('jeu'); // jeu | reponse
  const [trouve, setTrouve] = useState(null);

  const indiceSuivant = () => setIndiceIndex((i) => Math.min(enigme.indices.length - 1, i + 1));

  const valider = (reussite) => {
    setTrouve(reussite);
    setPhase('reponse-vote');
  };

  const confirmer = () => {
    const pts = trouve ? 5 : 1;
    const scores = Object.fromEntries(joueurs.map((nom) => [nom, pts]));
    onTermine({ scores });
  };

  return (
    <div className="stage" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="stripes-bg" />
      <RoundHeader
        icone={<IconCadenas color="var(--outline)" size={26} />}
        iconBg="var(--accent-lime)"
        titre="Évasion Express"
        sousTitre={`Manche ${manche} · ${enigme.titre}`}
        couleurTitre="var(--accent-lime)"
      />

      {phase === 'jeu' && (
        <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22, padding: '36px 50px', textAlign: 'center' }}>
          <p className="eyebrow" style={{ color: 'var(--text-muted)', letterSpacing: '.2em' }}>Toute l'équipe cherche ensemble</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 560, width: '100%' }}>
            {enigme.indices.slice(0, indiceIndex + 1).map((ind, i) => (
              <div key={i} className="hard-card" style={{ textAlign: 'left' }}>
                <span style={{ fontSize: 12, color: 'var(--accent-lime)', fontFamily: 'var(--font-display)' }}>Indice {i + 1}</span>
                <p style={{ fontSize: 16, fontWeight: 700, marginTop: 4 }}>{ind}</p>
              </div>
            ))}
          </div>
          {indiceIndex < enigme.indices.length - 1 && (
            <CountdownRing key={indiceIndex} secondes={DUREE_PAR_INDICE} actif couleur="var(--accent-lime)" pulseFinale taille={90} onFin={indiceSuivant} />
          )}
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
            {indiceIndex < enigme.indices.length - 1 && (
              <button className="btn btn-secondary" onClick={indiceSuivant}>Indice suivant</button>
            )}
            <button className="btn btn-yellow" onClick={() => setPhase('proposition')}>On propose une solution</button>
          </div>
        </div>
      )}

      {phase === 'proposition' && (
        <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22, padding: '40px', textAlign: 'center' }}>
          <p className="eyebrow" style={{ color: 'var(--accent-lime)', letterSpacing: '.18em' }}>La solution était</p>
          <div className="display-title" style={{ fontSize: 'clamp(24px, 3.4vw, 36px)' }}>{enigme.solution}</div>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button className="btn btn-secondary" onClick={() => valider(false)}>Pas trouvé</button>
            <button className="btn btn-lime" onClick={() => valider(true)}>Trouvé !</button>
          </div>
        </div>
      )}

      {phase === 'reponse-vote' && (
        <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22, padding: '40px', textAlign: 'center' }}>
          <div className="display-title" style={{ fontSize: 'clamp(24px, 3.4vw, 36px)', color: trouve ? 'var(--accent-lime)' : 'var(--accent-magenta)' }}>
            {trouve ? 'Évasion réussie !' : 'Évasion ratée'}
          </div>
          <button className="btn btn-lime" onClick={confirmer}>Manche suivante</button>
        </div>
      )}
    </div>
  );
}
