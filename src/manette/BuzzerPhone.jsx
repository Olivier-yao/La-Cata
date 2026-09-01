import React, { useEffect, useRef, useState } from 'react';

// BuzzerPhone — gros bouton, un seul appui compte. `payload` vient de
// l'action-broadcast de BuzzerHost (ou RouletteHost, qui réutilise ce même
// écran pour son bouton "stop"). `id` change à chaque manche : c'est ce qui
// permet de redevenir "prêt" sans dépendre du texte de la consigne.
// Si le jeu a un volet QCM (Vision Floue, Question Éclair), le gagnant du
// buzz reçoit ensuite un payload privé `etape:'repondre'` avec un temps
// réduit pour choisir la bonne réponse.

export default function BuzzerPhone({ payload, onAction, nom, couleur, labelBouton = 'BUZZ !' }) {
  const [etat, setEtat] = useState('attente'); // attente | pret | appuye | repondre | envoye | resultat
  const [tempsReponse, setTempsReponse] = useState(0);
  const dernierId = useRef(null);
  const dernierIdReponse = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => () => clearInterval(intervalRef.current), []);

  useEffect(() => {
    if (!payload) return;
    if (payload.etape === 'ouvert' && payload.id !== dernierId.current) {
      dernierId.current = payload.id;
      setEtat('pret');
    } else if (payload.etape === 'repondre' && payload.id !== dernierIdReponse.current) {
      dernierIdReponse.current = payload.id;
      setEtat('repondre');
      setTempsReponse(payload.duree || 8);
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setTempsReponse((t) => (t <= 1 ? 0 : t - 1));
      }, 1000);
    } else if (payload.etape === 'resultat') {
      // Pas de vérification d'id ici : un joueur exclu après une mauvaise
      // réponse a un id de manche périmé (les buzzers ont rouvert pour les
      // autres sans lui) — il doit quand même voir le résultat final.
      clearInterval(intervalRef.current);
      setEtat('resultat');
    }
  }, [payload]);

  const appuyer = () => {
    if (etat !== 'pret') return;
    setEtat('appuye');
    onAction({ t: Date.now() });
  };

  const repondre = (i) => {
    if (etat !== 'repondre') return;
    clearInterval(intervalRef.current);
    setEtat('envoye');
    onAction({ prim: 'buzzer', reponse: i, id: dernierIdReponse.current });
  };

  if (etat === 'repondre') {
    return (
      <div className="stage" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 20, padding: '30px 20px', background: 'var(--accent-yellow)' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="display-title" style={{ fontSize: 15, color: 'var(--outline)' }}>TU AS BUZZÉ · RÉPONDS VITE</div>
          <div className="display-title" style={{ fontSize: 40, color: 'var(--outline)' }}>{tempsReponse}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {(payload?.options || []).map((opt, i) => (
            <button
              key={i}
              onClick={() => repondre(i)}
              style={{ background: 'var(--outline)', color: 'var(--text-primary)', border: '4px solid var(--outline)', borderRadius: 18, padding: '18px', fontFamily: 'inherit', fontSize: 16, touchAction: 'manipulation' }}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (etat === 'envoye') {
    return (
      <div className="stage" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, textAlign: 'center', padding: 30 }}>
        <div className="display-title" style={{ fontSize: 24 }}>RÉPONSE ENVOYÉE</div>
        <p style={{ color: 'var(--text-muted)' }}>Résultat sur l'écran principal.</p>
      </div>
    );
  }

  if (etat === 'resultat') {
    if (payload.perdant) {
      const perdu = payload.gagnant === nom;
      return (
        <div className="stage" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, textAlign: 'center', padding: 30, background: perdu ? 'var(--bg-deep)' : 'var(--accent-lime)' }}>
          <div className="display-title" style={{ fontSize: 28, color: perdu ? 'var(--accent-magenta)' : 'var(--outline)' }}>
            {perdu ? 'PERDU… TU AS CRAQUÉ EN PREMIER' : payload.gagnant ? `${payload.gagnant} a craqué en premier, vous gagnez !` : 'Manche annulée'}
          </div>
        </div>
      );
    }
    const gagne = payload.gagnant === nom;
    return (
      <div className="stage" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, textAlign: 'center', padding: 30, background: gagne ? 'var(--accent-lime)' : 'var(--bg-deep)' }}>
        <div className="display-title" style={{ fontSize: 28, color: gagne ? 'var(--outline)' : 'var(--accent-magenta)' }}>
          {gagne ? 'GAGNÉ !' : payload.gagnant ? `${payload.gagnant} a été le/la plus rapide` : 'Personne n\'a trouvé'}
        </div>
      </div>
    );
  }

  return (
    <div className="stage" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24, padding: 30 }}>
      {payload?.consigne && <p style={{ color: 'var(--text-muted)', textAlign: 'center', maxWidth: 280 }}>{payload.consigne}</p>}
      <button
        onClick={appuyer}
        disabled={etat !== 'pret'}
        style={{
          width: 200,
          height: 200,
          borderRadius: 999,
          touchAction: 'manipulation',
          background: etat === 'appuye' ? 'var(--bg-panel-raised)' : (couleur?.bg || 'var(--accent-magenta)'),
          color: etat === 'appuye' ? 'var(--text-dim)' : (couleur?.fg || 'var(--outline)'),
          border: '6px solid var(--outline)',
          fontFamily: 'var(--font-display)',
          fontSize: 22,
          boxShadow: etat === 'appuye' ? 'none' : 'var(--shadow-hard-sm)',
        }}
      >
        {etat === 'appuye' ? 'ENVOYÉ' : etat === 'pret' ? labelBouton : 'PATIENTE…'}
      </button>
    </div>
  );
}
