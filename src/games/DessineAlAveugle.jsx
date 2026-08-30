import React, { useState } from 'react';
import CountdownRing from '../components/CountdownRing.jsx';
import PrepBanner from '../components/PrepBanner.jsx';
import { dessinAleatoire } from '../data/dessins.js';

const REGLES = [
  'Pose la feuille sous la table, ou ferme les yeux.',
  'Ne relève jamais le stylo. Une seule ligne.',
  'À zéro, tout le monde regarde et devine.',
];

export default function DessineAlAveugle({ joueurActuel, manche, onTermine }) {
  const [dessin] = useState(dessinAleatoire);
  const [demarre, setDemarre] = useState(false);
  const [termine, setTermine] = useState(false);

  return (
    <div className="stage" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="stripes-bg" style={{ background: 'repeating-linear-gradient(115deg, rgba(77,232,255,.1) 0 30px, transparent 30px 60px)' }} />
      <PrepBanner texte="Avant de lancer : une feuille, un stylo, et de quoi cacher ta main" />
      <div style={{ position: 'relative', flex: 1, display: 'flex', gap: 40, padding: '40px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ flex: '1 1 320px', display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 460 }}>
          <p className="display-title" style={{ fontSize: 16, color: 'var(--accent-cyan)' }}>Dessine à l'aveugle · {joueurActuel}</p>
          <p className="eyebrow" style={{ letterSpacing: '.2em', color: 'var(--text-muted)' }}>Consigne</p>
          <div style={{ background: 'var(--bg-panel)', border: '5px solid var(--outline)', borderRadius: 26, boxShadow: '12px 12px 0 var(--accent-cyan)', padding: '30px 34px', transform: 'rotate(-1deg)' }}>
            <div className="display-title" style={{ fontSize: 'clamp(26px, 3.4vw, 40px)', lineHeight: 1.1 }}>{dessin.toUpperCase()}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {REGLES.map((r, i) => (
              <div key={r} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 15, color: 'var(--text-muted)' }}>
                <span style={{ width: 26, height: 26, borderRadius: 8, background: 'var(--accent-lime)', color: 'var(--outline)', fontFamily: 'var(--font-display)', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>{i + 1}</span>
                {r}
              </div>
            ))}
          </div>
        </div>
        <div style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
          <CountdownRing secondes={32} actif={demarre} onFin={() => setTermine(true)} couleur="var(--accent-cyan)" taille={260} />
          {!demarre ? (
            <>
              <button className="btn btn-lime" onClick={() => setDemarre(true)}>On est prêts · GO</button>
              <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>Le chrono ne démarre qu'après ce clic</span>
            </>
          ) : termine ? (
            <button className="btn btn-yellow" onClick={() => onTermine()}>Montre ton chef-d'œuvre · voter</button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
