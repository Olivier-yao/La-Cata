import React, { useEffect, useRef, useState } from 'react';

// LyricsScroll — paroles qui défilent ligne par ligne façon "paroles
// synchronisées" (Spotify) : la ligne en cours reste au centre, en grand
// et en couleur, les suivantes/précédentes s'estompent au-dessus et en
// dessous. Chaque ligne a sa PROPRE durée (`duree`, en ms) — certaines
// filent vite, d'autres traînent — et une bande de progression se
// remplit sur cette durée pour indiquer au chanteur le rythme à prendre
// avant de passer à la ligne suivante.

const HAUTEUR_LIGNE = 56;
const HAUTEUR_PISTE = 280;

export default function LyricsScroll({ lignes, couleur = 'var(--accent-magenta)', onIndexChange, onTermine }) {
  const [index, setIndex] = useState(-1);
  const [enCours, setEnCours] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  useEffect(() => {
    onIndexChange && onIndexChange(Math.max(0, index));
  }, [index]);

  const planifierSuivante = (i) => {
    const duree = lignes[i].duree;
    timeoutRef.current = setTimeout(() => {
      if (i + 1 >= lignes.length) {
        setEnCours(false);
        onTermine && onTermine();
      } else {
        setIndex(i + 1);
        planifierSuivante(i + 1);
      }
    }, duree);
  };

  const demarrer = () => {
    setEnCours(true);
    setIndex(0);
    planifierSuivante(0);
  };

  const decalage = HAUTEUR_PISTE / 2 - HAUTEUR_LIGNE / 2 - Math.max(0, index) * HAUTEUR_LIGNE;
  const ligneActuelle = lignes[Math.max(0, index)];

  return (
    <div className="lyrics-wrapper">
      <div className="lyrics-piste">
        <div className="lyrics-colonne" style={{ transform: `translateY(${decalage}px)` }}>
          {lignes.map((ligne, i) => {
            const distance = Math.abs(i - index);
            const style =
              distance === 0
                ? { color: couleur, fontSize: 28, opacity: 1, fontWeight: 700 }
                : distance === 1
                ? { color: 'var(--text-primary)', fontSize: 19, opacity: 0.55, fontWeight: 700 }
                : { color: 'var(--text-dim)', fontSize: 16, opacity: 0.3, fontWeight: 700 };
            return (
              <div key={i} className="lyrics-ligne" style={style}>
                {ligne.texte}
              </div>
            );
          })}
        </div>
        <div className="lyrics-bande" style={{ borderColor: couleur }} />
        <div className="lyrics-voile lyrics-voile-haut" />
        <div className="lyrics-voile lyrics-voile-bas" />
      </div>

      {enCours && (
        <div className="lyrics-progression">
          <div
            key={index}
            className="lyrics-progression-remplissage"
            style={{ background: couleur, animationDuration: `${ligneActuelle.duree}ms` }}
          />
        </div>
      )}

      {!enCours && index === -1 && (
        <button className="btn btn-primary" onClick={demarrer} style={{ marginTop: 24 }}>
          Lancer le karaoké
        </button>
      )}

      <style>{`
        .lyrics-wrapper { display: flex; flex-direction: column; align-items: center; width: 100%; }
        .lyrics-piste {
          position: relative;
          width: 100%;
          max-width: 700px;
          height: ${HAUTEUR_PISTE}px;
          background: var(--bg-deep);
          border-radius: var(--radius-lg);
          overflow: hidden;
        }
        .lyrics-colonne {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: transform 0.5s cubic-bezier(.2,.7,.3,1);
        }
        .lyrics-ligne {
          height: ${HAUTEUR_LIGNE}px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 0 36px;
          font-family: var(--font-body);
          line-height: 1.15;
          transition: color 0.3s ease, opacity 0.3s ease, font-size 0.3s ease;
        }
        .lyrics-bande {
          position: absolute;
          top: 50%;
          left: 8%;
          right: 8%;
          height: ${HAUTEUR_LIGNE + 10}px;
          transform: translateY(-50%);
          border-top: 3px solid;
          border-bottom: 3px solid;
          pointer-events: none;
        }
        .lyrics-voile { position: absolute; left: 0; right: 0; height: 40%; pointer-events: none; }
        .lyrics-voile-haut { top: 0; background: linear-gradient(var(--bg-deep), transparent); }
        .lyrics-voile-bas { bottom: 0; background: linear-gradient(transparent, var(--bg-deep)); }
        .lyrics-progression {
          width: 100%;
          max-width: 700px;
          height: 10px;
          border-radius: 999px;
          background: var(--bg-panel-raised);
          overflow: hidden;
          margin-top: 16px;
        }
        .lyrics-progression-remplissage {
          height: 100%;
          width: 100%;
          transform-origin: left;
          transform: scaleX(0);
          animation-name: lc-lyrics-fill;
          animation-timing-function: linear;
          animation-fill-mode: forwards;
        }
        @keyframes lc-lyrics-fill {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
      `}</style>
    </div>
  );
}
