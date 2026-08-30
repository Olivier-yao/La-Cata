import React, { useEffect, useRef, useState } from 'react';

// ScrollingText — défile un texte verticalement dans une bande de focus,
// avec vitesse croissante optionnelle (utile pour Virelangue Express).
//
// Props :
// - texte: string à afficher
// - vitesseInitiale: px/frame de base
// - accelere: si true, la vitesse augmente progressivement pendant la lecture
// - onTermine: callback quand le texte a fini de défiler
// - onProgress(pct 0..1) / onVitesse(multiplicateur): rappels par frame,
//   utiles pour afficher une barre de progression ou une jauge de vitesse
//   au niveau de l'écran parent (voir VirelangueExpress).
// - couleurBande: couleur de la bande de focus (par défaut magenta)
// - sombre: variante fond quasi noir + bande magenta pulsée (Sans Rire)
// - reglageVitesse: multiplicateur choisi par la table ('lente' 0.7,
//   'normale' 1, 'rapide' 1.35) — voir GameSelectScreen.

export const VITESSES = { lente: 0.7, normale: 1, rapide: 1.35 };

export default function ScrollingText({
  texte,
  vitesseInitiale = 1.2,
  accelere = false,
  onTermine,
  onProgress,
  onVitesse,
  couleurBande = 'var(--accent-magenta)',
  sombre = false,
  reglageVitesse = 'normale',
  hauteur = 420,
  largeurMax = 960,
  tailleTexte = 30,
}) {
  const contenuRef = useRef(null);
  const pisteRef = useRef(null);
  const [position, setPosition] = useState(0);
  const [enCours, setEnCours] = useState(false);
  const vitesseRef = useRef(vitesseInitiale);
  const frameRef = useRef(null);
  const multiplicateur = VITESSES[reglageVitesse] ?? 1;

  useEffect(() => {
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  const demarrer = () => {
    setEnCours(true);
    const hauteurContenu = contenuRef.current.offsetHeight;
    const hauteurPiste = pisteRef.current.offsetHeight;
    // Le texte part entièrement caché sous la piste (top:100%, voir le
    // style ci-dessous) et doit entièrement en ressortir par le haut :
    // il doit donc parcourir sa propre hauteur PLUS celle de la piste.
    // Cette distance reste toujours positive (contrairement à l'ancien
    // calcul hauteurContenu - hauteurPiste/2), et la hauteur de piste à
    // elle seule donne un temps de lecture minimum correct même pour un
    // texte très court.
    const distance = hauteurPiste + hauteurContenu;
    const vitesseBase = vitesseInitiale * multiplicateur;
    vitesseRef.current = vitesseBase;
    let pos = 0;
    let dernierTemps = performance.now();

    const boucle = (temps) => {
      const delta = temps - dernierTemps;
      dernierTemps = temps;
      if (accelere) {
        // L'accélération plafonne à ×2 la vitesse de départ : au-delà, le
        // texte devient illisible pour une personne normale.
        vitesseRef.current = Math.min(vitesseBase * 2, vitesseRef.current + 0.00035 * multiplicateur * delta);
      }
      pos += vitesseRef.current * (delta / 16.6);
      setPosition(pos);
      onProgress && onProgress(Math.min(1, pos / distance));
      onVitesse && onVitesse(vitesseRef.current / vitesseBase);
      if (pos < distance) {
        frameRef.current = requestAnimationFrame(boucle);
      } else {
        setEnCours(false);
        onTermine && onTermine();
      }
    };
    frameRef.current = requestAnimationFrame(boucle);
  };

  return (
    <div className="scrolling-text-wrapper">
      <div
        className="scrolling-text-piste"
        ref={pisteRef}
        style={{ background: sombre ? 'var(--outline)' : 'var(--bg-deep)', height: hauteur, maxWidth: largeurMax }}
      >
        <div
          className="scrolling-text-contenu"
          ref={contenuRef}
          style={{ transform: `translateY(${-position}px)`, opacity: sombre ? 0.4 : 1, fontSize: tailleTexte }}
        >
          {texte}
        </div>
        <div
          className="scrolling-text-ligne"
          style={{ background: couleurBande, boxShadow: `0 0 14px ${couleurBande}` }}
        >
          <span className="scrolling-text-lisici" style={{ color: couleurBande }}>Lis ici</span>
        </div>
        <div className="scrolling-text-voile scrolling-text-voile-haut" style={{ background: `linear-gradient(${sombre ? 'var(--outline)' : 'var(--bg-deep)'}, transparent)` }} />
        <div className="scrolling-text-voile scrolling-text-voile-bas" style={{ background: `linear-gradient(transparent, ${sombre ? 'var(--outline)' : 'var(--bg-deep)'})` }} />
      </div>

      {!enCours && (
        <button className="btn btn-primary" onClick={demarrer} style={{ marginTop: 24 }}>
          Lancer le défilement
        </button>
      )}

      <style>{`
        .scrolling-text-wrapper { display: flex; flex-direction: column; align-items: center; width: 100%; }
        .scrolling-text-piste {
          position: relative;
          width: 100%;
          border-radius: var(--radius-lg);
          overflow: hidden;
        }
        .scrolling-text-contenu {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          padding: 0 48px;
          font-family: var(--font-body);
          font-weight: 700;
          line-height: 1.5;
          text-align: center;
          color: var(--text-primary);
        }
        .scrolling-text-ligne {
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 4px;
          transform: translateY(-50%);
          pointer-events: none;
        }
        .scrolling-text-lisici {
          position: absolute;
          left: 18px;
          top: -34px;
          font-family: var(--font-display);
          font-size: 18px;
          letter-spacing: .16em;
          text-transform: uppercase;
        }
        .scrolling-text-voile {
          position: absolute;
          left: 0;
          right: 0;
          height: 45%;
          pointer-events: none;
        }
        .scrolling-text-voile-haut { top: 0; }
        .scrolling-text-voile-bas { bottom: 0; }
      `}</style>
    </div>
  );
}
