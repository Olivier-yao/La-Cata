import React, { useState } from 'react';
import Avatar from '../components/Avatar.jsx';
import { IconStatue } from '../components/icons.jsx';
import { poseParNiveau } from '../data/poses.js';

// StatueSurprise — contrairement aux autres mini-jeux, tout se joue ici :
// on élimine manche après manche jusqu'à ce qu'il ne reste qu'un seul
// joueur, avec des poses de plus en plus inconfortables à mesure que le
// groupe se réduit. Pas de vote externe ensuite (voir games.js).

function niveauPour(enJeu, total) {
  if (total <= 2) return 3;
  const fraction = enJeu / total;
  if (fraction <= 0.4) return 3;
  if (fraction <= 0.7) return 2;
  return 1;
}

export default function StatueSurprise({ joueurs, manche, onTermine }) {
  const [enJeu, setEnJeu] = useState(joueurs);
  const [sortis, setSortis] = useState([]);
  const [mancheInterne, setMancheInterne] = useState(1);
  const [musique, setMusique] = useState(true);
  const [phase, setPhase] = useState('pose'); // 'pose' | 'elimination' | 'victoire'
  const [pose, setPose] = useState(() => poseParNiveau(niveauPour(joueurs.length, joueurs.length)));

  const niveau = niveauPour(enJeu.length, joueurs.length);

  const eliminer = (nom) => {
    const restants = enJeu.filter((j) => j !== nom);
    setSortis((prev) => [...prev, nom]);
    setEnJeu(restants);
    if (restants.length <= 1) {
      setPhase('victoire');
    } else {
      setMancheInterne((m) => m + 1);
      setPose(poseParNiveau(niveauPour(restants.length, joueurs.length)));
      setMusique(true);
      setPhase('pose');
    }
  };

  if (phase === 'victoire') {
    const gagnant = enJeu[0];
    return (
      <div className="stage" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22, padding: '60px 40px', textAlign: 'center', background: 'var(--accent-violet)' }}>
        <p className="display-title" style={{ fontSize: 15, letterSpacing: '.2em', color: 'var(--outline)' }}>Dernier·ère debout</p>
        <Avatar nom={gagnant} index={joueurs.indexOf(gagnant)} taille={96} contour="var(--outline)" />
        <div className="display-title" style={{ fontSize: 'clamp(30px, 5vw, 50px)', color: 'var(--outline)' }}>{gagnant}</div>
        <p style={{ color: 'var(--outline)', maxWidth: 480 }}>
          {sortis.length} statue{sortis.length > 1 ? 's' : ''} {sortis.length > 1 ? 'sont tombées' : 'est tombée'} avant celle-ci. Une pose de plus, et c'était fini pour {gagnant} aussi.
        </p>
        <button className="btn" style={{ background: 'var(--outline)', color: 'var(--accent-violet)' }} onClick={() => onTermine()}>
          Continuer
        </button>
      </div>
    );
  }

  return (
    <div className="stage" style={{ display: 'flex', flexDirection: 'column', background: 'var(--accent-violet)' }}>
      <div className="stripes-bg" style={{ background: 'repeating-linear-gradient(115deg, rgba(18,12,27,.22) 0 26px, transparent 26px 52px)', animation: musique ? 'lc-stripes 1.6s linear infinite' : 'none' }} />
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 30px', background: 'var(--outline)', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: 'var(--bg-panel)', border: '3px solid var(--accent-violet)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconStatue />
          </div>
          <div>
            <div className="display-title" style={{ fontSize: 19, color: 'var(--accent-violet)' }}>Statue Surprise</div>
            <div style={{ fontSize: 13, color: 'var(--text-dim)' }}>
              Manche {manche} · tour {mancheInterne} · {enJeu.length} en jeu sur {joueurs.length}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg-panel)', border: '3px solid var(--accent-violet)', borderRadius: 999, padding: '9px 20px' }}>
          <span className="display-title" style={{ fontSize: 13, color: 'var(--text-muted)' }}>Musique</span>
          <span className="display-title" style={{ fontSize: 15, color: musique ? 'var(--accent-lime)' : 'var(--accent-magenta)' }}>{musique ? 'En cours' : 'Coupée'}</span>
        </div>
      </div>

      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, padding: '30px 40px', textAlign: 'center' }}>
        <div className="display-title" style={{ fontSize: 22, letterSpacing: '.2em', color: 'var(--outline)' }}>Prenez la pose</div>
        <div style={{ background: 'var(--outline)', borderRadius: 30, padding: '32px 56px', boxShadow: '0 0 0 14px rgba(18,12,27,.25)', animation: musique ? 'none' : 'lc-pop 1.8s ease-out infinite' }}>
          <div className="display-title" style={{ fontSize: 'clamp(28px, 4.4vw, 60px)', color: niveau === 3 ? 'var(--accent-magenta)' : 'var(--accent-lime)' }}>{pose.titre}</div>
          <div style={{ fontSize: 16, color: 'var(--text-muted)', marginTop: 8, maxWidth: 520 }}>{pose.description}</div>
        </div>
        <div className="display-title" style={{ fontSize: 17, color: 'var(--outline)' }}>
          {enJeu.length === 2 ? 'Le dernier à se figer perd' : 'Le dernier à se figer sort'}
        </div>
        {niveau === 3 && (
          <div style={{ fontSize: 13, color: 'var(--outline)', fontFamily: 'var(--font-display)', letterSpacing: '.1em' }}>
            Dernières manches · ça devient inconfortable
          </div>
        )}
      </div>

      {phase === 'elimination' ? (
        <div style={{ position: 'relative', background: 'var(--outline)', padding: '24px 30px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
          <p className="eyebrow" style={{ color: 'var(--accent-violet)' }}>Qui a bougé en dernier ?</p>
          <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', justifyContent: 'center' }}>
            {enJeu.map((nom) => (
              <button
                key={nom}
                onClick={() => eliminer(nom)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
              >
                <Avatar nom={nom} index={joueurs.indexOf(nom)} taille={64} contour="var(--accent-lime)" />
                <span style={{ fontSize: 12, fontFamily: 'var(--font-display)', color: 'var(--accent-lime)' }}>{nom}</span>
              </button>
            ))}
          </div>
          <button className="btn btn-secondary" onClick={() => setPhase('pose')}>Égalité · personne ne sort</button>
        </div>
      ) : (
        <div style={{ position: 'relative', background: 'var(--outline)', padding: '18px 30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {enJeu.map((nom) => (
              <div key={nom} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <Avatar nom={nom} index={joueurs.indexOf(nom)} taille={46} contour="var(--accent-lime)" />
                <span style={{ fontSize: 11, fontFamily: 'var(--font-display)', color: 'var(--accent-lime)' }}>EN JEU</span>
              </div>
            ))}
            {sortis.map((nom) => (
              <Avatar key={nom} nom={nom} index={joueurs.indexOf(nom)} taille={46} eteint />
            ))}
          </div>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <button className="btn btn-secondary" onClick={() => setPhase('elimination')}>Éliminer quelqu'un</button>
            <button className="btn btn-lime" onClick={() => setMusique((m) => !m)}>{musique ? 'Couper la musique' : 'Relancer la musique'}</button>
          </div>
        </div>
      )}
    </div>
  );
}
