import React from 'react';
import CodeQR from './CodeQR.jsx';

// SettingsDrawer — tiroir de réglages en bas d'écran (vitesse, son,
// sélection du joueur), ouvert depuis l'icône "RÉGLER" de l'écran de
// choix du jeu. Remplace les contrôles auparavant coincés dans l'en-tête.

const VITESSES = [
  { valeur: 'lente', label: 'Lente' },
  { valeur: 'normale', label: 'Normale' },
  { valeur: 'rapide', label: 'Rapide' },
];

export default function SettingsDrawer({
  ouvert,
  onFermer,
  vitesseReglage,
  onChangerVitesse,
  sonActif,
  onBasculerSon,
  selectionJoueur,
  onChangerSelectionJoueur,
  remote,
}) {
  if (!ouvert) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
      <div
        onClick={onFermer}
        style={{ position: 'absolute', inset: 0, background: 'rgba(18,12,27,.72)' }}
      />
      <div
        style={{
          position: 'relative',
          background: 'var(--bg-deep)',
          borderTop: '5px solid var(--outline)',
          borderRadius: '30px 30px 0 0',
          padding: '22px 24px 28px',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          maxWidth: 640,
          width: '100%',
          margin: '0 auto',
          boxShadow: '0 -10px 0 rgba(18,12,27,.3)',
        }}
      >
        <div style={{ width: 70, height: 6, borderRadius: 999, background: 'var(--bg-panel-raised)', alignSelf: 'center' }} />
        <div className="display-title" style={{ fontSize: 22 }}>Réglages de la soirée</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span className="display-title" style={{ fontSize: 12, letterSpacing: '.16em', color: 'var(--accent-yellow)' }}>Vitesse de lecture</span>
          <div style={{ display: 'flex', gap: 8 }}>
            {VITESSES.map((v) => (
              <button
                key={v.valeur}
                onClick={() => onChangerVitesse(v.valeur)}
                className="btn"
                style={{
                  flex: 1,
                  padding: '14px 8px',
                  fontSize: 14,
                  background: vitesseReglage === v.valeur ? 'var(--accent-yellow)' : 'var(--bg-panel-raised)',
                  color: vitesseReglage === v.valeur ? 'var(--outline)' : 'var(--text-muted)',
                  boxShadow: vitesseReglage === v.valeur ? 'var(--shadow-hard-sm)' : 'none',
                }}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span className="display-title" style={{ fontSize: 12, letterSpacing: '.16em', color: 'var(--accent-lime)' }}>Son</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={onBasculerSon}
              className="btn"
              style={{ flex: 1, padding: '14px 8px', fontSize: 14, background: sonActif ? 'var(--accent-lime)' : 'var(--bg-panel-raised)', color: sonActif ? 'var(--outline)' : 'var(--text-muted)', boxShadow: sonActif ? 'var(--shadow-hard-sm)' : 'none' }}
            >
              Activé
            </button>
            <button
              onClick={onBasculerSon}
              className="btn"
              style={{ flex: 1, padding: '14px 8px', fontSize: 14, background: !sonActif ? 'var(--accent-lime)' : 'var(--bg-panel-raised)', color: !sonActif ? 'var(--outline)' : 'var(--text-muted)', boxShadow: !sonActif ? 'var(--shadow-hard-sm)' : 'none' }}
            >
              Muet
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span className="display-title" style={{ fontSize: 12, letterSpacing: '.16em', color: 'var(--accent-violet)' }}>Sélection du joueur</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => onChangerSelectionJoueur('tour')}
              className="btn"
              style={{ flex: 1, padding: '14px 8px', fontSize: 13, background: selectionJoueur === 'tour' ? 'var(--accent-violet)' : 'var(--bg-panel-raised)', color: selectionJoueur === 'tour' ? 'var(--text-primary)' : 'var(--text-muted)', boxShadow: selectionJoueur === 'tour' ? 'var(--shadow-hard-sm)' : 'none' }}
            >
              Chacun son tour
            </button>
            <button
              onClick={() => onChangerSelectionJoueur('hasard')}
              className="btn"
              style={{ flex: 1, padding: '14px 8px', fontSize: 13, background: selectionJoueur === 'hasard' ? 'var(--accent-violet)' : 'var(--bg-panel-raised)', color: selectionJoueur === 'hasard' ? 'var(--text-primary)' : 'var(--text-muted)', boxShadow: selectionJoueur === 'hasard' ? 'var(--shadow-hard-sm)' : 'none' }}
            >
              Au hasard
            </button>
          </div>
        </div>

        {remote && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, background: 'var(--bg-panel-raised)', border: '3px solid var(--accent-cyan)', borderRadius: 18, padding: 16 }}>
            <span className="display-title" style={{ fontSize: 12, letterSpacing: '.16em', color: 'var(--accent-cyan)' }}>Manette téléphone</span>
            {!remote.actif ? (
              <>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>
                  Chacun vote depuis son propre téléphone, sur le même Wi-Fi que cet écran.
                </p>
                <button className="btn btn-cyan" style={{ padding: '14px' }} onClick={remote.activer}>
                  Activer la manette
                </button>
              </>
            ) : (
              <>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                  <CodeQR url={`${window.location.origin}/?manette=1&code=${remote.code}`} taille={110} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>Code de la soirée</span>
                    <span className="display-title" style={{ fontSize: 30, color: 'var(--accent-cyan)', letterSpacing: '.15em' }}>{remote.code}</span>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{remote.nbConnectes} téléphone{remote.nbConnectes > 1 ? 's' : ''} connecté{remote.nbConnectes > 1 ? 's' : ''}</span>
                  </div>
                </div>
                {remote.connectes.length > 0 && (
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {remote.connectes.map((j) => (
                      <span key={j.nom} className="tag" style={{ opacity: j.connecte ? 1 : 0.4 }}>{j.connecte ? '● ' : '○ '}{j.nom}</span>
                    ))}
                  </div>
                )}
                <button className="btn btn-secondary" style={{ padding: '12px' }} onClick={remote.desactiver}>
                  Désactiver la manette
                </button>
              </>
            )}
          </div>
        )}

        <button className="btn btn-primary" style={{ width: '100%', padding: '18px' }} onClick={onFermer}>
          C'est bon
        </button>
      </div>
    </div>
  );
}
