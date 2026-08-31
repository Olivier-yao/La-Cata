import React, { useEffect, useRef } from 'react';
import Avatar from '../Avatar.jsx';

// VoteBinaireRemoteHost — même principe que VoteGradueeRemoteHost, mais
// pour un verdict à deux issues (Sans Rire, Procès Fictif) : chaque
// téléphone envoie directement les points de l'option choisie, la
// majorité l'emporte.

export default function VoteBinaireRemoteHost({ question, sousTitre, optionA, optionB, joueurs, connectes, votesRecus, onDemarrerVote, onVote }) {
  const demarreRef = useRef(false);
  useEffect(() => {
    if (!demarreRef.current) {
      demarreRef.current = true;
      onDemarrerVote(question, [
        { label: optionA.label, points: optionA.points },
        { label: optionB.label, points: optionB.points },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const indexJoueur = Object.fromEntries(joueurs.map((nom, i) => [nom, i]));
  const nomsConnectes = connectes.filter((j) => j.connecte).map((j) => j.nom);
  const nbVotes = Object.keys(votesRecus).length;
  const pourA = Object.values(votesRecus).filter((p) => p === optionA.points).length;
  const pourB = Object.values(votesRecus).filter((p) => p === optionB.points).length;

  const valider = () => {
    // Majorité l'emporte ; en cas d'égalité (ou zéro vote), optionA gagne
    // par convention — comme un pile ou face qui ne tombe jamais sur la
    // tranche.
    onVote(pourB > pourA ? optionB.points : optionA.points);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28, padding: '48px 24px', textAlign: 'center' }}>
      <div>
        <p className="eyebrow" style={{ color: 'var(--accent-cyan)' }}>Verdict depuis les téléphones</p>
        <h2 className="display-title" style={{ fontSize: 'clamp(24px, 3.6vw, 40px)', margin: '8px 0' }}>{question}</h2>
        {sousTitre && <p style={{ color: 'var(--text-muted)' }}>{sousTitre}</p>}
        <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>Chacun vote depuis sa manette. {nbVotes} / {nomsConnectes.length} ont voté.</p>
      </div>

      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
        <div style={{ background: 'var(--bg-panel-raised)', border: '3px solid var(--outline)', borderRadius: 18, padding: '16px 22px' }}>
          <div className="display-title" style={{ fontSize: 16 }}>{optionA.label}</div>
          <div className="display-title" style={{ fontSize: 26, color: 'var(--accent-lime)' }}>{pourA}</div>
        </div>
        <div style={{ background: 'var(--bg-panel-raised)', border: '3px solid var(--outline)', borderRadius: 18, padding: '16px 22px' }}>
          <div className="display-title" style={{ fontSize: 16 }}>{optionB.label}</div>
          <div className="display-title" style={{ fontSize: 26, color: 'var(--accent-magenta)' }}>{pourB}</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 560 }}>
        {nomsConnectes.map((nom) => {
          const aVote = votesRecus[nom] !== undefined;
          return (
            <div key={nom} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, opacity: aVote ? 1 : 0.45 }}>
              <Avatar nom={nom} index={indexJoueur[nom]} taille={44} contour={aVote ? 'var(--accent-lime)' : undefined} />
              <span style={{ fontSize: 12, color: aVote ? 'var(--accent-lime)' : 'var(--text-dim)' }}>{nom}</span>
            </div>
          );
        })}
      </div>

      <button className="btn btn-lime" style={{ padding: '18px 36px', fontSize: 17 }} onClick={valider}>
        {nbVotes < nomsConnectes.length ? 'Valider quand même' : 'Valider le verdict'}
      </button>
    </div>
  );
}
