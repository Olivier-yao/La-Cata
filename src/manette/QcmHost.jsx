import React, { useEffect, useRef, useState } from 'react';
import Avatar from '../components/Avatar.jsx';

// QcmHost — question à choix multiples envoyée à tous les téléphones en
// même temps. Pendant le vote, l'écran principal ne montre QUE qui a
// répondu (jamais les choix ni les scores en direct, pour ne pas
// influencer le reste de la table) ; les barres de résultat n'apparaissent
// qu'à la fin du chrono, qui se termine plus tôt si tout le monde a déjà
// voté. Sert de socle à Sondage Choc, Qui Ferait Ça ?, Plus ou Moins, Le
// Juste Prix Express, Vote de la Honte, et au vote de démasquage du
// Traître / d'Espion Parmi Nous. `modeScoring` change uniquement comment
// les points sont distribués à la fin, pas la mécanique de vote elle-même :
// - 'correct'   : bonneReponse (index) reçoit les points, les autres rien.
// - 'majorite'  : l'option la plus votée fait gagner tout le monde qui l'a
//   choisie (Sondage Choc, Vote de la Honte : "dans le vent"). Égalité
//   entre plusieurs options = personne ne marque de points.
// - 'cible'     : options = prénoms des joueurs ; l'option la plus votée
//   (le joueur désigné) reçoit les points, peu importe qui a voté quoi
//   (Qui Ferait Ça ?). Égalité = personne ne marque de points.
// - 'aucun'     : pas de points distribués ici (le jeu appelant gère lui-
//   même via `onResultat`, ex. le vote de démasquage du Traître).
// - 'revele'    : pas de bonne réponse ni de gagnant du tout — on montre
//   juste qui a voté quoi, zéro point pour tout le monde (Qui Ferait Ça ?
//   n'a jamais eu de vainqueur, seulement des réponses à comparer).
//
// `texteReussite`/`texteEchec`/`texteEgalite` personnalisent le retour
// affiché sur le téléphone de chaque votant (éviter le "bien vu"
// générique quand le jeu n'a pas vraiment de bonne réponse).
//
// `votantsEligibles` restreint le vote à une liste de prénoms (le reste
// des téléphones connectés ne reçoit rien) — pour un jury qui vote sans
// l'accusé ni les avocats, par exemple (Procès Fictif).

export default function QcmHost({
  remote, question, consigne, options, duree = 12, modeScoring = 'majorite', bonneReponse, pointsGagnant = 6,
  texteReussite = 'BIEN VU !', texteEchec = 'Résultat affiché sur l\'écran principal', texteEgalite = 'Égalité — personne ne marque de points.',
  autoDemarrer = false, votantsEligibles, onTermine, onResultat,
}) {
  const [etape, setEtape] = useState(autoDemarrer ? 'ouvert' : 'avant'); // avant | ouvert | resultat
  const [tempsRestant, setTempsRestant] = useState(duree);
  const intervalRef = useRef(null);
  const idRef = useRef(0);
  const nomsConnectes = votantsEligibles || remote.connectes.filter((j) => j.connecte).map((j) => j.nom);

  const demarrer = () => {
    remote.resetActions();
    idRef.current = Date.now();
    setTempsRestant(duree);
    setEtape('ouvert');
    const payload = { prim: 'qcm', etape: 'demarrer', question, options, id: idRef.current };
    if (votantsEligibles) {
      remote.envoyerActionPrivee(Object.fromEntries(votantsEligibles.map((n) => [n, payload])));
    } else {
      remote.envoyerAction(payload);
    }
    intervalRef.current = setInterval(() => setTempsRestant((t) => (t <= 1 ? 0 : t - 1)), 1000);
  };

  useEffect(() => {
    if (autoDemarrer) demarrer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const choix = {}; // nom -> index
  Object.entries(remote.actionsRecues).forEach(([nom, payload]) => {
    if (payload?.prim === 'qcm' && payload.id === idRef.current) choix[nom] = payload.choix;
  });
  const totalVotes = Object.keys(choix).length;

  useEffect(() => {
    if (etape === 'ouvert' && nomsConnectes.length > 0 && totalVotes >= nomsConnectes.length) {
      setTempsRestant(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalVotes]);

  useEffect(() => {
    if (etape === 'ouvert' && tempsRestant === 0) {
      clearInterval(intervalRef.current);
      setEtape('resultat');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tempsRestant, etape]);

  useEffect(() => () => clearInterval(intervalRef.current), []);

  const tally = options.map((_, i) => Object.values(choix).filter((c) => c === i).length);
  const maxVotes = Math.max(...tally);
  const indicesMajoritaires = tally.reduce((acc, v, i) => (v === maxVotes && v > 0 ? [...acc, i] : acc), []);
  const indexMajoritaire = indicesMajoritaires[0] ?? -1;
  const estEgalite = (modeScoring === 'majorite' || modeScoring === 'cible') && indicesMajoritaires.length > 1;

  useEffect(() => {
    if (etape === 'resultat') {
      const gagnant = modeScoring === 'correct' ? bonneReponse : modeScoring === 'revele' ? null : indexMajoritaire;
      remote.envoyerAction({
        prim: 'qcm', etape: 'resultat', bonneReponse: gagnant, estEgalite,
        optionsEgalite: estEgalite ? indicesMajoritaires.map((i) => options[i]) : [],
        texteReussite, texteEchec, texteEgalite, id: idRef.current,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [etape]);

  const valider = () => {
    if (onResultat) {
      onResultat({ choix, tally, indexMajoritaire, estEgalite });
      return;
    }
    const scores = {};
    if (modeScoring === 'revele') {
      nomsConnectes.forEach((nom) => { scores[nom] = 0; });
    } else if (modeScoring === 'correct' && bonneReponse != null) {
      Object.entries(choix).forEach(([nom, c]) => { scores[nom] = c === bonneReponse ? pointsGagnant : 0; });
    } else if (modeScoring === 'cible') {
      if (!estEgalite && options[indexMajoritaire]) scores[options[indexMajoritaire]] = pointsGagnant;
    } else if (!estEgalite) {
      Object.entries(choix).forEach(([nom, c]) => { scores[nom] = c === indexMajoritaire ? 3 : 0; });
    }
    onTermine(scores);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, padding: '40px 24px', textAlign: 'center', width: '100%' }}>
      {consigne && <p style={{ color: 'var(--text-muted)', maxWidth: 480 }}>{consigne}</p>}
      <div className="display-title" style={{ fontSize: 'clamp(20px, 3.5vw, 30px)', maxWidth: 620 }}>{question}</div>

      {etape === 'avant' && <button className="btn btn-cyan" style={{ fontSize: 20, padding: '20px 44px' }} onClick={demarrer}>Lancer le vote ({duree}s)</button>}

      {etape === 'ouvert' && (
        <>
          <div className="display-title" style={{ fontSize: 32, color: 'var(--accent-yellow)' }}>{tempsRestant}s</div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 520 }}>
            {nomsConnectes.map((nom) => {
              const aRepondu = choix[nom] !== undefined;
              return (
                <div key={nom} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, opacity: aRepondu ? 1 : 0.4 }}>
                  <Avatar nom={nom} taille={38} contour={aRepondu ? 'var(--accent-lime)' : undefined} />
                  <span style={{ fontSize: 10, color: aRepondu ? 'var(--accent-lime)' : 'var(--text-dim)' }}>{aRepondu ? 'répondu' : 'en attente'}</span>
                </div>
              );
            })}
          </div>
        </>
      )}

      {etape === 'resultat' && (
        <>
          {estEgalite && (
            <div className="display-title" style={{ fontSize: 15, color: 'var(--accent-yellow)' }}>
              Égalité entre {indicesMajoritaires.map((i) => options[i]).join(' et ')} — personne ne marque de points.
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 520 }}>
            {options.map((opt, i) => {
              const pct = totalVotes ? Math.round((tally[i] / totalVotes) * 100) : 0;
              const estBonneReponse = modeScoring === 'correct' && i === bonneReponse;
              const estGagnante = !estEgalite && (estBonneReponse || ((modeScoring === 'majorite' || modeScoring === 'cible') && i === indexMajoritaire));
              return (
                <div key={i} style={{ position: 'relative', borderRadius: 14, overflow: 'hidden', border: `3px solid ${estGagnante ? 'var(--accent-lime)' : 'var(--outline)'}`, background: 'var(--bg-panel-raised)' }}>
                  <div style={{ position: 'absolute', inset: 0, width: `${pct}%`, background: estGagnante ? 'var(--accent-lime)' : 'var(--accent-violet)', opacity: 0.35, transition: 'width .3s' }} />
                  <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', padding: '12px 16px' }}>
                    <span className="display-title" style={{ fontSize: 15 }}>{opt}</span>
                    <span className="display-title" style={{ fontSize: 15 }}>{tally[i]} · {pct}%</span>
                  </div>
                </div>
              );
            })}
          </div>
          <button className="btn btn-lime" style={{ fontSize: 18, padding: '16px 36px' }} onClick={valider}>Valider</button>
        </>
      )}
    </div>
  );
}
