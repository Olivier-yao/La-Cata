import React, { useEffect, useRef, useState } from 'react';

const COULEURS = ['var(--accent-lime)', 'var(--accent-magenta)', 'var(--accent-cyan)', 'var(--accent-yellow)'];

// SequencePhone — 4 gros boutons colorés. Chaque tap ajoute à la réponse
// locale et renvoie le tableau complet (plus simple que d'accumuler côté
// serveur) ; le bouton "Valider" clôt la réponse avant la fin du temps si
// le joueur est sûr de lui.

export default function SequencePhone({ payload, onAction, symboles }) {
  const [etat, setEtat] = useState('attente'); // attente | ouvert | envoye
  const [reponse, setReponse] = useState([]);
  const idRef = useRef(null);
  // La liste des taps vit dans une ref, pas seulement dans le state : deux
  // taps rapprochés déclenchent deux appels de `taper` avant que React
  // n'ait eu le temps de re-rendre, et lire `reponse` (state) dans la
  // fermeture du second appel donnerait une valeur périmée qui écraserait
  // le premier tap au lieu de l'accumuler.
  const reponseRef = useRef([]);

  useEffect(() => {
    if (!payload) return;
    if (payload.etape === 'ouvert' && payload.id !== idRef.current) {
      idRef.current = payload.id;
      reponseRef.current = [];
      setReponse([]);
      setEtat('ouvert');
    }
  }, [payload]);

  const taper = (i) => {
    if (etat !== 'ouvert') return;
    reponseRef.current = [...reponseRef.current, i];
    setReponse(reponseRef.current);
    onAction({ prim: 'sequence', reponse: reponseRef.current, id: idRef.current });
    if (payload?.longueur && reponseRef.current.length >= payload.longueur) setEtat('envoye');
  };

  if (etat !== 'ouvert') {
    return (
      <div className="stage" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, textAlign: 'center', padding: 30 }}>
        <div className="display-title" style={{ fontSize: 22 }}>{etat === 'envoye' ? 'RÉPONSE ENVOYÉE' : 'REGARDE L\'ÉCRAN…'}</div>
        <p style={{ color: 'var(--text-muted)' }}>{etat === 'envoye' ? 'Résultat sur l\'écran principal.' : 'La séquence s\'affiche là-bas.'}</p>
      </div>
    );
  }

  return (
    <div className="stage" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22, padding: 30 }}>
      <div className="display-title" style={{ fontSize: 16, color: 'var(--text-dim)' }}>REPRODUIS LA SÉQUENCE · {reponse.length}/{payload?.longueur}</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, width: 240, height: 240 }}>
        {[0, 1, 2, 3].map((i) => (
          <button
            key={i}
            onClick={() => taper(i)}
            style={{ borderRadius: 20, background: COULEURS[i], border: '4px solid var(--outline)', fontSize: 32, touchAction: 'manipulation' }}
          >
            {symboles ? symboles[i] : ''}
          </button>
        ))}
      </div>
    </div>
  );
}
