import React, { useEffect, useRef } from 'react';
import Avatar from '../components/Avatar.jsx';

// ScoreboardScreen — "Tableau des scores", plein écran entre deux manches
// (kit, écran 14). Le meneur ressort en citron-vert plein avec ombre
// magenta ; les autres lignes restent en surface sombre.
//
// Quand la manette est active, chaque téléphone reçoit un bouton "JE SUIS
// PRÊT·E" (PretPhone) : l'écran principal compte qui a déjà répondu et
// fait pulser "Manche suivante" dès que la majorité est là — jamais un
// verrou, l'hôte peut lancer la manche à tout moment, y compris avant.

export default function ScoreboardScreen({ joueurs, scores, manche, totalManches, onMancheSuivante, onTerminer, modeAuto, onQuitterAuto, resultat, remote }) {
  const idRef = useRef(Date.now());

  useEffect(() => {
    if (!remote?.actif) return;
    idRef.current = Date.now();
    remote.resetActions();
    remote.envoyerAction({ prim: 'pret', id: idRef.current });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const classement = joueurs
    .map((nom, i) => ({ nom, index: i, points: scores[nom] || 0 }))
    .sort((a, b) => b.points - a.points);
  const max = Math.max(1, classement[0]?.points || 1);

  const nomsConnectes = remote?.actif ? remote.connectes.filter((j) => j.connecte).map((j) => j.nom) : [];
  const nomsPrets = nomsConnectes.filter((nom) => {
    const p = remote.actionsRecues[nom];
    return p?.prim === 'pret' && p.id === idRef.current;
  });
  const majoriteAtteinte = nomsConnectes.length > 0 && nomsPrets.length >= Math.ceil(nomsConnectes.length / 2);

  return (
    <div className="stage" style={{ padding: '40px 44px', display: 'flex', flexDirection: 'column', gap: 26 }}>
      <div className="stripes-bg" />
      <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <p className="eyebrow" style={{ color: 'var(--accent-yellow)' }}>Entre deux manches · {manche} / {totalManches}</p>
          <h1 className="display-title" style={{ fontSize: 'clamp(30px, 5vw, 48px)', margin: '6px 0 0' }}>Tableau des scores</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--bg-panel-raised)', border: '3px solid var(--outline)', borderRadius: 999, padding: '10px 20px' }}>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>On choisit la prochaine victime…</span>
          <span style={{ width: 22, height: 22, borderRadius: 999, border: '3px solid var(--accent-cyan)', borderTopColor: 'transparent', animation: 'lc-spin .9s linear infinite' }} />
        </div>
      </div>

      {resultat && (
        <div style={{ position: 'relative', background: 'var(--bg-panel-raised)', border: '3px solid var(--accent-magenta)', borderRadius: 16, padding: '14px 20px' }}>
          <span className="display-title" style={{ fontSize: 15, color: 'var(--accent-magenta)' }}>{resultat}</span>
        </div>
      )}

      {nomsConnectes.length > 0 && (
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 12, background: 'var(--bg-panel-raised)', border: '3px solid var(--outline)', borderRadius: 16, padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="display-title" style={{ fontSize: 13, color: 'var(--text-dim)' }}>{nomsPrets.length} / {nomsConnectes.length} PRÊTS</span>
            {majoriteAtteinte && <span style={{ fontSize: 12, color: 'var(--accent-lime)' }}>majorité atteinte</span>}
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {nomsConnectes.map((nom) => {
              const pret = nomsPrets.includes(nom);
              return (
                <div key={nom} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, opacity: pret ? 1 : 0.5 }}>
                  <Avatar nom={nom} index={joueurs.indexOf(nom)} taille={34} contour={pret ? 'var(--accent-lime)' : undefined} />
                  <span style={{ fontSize: 10, color: pret ? 'var(--accent-lime)' : 'var(--text-dim)' }}>{pret ? 'prêt·e' : 'attend'}</span>
                </div>
              );
            })}
          </div>
          <div style={{ height: 8, borderRadius: 999, background: 'var(--bg-deep)', overflow: 'hidden' }}>
            <div style={{ width: `${(nomsPrets.length / nomsConnectes.length) * 100}%`, height: '100%', background: 'var(--accent-lime)', transition: 'width .3s' }} />
          </div>
        </div>
      )}

      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {classement.map(({ nom, index, points }, rang) => {
          const leader = rang === 0;
          return (
            <div
              key={nom}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 18,
                background: leader ? 'var(--accent-lime)' : 'var(--bg-panel-raised)',
                border: `3px solid var(--outline)`,
                borderRadius: 18,
                padding: '14px 22px',
                boxShadow: leader ? '8px 8px 0 var(--accent-magenta)' : 'none',
              }}
            >
              <div className="display-title" style={{ fontSize: 22, color: leader ? 'var(--outline)' : 'var(--text-muted)', width: 36 }}>
                {rang + 1}
              </div>
              <Avatar nom={nom} index={index} taille={46} />
              <div className="display-title" style={{ fontSize: 20, color: leader ? 'var(--outline)' : 'var(--text-primary)', width: 160 }}>
                {nom}
              </div>
              <div style={{ flex: 1, height: 16, borderRadius: 999, background: leader ? 'rgba(36,27,47,.2)' : 'var(--bg-deep)', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${(points / max) * 100}%`,
                    height: '100%',
                    background: leader ? 'var(--outline)' : 'var(--accent-magenta)',
                    transition: 'width .4s ease',
                  }}
                />
              </div>
              <div className="display-title" style={{ fontSize: 26, color: leader ? 'var(--outline)' : 'var(--text-primary)', width: 60, textAlign: 'right' }}>
                {points}
              </div>
              {leader && (
                <span style={{ fontSize: 12, fontFamily: 'var(--font-display)', color: 'var(--outline)', background: 'var(--accent-yellow)', border: '2px solid var(--outline)', borderRadius: 999, padding: '5px 12px' }}>
                  En tête
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary" onClick={onTerminer}>Terminer la soirée</button>
          {modeAuto && (
            <button className="btn btn-secondary" style={{ color: 'var(--accent-magenta)' }} onClick={onQuitterAuto}>
              Quitter le mode auto
            </button>
          )}
        </div>
        <button
          className="btn btn-lime"
          style={{ animation: majoriteAtteinte ? 'lc-band 2s ease-in-out infinite' : 'none' }}
          onClick={onMancheSuivante}
        >
          Manche suivante
        </button>
      </div>
    </div>
  );
}
