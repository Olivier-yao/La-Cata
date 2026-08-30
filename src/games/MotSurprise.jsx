import React, { useMemo, useState } from 'react';
import Avatar from '../components/Avatar.jsx';
import CountdownRing from '../components/CountdownRing.jsx';
import { IconImprovisation } from '../components/icons.jsx';
import { MOTS } from '../data/mots.js';
import { melanger } from '../lib/melanger.js';

const DUREE_TOUR = 7;

export default function MotSurprise({ joueurs, manche, onTermine }) {
  const cast = useState(() => {
    const nb = Math.min(joueurs.length, 5);
    return melanger(joueurs).slice(0, nb);
  })[0];
  const motsDistribues = useState(() => melanger(MOTS).slice(0, cast.length))[0];
  const indexJoueur = useMemo(
    () => Object.fromEntries(joueurs.map((nom, i) => [nom, i])),
    [joueurs]
  );

  const [phase, setPhase] = useState('presentation'); // presentation | jeu | fin
  const [tourIndex, setTourIndex] = useState(0);

  const joueurDuTour = cast[tourIndex];
  const motDuTour = motsDistribues[tourIndex];

  const tourSuivant = () => {
    if (tourIndex + 1 >= cast.length) {
      setPhase('fin');
    } else {
      setTourIndex((i) => i + 1);
    }
  };

  return (
    <div className="stage" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="stripes-bg" style={{ background: 'repeating-linear-gradient(115deg, rgba(200,255,77,.1) 0 30px, transparent 30px 60px)' }} />
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 26px', background: 'var(--bg-deep)', borderBottom: '3px solid var(--outline)', flexWrap: 'wrap', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: 'var(--accent-lime)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
            <IconImprovisation color="var(--outline)" />
          </div>
          <div>
            <div className="display-title" style={{ fontSize: 19, color: 'var(--accent-lime)' }}>Mot Surprise</div>
            <div style={{ fontSize: 13, color: 'var(--text-dim)' }}>Manche {manche} · chacun son mot, pas le temps de réfléchir</div>
          </div>
        </div>
        {phase === 'jeu' && (
          <span className="display-title" style={{ fontSize: 14, color: 'var(--text-muted)' }}>
            Tour {tourIndex + 1} / {cast.length}
          </span>
        )}
      </div>

      {phase === 'presentation' && (
        <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 26, padding: '44px 30px', textAlign: 'center' }}>
          <p className="eyebrow" style={{ color: 'var(--accent-lime)', letterSpacing: '.2em' }}>Sur le grill, dans cet ordre</p>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
            {cast.map((nom, i) => (
              <div key={nom} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <Avatar nom={nom} index={indexJoueur[nom]} taille={64} />
                <span className="display-title" style={{ fontSize: 15 }}>{nom}</span>
                <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>#{i + 1}</span>
              </div>
            ))}
          </div>
          <p style={{ color: 'var(--text-muted)', maxWidth: 540 }}>
            Chacun aura un mot différent, à placer dans une phrase à voix haute dès qu'il apparaît. Quelques secondes, pas plus — pas le temps de trop réfléchir.
          </p>
          <button className="btn btn-lime" onClick={() => setPhase('jeu')}>On est prêts · GO</button>
        </div>
      )}

      {phase === 'jeu' && (
        <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 28, padding: '40px 50px', overflow: 'hidden' }}>
          <div className="mot-fenetre">
            <div key={tourIndex} className="mot-ligne" style={{ '--mot-couleur': 'var(--accent-lime)' }}>
              <div className="mot-nom-col">
                <Avatar nom={joueurDuTour} index={indexJoueur[joueurDuTour]} taille={64} />
                <span className="display-title" style={{ fontSize: 16, color: 'var(--text-primary)' }}>{joueurDuTour}</span>
              </div>
              <div className="mot-texte-col">{motDuTour}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <CountdownRing key={tourIndex} secondes={DUREE_TOUR} actif couleur="var(--accent-lime)" pulseFinale taille={84} onFin={tourSuivant} />
            <button className="btn btn-secondary" onClick={tourSuivant}>Phrase dite · suivant</button>
          </div>

          <style>{`
            .mot-fenetre { width: 100%; max-width: 720px; overflow: hidden; }
            .mot-ligne {
              display: flex;
              align-items: center;
              gap: 22px;
              animation: mot-glisse 0.5s cubic-bezier(.2,.7,.3,1);
            }
            .mot-nom-col {
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 8px;
              flex: 0 0 auto;
              width: 96px;
            }
            .mot-texte-col {
              flex: 1;
              text-align: center;
              background: var(--bg-panel);
              border: 3px solid var(--mot-couleur);
              border-radius: 20px;
              padding: 24px 28px;
              font-family: var(--font-display);
              text-transform: uppercase;
              font-size: clamp(26px, 4vw, 40px);
              color: var(--mot-couleur);
              animation: mot-lueur 1.4s ease-in-out infinite;
            }
            @keyframes mot-glisse {
              from { transform: translateY(46px); opacity: 0; }
              to { transform: translateY(0); opacity: 1; }
            }
            @keyframes mot-lueur {
              0%, 100% { box-shadow: 0 0 0 0 var(--mot-couleur); }
              50% { box-shadow: 0 0 22px 2px var(--mot-couleur); }
            }
          `}</style>
        </div>
      )}

      {phase === 'fin' && (
        <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22, padding: '40px', textAlign: 'center' }}>
          <div className="display-title" style={{ fontSize: 'clamp(24px, 3.4vw, 36px)', color: 'var(--accent-lime)' }}>Manche terminée</div>
          <p style={{ color: 'var(--text-muted)', maxWidth: 520 }}>
            La table juge la performance collective : est-ce que chacun a réussi à placer son mot dans une phrase qui tenait debout ?
          </p>
          <button className="btn btn-lime" onClick={() => onTermine({ cast })}>On vote</button>
        </div>
      )}
    </div>
  );
}
