import React, { useEffect, useRef, useState } from 'react';
import RoundHeader from '../components/RoundHeader.jsx';
import JoueurChip from '../components/JoueurChip.jsx';
import { IconBruit, IconCadenas } from '../components/icons.jsx';
import { bruitAleatoire } from '../data/bruits.js';

export default function DevineLeBruit({ joueurActuel, joueurIndex, manche, onTermine }) {
  const [bruit] = useState(bruitAleatoire);
  const [phase, setPhase] = useState('avertissement'); // avertissement -> consigne -> floute
  const [decompte, setDecompte] = useState(3);
  const [secondes, setSecondes] = useState(0);
  const [propositions, setPropositions] = useState([]);
  const [saisie, setSaisie] = useState('');
  const intervalRef = useRef(null);

  useEffect(() => {
    if (phase === 'avertissement' || phase === 'consigne') {
      const t = setInterval(() => setDecompte((d) => (d <= 1 ? 0 : d - 1)), 1000);
      return () => clearInterval(t);
    }
  }, [phase]);

  useEffect(() => {
    if (decompte === 0 && phase === 'avertissement') {
      setPhase('consigne');
      setDecompte(3);
    } else if (decompte === 0 && phase === 'consigne') {
      setPhase('floute');
    }
  }, [decompte, phase]);

  useEffect(() => {
    if (phase === 'floute') {
      intervalRef.current = setInterval(() => setSecondes((s) => s + 1), 1000);
      return () => clearInterval(intervalRef.current);
    }
  }, [phase]);

  const ajouter = () => {
    const propre = saisie.trim();
    if (propre) {
      setPropositions((p) => [...p, propre]);
      setSaisie('');
    }
  };

  const min = String(Math.floor(secondes / 60)).padStart(1, '0');
  const sec = String(secondes % 60).padStart(2, '0');
  const chronoColor = secondes >= 60 ? 'var(--accent-magenta)' : secondes >= 30 ? 'var(--accent-yellow)' : 'var(--accent-lime)';

  return (
    <div className="stage" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="stripes-bg" style={{ background: 'repeating-linear-gradient(115deg, rgba(200,255,77,.08) 0 30px, transparent 30px 60px)' }} />
      <RoundHeader
        icone={<IconBruit color="var(--outline)" />}
        iconBg="var(--accent-lime)"
        titre="Devine le Bruit"
        sousTitre="Un bruiteur, tout le monde devine"
        couleurTitre="var(--accent-lime)"
        droite={
          phase === 'floute' ? (
            <>
              <JoueurChip nom={joueurActuel} index={joueurIndex} libelle={`${joueurActuel} bruite`} />
              <span className="display-title" style={{ fontSize: 24, color: chronoColor }}>{min}:{sec}</span>
            </>
          ) : null
        }
      />

      {phase !== 'floute' ? (
        <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, padding: 40, textAlign: 'center' }}>
          {phase === 'avertissement' ? (
            <>
              <div className="display-title" style={{ fontSize: 'clamp(20px, 3vw, 28px)', color: 'var(--accent-lime)' }}>
                {joueurActuel.toUpperCase()}, ET PERSONNE D'AUTRE
              </div>
              <p style={{ color: 'var(--text-muted)' }}>Les autres : regardez ailleurs.</p>
              <div className="display-title" style={{ fontSize: 80, color: 'var(--accent-yellow)' }}>{decompte}</div>
            </>
          ) : (
            <div style={{ background: 'var(--outline)', border: '3px dashed var(--accent-lime)', borderRadius: 16, padding: '26px 30px', maxWidth: 560 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', marginBottom: 12 }}>
                <IconCadenas />
                <span className="display-title" style={{ fontSize: 13, letterSpacing: '.16em', color: 'var(--accent-lime)' }}>Confidentiel · {joueurActuel} seulement</span>
              </div>
              <div className="display-title" style={{ fontSize: 'clamp(26px, 3.6vw, 40px)' }}>{bruit}</div>
              <p style={{ fontSize: 13, color: 'var(--text-dim)', marginTop: 10 }}>Avec la bouche uniquement. Pas de mots, pas de mimes.</p>
              <p style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 10 }}>Disparaît dans {decompte}s</p>
            </div>
          )}
        </div>
      ) : (
        <div style={{ position: 'relative', flex: 1, display: 'flex', gap: 30, padding: 32, flexWrap: 'wrap', justifyContent: 'center' }}>
          <div style={{ flex: '0 0 auto', width: 'min(400px, 100%)', background: 'var(--outline)', border: '4px solid var(--accent-lime)', borderRadius: 20, padding: 26, textAlign: 'center', filter: 'blur(6px)', userSelect: 'none' }}>
            <div className="display-title" style={{ fontSize: 30 }}>{bruit}</div>
          </div>
          <div style={{ flex: '1 1 260px', display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 340 }}>
            <p className="eyebrow" style={{ color: 'var(--accent-yellow)' }}>La table propose</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                value={saisie}
                onChange={(e) => setSaisie(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && ajouter()}
                placeholder="« Un chat qu'on écrase »"
                style={{ flex: 1, minWidth: 0, padding: '10px 14px', borderRadius: 999, border: '2px solid var(--border-soft)', background: 'var(--bg-panel-raised)', color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}
              />
              <button className="btn btn-secondary" onClick={ajouter}>+</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 160, overflowY: 'auto' }}>
              {propositions.map((p, i) => (
                <div key={i} className="hard-card" style={{ padding: '10px 14px', boxShadow: 'none', fontSize: 14 }}>« {p} »</div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 'auto' }}>
              <button className="btn btn-secondary" onClick={() => onTermine()}>Personne n'a trouvé</button>
              <button className="btn btn-lime" onClick={() => onTermine()}>Trouvé · arrêter</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
