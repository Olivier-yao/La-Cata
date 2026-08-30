import React, { useMemo, useState } from 'react';
import Avatar from '../components/Avatar.jsx';
import CountdownRing from '../components/CountdownRing.jsx';
import RoundHeader from '../components/RoundHeader.jsx';
import { IconDeclaration } from '../components/icons.jsx';
import { declarationAleatoire } from '../data/declarations.js';

export default function Declaration({ joueurActuel, joueurIndex, joueurs, manche, onTermine }) {
  const [declaration] = useState(declarationAleatoire);
  const cible = useState(() => {
    const autres = joueurs.filter((j) => j !== joueurActuel);
    return autres[Math.floor(Math.random() * autres.length)];
  })[0];
  const indexJoueur = useMemo(() => Object.fromEntries(joueurs.map((nom, i) => [nom, i])), [joueurs]);

  const [demarre, setDemarre] = useState(false);
  const [termine, setTermine] = useState(false);

  const texte = declaration.consigne.replace('{cible}', cible);

  return (
    <div className="stage" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="stripes-bg" style={{ animation: demarre ? 'lc-stripes 1.2s linear infinite' : 'lc-stripes 5s linear infinite' }} />
      <RoundHeader
        icone={<IconDeclaration color="var(--outline)" />}
        iconBg="var(--accent-magenta)"
        titre="Déclaration"
        sousTitre={`Manche ${manche} · ${joueurActuel}`}
        couleurTitre="var(--accent-magenta)"
      />
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22, padding: '36px 30px', textAlign: 'center' }}>
        <p className="eyebrow" style={{ color: 'var(--accent-magenta)', letterSpacing: '.2em' }}>{declaration.type}</p>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>à l'attention de</span>
          <Avatar nom={cible} index={indexJoueur[cible]} taille={44} />
          <span className="display-title" style={{ fontSize: 18 }}>{cible}</span>
        </div>

        <div className="hard-card" style={{ maxWidth: 600 }}>
          <p style={{ fontSize: 19, fontWeight: 700, lineHeight: 1.5 }}>{texte}</p>
        </div>

        {!demarre ? (
          <button className="btn btn-lime" onClick={() => setDemarre(true)}>C'est parti</button>
        ) : termine ? (
          <button className="btn btn-yellow" onClick={() => onTermine()}>Déclaration faite · voter</button>
        ) : (
          <CountdownRing secondes={30} actif={demarre} onFin={() => setTermine(true)} couleur="var(--accent-magenta)" pulseFinale taille={140} />
        )}
      </div>
    </div>
  );
}
