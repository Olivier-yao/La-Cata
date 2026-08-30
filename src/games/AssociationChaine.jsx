import React, { useMemo, useState } from 'react';
import Avatar from '../components/Avatar.jsx';
import CountdownRing from '../components/CountdownRing.jsx';
import RoundHeader from '../components/RoundHeader.jsx';
import { IconConversation } from '../components/icons.jsx';
import { motAssociationAleatoire } from '../data/motsAssociation.js';
import { melanger } from '../lib/melanger.js';

const DUREE_INITIALE = 5;
const DUREE_PLANCHER = 1.5;
const PAS = 0.3;

function pointsPourChaine(n) {
  if (n >= 12) return 6;
  if (n >= 6) return 3;
  return 1;
}

export default function AssociationChaine({ joueurs, manche, onTermine }) {
  const cast = useState(() => melanger(joueurs))[0];
  const indexJoueur = useMemo(() => Object.fromEntries(joueurs.map((nom, i) => [nom, i])), [joueurs]);
  const [motDepart] = useState(motAssociationAleatoire);

  const [tour, setTour] = useState(0);
  const [duree, setDuree] = useState(DUREE_INITIALE);
  const [phase, setPhase] = useState('jeu'); // jeu | fin
  const [perdant, setPerdant] = useState(null);

  const joueurDuTour = cast[tour % cast.length];

  const motDit = () => {
    setTour((t) => t + 1);
    setDuree((d) => Math.max(DUREE_PLANCHER, d - PAS));
  };

  const hesitation = () => {
    setPerdant(joueurDuTour);
    setPhase('fin');
  };

  const valider = () => {
    const pts = pointsPourChaine(tour);
    const scores = Object.fromEntries(cast.map((nom) => [nom, nom === perdant ? 0 : pts]));
    onTermine({ scores });
  };

  return (
    <div className="stage" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="stripes-bg" />
      <RoundHeader
        icone={<IconConversation color="var(--outline)" />}
        iconBg="var(--accent-lime)"
        titre="Association d'Idées en Chaîne"
        sousTitre={`Manche ${manche} · mot de départ : ${motDepart}`}
        couleurTitre="var(--accent-lime)"
        droite={phase === 'jeu' ? <span className="display-title" style={{ fontSize: 14, color: 'var(--text-muted)' }}>Passe {tour + 1}</span> : null}
      />

      {phase === 'jeu' && (
        <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24, padding: '36px 50px', textAlign: 'center' }}>
          <Avatar nom={joueurDuTour} index={indexJoueur[joueurDuTour]} taille={72} />
          <div className="display-title" style={{ fontSize: 22 }}>{joueurDuTour}</div>
          <p style={{ color: 'var(--text-muted)' }}>Un mot lié au précédent, sans réfléchir.</p>
          <CountdownRing key={tour} secondes={Math.round(duree)} actif pulseFinale couleur="var(--accent-lime)" taille={100} onFin={hesitation} />
          <button className="btn btn-secondary" onClick={motDit}>Mot dit · suivant</button>
        </div>
      )}

      {phase === 'fin' && (
        <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22, padding: '40px', textAlign: 'center' }}>
          <div className="display-title" style={{ fontSize: 'clamp(24px, 3.4vw, 36px)', color: 'var(--accent-lime)' }}>
            {perdant} a cassé la chaîne
          </div>
          <p style={{ color: 'var(--text-muted)' }}>{tour} passe{tour > 1 ? 's' : ''} réussie{tour > 1 ? 's' : ''} avant la faute.</p>
          <button className="btn btn-lime" onClick={valider}>Manche suivante</button>
        </div>
      )}
    </div>
  );
}
