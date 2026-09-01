import React, { useEffect, useRef, useState } from 'react';
import Avatar from '../components/Avatar.jsx';

// ScoreboardScreen — "Tableau des scores", plein écran entre deux manches
// (kit, écran 14). Le meneur ressort en citron-vert plein avec ombre
// magenta ; les autres lignes restent en surface sombre.
//
// Quand la manette est active, chaque téléphone reçoit la liste des
// mini-jeux Manette Party à voter (VoteJeuPhone) : voter vaut "prêt", pas
// besoin d'un geste séparé. Après 10s (ou plus tôt si tout le monde a
// voté), le jeu le plus voté est lancé automatiquement — égalité
// départagée au hasard parmi les meilleurs. Un clic sur "Choisir un autre
// type de jeu" annule le vote en cours et repasse par le choix manuel.
//
// Si le vote téléphone n'est pas actif (manches d'affilée du même jeu,
// aucun téléphone connecté, jeu non-manette...), la manche suivante
// s'enchaîne toute seule après un court délai — "Manche suivante" ne sert
// plus qu'à accélérer.

const DUREE_VOTE = 10;
const DELAI_AUTO_SUIVANTE = 3500;

export default function ScoreboardScreen({
  joueurs, scores, manche, totalManches, onMancheSuivante, onTerminer, modeAuto, onQuitterAuto,
  resultat, remote, jeuxManette, onAutoLancer, manchesRestantesMemeJeu = 1,
}) {
  const idRef = useRef(Date.now());
  const [tempsRestant, setTempsRestant] = useState(DUREE_VOTE);
  const [annule, setAnnule] = useState(false);
  const intervalRef = useRef(null);
  const gagnantRef = useRef(null);

  const nomsConnectes = remote?.actif ? remote.connectes.filter((j) => j.connecte).map((j) => j.nom) : [];
  // Le mode auto a déjà son propre tirage au sort (voir demarrerModeAuto) :
  // pas question de le faire courir en parallèle du vote des téléphones.
  const voteActif = remote?.actif && !modeAuto && manchesRestantesMemeJeu <= 1 && nomsConnectes.length > 0 && (jeuxManette?.length || 0) > 0 && !annule;

  useEffect(() => {
    if (!voteActif) return undefined;
    idRef.current = Date.now();
    remote.resetActions();
    remote.envoyerAction({ prim: 'vote-jeu', etape: 'ouvert', jeux: jeuxManette, id: idRef.current });
    intervalRef.current = setInterval(() => setTempsRestant((t) => (t <= 1 ? 0 : t - 1)), 1000);
    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const votes = {}; // nom -> jeuId
  if (voteActif) {
    Object.entries(remote.actionsRecues).forEach(([nom, payload]) => {
      if (payload?.prim === 'vote-jeu' && payload.id === idRef.current) votes[nom] = payload.jeuId;
    });
  }
  const nbVotes = Object.keys(votes).length;

  useEffect(() => {
    if (voteActif && nomsConnectes.length > 0 && nbVotes >= nomsConnectes.length) setTempsRestant(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nbVotes]);

  const tally = {}; // jeuId -> count
  Object.values(votes).forEach((jeuId) => { tally[jeuId] = (tally[jeuId] || 0) + 1; });

  useEffect(() => {
    if (!voteActif || tempsRestant !== 0 || gagnantRef.current) return undefined;
    clearInterval(intervalRef.current);
    const entrees = Object.entries(tally);
    let jeuGagnantId;
    if (entrees.length === 0) {
      jeuGagnantId = jeuxManette[Math.floor(Math.random() * jeuxManette.length)].id;
    } else {
      const max = Math.max(...entrees.map(([, c]) => c));
      const meilleurs = entrees.filter(([, c]) => c === max).map(([id]) => id);
      jeuGagnantId = meilleurs[Math.floor(Math.random() * meilleurs.length)];
    }
    gagnantRef.current = jeuGagnantId;
    remote.envoyerAction({ prim: 'vote-jeu', etape: 'fin', id: idRef.current });
    const t = setTimeout(() => onAutoLancer(jeuGagnantId), 1400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tempsRestant]);

  const annulerVote = () => {
    setAnnule(true);
    clearInterval(intervalRef.current);
    onMancheSuivante();
  };

  const jeuGagnant = gagnantRef.current && jeuxManette?.find((j) => j.id === gagnantRef.current);

  const autoAvanceRef = useRef(false);
  useEffect(() => {
    if (voteActif || autoAvanceRef.current) return undefined;
    autoAvanceRef.current = true;
    const t = setTimeout(() => onMancheSuivante(), DELAI_AUTO_SUIVANTE);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voteActif]);

  const classement = joueurs
    .map((nom, i) => ({ nom, index: i, points: scores[nom] || 0 }))
    .sort((a, b) => b.points - a.points);
  const max = Math.max(1, classement[0]?.points || 1);

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

      {voteActif && (
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 12, background: 'var(--bg-panel-raised)', border: '3px solid var(--accent-cyan)', borderRadius: 16, padding: '16px 20px' }}>
          {jeuGagnant ? (
            <div style={{ textAlign: 'center' }}>
              <span className="display-title" style={{ fontSize: 18, color: 'var(--accent-lime)' }}>🎉 {jeuGagnant.nom} lancé dans un instant !</span>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="display-title" style={{ fontSize: 13, color: 'var(--accent-cyan)' }}>CHOIX DU PROCHAIN MINI-JEU · {nbVotes} / {nomsConnectes.length} ONT VOTÉ</span>
                <span className="display-title" style={{ fontSize: 16, color: 'var(--accent-yellow)' }}>{tempsRestant}s</span>
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {nomsConnectes.map((nom) => {
                  const vote = votes[nom] !== undefined;
                  return (
                    <div key={nom} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, opacity: vote ? 1 : 0.5 }}>
                      <Avatar nom={nom} index={joueurs.indexOf(nom)} taille={30} contour={vote ? 'var(--accent-cyan)' : undefined} />
                      <span style={{ fontSize: 10, color: vote ? 'var(--accent-cyan)' : 'var(--text-dim)' }}>{vote ? 'voté' : 'attend'}</span>
                    </div>
                  );
                })}
              </div>
              {Object.keys(tally).length > 0 && (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {Object.entries(tally).sort((a, b) => b[1] - a[1]).map(([jeuId, count]) => (
                    <span key={jeuId} className="tag">{jeuxManette.find((j) => j.id === jeuId)?.nom || jeuId} · {count}</span>
                  ))}
                </div>
              )}
              <button className="btn btn-secondary" style={{ alignSelf: 'center', fontSize: 12 }} onClick={annulerVote}>Choisir un autre type de jeu à la place</button>
            </>
          )}
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
        {!voteActif && (
          <button className="btn btn-lime" onClick={onMancheSuivante}>Manche suivante</button>
        )}
      </div>
    </div>
  );
}
