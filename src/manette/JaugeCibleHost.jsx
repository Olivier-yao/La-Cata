import React, { useEffect, useRef, useState } from 'react';
import Avatar from '../components/Avatar.jsx';

// JaugeCibleHost — Surchauffe : chacun a SA PROPRE jauge (réutilise
// JaugePhone tel quel, maintenir pour charger, ça redescend si on
// relâche), mais l'objectif n'est pas juste de dépasser un nombre fixe —
// il faut rester dans une zone cible qui rétrécit et se déplace toute
// seule, en continu. Un pur "maintenir pour dépasser" ne suffit plus : il
// faut doser en temps réel pour suivre la zone qui bouge.

const DUREE = 18000; // ms
const INTERVALLE_ECHANTILLON = 300; // ms
const LARGEUR_INITIALE = 36;
const LARGEUR_MIN = 14;
const RETRECISSEMENT = 4;
const INTERVALLE_DEPLACEMENT = 2600; // ms

function nouvelleZone(largeur) {
  const centre = 20 + Math.random() * 60;
  return { lo: Math.max(2, centre - largeur / 2), hi: Math.min(98, centre + largeur / 2) };
}

export default function JaugeCibleHost({ remote, joueurs, onTermine }) {
  const [etape, setEtape] = useState('ouvert'); // ouvert | resultat
  const [, forceRender] = useState(0);
  const idRef = useRef(Date.now());
  const debutRef = useRef(0);
  const largeurRef = useRef(LARGEUR_INITIALE);
  const zoneRef = useRef(nouvelleZone(LARGEUR_INITIALE));
  const echantillonsRef = useRef({}); // nom -> { dans, total }
  const indexJoueur = Object.fromEntries(joueurs.map((nom, i) => [nom, i]));
  const nomsConnectes = remote.connectes.filter((j) => j.connecte).map((j) => j.nom);

  useEffect(() => {
    remote.resetActions();
    remote.envoyerAction({ prim: 'jauge', etape: 'demarrer', consigne: 'Reste dans la zone qui bouge — pas juste au maximum !', id: idRef.current });
    debutRef.current = Date.now();
    nomsConnectes.forEach((n) => { echantillonsRef.current[n] = { dans: 0, total: 0 }; });

    // Force un rendu régulier : c'est ce qui déclenche l'échantillonnage
    // (voir plus bas) et rafraîchit la position visuelle de la zone.
    const echantillonInterval = setInterval(() => forceRender((n) => n + 1), INTERVALLE_ECHANTILLON);

    const deplacementInterval = setInterval(() => {
      largeurRef.current = Math.max(LARGEUR_MIN, largeurRef.current - RETRECISSEMENT);
      zoneRef.current = nouvelleZone(largeurRef.current);
    }, INTERVALLE_DEPLACEMENT);

    const fin = setTimeout(() => {
      clearInterval(echantillonInterval);
      clearInterval(deplacementInterval);
      remote.envoyerAction({ prim: 'jauge', etape: 'fin', id: idRef.current });
      setEtape('resultat');
    }, DUREE);

    return () => { clearInterval(echantillonInterval); clearInterval(deplacementInterval); clearTimeout(fin); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const valeurs = {};
  Object.entries(remote.actionsRecues).forEach(([nom, payload]) => {
    if (payload?.prim === 'jauge' && payload.id === idRef.current) valeurs[nom] = payload.valeur || 0;
  });

  // Échantillonne à chaque rendu déclenché par l'intervalle ci-dessus —
  // suffisant vu la fréquence (300ms), pas besoin d'un timer séparé par joueur.
  const dernierEchantillonRef = useRef(0);
  if (etape === 'ouvert') {
    const maintenant = Date.now();
    if (maintenant - dernierEchantillonRef.current >= INTERVALLE_ECHANTILLON - 20) {
      dernierEchantillonRef.current = maintenant;
      nomsConnectes.forEach((nom) => {
        const v = valeurs[nom] || 0;
        const dansZone = v >= zoneRef.current.lo && v <= zoneRef.current.hi;
        const stats = echantillonsRef.current[nom] || { dans: 0, total: 0 };
        stats.total += 1;
        if (dansZone) stats.dans += 1;
        echantillonsRef.current[nom] = stats;
      });
    }
  }

  const valider = () => {
    const scores = {};
    nomsConnectes.forEach((nom) => {
      const stats = echantillonsRef.current[nom] || { dans: 0, total: 1 };
      const ratio = stats.total > 0 ? stats.dans / stats.total : 0;
      scores[nom] = Math.round(ratio * 8);
    });
    onTermine(scores);
  };

  useEffect(() => {
    if (etape === 'resultat') {
      const t = setTimeout(valider, 3000);
      return () => clearTimeout(t);
    }
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [etape]);

  const zone = zoneRef.current;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, padding: '32px 24px', textAlign: 'center' }}>
      <p style={{ color: 'var(--text-muted)', maxWidth: 480 }}>Maintiens le bouton sur ton téléphone pour monter, relâche pour redescendre — reste dans la zone qui bouge et rétrécit, pas juste au max !</p>

      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
        {nomsConnectes.map((nom) => {
          const v = Math.round(valeurs[nom] || 0);
          const dansZone = etape === 'ouvert' && v >= zone.lo && v <= zone.hi;
          return (
            <div key={nom} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <div style={{ position: 'relative', width: 40, height: 170, borderRadius: 999, border: '4px solid var(--outline)', background: 'var(--bg-panel-raised)', overflow: 'hidden' }}>
                {etape === 'ouvert' && (
                  <div style={{ position: 'absolute', left: 0, right: 0, bottom: `${zone.lo}%`, height: `${zone.hi - zone.lo}%`, background: 'rgba(180,255,120,.35)', borderTop: '2px dashed var(--accent-lime)', borderBottom: '2px dashed var(--accent-lime)' }} />
                )}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: `${v}%`, background: dansZone ? 'var(--accent-lime)' : 'var(--accent-magenta)', transition: 'height .15s linear' }} />
              </div>
              <Avatar nom={nom} index={indexJoueur[nom]} taille={32} contour={dansZone ? 'var(--accent-lime)' : undefined} />
              <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>{v}°</span>
            </div>
          );
        })}
      </div>

      {etape === 'resultat' && (
        <>
          <div className="display-title" style={{ fontSize: 20, color: 'var(--accent-lime)' }}>Temps écoulé !</div>
          <p style={{ fontSize: 13, color: 'var(--text-dim)' }}>Points appliqués selon le temps passé dans la zone...</p>
        </>
      )}
    </div>
  );
}
