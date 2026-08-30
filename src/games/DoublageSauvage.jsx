import React, { useEffect, useState } from 'react';
import RoundHeader from '../components/RoundHeader.jsx';
import { IconDoublage } from '../components/icons.jsx';
import { clipAleatoire } from '../data/doublage.js';

const DUREE_BOUCLE = 6000;

export default function DoublageSauvage({ joueurActuel, manche, onTermine }) {
  const [clip, setClip] = useState(clipAleatoire);
  const [boucles, setBoucles] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setBoucles((b) => b + 1), DUREE_BOUCLE);
    return () => clearInterval(t);
  }, [clip]);

  const autreClip = () => {
    setClip(clipAleatoire());
    setBoucles(0);
  };

  return (
    <div className="stage" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="stripes-bg" style={{ background: 'repeating-linear-gradient(115deg, rgba(124,77,255,.14) 0 30px, transparent 30px 60px)' }} />
      <RoundHeader
        icone={<IconDoublage color="var(--outline)" />}
        iconBg="var(--accent-violet)"
        titre="Doublage Sauvage"
        sousTitre="Aucun son. À toi d'inventer ce qu'ils disent."
        couleurTitre="var(--accent-violet)"
        droite={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="display-title" style={{ fontSize: 13, color: 'var(--text-muted)' }}>Boucle</span>
            <span className="display-title" style={{ fontSize: 20, color: 'var(--accent-violet)' }}>{boucles}</span>
          </div>
        }
      />

      <div style={{ position: 'relative', flex: 1, display: 'flex', gap: 30, padding: '32px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <div
          key={clip.description}
          style={{
            position: 'relative',
            width: 'min(600px, 100%)',
            aspectRatio: '16 / 9',
            background: 'var(--outline)',
            border: '5px solid var(--accent-violet)',
            borderRadius: 20,
            boxShadow: '0 0 0 10px rgba(124,77,255,.16)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: 20, textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, letterSpacing: '.2em', color: 'var(--text-dim)' }}>EMPLACEMENT VIDÉO · 16:9 MUET</div>
            <div className="display-title" style={{ fontSize: 'clamp(20px, 3vw, 30px)', color: 'var(--text-muted)' }}>{clip.description.toUpperCase()}</div>
          </div>
          <div style={{ position: 'absolute', top: 14, right: 16, display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(18,12,27,.8)', border: '2px solid var(--accent-violet)', borderRadius: 999, padding: '5px 12px' }}>
            <span style={{ width: 9, height: 9, borderRadius: 999, background: 'var(--accent-magenta)', animation: 'lc-blink 1.2s steps(1) infinite' }} />
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 11, color: 'var(--text-primary)' }}>EN BOUCLE</span>
          </div>
          <div style={{ position: 'absolute', left: 18, right: 18, bottom: 0, height: 8, background: 'var(--bg-panel-raised)', overflow: 'hidden' }}>
            <div key={boucles} style={{ width: '100%', height: '100%', background: 'var(--accent-violet)', animation: `lc-loop ${DUREE_BOUCLE}ms linear infinite` }} />
          </div>
        </div>

        <div style={{ flex: '1 1 240px', display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 320 }}>
          <p className="eyebrow" style={{ color: 'var(--accent-yellow)' }}>Pistes si ça sèche</p>
          {boucles >= 1 ? (
            clip.pistes.map((p) => (
              <div key={p} className="hard-card" style={{ padding: '14px 16px', boxShadow: 'none', fontSize: 15, color: 'var(--text-muted)' }}>« {p} »</div>
            ))
          ) : (
            <div style={{ border: '3px dashed var(--border-soft)', borderRadius: 16, padding: '14px 16px', fontSize: 14, color: 'var(--text-dim)' }}>
              Les pistes apparaissent à la 2e boucle, pour laisser le temps d'improviser.
            </div>
          )}
        </div>
      </div>

      <div style={{ position: 'relative', padding: '18px 30px', borderTop: '3px solid var(--outline)', background: 'var(--bg-deep)', display: 'flex', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}>
        <button className="btn btn-secondary" onClick={autreClip}>Autre clip</button>
        <button className="btn btn-violet" onClick={() => onTermine()}>Couper · on vote</button>
      </div>
    </div>
  );
}
