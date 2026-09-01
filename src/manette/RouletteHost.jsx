import React, { useEffect, useRef, useState } from 'react';

// RouletteHost — la roue tourne en continu sur l'écran principal, chaque
// téléphone a un bouton "STOP" (réutilise BuzzerPhone tel quel) et gagne
// selon la case sur laquelle la roue se trouvait AU MOMENT de son appui.
// Version approfondie : 8 cases variées (pas juste gagnant/rien), vitesse
// et sens qui changent sans prévenir pour qu'on ne puisse pas "timer" la
// roue par habitude, et une case Mystère résolue au hasard au moment du
// tap plutôt qu'un simple gain fixe. L'angle courant vit dans une ref mise
// à jour à chaque frame ; on capture sa valeur dès qu'un nouveau tap
// apparaît dans `actionsRecues`, une seule fois par joueur (`resultatsRef`)
// pour ne pas recalculer un résultat différent à chaque rendu.

const SEGMENTS = ['JACKPOT', 'GAGNANT', 'MALUS', 'RIEN', 'GAGE', 'MYSTÈRE', 'GAGNANT', 'RIEN'];
const COULEURS = {
  JACKPOT: 'var(--accent-yellow)',
  GAGNANT: 'var(--accent-lime)',
  MALUS: 'var(--accent-magenta)',
  RIEN: 'var(--bg-panel-raised)',
  GAGE: 'var(--accent-violet)',
  'MYSTÈRE': 'var(--accent-cyan)',
};
const POINTS_FIXES = { JACKPOT: 8, GAGNANT: 4, MALUS: -3, RIEN: 0 };
const TAILLE_SEGMENT = 360 / SEGMENTS.length;
const GAGES = [
  'Imite un animal pendant 10 secondes',
  'Parle avec un accent pendant les 2 prochaines manches',
  'Raconte ta honte la plus récente en une phrase',
  'Fais 10 pompes ou 20 squats, au choix',
  'Chante le refrain d\'une chanson au hasard',
  'Laisse un autre joueur poster un statut à ta place',
];

function segmentA(angleDeg) {
  const idx = Math.floor((((angleDeg % 360) + 360) % 360) / TAILLE_SEGMENT);
  return SEGMENTS[idx];
}

function resoudre(segment) {
  if (segment === 'MYSTÈRE') {
    const valeur = Math.floor(Math.random() * 10) - 3; // -3..+6
    return { points: valeur, detail: `${valeur >= 0 ? '+' : ''}${valeur}` };
  }
  if (segment === 'GAGE') {
    return { points: 0, detail: GAGES[Math.floor(Math.random() * GAGES.length)] };
  }
  return { points: POINTS_FIXES[segment] ?? 0, detail: null };
}

const DUREE_MAX = 20; // secondes, tout le monde a fini d'appuyer bien avant

export default function RouletteHost({ remote, consigne, onTermine }) {
  const [etape, setEtape] = useState('tourne'); // tourne | resultat
  const [angle, setAngle] = useState(0);
  const angleActuelRef = useRef(0);
  const vitesseRef = useRef(200);
  const dernierTsRef = useRef(0);
  const prochainChangementRef = useRef(0);
  const idRef = useRef(0);
  const rafRef = useRef(null);
  const resultatsRef = useRef({}); // nom -> { segment, points, detail }, figé au premier tap
  const joueursConnectes = remote.connectes.filter((j) => j.connecte).map((j) => j.nom);

  const demarrer = () => {
    remote.resetActions();
    idRef.current = Date.now();
    angleActuelRef.current = 0;
    vitesseRef.current = 160 + Math.random() * 160;
    dernierTsRef.current = 0;
    prochainChangementRef.current = Date.now() + 1000 + Math.random() * 1200;
    resultatsRef.current = {};
    setEtape('tourne');
    remote.envoyerAction({ prim: 'buzzer', etape: 'ouvert', consigne: 'Tape STOP au bon moment !', id: idRef.current });
    const boucle = () => {
      const maintenant = Date.now();
      if (dernierTsRef.current) {
        const dt = (maintenant - dernierTsRef.current) / 1000;
        angleActuelRef.current += vitesseRef.current * dt;
        setAngle(angleActuelRef.current);
      }
      dernierTsRef.current = maintenant;
      if (maintenant >= prochainChangementRef.current) {
        const inverser = Math.random() < 0.4;
        const base = 130 + Math.random() * 280;
        vitesseRef.current = inverser ? -base : base;
        prochainChangementRef.current = maintenant + 800 + Math.random() * 1400;
      }
      rafRef.current = requestAnimationFrame(boucle);
    };
    rafRef.current = requestAnimationFrame(boucle);
  };

  useEffect(() => { demarrer(); return () => cancelAnimationFrame(rafRef.current); }, []);

  Object.keys(remote.actionsRecues).forEach((nom) => {
    if (resultatsRef.current[nom]) return;
    const payload = remote.actionsRecues[nom];
    if (payload?.t == null) return;
    const segment = segmentA(angleActuelRef.current);
    resultatsRef.current[nom] = { segment, ...resoudre(segment) };
  });
  const resultats = resultatsRef.current;
  const nbResultats = Object.keys(resultats).length;

  useEffect(() => {
    if (etape !== 'tourne') return undefined;
    if (joueursConnectes.length > 0 && nbResultats >= joueursConnectes.length) {
      cancelAnimationFrame(rafRef.current);
      setEtape('resultat');
      return undefined;
    }
    const t = setTimeout(() => { cancelAnimationFrame(rafRef.current); setEtape('resultat'); }, DUREE_MAX * 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [etape, nbResultats]);

  const terminer = () => {
    const scores = {};
    Object.entries(resultats).forEach(([nom, r]) => { scores[nom] = r.points; });
    onTermine(scores);
  };

  useEffect(() => {
    if (etape === 'resultat') {
      const t = setTimeout(terminer, 3000);
      return () => clearTimeout(t);
    }
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [etape]);

  const gradient = `conic-gradient(${SEGMENTS.map((s, i) => `${COULEURS[s]} ${i * TAILLE_SEGMENT}deg ${(i + 1) * TAILLE_SEGMENT}deg`).join(', ')})`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, padding: '40px 24px', textAlign: 'center' }}>
      {consigne && <p style={{ color: 'var(--text-muted)', maxWidth: 480 }}>{consigne}</p>}

      <div style={{ position: 'relative', width: 220, height: 220 }}>
        <div style={{ width: '100%', height: '100%', borderRadius: 999, transform: `rotate(${angle}deg)`, background: gradient, border: '4px solid var(--outline)' }} />
        <div style={{ position: 'absolute', top: -6, left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '10px solid transparent', borderRight: '10px solid transparent', borderTop: '16px solid var(--accent-magenta)' }} />
      </div>

      {etape === 'tourne' && (
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
          {Object.keys(resultats).map((n) => <span key={n} className="tag">{n} · {resultats[n].segment}</span>)}
        </div>
      )}

      {etape === 'resultat' && (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 420 }}>
            {Object.entries(resultats).sort((a, b) => b[1].points - a[1].points).map(([nom, r]) => (
              <div key={nom} style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '10px 16px', borderRadius: 12, background: r.points > 0 ? 'var(--accent-lime)' : r.points < 0 ? 'var(--accent-magenta)' : 'var(--bg-panel-raised)', color: r.points !== 0 ? 'var(--outline)' : 'var(--text-primary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="display-title" style={{ fontSize: 16 }}>{nom}</span>
                  <span className="display-title" style={{ fontSize: 16 }}>{r.segment} · {r.points >= 0 ? `+${r.points}` : r.points}</span>
                </div>
                {r.detail && r.segment === 'GAGE' && <span style={{ fontSize: 12, opacity: 0.85 }}>Gage : {r.detail}</span>}
              </div>
            ))}
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-dim)' }}>Points appliqués dans un instant...</p>
        </>
      )}
    </div>
  );
}
