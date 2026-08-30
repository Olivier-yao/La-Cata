import React, { useState } from 'react';
import Avatar from '../components/Avatar.jsx';
import CountdownRing from '../components/CountdownRing.jsx';
import RoundHeader from '../components/RoundHeader.jsx';
import { IconAveugle } from '../components/icons.jsx';
import { categorieChronoAleatoire } from '../data/categoriesChrono.js';

const DUREE = 20;

export default function CategoriesChrono({ joueurs, manche, onTermine }) {
  const [{ categorie, lettre }] = useState(categorieChronoAleatoire);
  const [phase, setPhase] = useState('attente'); // attente | chrono | checklist
  const [valides, setValides] = useState({});

  const toggle = (nom) => setValides((v) => ({ ...v, [nom]: !v[nom] }));

  const valider = () => {
    const scores = Object.fromEntries(joueurs.map((nom) => [nom, valides[nom] ? 2 : 0]));
    onTermine({ scores });
  };

  return (
    <div className="stage" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="stripes-bg" />
      <RoundHeader
        icone={<IconAveugle color="var(--outline)" />}
        iconBg="var(--accent-cyan)"
        titre="Catégories Chrono"
        sousTitre={`Manche ${manche} · ${categorie}, lettre ${lettre}`}
        couleurTitre="var(--accent-cyan)"
      />

      {phase === 'attente' && (
        <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 26, padding: '40px', textAlign: 'center' }}>
          <p className="eyebrow" style={{ color: 'var(--text-muted)', letterSpacing: '.2em' }}>Catégorie</p>
          <div className="hard-card" style={{ minWidth: 280 }}>
            <div className="display-title" style={{ fontSize: 30 }}>{categorie}</div>
            <div className="display-title" style={{ fontSize: 60, color: 'var(--accent-cyan)', marginTop: 10 }}>{lettre}</div>
          </div>
          <p style={{ color: 'var(--text-muted)', maxWidth: 460 }}>Tout le monde crie une réponse avant la fin du chrono. Les doublons seront éliminés.</p>
          <button className="btn btn-lime" onClick={() => setPhase('chrono')}>C'est parti</button>
        </div>
      )}

      {phase === 'chrono' && (
        <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 26, padding: '40px', textAlign: 'center' }}>
          <div className="display-title" style={{ fontSize: 34 }}>{categorie} · {lettre}</div>
          <CountdownRing secondes={DUREE} actif pulseFinale couleur="var(--accent-cyan)" taille={180} onFin={() => setPhase('checklist')} />
        </div>
      )}

      {phase === 'checklist' && (
        <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22, padding: '36px 50px', textAlign: 'center' }}>
          <p className="eyebrow" style={{ color: 'var(--accent-cyan)', letterSpacing: '.18em' }}>Qui a une réponse valide ?</p>
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Décoche les doublons ou les réponses invalides.</p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 640 }}>
            {joueurs.map((nom, i) => (
              <button
                key={nom}
                onClick={() => toggle(nom)}
                className="btn"
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '16px 20px',
                  background: valides[nom] ? 'var(--accent-lime)' : 'var(--bg-panel-raised)',
                  color: valides[nom] ? 'var(--outline)' : 'var(--text-primary)',
                }}
              >
                <Avatar nom={nom} index={i} taille={44} />
                {nom}
              </button>
            ))}
          </div>
          <button className="btn btn-yellow" onClick={valider}>Valider les points</button>
        </div>
      )}
    </div>
  );
}
