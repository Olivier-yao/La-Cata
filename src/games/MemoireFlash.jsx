import React, { useState } from 'react';
import CountdownRing from '../components/CountdownRing.jsx';
import RoundHeader from '../components/RoundHeader.jsx';
import { IconMemoire } from '../components/icons.jsx';
import { texteMemoireAleatoire } from '../data/memoire.js';

function dureeMemorisation(texte) {
  const mots = texte.split(' ').length;
  return Math.min(14, Math.max(6, Math.round(mots * 0.5) + 4));
}

function dureeRestitution(texte) {
  const mots = texte.split(' ').length;
  return Math.min(25, Math.max(15, Math.round(mots * 0.9) + 6));
}

export default function MemoireFlash({ joueurActuel, manche, onTermine }) {
  const [texte] = useState(texteMemoireAleatoire);
  const [phase, setPhase] = useState('memorisation'); // memorisation | restitution | revelation

  return (
    <div className="stage" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="stripes-bg" style={{ background: 'repeating-linear-gradient(115deg, rgba(77,232,255,.1) 0 30px, transparent 30px 60px)' }} />
      <RoundHeader
        icone={<IconMemoire color="var(--outline)" />}
        iconBg="var(--accent-cyan)"
        titre="Mémoire Flash"
        sousTitre={`Manche ${manche} · ${joueurActuel}`}
        couleurTitre="var(--accent-cyan)"
      />

      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 26, padding: '40px 50px', textAlign: 'center' }}>
        {phase === 'memorisation' && (
          <>
            <p className="eyebrow" style={{ color: 'var(--text-muted)', letterSpacing: '.2em' }}>Mémorise, mot pour mot</p>
            <div style={{ background: 'var(--bg-panel)', border: '4px solid var(--outline)', borderRadius: 24, boxShadow: '10px 10px 0 var(--accent-cyan)', padding: '32px 40px', maxWidth: 680 }}>
              <div style={{ fontSize: 'clamp(20px, 2.6vw, 28px)', fontWeight: 700, lineHeight: 1.35 }}>{texte}</div>
            </div>
            <CountdownRing
              secondes={dureeMemorisation(texte)}
              actif
              onFin={() => setPhase('restitution')}
              couleur="var(--accent-cyan)"
              pulseFinale
              taille={140}
            />
          </>
        )}

        {phase === 'restitution' && (
          <>
            <p className="eyebrow" style={{ color: 'var(--accent-magenta)', letterSpacing: '.2em' }}>À {joueurActuel} de réciter, exactement</p>
            <div style={{ background: 'var(--bg-panel)', border: '4px solid var(--outline)', borderRadius: 24, padding: '32px 40px', maxWidth: 680 }}>
              <div style={{ fontSize: 'clamp(20px, 2.6vw, 28px)', fontWeight: 700, lineHeight: 1.35, filter: 'blur(9px)', userSelect: 'none' }}>{texte}</div>
            </div>
            <CountdownRing
              secondes={dureeRestitution(texte)}
              actif
              onFin={() => setPhase('revelation')}
              couleur="var(--accent-magenta)"
              pulseFinale
              taille={140}
            />
            <button className="btn btn-secondary" onClick={() => setPhase('revelation')}>J'ai terminé</button>
          </>
        )}

        {phase === 'revelation' && (
          <>
            <p className="eyebrow" style={{ color: 'var(--accent-lime)', letterSpacing: '.2em' }}>Le texte original</p>
            <div style={{ background: 'var(--bg-panel)', border: '4px solid var(--outline)', borderRadius: 24, boxShadow: '10px 10px 0 var(--accent-lime)', padding: '32px 40px', maxWidth: 680 }}>
              <div style={{ fontSize: 'clamp(20px, 2.6vw, 28px)', fontWeight: 700, lineHeight: 1.35 }}>{texte}</div>
            </div>
            <p style={{ color: 'var(--text-muted)', maxWidth: 520 }}>
              La table compare avec ce que {joueurActuel} vient de réciter, et juge si c'était fidèle au mot près.
            </p>
            <button className="btn btn-lime" onClick={() => onTermine()}>On vote</button>
          </>
        )}
      </div>
    </div>
  );
}
