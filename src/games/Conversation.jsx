import React, { useMemo, useState } from 'react';
import Avatar from '../components/Avatar.jsx';
import CountdownRing from '../components/CountdownRing.jsx';
import { IconConversation } from '../components/icons.jsx';
import { scenarioAleatoirePourRoles } from '../data/conversations.js';
import { melanger } from '../lib/melanger.js';

const COULEUR_GENRE = {
  'drôle': 'var(--accent-lime)',
  'épique': 'var(--accent-violet)',
  'amour': 'var(--accent-magenta)',
  'drame': 'var(--accent-cyan)',
};

function dureeLigne(texte) {
  return Math.min(14, Math.max(5, Math.round(texte.length / 14) + 3));
}

export default function Conversation({ joueurs, manche, onTermine }) {
  const scenario = useState(() => scenarioAleatoirePourRoles(joueurs.length))[0];
  const distribution = useState(() => {
    const casting = melanger(joueurs).slice(0, scenario.roles.length);
    return Object.fromEntries(scenario.roles.map((role, i) => [role, casting[i]]));
  })[0];
  const indexJoueur = useMemo(
    () => Object.fromEntries(joueurs.map((nom, i) => [nom, i])),
    [joueurs]
  );

  const [phase, setPhase] = useState('presentation'); // 'presentation' | 'scene' | 'fin'
  const [ligneIndex, setLigneIndex] = useState(0);

  const couleur = COULEUR_GENRE[scenario.genre] || 'var(--accent-magenta)';
  const ligne = scenario.lignes[ligneIndex];
  const joueurDeLaLigne = ligne ? distribution[ligne.role] : null;

  const ligneSuivante = () => {
    if (ligneIndex + 1 >= scenario.lignes.length) {
      setPhase('fin');
    } else {
      setLigneIndex((i) => i + 1);
    }
  };

  return (
    <div className="stage" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="stripes-bg" style={{ background: `repeating-linear-gradient(115deg, ${couleur}22 0 30px, transparent 30px 60px)` }} />
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 26px', background: 'var(--bg-deep)', borderBottom: '3px solid var(--outline)', flexWrap: 'wrap', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: couleur, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
            <IconConversation color="var(--outline)" />
          </div>
          <div>
            <div className="display-title" style={{ fontSize: 19, color: couleur }}>Conversation · {scenario.genre}</div>
            <div style={{ fontSize: 13, color: 'var(--text-dim)' }}>{scenario.titre} · manche {manche}</div>
          </div>
        </div>
        {phase === 'scene' && (
          <span className="display-title" style={{ fontSize: 14, color: 'var(--text-muted)' }}>
            Réplique {ligneIndex + 1} / {scenario.lignes.length}
          </span>
        )}
      </div>

      {phase === 'presentation' && (
        <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 26, padding: '44px 30px', textAlign: 'center' }}>
          <p className="eyebrow" style={{ color: couleur, letterSpacing: '.2em' }}>Distribution des rôles</p>
          <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap', justifyContent: 'center' }}>
            {scenario.roles.map((role) => {
              const nom = distribution[role];
              return (
                <div key={role} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                  <Avatar nom={nom} index={indexJoueur[nom]} taille={72} />
                  <span className="display-title" style={{ fontSize: 18 }}>{nom}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>rôle {role}</span>
                </div>
              );
            })}
          </div>
          <p style={{ color: 'var(--text-muted)', maxWidth: 560 }}>
            Chacun lit sa réplique à voix haute quand c'est son tour, dans le ton de la scène : {scenario.genre}. On enchaîne comme un vrai dialogue, sans se presser mais sans traîner.
          </p>
          <button className="btn" style={{ background: couleur, color: 'var(--outline)' }} onClick={() => setPhase('scene')}>
            On est prêts · GO
          </button>
        </div>
      )}

      {phase === 'scene' && ligne && (
        <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 28, padding: '40px 50px', overflow: 'hidden' }}>
          <div className="convo-fenetre">
            <div key={ligneIndex} className="convo-ligne" style={{ '--convo-couleur': couleur }}>
              <div className="convo-nom-col">
                <Avatar nom={joueurDeLaLigne} index={indexJoueur[joueurDeLaLigne]} taille={64} />
                <span className="display-title" style={{ fontSize: 16, color: 'var(--text-primary)' }}>{joueurDeLaLigne}</span>
              </div>
              <div className="convo-texte-col">« {ligne.texte} »</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <CountdownRing key={ligneIndex} secondes={dureeLigne(ligne.texte)} actif couleur={couleur} taille={84} onFin={ligneSuivante} />
            <button className="btn btn-secondary" onClick={ligneSuivante}>Réplique dite · suivant</button>
          </div>

          <style>{`
            .convo-fenetre { width: 100%; max-width: 720px; overflow: hidden; }
            .convo-ligne {
              display: flex;
              align-items: center;
              gap: 22px;
              animation: convo-glisse 0.5s cubic-bezier(.2,.7,.3,1);
            }
            .convo-nom-col {
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 8px;
              flex: 0 0 auto;
              width: 96px;
            }
            .convo-texte-col {
              flex: 1;
              text-align: left;
              background: var(--bg-panel);
              border: 3px solid var(--convo-couleur);
              border-radius: 20px;
              padding: 24px 28px;
              font-size: clamp(18px, 2.2vw, 24px);
              font-weight: 700;
              line-height: 1.35;
              animation: convo-lueur 1.8s ease-in-out infinite;
            }
            @keyframes convo-glisse {
              from { transform: translateY(46px); opacity: 0; }
              to { transform: translateY(0); opacity: 1; }
            }
            @keyframes convo-lueur {
              0%, 100% { box-shadow: 0 0 0 0 var(--convo-couleur); }
              50% { box-shadow: 0 0 22px 2px var(--convo-couleur); }
            }
          `}</style>
        </div>
      )}

      {phase === 'fin' && (
        <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22, padding: '40px', textAlign: 'center' }}>
          <div className="display-title" style={{ fontSize: 'clamp(24px, 3.4vw, 36px)', color: couleur }}>Scène terminée</div>
          <p style={{ color: 'var(--text-muted)', maxWidth: 520 }}>
            La table juge la performance collective : justesse du ton, engagement, et bien sûr le fou rire éventuel.
          </p>
          <button className="btn" style={{ background: couleur, color: 'var(--outline)' }} onClick={() => onTermine({ cast: Object.values(distribution) })}>
            On vote
          </button>
        </div>
      )}
    </div>
  );
}
