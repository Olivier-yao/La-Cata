import React, { useEffect, useRef, useState } from 'react';
import Avatar from '../components/Avatar.jsx';

// BraqueMoiHost — chacun fixe en secret son propre code à 6 chiffres, puis
// choisit qui il veut braquer parmi les autres. Une fois tout le monde
// prêt, chacun tente librement des combinaisons contre le code de SA
// cible (même mécanique de tentative que Coffre Fort : indice Mastermind
// privé, chiffres jamais révélés en direct). Pas de chrono — le premier
// qui craque le code de sa cible gagne le braquage et la manche s'arrête
// net pour tout le monde.

const LONGUEUR = 6;

export default function BraqueMoiHost({ remote, onTermine }) {
  const [etape, setEtape] = useState('code'); // code | cible | ouvert | resultat
  const [codes, setCodes] = useState({}); // nom -> [chiffres]
  const [cibles, setCibles] = useState({}); // nom -> nomCible
  const [meilleures, setMeilleures] = useState({}); // nom -> { guess, exact }
  const idRef = useRef(Date.now());
  const traiteCodeRef = useRef(new Set());
  const traiteCibleRef = useRef(new Set());
  const traiteGuessRef = useRef(new Set());
  const gagnantRef = useRef(null);
  const joueursConnectes = remote.connectes.filter((j) => j.connecte).map((j) => j.nom);

  useEffect(() => {
    remote.resetActions();
    remote.envoyerAction({ prim: 'braque-moi', etape: 'code', longueur: LONGUEUR, id: idRef.current });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Étape 1 : récupère le code secret de chacun.
  useEffect(() => {
    if (etape !== 'code') return;
    Object.entries(remote.actionsRecues).forEach(([nom, payload]) => {
      if (payload?.prim !== 'braque-moi' || payload.action !== 'code' || payload.id !== idRef.current) return;
      if (traiteCodeRef.current.has(nom)) return;
      traiteCodeRef.current.add(nom);
      setCodes((prev) => ({ ...prev, [nom]: payload.code }));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remote.actionsRecues, etape]);

  const tousLesCodesRecus = joueursConnectes.length > 0 && joueursConnectes.every((n) => codes[n] != null);

  useEffect(() => {
    if (etape === 'code' && tousLesCodesRecus) {
      setEtape('cible');
      const autresPour = Object.fromEntries(joueursConnectes.map((nom) => [nom, joueursConnectes.filter((n) => n !== nom)]));
      remote.envoyerActionPrivee(Object.fromEntries(joueursConnectes.map((nom) => [nom, { prim: 'braque-moi', etape: 'cible', joueurs: autresPour[nom], id: idRef.current }])));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tousLesCodesRecus]);

  // Étape 2 : récupère la cible choisie par chacun.
  useEffect(() => {
    if (etape !== 'cible') return;
    Object.entries(remote.actionsRecues).forEach(([nom, payload]) => {
      if (payload?.prim !== 'braque-moi' || payload.action !== 'cible' || payload.id !== idRef.current) return;
      if (traiteCibleRef.current.has(nom)) return;
      traiteCibleRef.current.add(nom);
      setCibles((prev) => ({ ...prev, [nom]: payload.cible }));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remote.actionsRecues, etape]);

  const toutesLesCiblesRecues = joueursConnectes.length > 0 && joueursConnectes.every((n) => cibles[n] != null);

  useEffect(() => {
    if (etape === 'cible' && toutesLesCiblesRecues) {
      setEtape('ouvert');
      remote.envoyerAction({ prim: 'braque-moi', etape: 'ouvert', longueur: LONGUEUR, id: idRef.current });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toutesLesCiblesRecues]);

  // Étape 3 : traite chaque tentative contre le code de la cible choisie.
  useEffect(() => {
    if (etape !== 'ouvert') return;
    Object.entries(remote.actionsRecues).forEach(([nom, payload]) => {
      if (payload?.prim !== 'braque-moi' || payload.action !== 'guess' || payload.id !== idRef.current) return;
      const cle = `${nom}-${payload.seq}`;
      if (traiteGuessRef.current.has(cle)) return;
      traiteGuessRef.current.add(cle);

      const cibleCode = codes[cibles[nom]];
      if (!cibleCode) return;
      const guess = payload.guess;
      const exact = guess.filter((d, i) => d === cibleCode[i]).length;
      const feedback = guess.map((d, i) => (d === cibleCode[i] ? 'exact' : cibleCode.includes(d) ? 'present' : 'absent'));
      remote.envoyerActionPrivee({ [nom]: { prim: 'braque-moi', etape: 'feedback', feedback, seq: payload.seq, id: idRef.current } });

      setMeilleures((prev) => {
        const actuel = prev[nom];
        if (actuel && actuel.exact >= exact) return prev;
        return { ...prev, [nom]: { guess, exact } };
      });

      if (exact === LONGUEUR && !gagnantRef.current) {
        gagnantRef.current = nom;
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remote.actionsRecues, etape, codes, cibles]);

  useEffect(() => {
    if (etape === 'ouvert' && gagnantRef.current) {
      setEtape('resultat');
      remote.envoyerAction({ prim: 'braque-moi', etape: 'fin', id: idRef.current });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meilleures]);

  const valider = () => {
    const scores = {};
    joueursConnectes.forEach((nom) => {
      if (nom === gagnantRef.current) { scores[nom] = 8; return; }
      scores[nom] = meilleures[nom]?.exact || 0;
    });
    onTermine(scores);
  };

  useEffect(() => {
    if (etape === 'resultat') {
      const t = setTimeout(valider, 4000);
      return () => clearTimeout(t);
    }
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [etape]);

  const indexJoueur = Object.fromEntries(joueursConnectes.map((nom, i) => [nom, i]));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, padding: '36px 24px', textAlign: 'center' }}>
      {etape === 'code' && (
        <>
          <p style={{ color: 'var(--text-dim)', fontSize: 13, maxWidth: 420 }}>Chacun fixe en secret son propre code à {LONGUEUR} chiffres sur son téléphone.</p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            {joueursConnectes.map((nom) => (
              <div key={nom} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, opacity: codes[nom] != null ? 1 : 0.4 }}>
                <Avatar nom={nom} index={indexJoueur[nom]} taille={38} contour={codes[nom] != null ? 'var(--accent-lime)' : undefined} />
                <span style={{ fontSize: 10, color: codes[nom] != null ? 'var(--accent-lime)' : 'var(--text-dim)' }}>{codes[nom] != null ? 'prêt' : 'réfléchit'}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {etape === 'cible' && (
        <>
          <p style={{ color: 'var(--text-dim)', fontSize: 13, maxWidth: 420 }}>Chacun choisit en secret qui il veut braquer.</p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            {joueursConnectes.map((nom) => (
              <div key={nom} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, opacity: cibles[nom] != null ? 1 : 0.4 }}>
                <Avatar nom={nom} index={indexJoueur[nom]} taille={38} contour={cibles[nom] != null ? 'var(--accent-lime)' : undefined} />
                <span style={{ fontSize: 10, color: cibles[nom] != null ? 'var(--accent-lime)' : 'var(--text-dim)' }}>{cibles[nom] != null ? 'prêt' : 'réfléchit'}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {etape === 'ouvert' && (
        <>
          <p style={{ color: 'var(--text-dim)', fontSize: 13, maxWidth: 460 }}>Pas de chrono, premier qui craque le code de sa cible gagne le braquage. Les vrais chiffres ne s'affichent qu'à la toute fin.</p>
          <div style={{ display: 'grid', gridTemplateColumns: joueursConnectes.length > 2 ? 'repeat(2, 1fr)' : '1fr', gap: 14, width: '100%', maxWidth: 560 }}>
            {joueursConnectes.map((nom) => {
              const meilleure = meilleures[nom];
              const cible = cibles[nom];
              const cibleCode = codes[cible];
              return (
                <div key={nom} style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 14, borderRadius: 16, background: 'var(--bg-panel-raised)', border: '3px solid var(--outline)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Avatar nom={nom} index={indexJoueur[nom]} taille={30} />
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                      <span className="display-title" style={{ fontSize: 13 }}>{nom}</span>
                      <span style={{ fontSize: 10, color: 'var(--text-dim)' }}>braque {cible}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 5, justifyContent: 'center' }}>
                    {Array.from({ length: LONGUEUR }).map((_, i) => {
                      const dansPosition = meilleure?.guess?.[i] === cibleCode?.[i];
                      return <span key={i} style={{ width: 12, height: 12, borderRadius: 999, background: dansPosition ? 'var(--accent-lime)' : 'var(--bg-deep)', border: '2px solid var(--outline)' }} />;
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {etape === 'resultat' && (
        <>
          <div className="display-title" style={{ fontSize: 24, color: 'var(--accent-lime)' }}>
            {gagnantRef.current} A CRAQUÉ LE CODE DE {cibles[gagnantRef.current]} !
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 420 }}>
            {joueursConnectes
              .slice()
              .sort((a, b) => (b === gagnantRef.current ? 1 : 0) - (a === gagnantRef.current ? 1 : 0) || (meilleures[b]?.exact || 0) - (meilleures[a]?.exact || 0))
              .map((nom, i) => {
                const cible = cibles[nom];
                const cibleCode = codes[cible] || [];
                const meilleure = meilleures[nom]?.guess || [];
                const gagne = nom === gagnantRef.current;
                return (
                  <div key={nom} style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '10px 16px', borderRadius: 12, background: gagne ? 'var(--accent-lime)' : 'var(--bg-panel-raised)', color: gagne ? 'var(--outline)' : 'var(--text-primary)', animation: `lc-cardin 320ms ease-out ${i * 200}ms both` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span className="display-title" style={{ fontSize: 14 }}>{nom} → {cible}</span>
                      <span className="display-title" style={{ fontSize: 14 }}>+{gagne ? 8 : (meilleures[nom]?.exact || 0)}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {cibleCode.map((d, j) => (
                        <span key={j} className="display-title" style={{ fontSize: 15, color: meilleure[j] === d ? (gagne ? 'var(--outline)' : 'var(--accent-lime)') : 'var(--accent-magenta)' }}>{d}</span>
                      ))}
                    </div>
                  </div>
                );
              })}
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-dim)' }}>Points appliqués dans un instant...</p>
        </>
      )}
    </div>
  );
}
