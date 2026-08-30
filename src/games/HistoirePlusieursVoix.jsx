import React, { useMemo, useState } from 'react';
import Avatar from '../components/Avatar.jsx';
import CountdownRing from '../components/CountdownRing.jsx';
import RoundHeader from '../components/RoundHeader.jsx';
import { IconConversation } from '../components/icons.jsx';
import { debutHistoireAleatoire, contrainteHistoireAleatoire } from '../data/histoire.js';
import { melanger } from '../lib/melanger.js';

const DUREE_TOUR = 18;

export default function HistoirePlusieursVoix({ joueurs, manche, onTermine }) {
  const cast = useState(() => melanger(joueurs).slice(0, Math.min(joueurs.length, 5)))[0];
  const contraintes = useState(() => cast.map(() => contrainteHistoireAleatoire()))[0];
  const [debut] = useState(debutHistoireAleatoire);
  const indexJoueur = useMemo(() => Object.fromEntries(joueurs.map((nom, i) => [nom, i])), [joueurs]);

  const [phase, setPhase] = useState('presentation'); // presentation | jeu | fin
  const [tourIndex, setTourIndex] = useState(0);

  const joueurDuTour = cast[tourIndex];
  const contrainteDuTour = contraintes[tourIndex];

  const tourSuivant = () => {
    if (tourIndex + 1 >= cast.length) setPhase('fin');
    else setTourIndex((i) => i + 1);
  };

  return (
    <div className="stage" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="stripes-bg" />
      <RoundHeader
        icone={<IconConversation color="var(--accent-magenta)" />}
        iconBg="var(--bg-deep)"
        titre="Histoire à Plusieurs Voix"
        sousTitre={`Manche ${manche}`}
        couleurTitre="var(--accent-magenta)"
        droite={phase === 'jeu' ? <span className="display-title" style={{ fontSize: 14, color: 'var(--text-muted)' }}>Tour {tourIndex + 1} / {cast.length}</span> : null}
      />

      {phase === 'presentation' && (
        <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24, padding: '40px', textAlign: 'center' }}>
          <p className="eyebrow" style={{ color: 'var(--accent-magenta)', letterSpacing: '.2em' }}>Le début de l'histoire</p>
          <div className="hard-card" style={{ maxWidth: 620 }}>
            <p style={{ fontSize: 19, fontWeight: 700, lineHeight: 1.5 }}>{debut}</p>
          </div>
          <p style={{ color: 'var(--text-muted)', maxWidth: 480 }}>
            Chacun ajoute une phrase à son tour, avec une contrainte imposée à respecter : {cast.join(' → ')}.
          </p>
          <button className="btn btn-lime" onClick={() => setPhase('jeu')}>On commence</button>
        </div>
      )}

      {phase === 'jeu' && (
        <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24, padding: '36px 50px', textAlign: 'center' }}>
          <Avatar nom={joueurDuTour} index={indexJoueur[joueurDuTour]} taille={68} />
          <div className="display-title" style={{ fontSize: 20 }}>{joueurDuTour}</div>
          <div className="hard-card" style={{ maxWidth: 560 }}>
            <p style={{ fontSize: 17, fontWeight: 700 }}>Contrainte : {contrainteDuTour}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <CountdownRing key={tourIndex} secondes={DUREE_TOUR} actif pulseFinale couleur="var(--accent-magenta)" taille={90} onFin={tourSuivant} />
            <button className="btn btn-secondary" onClick={tourSuivant}>Phrase dite · suivant</button>
          </div>
        </div>
      )}

      {phase === 'fin' && (
        <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22, padding: '40px', textAlign: 'center' }}>
          <div className="display-title" style={{ fontSize: 'clamp(24px, 3.4vw, 36px)', color: 'var(--accent-magenta)' }}>Histoire terminée</div>
          <p style={{ color: 'var(--text-muted)', maxWidth: 480 }}>La table note la contribution de chacun à l'histoire collective.</p>
          <button className="btn btn-lime" onClick={() => onTermine({ cast })}>On vote</button>
        </div>
      )}
    </div>
  );
}
