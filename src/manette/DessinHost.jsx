import React, { useEffect, useRef, useState } from 'react';

// DessinHost — dessin collectif au tour par tour : chaque téléphone connecté
// reçoit son tour (durée fixe), dessine sur son écran, les traits arrivent
// en direct sur le canvas partagé de l'écran principal, qui n'est jamais
// effacé entre deux tours (Cadavre Exquis Numérique). Le tracé de chacun
// arrive via `remote.actionsRecues[artiste]`, un point à la fois.
//
// `demanderJugement` (avec `nbArtistes=1`) ajoute une étape de jugement
// après le dessin : l'hôte coche à voix haute qui a deviné juste (Dessine
// et Devine) — l'artiste gagne un bonus selon le nombre de bonnes
// réponses, chaque bon devineur gagne aussi des points.

export default function DessinHost({ remote, dureeParTour = 18, consigne, consigneArtiste, nbArtistes, demanderJugement = false, pointsParDefaut = 3, onTermine }) {
  const [etape, setEtape] = useState('avant'); // avant | tour | fin | jugement | jugement-envoye
  const [devineurs, setDevineurs] = useState(new Set());
  const [ordre, setOrdre] = useState([]);
  const [tourIndex, setTourIndex] = useState(0);
  const [tempsRestant, setTempsRestant] = useState(dureeParTour);
  const canvasRef = useRef(null);
  const dernierPointRef = useRef(null);
  const intervalRef = useRef(null);
  const traiteRef = useRef(null); // évite de redessiner deux fois le même point

  const artisteActuel = ordre[tourIndex];

  const demarrerTour = (index, liste) => {
    const artiste = liste[index];
    dernierPointRef.current = null;
    remote.resetActions();
    setTempsRestant(dureeParTour);
    remote.envoyerAction({ prim: 'dessin', etape: 'spectateur', artiste });
    remote.envoyerActionPrivee({ [artiste]: { prim: 'dessin', etape: 'demarrer', consigne: consigneArtiste || consigne } });
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => setTempsRestant((t) => (t <= 1 ? 0 : t - 1)), 1000);
  };

  const demarrer = () => {
    let liste = remote.connectes.filter((j) => j.connecte).map((j) => j.nom);
    if (nbArtistes && nbArtistes < liste.length) {
      // Tire nbArtistes noms au hasard plutôt que tout le monde — pour un
      // duel de dessin ou un artiste unique désigné (Dessine et Devine).
      liste = [...liste].sort(() => Math.random() - 0.5).slice(0, nbArtistes);
    }
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setOrdre(liste);
    setTourIndex(0);
    setEtape('tour');
    demarrerTour(0, liste);
  };

  useEffect(() => {
    if (etape === 'tour' && tempsRestant === 0) {
      const suivant = tourIndex + 1;
      if (suivant >= ordre.length) {
        clearInterval(intervalRef.current);
        setEtape('fin');
      } else {
        setTourIndex(suivant);
        demarrerTour(suivant, ordre);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tempsRestant, etape]);

  useEffect(() => { demarrer(); return () => clearInterval(intervalRef.current); }, []);

  // Trace le point le plus récent reçu de l'artiste courant.
  useEffect(() => {
    if (!artisteActuel) return;
    const payload = remote.actionsRecues[artisteActuel];
    if (!payload || payload.prim !== 'dessin' || payload === traiteRef.current) return;
    traiteRef.current = payload;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const x = payload.x * canvas.width;
    const y = payload.y * canvas.height;
    if (payload.phase === 'start' || !dernierPointRef.current) {
      dernierPointRef.current = { x, y };
      return;
    }
    ctx.strokeStyle = '#F6ECFF';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(dernierPointRef.current.x, dernierPointRef.current.y);
    ctx.lineTo(x, y);
    ctx.stroke();
    dernierPointRef.current = { x, y };
    if (payload.phase === 'end') dernierPointRef.current = null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remote.actionsRecues, artisteActuel]);

  const artiste = ordre[0];
  const autresJoueurs = remote.connectes.filter((j) => j.connecte && j.nom !== artiste).map((j) => j.nom);
  const jugementIdRef = useRef(null);

  const terminer = () => {
    if (demanderJugement) {
      jugementIdRef.current = Date.now();
      remote.envoyerActionPrivee({ [artiste]: { prim: 'dessin', etape: 'jugement', joueurs: autresJoueurs, id: jugementIdRef.current } });
      setEtape('jugement');
      return;
    }
    const scores = {};
    ordre.forEach((nom) => { scores[nom] = pointsParDefaut; });
    onTermine(scores);
  };

  useEffect(() => {
    if (etape === 'fin') {
      const t = setTimeout(terminer, 2500);
      return () => clearTimeout(t);
    }
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [etape]);

  const validerJugement = (nomsDevineurs) => {
    const scores = {};
    nomsDevineurs.forEach((nom) => { scores[nom] = 3; });
    if (artiste) scores[artiste] = nomsDevineurs.length > 0 ? nomsDevineurs.length * 2 : 1;
    onTermine(scores);
  };

  // Reçoit le jugement envoyé par l'artiste depuis son propre téléphone.
  useEffect(() => {
    if (etape !== 'jugement' || !artiste) return;
    const payload = remote.actionsRecues[artiste];
    if (payload?.prim === 'dessin-jugement' && payload.id === jugementIdRef.current) {
      setDevineurs(new Set(payload.devineurs || []));
      setEtape('jugement-envoye');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remote.actionsRecues, etape]);

  useEffect(() => {
    if (etape === 'jugement-envoye') {
      const t = setTimeout(() => validerJugement([...devineurs]), 2500);
      return () => clearTimeout(t);
    }
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [etape]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, padding: '32px 24px', textAlign: 'center' }}>
      {consigne && <p style={{ color: 'var(--text-muted)', maxWidth: 480 }}>{consigne}</p>}

      {etape !== 'avant' && (
        <canvas ref={canvasRef} width={640} height={420} style={{ width: '100%', maxWidth: 640, background: 'var(--outline)', borderRadius: 18, border: '3px solid var(--outline)', touchAction: 'none' }} />
      )}

      {etape === 'tour' && (
        <>
          <div className="display-title" style={{ fontSize: 20, color: 'var(--accent-cyan)' }}>{artisteActuel} dessine · {tempsRestant}s</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            {ordre.map((n, i) => <span key={n} className="tag" style={{ opacity: i === tourIndex ? 1 : i < tourIndex ? 0.5 : 0.3 }}>{n}</span>)}
          </div>
        </>
      )}

      {etape === 'fin' && demanderJugement && (
        <p style={{ fontSize: 13, color: 'var(--text-dim)' }}>{artiste} choisit qui a deviné juste sur son téléphone...</p>
      )}
      {etape === 'fin' && !demanderJugement && (
        <p style={{ fontSize: 13, color: 'var(--text-dim)' }}>Points appliqués dans un instant...</p>
      )}

      {etape === 'jugement' && (
        <p style={{ fontSize: 13, color: 'var(--text-dim)' }}>{artiste} choisit qui a deviné juste sur son téléphone...</p>
      )}

      {etape === 'jugement-envoye' && (
        <>
          <div className="display-title" style={{ fontSize: 16, color: 'var(--accent-yellow)' }}>ONT DEVINÉ JUSTE À VOIX HAUTE</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
            {[...devineurs].length === 0 && <span style={{ color: 'var(--text-muted)' }}>Personne, selon {artiste}.</span>}
            {[...devineurs].map((nom) => <span key={nom} className="tag" style={{ background: 'var(--accent-lime)', color: 'var(--outline)' }}>{nom}</span>)}
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-dim)' }}>Points appliqués dans un instant...</p>
        </>
      )}
    </div>
  );
}
