import React, { useEffect, useRef, useState } from 'react';
import Avatar from '../components/Avatar.jsx';

// CoffreFortHost — Mastermind collectif. Un code à 4 chiffres uniques est
// tiré au sort ; tout le monde tente des combinaisons en même temps et
// autant de fois qu'il veut sur son téléphone. Dès qu'une position est
// trouvée par n'importe qui, elle est verrouillée pour de bon (visible de
// tous, jamais remise en jeu) — le coffre s'ouvre quand les 4 positions
// sont verrouillées, ou le chrono s'arrête avant.

const LONGUEUR = 4;
const DUREE = 45;

function genererCode(longueur) {
  const chiffres = Array.from({ length: 10 }, (_, i) => i).sort(() => Math.random() - 0.5);
  return chiffres.slice(0, longueur);
}

export default function CoffreFortHost({ remote, onTermine }) {
  const [etape, setEtape] = useState('avant'); // avant | ouvert | resultat
  const [code] = useState(() => genererCode(LONGUEUR));
  const [locked, setLocked] = useState(() => Array(LONGUEUR).fill(null));
  const [locksParJoueur, setLocksParJoueur] = useState({});
  const [tempsRestant, setTempsRestant] = useState(DUREE);
  const idRef = useRef(0);
  const intervalRef = useRef(null);
  const traiteRef = useRef(new Set());
  const joueursConnectes = remote.connectes.filter((j) => j.connecte).map((j) => j.nom);

  const demarrer = () => {
    remote.resetActions();
    idRef.current = Date.now();
    traiteRef.current = new Set();
    setLocked(Array(LONGUEUR).fill(null));
    setLocksParJoueur({});
    setTempsRestant(DUREE);
    setEtape('ouvert');
    remote.envoyerAction({ prim: 'coffre-fort', etape: 'ouvert', longueur: LONGUEUR, id: idRef.current });
    intervalRef.current = setInterval(() => setTempsRestant((t) => (t <= 1 ? 0 : t - 1)), 1000);
  };

  useEffect(() => () => clearInterval(intervalRef.current), []);

  // Traite chaque nouvelle tentative reçue (une par joueur au plus dans
  // `actionsRecues`, mais on ne rejoue jamais deux fois la même grâce à
  // `seq`) : verrouille les positions justes, renvoie un indice privé.
  useEffect(() => {
    if (etape !== 'ouvert') return;
    Object.entries(remote.actionsRecues).forEach(([nom, payload]) => {
      if (payload?.prim !== 'coffre-fort' || payload.id !== idRef.current || payload.guess == null) return;
      const cle = `${nom}-${payload.seq}`;
      if (traiteRef.current.has(cle)) return;
      traiteRef.current.add(cle);
      const guess = payload.guess;

      setLocked((prevLocked) => {
        const nouveau = [...prevLocked];
        let nbNouveaux = 0;
        for (let i = 0; i < LONGUEUR; i++) {
          if (nouveau[i] === null && guess[i] === code[i]) { nouveau[i] = code[i]; nbNouveaux++; }
        }
        if (nbNouveaux > 0) {
          setLocksParJoueur((prev) => ({ ...prev, [nom]: (prev[nom] || 0) + nbNouveaux }));
        }
        return nouveau;
      });

      const feedback = guess.map((d, i) => (d === code[i] ? 'exact' : code.includes(d) ? 'present' : 'absent'));
      remote.envoyerActionPrivee({ [nom]: { prim: 'coffre-fort', etape: 'feedback', feedback, seq: payload.seq, id: idRef.current } });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remote.actionsRecues, etape]);

  const toutTrouve = locked.every((d) => d !== null);

  useEffect(() => {
    if (etape === 'ouvert' && toutTrouve) {
      clearInterval(intervalRef.current);
      setEtape('resultat');
      remote.envoyerAction({ prim: 'coffre-fort', etape: 'fin', id: idRef.current });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toutTrouve]);

  useEffect(() => {
    if (etape === 'ouvert' && tempsRestant === 0) {
      clearInterval(intervalRef.current);
      setEtape('resultat');
      remote.envoyerAction({ prim: 'coffre-fort', etape: 'fin', id: idRef.current });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tempsRestant, etape]);

  const contributeurs = Object.entries(locksParJoueur).sort((a, b) => b[1] - a[1]);

  const valider = () => {
    const scores = {};
    contributeurs.forEach(([nom, n]) => { scores[nom] = n * 2; });
    if (toutTrouve) {
      joueursConnectes.forEach((nom) => { scores[nom] = (scores[nom] || 0) + 2; });
    }
    onTermine(scores);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, padding: '40px 24px', textAlign: 'center' }}>
      {etape === 'avant' && (
        <>
          <p style={{ color: 'var(--text-muted)', maxWidth: 460 }}>Un code à 4 chiffres est verrouillé dans le coffre. Chacun tente des combinaisons sur son téléphone, autant de fois qu'il veut — dès qu'un chiffre est trouvé à la bonne place, il reste acquis pour tout le monde.</p>
          <button className="btn btn-cyan" style={{ fontSize: 20, padding: '20px 44px' }} onClick={demarrer}>Ouvrir le coffre ({DUREE}s)</button>
        </>
      )}

      {etape === 'ouvert' && (
        <>
          <div className="display-title" style={{ fontSize: 32, color: 'var(--accent-yellow)' }}>{tempsRestant}s</div>
          <div style={{ display: 'flex', gap: 14 }}>
            {locked.map((d, i) => (
              <div key={i} style={{ width: 64, height: 64, borderRadius: 14, border: `4px solid ${d !== null ? 'var(--accent-lime)' : 'var(--outline)'}`, background: d !== null ? 'var(--accent-lime)' : 'var(--bg-panel-raised)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="display-title" style={{ fontSize: 28, color: d !== null ? 'var(--outline)' : 'var(--text-dim)' }}>{d !== null ? d : '🔒'}</span>
              </div>
            ))}
          </div>
          <p style={{ color: 'var(--text-dim)', fontSize: 13 }}>{locked.filter((d) => d !== null).length} / {LONGUEUR} chiffres verrouillés</p>
          {contributeurs.length > 0 && (
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
              {contributeurs.map(([nom, n]) => (
                <div key={nom} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <Avatar nom={nom} index={joueursConnectes.indexOf(nom)} taille={32} contour="var(--accent-lime)" />
                  <span style={{ fontSize: 10, color: 'var(--accent-lime)' }}>+{n}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {etape === 'resultat' && (
        <>
          <div className="display-title" style={{ fontSize: 24, color: toutTrouve ? 'var(--accent-lime)' : 'var(--accent-magenta)' }}>
            {toutTrouve ? 'COFFRE OUVERT !' : 'TEMPS ÉCOULÉ'}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {code.map((d, i) => (
              <div key={i} style={{ width: 52, height: 52, borderRadius: 12, border: '3px solid var(--accent-lime)', background: 'var(--bg-panel-raised)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="display-title" style={{ fontSize: 22, color: 'var(--accent-lime)' }}>{d}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%', maxWidth: 320 }}>
            {contributeurs.length === 0 && <p style={{ color: 'var(--text-muted)' }}>Personne n'a trouvé un seul chiffre.</p>}
            {contributeurs.map(([nom, n]) => (
              <div key={nom} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 14px', borderRadius: 10, background: 'var(--bg-panel-raised)' }}>
                <span className="display-title" style={{ fontSize: 14 }}>{nom}</span>
                <span className="display-title" style={{ fontSize: 14, color: 'var(--accent-lime)' }}>{n} chiffre{n > 1 ? 's' : ''}</span>
              </div>
            ))}
          </div>
          <button className="btn btn-lime" style={{ fontSize: 18, padding: '16px 36px' }} onClick={valider}>Valider les points</button>
        </>
      )}
    </div>
  );
}
