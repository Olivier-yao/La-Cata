import React, { useMemo, useState } from 'react';
import Avatar from '../components/Avatar.jsx';
import RoundHeader from '../components/RoundHeader.jsx';
import { IconSondage } from '../components/icons.jsx';
import { questionSondageAleatoire } from '../data/questionsSondage.js';
import { melanger } from '../lib/melanger.js';

export default function SondagePredictif({ joueurs, manche, onTermine }) {
  const [question] = useState(questionSondageAleatoire);
  const ordreVote = useState(() => melanger(joueurs))[0];
  const indexJoueur = useMemo(() => Object.fromEntries(joueurs.map((nom, i) => [nom, i])), [joueurs]);

  const [voteIndex, setVoteIndex] = useState(0);
  const [phase, setPhase] = useState('gate'); // gate | vote | resultats
  const [votes, setVotes] = useState({});

  const votant = ordreVote[voteIndex];

  const voter = (cible) => {
    setVotes((v) => ({ ...v, [cible]: (v[cible] || 0) + 1 }));
    if (voteIndex + 1 >= ordreVote.length) {
      setPhase('resultats');
    } else {
      setVoteIndex((i) => i + 1);
      setPhase('gate');
    }
  };

  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0) || 1;
  const maxVotes = Math.max(0, ...Object.values(votes));
  const gagnants = joueurs.filter((j) => (votes[j] || 0) === maxVotes && maxVotes > 0);

  const valider = () => {
    const scores = Object.fromEntries(joueurs.map((nom) => [nom, gagnants.includes(nom) ? 3 : 0]));
    onTermine({ scores });
  };

  return (
    <div className="stage" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="stripes-bg" />
      <RoundHeader
        icone={<IconSondage color="var(--outline)" />}
        iconBg="var(--accent-yellow)"
        titre="Sondage Prédictif"
        sousTitre={`Manche ${manche}`}
        couleurTitre="var(--accent-yellow)"
      />

      {phase === 'gate' && (
        <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22, padding: '40px', textAlign: 'center' }}>
          <Avatar nom={votant} index={indexJoueur[votant]} taille={72} />
          <p className="eyebrow" style={{ color: 'var(--accent-yellow)', letterSpacing: '.18em' }}>Passe le téléphone à {votant}</p>
          <p style={{ color: 'var(--text-muted)', maxWidth: 460 }}>Les autres détournent le regard. Vote {voteIndex + 1} / {ordreVote.length}.</p>
          <button className="btn btn-lime" onClick={() => setPhase('vote')}>Je suis prêt · voter en secret</button>
        </div>
      )}

      {phase === 'vote' && (
        <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24, padding: '36px 50px', textAlign: 'center' }}>
          <div className="display-title" style={{ fontSize: 'clamp(22px, 3vw, 32px)' }}>{question}</div>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 640 }}>
            {joueurs.map((nom) => (
              <button
                key={nom}
                className="btn btn-secondary"
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '16px 20px' }}
                onClick={() => voter(nom)}
              >
                <Avatar nom={nom} index={indexJoueur[nom]} taille={44} />
                {nom}
              </button>
            ))}
          </div>
        </div>
      )}

      {phase === 'resultats' && (
        <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, padding: '36px 50px' }}>
          <p className="eyebrow" style={{ color: 'var(--accent-yellow)', letterSpacing: '.18em', textAlign: 'center' }}>Résultats</p>
          <div className="display-title" style={{ fontSize: 'clamp(20px, 2.6vw, 28px)', textAlign: 'center', marginBottom: 8 }}>{question}</div>
          <div style={{ width: '100%', maxWidth: 560, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {joueurs.map((nom) => {
              const n = votes[nom] || 0;
              const pct = Math.round((n / totalVotes) * 100);
              const gagnant = gagnants.includes(nom);
              return (
                <div key={nom} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Avatar nom={nom} index={indexJoueur[nom]} taille={38} />
                  <span style={{ width: 100, fontSize: 14, color: gagnant ? 'var(--accent-yellow)' : 'var(--text-primary)' }}>{nom}</span>
                  <div style={{ flex: 1, height: 16, borderRadius: 999, background: 'var(--bg-deep)', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: gagnant ? 'var(--accent-yellow)' : 'var(--accent-magenta)', transition: 'width .5s ease' }} />
                  </div>
                  <span style={{ width: 44, fontSize: 13, color: 'var(--text-muted)', textAlign: 'right' }}>{pct}%</span>
                </div>
              );
            })}
          </div>
          <button className="btn btn-lime" onClick={valider}>Manche suivante</button>
        </div>
      )}
    </div>
  );
}
