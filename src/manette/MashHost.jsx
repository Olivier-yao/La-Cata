import React, { useEffect, useRef, useState } from 'react';
import Avatar from '../components/Avatar.jsx';

// MashHost — jauge/appuis répétés. `mode: 'equipes'` (Tir à la Corde) sépare
// les téléphones en deux camps qui s'affrontent ; `mode: 'ffa'` (Le Trône,
// Marathon des Doigts, Surchauffe) classe chacun individuellement. En mode
// coopératif (`cooperatif: true`), on compare la somme des appuis à un
// objectif au lieu de départager les joueurs entre eux.
//
// `autoDemarrer` (secondes) : démarre tout seul après un compte à rebours,
// sans bouton "Lancer". Les points sont toujours appliqués tout seuls
// quelques secondes après le résultat, sans bouton "Valider". `visuel`
// ('corde' | 'trone') : remplace l'affichage générique par une mise en
// scène dédiée pendant la partie ET le résultat.

export default function MashHost({
  remote, mode = 'ffa', equipes, spectateurs = [], cooperatif = false, objectif = 80,
  duree = 8, consigne, autoDemarrer = null, visuel, onTermine,
}) {
  const [etape, setEtape] = useState(autoDemarrer ? 'compte-a-rebours' : 'avant');
  const [avantCompte, setAvantCompte] = useState(autoDemarrer || 0);
  const [tempsRestant, setTempsRestant] = useState(duree);
  const intervalRef = useRef(null);
  const idRef = useRef(0);

  const demarrer = () => {
    remote.resetActions();
    idRef.current = Date.now();
    setTempsRestant(duree);
    setEtape('ouvert');
    if (mode === 'equipes' && equipes) {
      const parJoueur = {};
      (equipes.A || []).forEach((nom) => { parJoueur[nom] = { prim: 'mash', etape: 'demarrer', equipe: 'A', id: idRef.current }; });
      (equipes.B || []).forEach((nom) => { parJoueur[nom] = { prim: 'mash', etape: 'demarrer', equipe: 'B', id: idRef.current }; });
      spectateurs.forEach((nom) => { parJoueur[nom] = { prim: 'mash', etape: 'spectateur', id: idRef.current }; });
      remote.envoyerActionPrivee(parJoueur);
    } else {
      remote.envoyerAction({ prim: 'mash', etape: 'demarrer', id: idRef.current });
    }
    intervalRef.current = setInterval(() => {
      setTempsRestant((t) => (t <= 1 ? 0 : t - 1));
    }, 1000);
  };

  useEffect(() => {
    if (!autoDemarrer) return undefined;
    if (avantCompte <= 0) { demarrer(); return undefined; }
    const t = setTimeout(() => setAvantCompte((n) => n - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [avantCompte]);

  useEffect(() => {
    if (etape === 'ouvert' && tempsRestant === 0) {
      clearInterval(intervalRef.current);
      setEtape('resultat');
      remote.envoyerAction({ prim: 'mash', etape: 'fin', id: idRef.current });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tempsRestant, etape]);

  useEffect(() => () => clearInterval(intervalRef.current), []);

  const totaux = {};
  Object.entries(remote.actionsRecues).forEach(([nom, payload]) => {
    if (payload?.prim === 'mash' && payload.id === idRef.current) totaux[nom] = payload.total || 0;
  });

  let contenuResultat = null;
  const scoresAAppliquer = {};

  if (mode === 'equipes' && equipes) {
    const totalA = (equipes.A || []).reduce((s, n) => s + (totaux[n] || 0), 0);
    const totalB = (equipes.B || []).reduce((s, n) => s + (totaux[n] || 0), 0);
    const total = totalA + totalB;
    const pourcentA = total === 0 ? 50 : Math.round((totalA / total) * 100);
    const texteVerdict = totalA === totalB ? 'Égalité parfaite !' : totalA > totalB ? 'Équipe magenta gagne !' : 'Équipe cyan gagne !';

    contenuResultat = visuel === 'corde' ? (
      <CordeVisuel pourcentA={pourcentA} equipes={equipes} verdict={texteVerdict} totalA={totalA} totalB={totalB} />
    ) : (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', width: '100%', maxWidth: 480 }}>
        <div style={{ display: 'flex', width: '100%', height: 34, borderRadius: 999, overflow: 'hidden', border: '3px solid var(--outline)' }}>
          <div style={{ width: `${pourcentA}%`, background: 'var(--accent-magenta)', transition: 'width .3s' }} />
          <div style={{ width: `${100 - pourcentA}%`, background: 'var(--accent-cyan)', transition: 'width .3s' }} />
        </div>
        <div className="display-title" style={{ fontSize: 22 }}>{texteVerdict}</div>
        <div style={{ fontSize: 13, color: 'var(--text-dim)' }}>{totalA} contre {totalB} appuis</div>
      </div>
    );
    (equipes.A || []).forEach((n) => { scoresAAppliquer[n] = totalA >= totalB ? 6 : 2; });
    (equipes.B || []).forEach((n) => { scoresAAppliquer[n] = totalB >= totalA ? 6 : 2; });
    spectateurs.forEach((n) => { scoresAAppliquer[n] = 2; });
  } else if (cooperatif) {
    const totalGroupe = Object.values(totaux).reduce((s, n) => s + n, 0);
    const reussi = totalGroupe >= objectif;
    contenuResultat = (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}>
        <div className="display-title" style={{ fontSize: 40, color: reussi ? 'var(--accent-lime)' : 'var(--accent-magenta)' }}>{totalGroupe} / {objectif}</div>
        <div className="display-title" style={{ fontSize: 20 }}>{reussi ? 'Objectif atteint, bravo à tous !' : 'Objectif manqué de peu...'}</div>
      </div>
    );
    Object.keys(totaux).forEach((n) => { scoresAAppliquer[n] = reussi ? 5 : 1; });
  } else {
    const classement = Object.entries(totaux).sort((a, b) => b[1] - a[1]);
    const max = classement[0]?.[1] || 1;
    contenuResultat = visuel === 'trone' ? (
      <TronesVisuel classement={classement} max={max} />
    ) : (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 420 }}>
        {classement.map(([nom, total], i) => (
          <div key={nom} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 16px', borderRadius: 12, background: i === 0 ? 'var(--accent-lime)' : 'var(--bg-panel-raised)', color: i === 0 ? 'var(--outline)' : 'var(--text-primary)' }}>
            <span className="display-title" style={{ fontSize: 16 }}>{i + 1}. {nom}</span>
            <span className="display-title" style={{ fontSize: 16 }}>{total}</span>
          </div>
        ))}
      </div>
    );
    classement.forEach(([nom, total]) => {
      if (total === 0) { scoresAAppliquer[nom] = 0; return; }
      const rangDeTotal = classement.findIndex(([, t]) => t === total);
      scoresAAppliquer[nom] = rangDeTotal === 0 ? 6 : rangDeTotal === 1 ? 3 : 1;
    });
  }

  useEffect(() => {
    if (etape === 'resultat') {
      const t = setTimeout(() => onTermine(scoresAAppliquer), 3000);
      return () => clearTimeout(t);
    }
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [etape]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, padding: '44px 24px', textAlign: 'center' }}>
      {consigne && <p style={{ color: 'var(--text-muted)', maxWidth: 480 }}>{consigne}</p>}
      {etape === 'avant' && <button className="btn btn-cyan" style={{ fontSize: 20, padding: '20px 44px' }} onClick={demarrer}>Lancer ({duree}s)</button>}
      {etape === 'compte-a-rebours' && (
        <div className="display-title" style={{ fontSize: 64, color: 'var(--accent-yellow)' }}>{avantCompte > 0 ? avantCompte : 'GO !'}</div>
      )}
      {etape === 'ouvert' && (
        <>
          <div className="display-title" style={{ fontSize: 48, color: 'var(--accent-yellow)' }}>{tempsRestant}</div>
          {visuel === 'corde' && equipes ? (
            <CordeVisuel
              pourcentA={(() => {
                const totalA = (equipes.A || []).reduce((s, n) => s + (totaux[n] || 0), 0);
                const totalB = (equipes.B || []).reduce((s, n) => s + (totaux[n] || 0), 0);
                const total = totalA + totalB;
                return total === 0 ? 50 : Math.round((totalA / total) * 100);
              })()}
              equipes={equipes}
            />
          ) : visuel === 'trone' ? (
            <TronesVisuel classement={Object.entries(totaux).sort((a, b) => b[1] - a[1])} max={Math.max(1, ...Object.values(totaux), 1)} enDirect />
          ) : (
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
              {Object.entries(totaux).map(([nom, total]) => <span key={nom} className="tag">{nom} · {total}</span>)}
            </div>
          )}
        </>
      )}
      {etape === 'resultat' && (
        <>
          {contenuResultat}
          <p style={{ fontSize: 13, color: 'var(--text-dim)' }}>Points appliqués dans un instant...</p>
        </>
      )}
    </div>
  );
}

function CordeVisuel({ pourcentA, equipes, verdict, totalA, totalB }) {
  const clamp = Math.min(88, Math.max(12, pourcentA));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center', width: '100%', maxWidth: 520 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <span className="display-title" style={{ fontSize: 14, color: 'var(--accent-magenta)' }}>{(equipes.A || []).join(' · ') || '—'}</span>
        <span className="display-title" style={{ fontSize: 14, color: 'var(--accent-cyan)' }}>{(equipes.B || []).join(' · ') || '—'}</span>
      </div>
      <div style={{ position: 'relative', width: '100%', height: 56, borderRadius: 999, background: 'repeating-linear-gradient(90deg, #C9A15A 0 18px, #B8925084 18px 22px)', border: '4px solid var(--outline)', boxShadow: 'var(--shadow-hard-sm)', overflow: 'visible' }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: 999, background: 'linear-gradient(90deg, rgba(255,77,141,.35), transparent 45%, transparent 55%, rgba(77,232,255,.35))' }} />
        <div
          style={{
            position: 'absolute', top: '50%', left: `${clamp}%`, transform: 'translate(-50%, -50%)',
            width: 44, height: 44, borderRadius: 999, background: 'var(--accent-yellow)', border: '4px solid var(--outline)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, transition: 'left .4s ease',
            animation: 'lc-wobble 0.6s ease-in-out infinite',
          }}
        >
          🚩
        </div>
      </div>
      {verdict && <div className="display-title" style={{ fontSize: 22 }}>{verdict}</div>}
      {verdict && <div style={{ fontSize: 13, color: 'var(--text-dim)' }}>{totalA} contre {totalB} appuis</div>}
    </div>
  );
}

function TronesVisuel({ classement, max, enDirect = false }) {
  return (
    <div style={{ display: 'flex', gap: 22, alignItems: 'flex-end', justifyContent: 'center', flexWrap: 'wrap', minHeight: 190, width: '100%' }}>
      {classement.map(([nom, total], i) => {
        const ratio = Math.min(1, total / max);
        const hauteur = 30 + ratio * 130;
        const enTete = i === 0 && total > 0;
        return (
          <div key={nom} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            {enTete && !enDirect && <span style={{ fontSize: 24 }}>👑</span>}
            {enTete && enDirect && <span style={{ fontSize: 20, animation: 'lc-float 0.5s ease-in-out infinite alternate' }}>👑</span>}
            <Avatar nom={nom} taille={38} contour={enTete ? 'var(--accent-yellow)' : undefined} />
            <div
              style={{
                width: 54, height: hauteur, borderRadius: '10px 10px 4px 4px',
                background: enTete ? 'var(--accent-yellow)' : 'var(--bg-panel-raised)',
                border: '3px solid var(--outline)', transition: 'height .35s ease',
                display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 6,
              }}
            >
              <span className="display-title" style={{ fontSize: 13, color: enTete ? 'var(--outline)' : 'var(--text-primary)' }}>{total}</span>
            </div>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{nom}</span>
          </div>
        );
      })}
    </div>
  );
}
