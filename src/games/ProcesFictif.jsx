import React, { useEffect, useState } from 'react';
import Avatar from '../components/Avatar.jsx';
import CountdownRing from '../components/CountdownRing.jsx';
import RoundHeader from '../components/RoundHeader.jsx';
import QcmHost from '../manette/QcmHost.jsx';
import { IconMenteur } from '../components/icons.jsx';
import { dossierProcesAleatoire } from '../data/dossiersProces.js';

const DUREE_PLAIDOIRIE = 80;

// ProcesFictif — version Manette Party : l'accusé et les deux avocats sont
// tirés au sort parmi les téléphones connectés, le reste devient le jury.
// L'avocat de la défense a trois preuves privées qu'il peut révéler à
// tout moment (irréversible, voir ProcesAvocatPhone) ; le jury ne voit que
// les preuves déjà révélées et vote coupable/non coupable sur son
// téléphone une fois la plaidoirie terminée — sans l'accusé ni les
// avocats, qui ne votent pas sur leur propre affaire (QcmHost.votantsEligibles).

export default function ProcesFictif({ remote, manche, onTermine }) {
  const [dossier] = useState(dossierProcesAleatoire);
  const [phase, setPhase] = useState('avant'); // avant | plaidoirie | vote
  const [tempsRestant, setTempsRestant] = useState(DUREE_PLAIDOIRIE);
  const joueursConnectes = remote.connectes.filter((j) => j.connecte).map((j) => j.nom);
  const indexJoueur = Object.fromEntries(joueursConnectes.map((nom, i) => [nom, i]));

  const [roles] = useState(() => {
    const melanges = [...joueursConnectes].sort(() => Math.random() - 0.5);
    return {
      accuse: melanges[0],
      avocatDefense: melanges[1],
      avocatAccusation: melanges[2],
      jures: melanges.slice(3),
    };
  });

  if (joueursConnectes.length < 4) {
    return (
      <div className="stage" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, padding: 40, textAlign: 'center', minHeight: 420 }}>
        <div className="display-title" style={{ fontSize: 26, color: 'var(--accent-cyan)' }}>Il manque des téléphones</div>
        <p style={{ color: 'var(--text-muted)', maxWidth: 420 }}>
          Procès Fictif se joue à au moins 4 : un·e accusé·e, deux avocats et au moins un·e juré·e. {joueursConnectes.length} connecté·e{joueursConnectes.length > 1 ? 's' : ''} pour l'instant.
        </p>
      </div>
    );
  }

  const distribuerRoles = () => {
    remote.resetActions();
    const parJoueur = {
      [roles.accuse]: { prim: 'role-secret', special: true, titre: 'TU ES L\'ACCUSÉ·E', consigne: 'Tais-toi et laisse plaider. Tu ne votes pas sur ton propre sort.' },
      [roles.avocatAccusation]: { prim: 'role-secret', special: false, titre: 'TU ES L\'AVOCAT DE L\'ACCUSATION', consigne: 'Charge l\'accusé·e à voix haute. Tu ne votes pas.' },
      [roles.avocatDefense]: { prim: 'proces-avocat', preuves: dossier.preuvesDefensePrivees },
    };
    roles.jures.forEach((nom) => {
      parJoueur[nom] = { prim: 'role-secret', special: false, titre: 'TU ES JURÉ·E', consigne: 'Écoute la plaidoirie. Tu voteras coupable ou non coupable à la fin, sur ton téléphone.' };
    });
    remote.envoyerActionPrivee(parJoueur);
    setPhase('plaidoirie');
  };

  const payloadAvocat = remote.actionsRecues[roles.avocatDefense];
  const indicesRevelees = (payloadAvocat?.prim === 'proces-avocat' && payloadAvocat.indices) || [];

  useEffect(() => {
    if (phase !== 'vote') return;
    remote.envoyerActionPrivee({
      [roles.accuse]: { prim: 'role-secret', special: true, titre: 'LE JURY DÉLIBÈRE', consigne: 'Patiente, ton sort se joue maintenant.' },
      [roles.avocatDefense]: { prim: 'role-secret', special: false, titre: 'PLAIDOIRIE TERMINÉE', consigne: 'Le jury vote maintenant.' },
      [roles.avocatAccusation]: { prim: 'role-secret', special: false, titre: 'PLAIDOIRIE TERMINÉE', consigne: 'Le jury vote maintenant.' },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const surVerdict = ({ tally, estEgalite }) => {
    const coupable = !estEgalite && tally[0] > tally[1];
    const scores = {};
    [roles.accuse, roles.avocatDefense, roles.avocatAccusation].forEach((nom) => {
      if (nom) scores[nom] = coupable ? 1 : 4;
    });
    const resultat = coupable
      ? `${roles.accuse} est reconnu·e coupable !`
      : `${roles.accuse} est acquitté·e${estEgalite ? ' — égalité, le doute profite à l\'accusé·e' : ''}.`;
    onTermine({ scores, resultat });
  };

  return (
    <div className="stage" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="stripes-bg" />
      <RoundHeader
        icone={<IconMenteur color="var(--outline)" />}
        iconBg="var(--accent-magenta)"
        titre="Procès Fictif"
        sousTitre={`Manche ${manche}`}
        couleurTitre="var(--accent-magenta)"
      />

      {phase === 'avant' && (
        <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22, padding: '36px 50px', textAlign: 'center' }}>
          <p className="eyebrow" style={{ color: 'var(--text-muted)', letterSpacing: '.2em' }}>Chef d'accusation</p>
          <div className="hard-card" style={{ maxWidth: 600 }}>
            <p style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.5 }}>{dossier.accusation}</p>
          </div>
          <p style={{ color: 'var(--text-muted)', maxWidth: 460 }}>
            Un·e accusé·e, deux avocats et le reste comme jury sont tirés au sort parmi les téléphones connectés. L'avocat de la défense reçoit trois preuves privées à révéler quand il/elle le juge utile.
          </p>
          <button className="btn btn-lime" onClick={distribuerRoles}>Distribuer les rôles</button>
        </div>
      )}

      {phase === 'plaidoirie' && (
        <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, padding: '28px 40px', textAlign: 'center' }}>
          <div className="hard-card" style={{ maxWidth: 640 }}>
            <p style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.4 }}>{dossier.accusation}</p>
          </div>

          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              { nom: roles.accuse, label: 'Accusé·e' },
              { nom: roles.avocatAccusation, label: 'Accusation' },
              { nom: roles.avocatDefense, label: 'Défense' },
            ].map(({ nom, label }) => (
              <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <Avatar nom={nom} index={indexJoueur[nom]} taille={48} />
                <span className="display-title" style={{ fontSize: 13 }}>{nom}</span>
                <span style={{ fontSize: 11, color: 'var(--accent-magenta)' }}>{label}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, width: '100%', maxWidth: 620 }}>
            <div className="hard-card" style={{ borderColor: 'var(--accent-magenta)', textAlign: 'left' }}>
              <p style={{ fontSize: 11, letterSpacing: '.14em', color: 'var(--accent-magenta)', marginBottom: 6 }}>ACCUSATION · PREUVE</p>
              <p style={{ fontSize: 14 }}>{dossier.preuveAccusation}</p>
            </div>
            <div className="hard-card" style={{ borderColor: 'var(--accent-lime)', textAlign: 'left' }}>
              <p style={{ fontSize: 11, letterSpacing: '.14em', color: 'var(--accent-lime)', marginBottom: 6 }}>DÉFENSE · PREUVE</p>
              <p style={{ fontSize: 14 }}>{dossier.preuveDefense}</p>
            </div>
          </div>

          <div style={{ width: '100%', maxWidth: 620 }}>
            <p style={{ fontSize: 11, letterSpacing: '.14em', color: 'var(--text-dim)', marginBottom: 10 }}>
              PREUVES PRIVÉES DE LA DÉFENSE · {dossier.preuvesDefensePrivees.length - indicesRevelees.length} encore gardées
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {dossier.preuvesDefensePrivees.map((preuve, i) => {
                const revelee = indicesRevelees.includes(i);
                return (
                  <div key={i} style={{ borderRadius: 12, border: `3px solid ${revelee ? 'var(--accent-lime)' : 'var(--outline)'}`, background: revelee ? 'var(--bg-panel-raised)' : 'var(--bg-deep)', padding: 12, minHeight: 76, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'left' }}>
                    {revelee ? <span style={{ fontSize: 12 }}>{preuve}</span> : <span style={{ fontSize: 20, color: 'var(--text-dim)' }}>🔒</span>}
                  </div>
                );
              })}
            </div>
          </div>

          <CountdownRing secondes={DUREE_PLAIDOIRIE} actif={phase === 'plaidoirie'} onFin={() => setPhase('vote')} couleur="var(--accent-magenta)" pulseFinale taille={110} />
          <button className="btn btn-secondary" onClick={() => setPhase('vote')}>Passer directement au vote</button>
        </div>
      )}

      {phase === 'vote' && (
        <QcmHost
          remote={remote}
          question={`${roles.accuse} est-il/elle coupable ?`}
          options={['Coupable', 'Non coupable']}
          votantsEligibles={roles.jures}
          duree={20}
          modeScoring="aucun"
          texteReussite="VERDICT ENREGISTRÉ"
          texteEchec="VERDICT ENREGISTRÉ"
          onResultat={surVerdict}
          consigne="Seul le jury vote. Vous ne voyez que les preuves révélées."
        />
      )}
    </div>
  );
}
