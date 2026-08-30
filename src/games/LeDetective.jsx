import React, { useMemo, useState } from 'react';
import Avatar from '../components/Avatar.jsx';
import CountdownRing from '../components/CountdownRing.jsx';
import RoundHeader from '../components/RoundHeader.jsx';
import { IconDetective } from '../components/icons.jsx';
import { scenarioDetectiveAleatoire } from '../data/scenariosDetective.js';
import { melanger } from '../lib/melanger.js';

const DUREE_ENQUETE = 90;

export default function LeDetective({ joueurs, manche, onTermine }) {
  const scenario = useState(scenarioDetectiveAleatoire)[0];
  const cast = useState(() => melanger(joueurs).slice(0, Math.min(joueurs.length, scenario.indices.length)))[0];
  const coupable = cast[scenario.coupableIndex % cast.length];
  const indexJoueur = useMemo(() => Object.fromEntries(joueurs.map((nom, i) => [nom, i])), [joueurs]);

  const [distIndex, setDistIndex] = useState(0);
  const [phase, setPhase] = useState('gate'); // gate | reveal | enquete | vote | revelation
  const [accuse, setAccuse] = useState(null);

  const joueurEnCours = cast[distIndex];

  const suivantDistribution = () => {
    if (distIndex + 1 >= cast.length) {
      setPhase('enquete');
    } else {
      setDistIndex((i) => i + 1);
      setPhase('gate');
    }
  };

  const voterAccuse = (nom) => {
    setAccuse(nom);
    setPhase('revelation');
  };

  const correct = accuse === coupable;

  const valider = () => {
    const scores = Object.fromEntries(
      cast.map((nom) => [nom, nom === coupable ? (correct ? 1 : 6) : (correct ? 4 : 1)])
    );
    onTermine({ scores });
  };

  return (
    <div className="stage" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="stripes-bg" />
      <RoundHeader
        icone={<IconDetective color="var(--outline)" />}
        iconBg="var(--accent-violet)"
        titre="Le Détective"
        sousTitre={`Manche ${manche} · ${scenario.crime}`}
        couleurTitre="var(--accent-violet)"
      />

      {phase === 'gate' && (
        <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22, padding: '40px', textAlign: 'center' }}>
          <Avatar nom={joueurEnCours} index={indexJoueur[joueurEnCours]} taille={72} />
          <p className="eyebrow" style={{ color: 'var(--accent-violet)', letterSpacing: '.18em' }}>Passe le téléphone à {joueurEnCours}</p>
          <p style={{ color: 'var(--text-muted)', maxWidth: 460 }}>Les autres détournent le regard. Indice {distIndex + 1} / {cast.length}.</p>
          <button className="btn btn-lime" onClick={() => setPhase('reveal')}>Je suis prêt · voir mon indice</button>
        </div>
      )}

      {phase === 'reveal' && (
        <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22, padding: '40px', textAlign: 'center' }}>
          <div className="hard-card" style={{ maxWidth: 560 }}>
            <p style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.5 }}>{scenario.indices[cast.indexOf(joueurEnCours)]}</p>
          </div>
          <button className="btn btn-yellow" onClick={suivantDistribution}>J'ai vu · suivant</button>
        </div>
      )}

      {phase === 'enquete' && (
        <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 26, padding: '40px', textAlign: 'center' }}>
          <p className="eyebrow" style={{ color: 'var(--accent-violet)', letterSpacing: '.18em' }}>Enquête en cours</p>
          <p style={{ color: 'var(--text-muted)', maxWidth: 480 }}>Interrogez-vous librement. Un seul coupable se cache parmi {cast.join(', ')}.</p>
          <CountdownRing secondes={DUREE_ENQUETE} actif couleur="var(--accent-violet)" pulseFinale taille={140} onFin={() => setPhase('vote')} />
          <button className="btn btn-secondary" onClick={() => setPhase('vote')}>On a fini d'enquêter</button>
        </div>
      )}

      {phase === 'vote' && (
        <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22, padding: '36px 50px', textAlign: 'center' }}>
          <div className="display-title" style={{ fontSize: 'clamp(22px, 3vw, 30px)' }}>Qui est le coupable ?</div>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 640 }}>
            {cast.map((nom) => (
              <button
                key={nom}
                className="btn btn-secondary"
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '16px 20px' }}
                onClick={() => voterAccuse(nom)}
              >
                <Avatar nom={nom} index={indexJoueur[nom]} taille={44} />
                {nom}
              </button>
            ))}
          </div>
        </div>
      )}

      {phase === 'revelation' && (
        <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, padding: '40px', textAlign: 'center' }}>
          <p className="eyebrow" style={{ color: correct ? 'var(--accent-lime)' : 'var(--accent-magenta)', letterSpacing: '.18em' }}>
            {correct ? 'Bien vu !' : 'Raté !'}
          </p>
          <div className="display-title" style={{ fontSize: 'clamp(24px, 3.4vw, 36px)' }}>
            Le coupable était {coupable}
          </div>
          <p style={{ color: 'var(--text-muted)', maxWidth: 480 }}>La table avait accusé {accuse}.</p>
          <button className="btn btn-lime" onClick={valider}>Manche suivante</button>
        </div>
      )}
    </div>
  );
}
