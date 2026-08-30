import React, { useMemo, useState } from 'react';
import Avatar from '../components/Avatar.jsx';
import CountdownRing from '../components/CountdownRing.jsx';
import { IconImprovisation } from '../components/icons.jsx';
import { themeAleatoire } from '../data/themes.js';
import { melanger } from '../lib/melanger.js';

export default function Improvisation({ joueurs, manche, onTermine }) {
  const theme = useState(themeAleatoire)[0];
  const cast = useState(() => {
    const nb = Math.min(joueurs.length, joueurs.length >= 3 ? 3 : 2);
    return melanger(joueurs).slice(0, nb);
  })[0];
  const indexJoueur = useMemo(
    () => Object.fromEntries(joueurs.map((nom, i) => [nom, i])),
    [joueurs]
  );

  const [phase, setPhase] = useState('presentation'); // presentation | impro | fin
  const [demarre, setDemarre] = useState(false);

  return (
    <div className="stage" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="stripes-bg" style={{ background: 'repeating-linear-gradient(115deg, rgba(255,201,77,.12) 0 30px, transparent 30px 60px)' }} />
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 14, padding: '18px 26px', background: 'var(--bg-deep)', borderBottom: '3px solid var(--outline)' }}>
        <div style={{ width: 44, height: 44, borderRadius: 14, background: 'var(--accent-yellow)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
          <IconImprovisation color="var(--outline)" />
        </div>
        <div>
          <div className="display-title" style={{ fontSize: 19, color: 'var(--accent-yellow)' }}>Improvisation</div>
          <div style={{ fontSize: 13, color: 'var(--text-dim)' }}>Manche {manche} · rien n'est écrit, tout s'invente</div>
        </div>
      </div>

      {phase === 'presentation' && (
        <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 26, padding: '44px 30px', textAlign: 'center' }}>
          <p className="eyebrow" style={{ color: 'var(--accent-yellow)', letterSpacing: '.2em' }}>Sur scène</p>
          <div style={{ display: 'flex', gap: 26, flexWrap: 'wrap', justifyContent: 'center' }}>
            {cast.map((nom) => (
              <div key={nom} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                <Avatar nom={nom} index={indexJoueur[nom]} taille={72} />
                <span className="display-title" style={{ fontSize: 18 }}>{nom}</span>
              </div>
            ))}
          </div>
          <div className="hard-card" style={{ maxWidth: 620 }}>
            <p style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.4 }}>{theme}</p>
          </div>
          <p style={{ color: 'var(--text-muted)', maxWidth: 520 }}>
            Personne n'a de texte à lire : à vous d'improviser une vraie conversation à partir de ce point de départ, jusqu'à la fin du chrono.
          </p>
          <button className="btn btn-yellow" onClick={() => setPhase('impro')}>On est prêts · GO</button>
        </div>
      )}

      {phase === 'impro' && (
        <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 26, padding: '40px 50px', textAlign: 'center' }}>
          <div style={{ display: 'flex', gap: 14 }}>
            {cast.map((nom) => (
              <Avatar key={nom} nom={nom} index={indexJoueur[nom]} taille={52} />
            ))}
          </div>
          <div className="hard-card" style={{ maxWidth: 640, boxShadow: '10px 10px 0 var(--accent-yellow)' }}>
            <p style={{ fontSize: 'clamp(18px, 2.2vw, 24px)', fontWeight: 700, lineHeight: 1.35 }}>{theme}</p>
          </div>
          {!demarre ? (
            <button className="btn btn-lime" onClick={() => setDemarre(true)}>On commence à improviser</button>
          ) : (
            <>
              <CountdownRing secondes={50} actif={demarre} onFin={() => setPhase('fin')} couleur="var(--accent-yellow)" pulseFinale taille={130} />
              <button className="btn btn-secondary" onClick={() => setPhase('fin')}>On a fini avant l'heure</button>
            </>
          )}
        </div>
      )}

      {phase === 'fin' && (
        <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22, padding: '40px', textAlign: 'center' }}>
          <div className="display-title" style={{ fontSize: 'clamp(24px, 3.4vw, 36px)', color: 'var(--accent-yellow)' }}>Improvisation terminée</div>
          <p style={{ color: 'var(--text-muted)', maxWidth: 520 }}>
            La table juge la performance collective : est-ce que la conversation tenait debout, était-elle drôle, engagée, culottée ?
          </p>
          <button className="btn btn-yellow" onClick={() => onTermine({ cast })}>On vote</button>
        </div>
      )}
    </div>
  );
}
