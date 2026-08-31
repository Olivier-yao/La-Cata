import React, { useEffect, useRef, useState } from 'react';

// MemoireEclairHost — Mémoire Flash refondu en saisie simultanée : un
// nombre s'affiche quelques secondes sur l'écran principal (tout le
// monde mémorise en même temps, personne ne touche son téléphone),
// pendant la saisie l'écran ne montre que des points (combien de
// chiffres tapés, jamais lesquels), et la révélation compare chiffre
// par chiffre à la fin.

const LONGUEUR = 5;
const DUREE_MEMORISATION = 4;
const DUREE_SAISIE = 20;

function genererNombre(longueur) {
  let s = '';
  for (let i = 0; i < longueur; i++) s += Math.floor(Math.random() * 10);
  return s;
}

export default function MemoireEclairHost({ remote, onTermine }) {
  const [etape, setEtape] = useState('avant'); // avant | memorisation | saisie | resultat
  const [nombre] = useState(() => genererNombre(LONGUEUR));
  const [tempsRestant, setTempsRestant] = useState(DUREE_SAISIE);
  const idRef = useRef(0);
  const intervalRef = useRef(null);
  const timerMemoRef = useRef(null);
  const joueursConnectes = remote.connectes.filter((j) => j.connecte).map((j) => j.nom);

  const demarrer = () => {
    remote.resetActions();
    idRef.current = Date.now();
    setEtape('memorisation');
    remote.envoyerAction({ prim: 'memoire-eclair', etape: 'memorisation', id: idRef.current });
    timerMemoRef.current = setTimeout(() => {
      setEtape('saisie');
      setTempsRestant(DUREE_SAISIE);
      remote.envoyerAction({ prim: 'memoire-eclair', etape: 'saisie', longueur: LONGUEUR, id: idRef.current });
      intervalRef.current = setInterval(() => setTempsRestant((t) => (t <= 1 ? 0 : t - 1)), 1000);
    }, DUREE_MEMORISATION * 1000);
  };

  useEffect(() => () => { clearTimeout(timerMemoRef.current); clearInterval(intervalRef.current); }, []);

  const saisies = {}; // nom -> chaîne en cours
  Object.entries(remote.actionsRecues).forEach(([nom, payload]) => {
    if (payload?.prim === 'memoire-eclair' && payload.id === idRef.current) saisies[nom] = payload.saisie || '';
  });
  const nbFinis = joueursConnectes.filter((n) => (saisies[n] || '').length >= LONGUEUR).length;

  useEffect(() => {
    if (etape === 'saisie' && joueursConnectes.length > 0 && nbFinis >= joueursConnectes.length) {
      setTempsRestant(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nbFinis]);

  useEffect(() => {
    if (etape === 'saisie' && tempsRestant === 0) {
      clearInterval(intervalRef.current);
      setEtape('resultat');
      remote.envoyerAction({ prim: 'memoire-eclair', etape: 'fin', id: idRef.current });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tempsRestant, etape]);

  const resultats = joueursConnectes
    .map((nom) => {
      const s = saisies[nom] || '';
      let correct = 0;
      for (let i = 0; i < LONGUEUR; i++) if (s[i] === nombre[i]) correct++;
      return { nom, saisie: s, correct };
    })
    .sort((a, b) => b.correct - a.correct);

  const valider = () => {
    const scores = {};
    resultats.forEach(({ nom, correct }) => { scores[nom] = correct; });
    onTermine(scores);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, padding: '40px 24px', textAlign: 'center' }}>
      {etape === 'avant' && <button className="btn btn-cyan" style={{ fontSize: 20, padding: '20px 44px' }} onClick={demarrer}>Lancer la mémorisation</button>}

      {etape === 'memorisation' && (
        <>
          <div className="display-title" style={{ fontSize: 14, color: 'var(--text-dim)', letterSpacing: '.16em' }}>RETENEZ CE NOMBRE</div>
          <div className="display-title" style={{ fontSize: 'clamp(48px, 9vw, 84px)', letterSpacing: 6, color: 'var(--text-primary)' }}>{nombre}</div>
          <p style={{ color: 'var(--text-dim)' }}>Personne ne touche son téléphone.</p>
        </>
      )}

      {etape === 'saisie' && (
        <>
          <div className="display-title" style={{ fontSize: 14, color: 'var(--accent-yellow)' }}>TAPEZ CE DONT VOUS VOUS SOUVENEZ · {tempsRestant}s</div>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
            {joueursConnectes.map((nom) => {
              const n = (saisies[nom] || '').length;
              const fini = n >= LONGUEUR;
              return (
                <div key={nom} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '10px 14px', borderRadius: 12, border: `3px solid ${fini ? 'var(--accent-lime)' : 'var(--outline)'}`, background: 'var(--bg-panel-raised)' }}>
                  <span className="display-title" style={{ fontSize: 12, color: fini ? 'var(--accent-lime)' : 'var(--text-muted)' }}>{nom}{fini ? ' · FINI' : ''}</span>
                  <span style={{ fontSize: 18, letterSpacing: 3, color: 'var(--accent-lime)' }}>
                    {'●'.repeat(n)}{'○'.repeat(Math.max(0, LONGUEUR - n))}
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}

      {etape === 'resultat' && (
        <>
          <div className="display-title" style={{ fontSize: 16, color: 'var(--text-dim)' }}>C'ÉTAIT <span style={{ color: 'var(--accent-lime)', letterSpacing: 4 }}>{nombre}</span></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 380 }}>
            {resultats.map(({ nom, saisie, correct }) => (
              <div key={nom} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderRadius: 12, background: 'var(--bg-panel-raised)' }}>
                <span className="display-title" style={{ fontSize: 14, width: 80, textAlign: 'left' }}>{nom}</span>
                <span style={{ display: 'flex', gap: 2, letterSpacing: 1 }}>
                  {Array.from({ length: LONGUEUR }, (_, i) => (
                    <span key={i} className="display-title" style={{ fontSize: 16, color: saisie[i] === undefined ? 'var(--text-dim)' : saisie[i] === nombre[i] ? 'var(--accent-lime)' : 'var(--accent-magenta)' }}>
                      {saisie[i] ?? '·'}
                    </span>
                  ))}
                </span>
                <span className="display-title" style={{ fontSize: 15, color: 'var(--accent-lime)' }}>+{correct}</span>
              </div>
            ))}
          </div>
          <button className="btn btn-lime" style={{ fontSize: 18, padding: '16px 36px' }} onClick={valider}>Valider les points</button>
        </>
      )}
    </div>
  );
}
