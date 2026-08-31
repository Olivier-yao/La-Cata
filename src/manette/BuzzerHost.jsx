import React, { useEffect, useRef, useState } from 'react';

// BuzzerHost — premier qui appuie gagne, avec deux options composables :
//
// `auto` : pas de bouton "Ouvrir les buzzers" — un décompte de 15s se
// lance tout seul au montage, puis les buzzers s'ouvrent après un délai
// supplémentaire aléatoire (0,6 à 2,8s) pour qu'on ne puisse jamais
// anticiper exactement le moment (Le Duel du Buzzer, Vision Floue,
// Question Éclair, Le Compte est Bon Express).
//
// `question`/`options`/`bonneReponse` : après avoir buzzé, le premier
// reçoit en privé un QCM sur son téléphone avec un temps réduit pour
// répondre (`dureeReponse`). S'il se trompe (ou ne répond pas à temps),
// il est exclu et les buzzers se rouvrent pour les autres — la manche ne
// se termine que sur une bonne réponse ou quand tout le monde a été
// exclu (Vision Floue, Question Éclair).

export default function BuzzerHost({
  remote, consigne, enfants, pointsGagnant = 6, boutonLabel = 'Ouvrir les buzzers',
  demanderJugement = false, perdant = false, joueursEligibles, auto = false,
  question, options, bonneReponse, dureeReponse = 8,
  onTermine,
}) {
  const avecQcm = Array.isArray(options) && options.length > 0;
  const [etape, setEtape] = useState('avant'); // avant | compte-a-rebours | suspense | ouvert | repondre | resultat | personne
  const [gagnant, setGagnant] = useState(null);
  const [decompte, setDecompte] = useState(15);
  const [exclus, setExclus] = useState([]);
  const idRef = useRef(0);
  const timersRef = useRef([]);
  const enAttenteReponseRef = useRef(false);

  useEffect(() => () => timersRef.current.forEach(clearTimeout), []);

  const nomsConnectesBase = joueursEligibles || remote.connectes.filter((j) => j.connecte).map((j) => j.nom);
  const nomsConnectes = nomsConnectesBase.filter((n) => !exclus.includes(n));

  const envoyerOuverture = (destinataires) => {
    const payload = { prim: 'buzzer', etape: 'ouvert', consigne, id: idRef.current };
    if (destinataires) {
      remote.envoyerActionPrivee(Object.fromEntries(destinataires.map((n) => [n, payload])));
    } else {
      remote.envoyerAction(payload);
    }
  };

  const demarrer = (destinataires) => {
    remote.resetActions();
    idRef.current = Date.now();
    setGagnant(null);
    setEtape('ouvert');
    envoyerOuverture(destinataires || (joueursEligibles ? nomsConnectes : null));
  };

  const demarrerAuto = () => {
    setEtape('compte-a-rebours');
    setDecompte(15);
    remote.envoyerAction({ prim: 'buzzer', etape: 'attente', consigne });
    let n = 15;
    const interval = setInterval(() => {
      n -= 1;
      setDecompte(n);
      if (n <= 0) {
        clearInterval(interval);
        setEtape('suspense');
        const delai = 600 + Math.random() * 2200;
        timersRef.current.push(setTimeout(() => demarrer(), delai));
      }
    }, 1000);
    timersRef.current.push(interval);
  };

  useEffect(() => {
    if (auto) demarrerAuto();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Détecte le premier buzz une fois les buzzers ouverts.
  useEffect(() => {
    if (etape !== 'ouvert') return;
    const ordreFiltre = remote.ordreActions.filter((n) => nomsConnectes.includes(n));
    if (ordreFiltre.length === 0) return;
    const nom = ordreFiltre[0];
    setGagnant(nom);
    if (avecQcm) {
      enAttenteReponseRef.current = true;
      setEtape('repondre');
      remote.envoyerAction({ prim: 'buzzer', etape: 'resultat', gagnant: nom, id: idRef.current });
      remote.envoyerActionPrivee({ [nom]: { prim: 'buzzer', etape: 'repondre', question, options, duree: dureeReponse, id: idRef.current } });
      timersRef.current.push(setTimeout(() => traiterReponse(nom, null), dureeReponse * 1000 + 400));
    } else {
      setEtape('resultat');
      remote.envoyerAction({ prim: 'buzzer', etape: 'resultat', gagnant: nom, id: idRef.current });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remote.ordreActions, etape]);

  // Détecte la réponse du joueur qui a buzzé, pendant l'étape "repondre".
  useEffect(() => {
    if (etape !== 'repondre' || !gagnant || !enAttenteReponseRef.current) return;
    const payload = remote.actionsRecues[gagnant];
    if (payload?.prim === 'buzzer' && payload.reponse != null && payload.id === idRef.current) {
      traiterReponse(gagnant, payload.reponse);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remote.actionsRecues, etape]);

  const traiterReponse = (nom, reponse) => {
    if (!enAttenteReponseRef.current) return;
    enAttenteReponseRef.current = false;
    if (reponse === bonneReponse) {
      setEtape('resultat');
      return;
    }
    // Mauvaise réponse (ou temps écoulé) : exclu, on rouvre pour les autres.
    const nouveauxExclus = [...exclus, nom];
    setExclus(nouveauxExclus);
    const restants = nomsConnectesBase.filter((n) => !nouveauxExclus.includes(n));
    if (restants.length === 0) {
      setEtape('personne');
      remote.envoyerAction({ prim: 'buzzer', etape: 'resultat', gagnant: null, id: idRef.current });
      return;
    }
    remote.resetActions();
    idRef.current = Date.now();
    setGagnant(null);
    setEtape('ouvert');
    remote.envoyerAction({ prim: 'buzzer', etape: 'ouvert', consigne: `${nom} s'est trompé — à vous !`, id: idRef.current });
    envoyerOuverture(restants);
  };

  const valider = () => {
    if (etape === 'personne') { onTermine({}); return; }
    onTermine({ [gagnant]: pointsGagnant });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, padding: '44px 24px', textAlign: 'center' }}>
      {consigne && <p style={{ color: 'var(--text-muted)', maxWidth: 480, fontSize: 17 }}>{consigne}</p>}
      {enfants}

      {etape === 'avant' && !auto && (
        <button className="btn btn-cyan" style={{ fontSize: 20, padding: '20px 44px' }} onClick={() => demarrer()}>{boutonLabel}</button>
      )}

      {etape === 'compte-a-rebours' && (
        <>
          <div className="display-title" style={{ fontSize: 64, color: 'var(--accent-yellow)' }}>{decompte}</div>
          <p style={{ color: 'var(--text-dim)' }}>Préparez vos téléphones… ça peut ouvrir à tout moment après.</p>
        </>
      )}

      {etape === 'suspense' && (
        <div className="display-title" style={{ fontSize: 40, color: 'var(--accent-magenta)', animation: 'lc-wobble .35s ease-in-out infinite' }}>…</div>
      )}

      {etape === 'ouvert' && (
        <>
          <div className="display-title" style={{ fontSize: 22, color: 'var(--accent-cyan)', animation: 'lc-wobble 1s ease-in-out infinite' }}>BUZZERS OUVERTS…</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
            {nomsConnectes.map((n) => <span key={n} className="tag">{n}</span>)}
          </div>
          {exclus.length > 0 && (
            <p style={{ fontSize: 13, color: 'var(--text-dim)' }}>Déjà éliminé·e cette manche : {exclus.join(', ')}</p>
          )}
        </>
      )}

      {etape === 'repondre' && (
        <div className="display-title" style={{ fontSize: 24, color: 'var(--accent-yellow)' }}>{gagnant} réfléchit sur son téléphone…</div>
      )}

      {etape === 'personne' && (
        <>
          <div className="display-title" style={{ fontSize: 26, color: 'var(--accent-magenta)' }}>Personne n'a trouvé !</div>
          <button className="btn btn-lime" style={{ fontSize: 18, padding: '16px 36px' }} onClick={valider}>Manche suivante</button>
        </>
      )}

      {etape === 'resultat' && perdant && (
        <>
          <div className="display-title" style={{ fontSize: 28, color: 'var(--accent-magenta)' }}>{gagnant} a buzzé en premier… et perd la manche !</div>
          <button
            className="btn btn-lime"
            style={{ fontSize: 18, padding: '16px 36px' }}
            onClick={() => onTermine(Object.fromEntries(nomsConnectesBase.map((n) => [n, n === gagnant ? 0 : pointsGagnant])))}
          >
            Valider
          </button>
        </>
      )}

      {etape === 'resultat' && !perdant && avecQcm && (
        <>
          <div className="display-title" style={{ fontSize: 28, color: 'var(--accent-lime)' }}>{gagnant} a trouvé la bonne réponse !</div>
          <button className="btn btn-lime" style={{ fontSize: 18, padding: '16px 36px' }} onClick={valider}>
            Valider · +{pointsGagnant} pour {gagnant}
          </button>
        </>
      )}

      {etape === 'resultat' && !perdant && !avecQcm && demanderJugement && (
        <>
          <div className="display-title" style={{ fontSize: 28, color: 'var(--accent-lime)' }}>{gagnant} a buzzé en premier !</div>
          <p style={{ color: 'var(--text-muted)' }}>A répondu juste à voix haute ?</p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button className="btn btn-lime" style={{ fontSize: 16, padding: '14px 28px' }} onClick={() => onTermine({ [gagnant]: pointsGagnant })}>
              Bonne réponse · +{pointsGagnant}
            </button>
            <button className="btn btn-secondary" style={{ fontSize: 16, padding: '14px 28px' }} onClick={() => onTermine({ [gagnant]: 0 })}>
              Mauvaise réponse
            </button>
          </div>
        </>
      )}

      {etape === 'resultat' && !perdant && !avecQcm && !demanderJugement && (
        <>
          <div className="display-title" style={{ fontSize: 28, color: 'var(--accent-lime)' }}>{gagnant} a buzzé en premier !</div>
          <button className="btn btn-lime" style={{ fontSize: 18, padding: '16px 36px' }} onClick={() => onTermine({ [gagnant]: pointsGagnant })}>
            Valider · +{pointsGagnant} pour {gagnant}
          </button>
        </>
      )}
    </div>
  );
}
