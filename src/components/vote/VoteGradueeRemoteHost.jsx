import React, { useEffect, useRef } from 'react';
import Avatar from '../Avatar.jsx';

// VoteGradueeRemoteHost — affiché sur l'écran principal quand des
// téléphones sont connectés : chacun vote depuis sa propre manette au lieu
// d'un seul clic pour toute la table. Démarre le vote une seule fois au
// montage, affiche les votes en direct, et calcule la moyenne une fois
// que l'hôte valide (pas besoin d'attendre absolument tout le monde — un
// téléphone déchargé ne doit pas bloquer la soirée).

export default function VoteGradueeRemoteHost({ joueurActuel, question, joueurs, connectes, votesRecus, onDemarrerVote, onValider }) {
  const demarreRef = useRef(false);
  useEffect(() => {
    if (!demarreRef.current) {
      demarreRef.current = true;
      onDemarrerVote(question || `C'était comment, ${joueurActuel} ?`);
    }
  }, []);

  const indexJoueur = Object.fromEntries(joueurs.map((nom, i) => [nom, i]));
  const nomsConnectes = connectes.filter((j) => j.connecte).map((j) => j.nom);
  const nbVotes = Object.keys(votesRecus).length;

  const valider = () => {
    const valeurs = Object.values(votesRecus);
    if (valeurs.length === 0) {
      onValider(0);
      return;
    }
    const moyenne = valeurs.reduce((a, b) => a + b, 0) / valeurs.length;
    onValider(Math.round(moyenne));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28, padding: '48px 24px', textAlign: 'center' }}>
      <div>
        <p className="eyebrow" style={{ color: 'var(--accent-cyan)' }}>Vote depuis les téléphones</p>
        <h2 className="display-title" style={{ fontSize: 'clamp(26px, 4vw, 44px)', margin: '8px 0' }}>
          {question || `C'était comment, ${joueurActuel} ?`}
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>
          Chacun note depuis sa manette. {nbVotes} / {nomsConnectes.length} ont voté.
        </p>
      </div>

      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 560 }}>
        {nomsConnectes.map((nom) => {
          const aVote = votesRecus[nom] !== undefined;
          return (
            <div key={nom} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, opacity: aVote ? 1 : 0.45 }}>
              <Avatar nom={nom} index={indexJoueur[nom]} taille={52} contour={aVote ? 'var(--accent-lime)' : undefined} />
              <span style={{ fontSize: 13, color: aVote ? 'var(--accent-lime)' : 'var(--text-dim)' }}>{aVote ? `+${votesRecus[nom]}` : nom}</span>
            </div>
          );
        })}
      </div>

      <button className="btn btn-lime" style={{ padding: '18px 36px', fontSize: 17 }} onClick={valider}>
        {nbVotes < nomsConnectes.length ? 'Valider quand même' : 'Valider les points'}
      </button>
    </div>
  );
}
