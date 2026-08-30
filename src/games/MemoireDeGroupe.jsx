import React, { useMemo, useState } from 'react';
import Avatar from '../components/Avatar.jsx';
import RoundHeader from '../components/RoundHeader.jsx';
import { IconMemoire } from '../components/icons.jsx';
import { motMemoireAleatoire } from '../data/motsMemoireGroupe.js';
import { melanger } from '../lib/melanger.js';

function pointsPourLongueur(n) {
  if (n >= 8) return 6;
  if (n >= 4) return 3;
  return 1;
}

export default function MemoireDeGroupe({ joueurs, manche, onTermine }) {
  const cast = useState(() => melanger(joueurs).slice(0, Math.min(joueurs.length, 6)))[0];
  const indexJoueur = useMemo(() => Object.fromEntries(joueurs.map((nom, i) => [nom, i])), [joueurs]);

  const [liste, setListe] = useState([motMemoireAleatoire()]);
  const [tourIndex, setTourIndex] = useState(0);
  const [phase, setPhase] = useState('recite'); // recite | fin
  const [perdant, setPerdant] = useState(null);

  const joueurDuTour = cast[tourIndex % cast.length];

  const reussi = () => {
    setListe((l) => [...l, motMemoireAleatoire()]);
    setTourIndex((t) => t + 1);
  };

  const rate = () => {
    setPerdant(joueurDuTour);
    setPhase('fin');
  };

  const valider = () => {
    const pts = pointsPourLongueur(liste.length);
    const scores = Object.fromEntries(cast.map((nom) => [nom, nom === perdant ? 0 : pts]));
    onTermine({ scores });
  };

  return (
    <div className="stage" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="stripes-bg" />
      <RoundHeader
        icone={<IconMemoire color="var(--accent-magenta)" />}
        iconBg="var(--bg-deep)"
        bordure="3px solid var(--outline)"
        titre="Mémoire de Groupe"
        sousTitre={`Manche ${manche} · liste de ${liste.length} mot${liste.length > 1 ? 's' : ''}`}
        couleurTitre="var(--accent-magenta)"
      />

      {phase === 'recite' && (
        <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24, padding: '36px 50px', textAlign: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <Avatar nom={joueurDuTour} index={indexJoueur[joueurDuTour]} taille={64} />
            <span className="display-title" style={{ fontSize: 18 }}>{joueurDuTour}</span>
          </div>
          <p style={{ color: 'var(--text-muted)', maxWidth: 500 }}>
            Doit réciter toute la liste dans l'ordre, puis ajouter un nouveau mot.
          </p>
          <div className="hard-card" style={{ maxWidth: 640, display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
            {liste.map((mot, i) => (
              <span key={i} className="tag">{mot}</span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button className="btn btn-secondary" onClick={rate}>Raté</button>
            <button className="btn btn-lime" onClick={reussi}>Réussi · mot suivant</button>
          </div>
        </div>
      )}

      {phase === 'fin' && (
        <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22, padding: '40px', textAlign: 'center' }}>
          <div className="display-title" style={{ fontSize: 'clamp(24px, 3.4vw, 36px)', color: 'var(--accent-magenta)' }}>
            {perdant} a fait tomber la chaîne
          </div>
          <p style={{ color: 'var(--text-muted)', maxWidth: 480 }}>
            La liste était montée à {liste.length} mots avant la faute.
          </p>
          <button className="btn btn-lime" onClick={valider}>Manche suivante</button>
        </div>
      )}
    </div>
  );
}
