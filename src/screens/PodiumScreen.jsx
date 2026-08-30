import React, { useEffect, useRef } from 'react';
import Avatar from '../components/Avatar.jsx';
import { sonSucces } from '../lib/son.js';
import { hapticSucces } from '../lib/haptique.js';

// PodiumScreen — "Fin de soirée" (kit, écran 15) : podium des 3 premiers,
// deux titres bonus tirés parmi les autres joueurs pour que personne ne
// reparte les mains vides.

const TITRES_BONUS = [
  (nom) => `${nom} — n'a jamais tenu 4 secondes sans rire`,
  (nom) => `${nom} — a inventé un accent qui n'existe pas`,
  (nom) => `${nom} — a menti avec un aplomb inquiétant`,
  (nom) => `${nom} — a survécu à Statue Surprise le plus longtemps`,
];

export default function PodiumScreen({ joueurs, scores, manches, onRemettre, onNouvelleSoiree, paris, onOuvrirParis }) {
  const classement = joueurs
    .map((nom, i) => ({ nom, index: i, points: scores[nom] || 0 }))
    .sort((a, b) => b.points - a.points);

  const [premier, deuxieme, troisieme] = classement;

  // Un `ref` (et pas juste un tableau de deps vide) pour survivre au
  // double-appel des effets de StrictMode en développement, qui sinon
  // ferait sonner la fanfare deux fois d'affilée.
  const fanfareJoueeRef = useRef(false);
  useEffect(() => {
    if (!fanfareJoueeRef.current) {
      fanfareJoueeRef.current = true;
      sonSucces();
      hapticSucces();
    }
  }, []);
  const restants = classement.slice(1);
  const titresBonus = restants.slice(-2).map((j, i) => TITRES_BONUS[i % TITRES_BONUS.length](j.nom));

  const marche = (joueur, hauteur, rang, gagnant) => joueur && (
    <div key={joueur.nom} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
      {gagnant && (
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: 'var(--outline)', background: 'var(--accent-yellow)', border: '3px solid var(--outline)', borderRadius: 999, padding: '6px 14px', transform: 'rotate(-3deg)' }}>
          Gagnant·e
        </div>
      )}
      <Avatar
        nom={joueur.nom}
        index={joueur.index}
        taille={gagnant ? 84 : 66}
        contour={gagnant ? 'var(--outline)' : undefined}
      />
      <div className="display-title" style={{ fontSize: gagnant ? 24 : 18, color: gagnant ? 'var(--accent-lime)' : 'var(--text-primary)' }}>
        {joueur.nom}
      </div>
      <div
        style={{
          width: gagnant ? 220 : 180,
          height: hauteur,
          background: gagnant ? 'var(--accent-lime)' : 'var(--bg-panel-raised)',
          border: '4px solid var(--outline)',
          borderRadius: '20px 20px 0 0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4,
        }}
      >
        <div className="display-title" style={{ fontSize: gagnant ? 44 : 32, lineHeight: 1, color: gagnant ? 'var(--outline)' : 'var(--text-muted)' }}>
          {rang}
        </div>
        <div className="display-title" style={{ fontSize: gagnant ? 24 : 18, lineHeight: 1, color: gagnant ? 'var(--outline)' : 'var(--text-primary)' }}>
          {joueur.points} pts
        </div>
      </div>
    </div>
  );

  return (
    <div className="stage" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="stripes-bg" />
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 40px 0', gap: 8 }}>
        <p className="eyebrow" style={{ color: 'var(--accent-yellow)' }}>Fin de la soirée · {manches} manches</p>
        <h1 className="display-title" style={{ fontSize: 'clamp(30px, 5.5vw, 52px)', color: 'var(--accent-lime)', textShadow: '5px 5px 0 var(--accent-magenta)', textAlign: 'center' }}>
          {premier ? `${premier.nom} l'a fait` : 'Soirée terminée'}
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>Championne ou champion incontesté·e de la soirée.</p>

        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 22, marginTop: 'auto', paddingTop: 32, flexWrap: 'wrap', justifyContent: 'center' }}>
          {marche(deuxieme, 96, 2, false)}
          {marche(premier, 134, 1, true)}
          {marche(troisieme, 74, 3, false)}
        </div>
      </div>

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, padding: '18px 34px', background: 'var(--bg-deep)', borderTop: '3px solid var(--outline)', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13, color: 'var(--text-muted)' }}>
          {titresBonus.map((t, i) => (
            <div key={i}>
              <b style={{ color: i === 0 ? 'var(--accent-magenta)' : 'var(--accent-yellow)' }}>Titre bonus</b> · {t}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 14 }}>
          {paris && paris.length > 0 && (
            <button className="btn btn-secondary" onClick={onOuvrirParis}>Vérifier les paris ({paris.length})</button>
          )}
          <button className="btn btn-secondary" onClick={onRemettre}>Mêmes joueurs, on remet ça</button>
          <button className="btn btn-primary" onClick={onNouvelleSoiree}>Nouvelle soirée</button>
        </div>
      </div>
    </div>
  );
}
