import React, { useMemo, useState } from 'react';
import Avatar from '../components/Avatar.jsx';
import CountdownRing from '../components/CountdownRing.jsx';
import RoundHeader from '../components/RoundHeader.jsx';
import { IconMenteur } from '../components/icons.jsx';
import { accusationProcesAleatoire } from '../data/accusationsProces.js';
import { melanger } from '../lib/melanger.js';

const LABELS_ROLES = ['Accusé(e)', 'Avocat de la défense', 'Avocat de l\'accusation'];

export default function ProcesFictif({ joueurs, manche, onTermine }) {
  const cast = useState(() => melanger(joueurs).slice(0, Math.min(joueurs.length, 3)))[0];
  const [accusation] = useState(accusationProcesAleatoire);
  const indexJoueur = useMemo(() => Object.fromEntries(joueurs.map((nom, i) => [nom, i])), [joueurs]);

  const [demarre, setDemarre] = useState(false);
  const [termine, setTermine] = useState(false);

  return (
    <div className="stage" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="stripes-bg" />
      <RoundHeader
        icone={<IconMenteur color="var(--outline)" />}
        iconBg="var(--accent-magenta)"
        titre="Procès Fictif"
        sousTitre={`Manche ${manche}`}
        couleurTitre="var(--accent-magenta)"
      />
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22, padding: '36px 50px', textAlign: 'center' }}>
        <p className="eyebrow" style={{ color: 'var(--text-muted)', letterSpacing: '.2em' }}>Chef d'accusation</p>
        <div className="hard-card" style={{ maxWidth: 600 }}>
          <p style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.5 }}>{accusation}</p>
        </div>
        <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', justifyContent: 'center' }}>
          {cast.map((nom, i) => (
            <div key={nom} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <Avatar nom={nom} index={indexJoueur[nom]} taille={56} />
              <span className="display-title" style={{ fontSize: 15 }}>{nom}</span>
              <span style={{ fontSize: 12, color: 'var(--accent-magenta)' }}>{LABELS_ROLES[i]}</span>
            </div>
          ))}
        </div>
        {!demarre ? (
          <button className="btn btn-lime" onClick={() => setDemarre(true)}>Ouverture du procès</button>
        ) : termine ? (
          <button className="btn btn-yellow" onClick={() => onTermine({ cast })}>Plaidoiries terminées · verdict</button>
        ) : (
          <CountdownRing secondes={60} actif={demarre} onFin={() => setTermine(true)} couleur="var(--accent-magenta)" pulseFinale taille={130} />
        )}
      </div>
    </div>
  );
}
