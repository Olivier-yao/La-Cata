import React, { useEffect, useRef, useState } from 'react';
import Avatar from '../components/Avatar.jsx';

// TeleAchatHost — un·e vendeur·se tiré·e au sort présente un objet à voix
// haute, les autres téléphones enchérissent par paliers croissants
// (jamais de retour en arrière, voir TeleAchatPhone). Un bouton "achat
// immédiat" plus cher coupe tout instantanément dès qu'un acheteur
// l'appuie — sinon, la plus haute offre au bout du chrono remporte
// l'objet. Deux primitives recyclées dans l'esprit (un vote à montants
// croissants + un buzzer qui coupe tout), regroupées ici en un seul host
// puisque les deux se déroulent en même temps, pas l'un après l'autre.

const PALIERS = [800, 1200, 1600, 2000];
const ACHAT_IMMEDIAT = 3000;
const DUREE = 25;
const POINTS_PAR_PALIER = { 800: 2, 1200: 4, 1600: 6, 2000: 7 };

export default function TeleAchatHost({ remote, objet, onTermine }) {
  const [etape, setEtape] = useState('avant'); // avant | ouvert | resultat
  const [tempsRestant, setTempsRestant] = useState(DUREE);
  const idRef = useRef(0);
  const intervalRef = useRef(null);
  const joueursConnectes = remote.connectes.filter((j) => j.connecte).map((j) => j.nom);
  const indexJoueur = Object.fromEntries(joueursConnectes.map((nom, i) => [nom, i]));

  const [vendeur] = useState(() => {
    const melanges = [...joueursConnectes].sort(() => Math.random() - 0.5);
    return melanges[0];
  });
  const acheteurs = joueursConnectes.filter((n) => n !== vendeur);

  const demarrer = () => {
    remote.resetActions();
    idRef.current = Date.now();
    setTempsRestant(DUREE);
    setEtape('ouvert');
    const parJoueur = {};
    acheteurs.forEach((nom) => {
      parJoueur[nom] = { prim: 'tele-achat', etape: 'ouvert', paliers: PALIERS, achatImmediat: ACHAT_IMMEDIAT, id: idRef.current };
    });
    if (vendeur) {
      parJoueur[vendeur] = { prim: 'role-secret', special: true, titre: 'TU VENDS', consigne: `Vends "${objet}" à voix haute pendant que les autres enchérissent. Ne regarde pas ton téléphone.` };
    }
    remote.envoyerActionPrivee(parJoueur);
    intervalRef.current = setInterval(() => setTempsRestant((t) => (t <= 1 ? 0 : t - 1)), 1000);
  };

  const offres = {}; // nom -> { offre, achatImmediat }
  Object.entries(remote.actionsRecues).forEach(([nom, payload]) => {
    if (payload?.prim === 'tele-achat' && payload.id === idRef.current) offres[nom] = { offre: payload.offre, achatImmediat: payload.achatImmediat };
  });
  const achatImmediatNom = Object.entries(offres).find(([, o]) => o.achatImmediat)?.[0];

  useEffect(() => {
    if (etape === 'ouvert' && achatImmediatNom) {
      clearInterval(intervalRef.current);
      setEtape('resultat');
      remote.envoyerAction({ prim: 'tele-achat', etape: 'fin', id: idRef.current });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [achatImmediatNom]);

  useEffect(() => {
    if (etape === 'ouvert' && tempsRestant === 0) {
      clearInterval(intervalRef.current);
      setEtape('resultat');
      remote.envoyerAction({ prim: 'tele-achat', etape: 'fin', id: idRef.current });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tempsRestant, etape]);

  useEffect(() => () => clearInterval(intervalRef.current), []);

  const classement = Object.entries(offres).sort((a, b) => b[1].offre - a[1].offre);
  const meilleure = classement[0];

  const valider = () => {
    const scores = {};
    if (meilleure) {
      const [nomGagnant, info] = meilleure;
      scores[vendeur] = info.achatImmediat ? 8 : (POINTS_PAR_PALIER[info.offre] || 1);
      scores[nomGagnant] = (scores[nomGagnant] || 0) + 1;
    } else {
      scores[vendeur] = 0;
    }
    onTermine({ scores, resultat: meilleure ? `${meilleure[0]} remporte "${objet}" pour ${meilleure[1].offre} F.` : `Personne n'a enchéri sur "${objet}".` });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, padding: '36px 24px', textAlign: 'center', width: '100%' }}>
      <p className="eyebrow" style={{ color: 'var(--text-muted)', letterSpacing: '.2em' }}>{vendeur} vend</p>
      <div className="hard-card" style={{ maxWidth: 560 }}>
        <div className="display-title" style={{ fontSize: 'clamp(20px, 3.2vw, 30px)' }}>{objet}</div>
      </div>

      {etape === 'avant' && (
        <button className="btn btn-cyan" style={{ fontSize: 20, padding: '20px 44px' }} onClick={demarrer}>Ouvrir les enchères ({DUREE}s)</button>
      )}

      {etape === 'ouvert' && (
        <>
          <div className="display-title" style={{ fontSize: 32, color: 'var(--accent-yellow)' }}>{tempsRestant}s</div>
          {meilleure ? (
            <div className="hard-card" style={{ borderColor: 'var(--accent-lime)', maxWidth: 380 }}>
              <p style={{ fontSize: 11, letterSpacing: '.14em', color: 'var(--accent-lime)', marginBottom: 6 }}>MEILLEURE OFFRE</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
                <Avatar nom={meilleure[0]} index={indexJoueur[meilleure[0]]} taille={34} />
                <span className="display-title" style={{ fontSize: 22 }}>{meilleure[1].offre} F</span>
              </div>
            </div>
          ) : (
            <p style={{ color: 'var(--text-dim)' }}>Aucune offre pour l'instant…</p>
          )}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 480 }}>
            {classement.slice(1).map(([nom, info]) => (
              <span key={nom} className="tag">{nom} · {info.offre} F</span>
            ))}
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-dim)' }}>Achat immédiat à {ACHAT_IMMEDIAT} F : premier qui appuie coupe tout.</p>
        </>
      )}

      {etape === 'resultat' && (
        <>
          {achatImmediatNom ? (
            <div className="display-title" style={{ fontSize: 26, color: 'var(--accent-magenta)' }}>ACHAT IMMÉDIAT · VENDU</div>
          ) : (
            <div className="display-title" style={{ fontSize: 22, color: 'var(--accent-lime)' }}>{meilleure ? 'VENDU' : 'INVENDU'}</div>
          )}
          {meilleure ? (
            <p style={{ fontSize: 16 }}>{meilleure[0]} remporte l'objet pour <strong>{meilleure[1].offre} F</strong>.</p>
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>Personne n'a enchéri à temps.</p>
          )}
          <button className="btn btn-lime" style={{ fontSize: 18, padding: '16px 36px' }} onClick={valider}>Valider les points</button>
        </>
      )}
    </div>
  );
}
