import React, { useState } from 'react';
import { GAMES } from '../data/games.js';
import { STYLE_PAR_JEU } from '../lib/styleJeux.js';
import { FAMILLES, FAMILLE_PAR_JEU, BADGE_JOUEURS } from '../lib/famillesJeux.js';
import { definirSonActif, sonActifEst } from '../lib/son.js';
import { IconSolo, IconGroupe } from '../components/icons.jsx';
import SettingsDrawer from '../components/SettingsDrawer.jsx';

// GameSelectScreen — écran "Choisis le mini-jeu", repensé pour tenir la
// charge de 28 jeux : groupés en 4 familles pliables plutôt qu'en grille
// plate, réglages sortis dans un tiroir dédié, mode auto comme deuxième
// affichage du même écran (pas une popup).

const MINUTES_PAR_MANCHE = 3.75;

function jeuxDeFamille(familleId) {
  return GAMES.filter((j) => (FAMILLE_PAR_JEU[j.id] || 'chrono-solo') === familleId);
}

function CarteJeu({ jeu, onClick }) {
  const { Icone, bg, couleur, contour } = STYLE_PAR_JEU[jeu.id];
  const badge = BADGE_JOUEURS[jeu.id];
  return (
    <button
      onClick={onClick}
      style={{
        background: 'var(--bg-deep)',
        border: '3px solid var(--outline)',
        borderRadius: 16,
        padding: 12,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        cursor: 'pointer',
        fontFamily: 'inherit',
        textAlign: 'left',
        minHeight: 96,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: bg, border: contour ? `2px solid ${contour}` : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icone color={contour ? couleur : 'var(--outline)'} size={20} />
        </div>
        {badge ? (
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 11, color: 'var(--outline)', background: 'var(--accent-violet)', borderRadius: 999, padding: '4px 8px' }}>{badge}</span>
        ) : jeu.groupe ? (
          <IconGroupe color="var(--text-dim)" size={18} />
        ) : (
          <IconSolo color="var(--text-dim)" size={18} />
        )}
      </div>
      <span className="display-title" style={{ fontSize: 13, color: couleur, lineHeight: 1.2 }}>{jeu.nom}</span>
    </button>
  );
}

function LigneJeuCompacte({ jeu, onClick }) {
  const { Icone, bg, couleur, contour } = STYLE_PAR_JEU[jeu.id];
  const badge = BADGE_JOUEURS[jeu.id];
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 12, background: 'var(--bg-deep)', border: '3px solid var(--outline)',
        borderRadius: 14, padding: '0 14px', height: 60, boxSizing: 'border-box', cursor: 'pointer', fontFamily: 'inherit', width: '100%', textAlign: 'left',
      }}
    >
      <div style={{ width: 32, height: 32, borderRadius: 10, background: bg, border: contour ? `2px solid ${contour}` : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
        <Icone color={contour ? couleur : 'var(--outline)'} size={18} />
      </div>
      <span className="display-title" style={{ flex: 1, fontSize: 14, color: 'var(--text-primary)' }}>{jeu.nom}</span>
      {badge ? (
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 11, color: 'var(--outline)', background: 'var(--accent-violet)', borderRadius: 999, padding: '4px 10px' }}>{badge}</span>
      ) : jeu.groupe ? (
        <IconGroupe color="var(--text-dim)" size={16} />
      ) : (
        <IconSolo color="var(--text-dim)" size={16} />
      )}
    </button>
  );
}

function VueFamilles({ familleOuverte, setFamilleOuverte, onChoisir }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {FAMILLES.map((famille, index) => {
        const jeux = jeuxDeFamille(famille.id);
        const ouverte = familleOuverte === famille.id;
        return (
          <div key={famille.id} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button
              onClick={() => setFamilleOuverte(ouverte ? null : famille.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12, background: ouverte ? famille.couleur : 'var(--bg-panel-raised)',
                border: '3px solid var(--outline)', borderRadius: 18, padding: '14px 16px', cursor: 'pointer', fontFamily: 'inherit',
                boxShadow: ouverte ? 'var(--shadow-hard-sm)' : 'none', minHeight: 56,
                animation: `lc-rowin 280ms ease-out ${index * 60}ms both`,
              }}
            >
              <div
                style={{
                  width: 30, height: 30, borderRadius: 8, background: ouverte ? 'var(--outline)' : famille.couleur,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto',
                  animation: ouverte ? 'none' : 'lc-pulse-ring 2.6s ease-in-out infinite',
                }}
              >
                <famille.Icone color={ouverte ? famille.couleur : 'var(--outline)'} size={17} />
              </div>
              <span className="display-title" style={{ flex: 1, fontSize: 15, color: ouverte ? 'var(--outline)' : 'var(--text-primary)', textAlign: 'left' }}>{famille.nom.toUpperCase()}</span>
              <span style={{ fontSize: 12, color: ouverte ? 'var(--outline)' : 'var(--text-muted)' }}>{jeux.length} jeux</span>
              <span className="display-title" style={{ fontSize: 18, color: ouverte ? 'var(--outline)' : famille.couleur }}>{ouverte ? '−' : '+'}</span>
            </button>
            {ouverte && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10, padding: '2px 4px 6px' }}>
                {jeux.map((jeu, i) => (
                  <div key={jeu.id} style={{ animation: `lc-cardin 220ms ease-out ${i * 30}ms both` }}>
                    <CarteJeu jeu={jeu} onClick={() => onChoisir(jeu)} />
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function VueListeCompacte({ onChoisir }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {FAMILLES.map((famille) => {
        const jeux = jeuxDeFamille(famille.id);
        return (
          <React.Fragment key={famille.id}>
            <div className="display-title" style={{ fontSize: 11, letterSpacing: '.16em', color: 'var(--text-dim)', padding: '8px 4px 0' }}>{famille.nom.toUpperCase()}</div>
            {jeux.map((jeu) => (
              <LigneJeuCompacte key={jeu.id} jeu={jeu} onClick={() => onChoisir(jeu)} />
            ))}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function VueModeAuto({ nbJoueurs, onLancerAuto }) {
  const [manches, setManches] = useState(Math.max(6, nbJoueurs * 3));
  const [famillesIncluses, setFamillesIncluses] = useState(() => new Set(FAMILLES.map((f) => f.id)));

  const toggleFamille = (id) => {
    setFamillesIncluses((prev) => {
      const suivant = new Set(prev);
      if (suivant.has(id)) suivant.delete(id);
      else suivant.add(id);
      return suivant;
    });
  };

  const totalJeuxInclus = FAMILLES.reduce((acc, f) => acc + (famillesIncluses.has(f.id) ? jeuxDeFamille(f.id).length : 0), 0);
  const minutesEstimees = Math.round(manches * MINUTES_PAR_MANCHE);
  const peutLancer = famillesIncluses.size > 0;
  const familleExclue = FAMILLES.find((f) => !famillesIncluses.has(f.id));

  const lancer = () => {
    const ids = GAMES.filter((g) => famillesIncluses.has(FAMILLE_PAR_JEU[g.id] || 'chrono-solo')).map((g) => g.id);
    onLancerAuto(ids, manches);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <span className="display-title" style={{ fontSize: 12, letterSpacing: '.16em', color: 'var(--accent-yellow)' }}>Combien de manches</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="btn btn-secondary" style={{ width: 56, height: 56, padding: 0, fontSize: 24 }} onClick={() => setManches((m) => Math.max(1, m - 1))}>−</button>
          <div style={{ flex: 1, height: 56, borderRadius: 16, background: 'var(--bg-deep)', border: '3px solid var(--accent-yellow)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span className="display-title" style={{ fontSize: 24, color: 'var(--accent-yellow)', lineHeight: 1 }}>{manches}</span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>≈ {minutesEstimees} min</span>
          </div>
          <button className="btn" style={{ width: 56, height: 56, padding: 0, fontSize: 24, background: 'var(--accent-yellow)', color: 'var(--outline)' }} onClick={() => setManches((m) => m + 1)}>+</button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="display-title" style={{ fontSize: 12, letterSpacing: '.16em', color: 'var(--accent-lime)' }}>Jeux inclus</span>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{totalJeuxInclus} / {GAMES.length}</span>
        </div>
        {FAMILLES.map((f) => {
          const inclus = famillesIncluses.has(f.id);
          const nb = jeuxDeFamille(f.id).length;
          return (
            <button
              key={f.id}
              onClick={() => toggleFamille(f.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12, height: 56, padding: '0 14px', borderRadius: 16, cursor: 'pointer', fontFamily: 'inherit',
                background: inclus ? 'var(--accent-lime)' : 'var(--bg-panel-raised)',
                border: inclus ? '3px solid var(--outline)' : '3px solid var(--outline)',
                boxShadow: inclus ? 'var(--shadow-hard-sm)' : 'none',
                opacity: inclus ? 1 : 0.65,
              }}
            >
              <span className="display-title" style={{ flex: 1, textAlign: 'left', fontSize: 14, color: inclus ? 'var(--outline)' : 'var(--text-primary)' }}>{f.nom.toUpperCase()}</span>
              <span style={{ fontSize: 12, color: inclus ? 'var(--outline)' : 'var(--text-muted)' }}>{inclus ? nb : 0} / {nb}</span>
            </button>
          );
        })}
        {familleExclue && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg-deep)', border: '3px dashed var(--accent-cyan)', borderRadius: 16, padding: 14 }}>
            <span style={{ width: 24, height: 24, borderRadius: 8, background: 'var(--accent-cyan)', color: 'var(--outline)', fontFamily: 'var(--font-display)', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>i</span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>« {familleExclue.nom} » exclue de la rotation pour cette soirée.</span>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <button
          className="btn btn-yellow"
          disabled={!peutLancer}
          style={{ width: '100%', padding: '18px', fontSize: 18, display: 'flex', flexDirection: 'column', gap: 2 }}
          onClick={lancer}
        >
          Lancer la soirée auto
          <span style={{ fontSize: 11, fontFamily: 'var(--font-body)', textTransform: 'none', letterSpacing: 0 }}>
            {manches} manches · {totalJeuxInclus} jeux · {nbJoueurs} joueurs
          </span>
        </button>
        <span style={{ fontSize: 11, color: 'var(--text-dim)', textAlign: 'center' }}>On peut reprendre la main à tout moment en revenant au choix manuel</span>
      </div>
    </div>
  );
}

export default function GameSelectScreen({
  manche,
  vitesseReglage,
  onChangerVitesse,
  onChoisir,
  onHasard,
  nbJoueurs,
  onLancerAuto,
  nbParis,
  onOuvrirParis,
  selectionJoueur,
  onChangerSelectionJoueur,
  remote,
}) {
  const [sonActif, setSonActif] = useState(sonActifEst);
  const [segment, setSegment] = useState('manuel'); // manuel | auto
  const [vueListe, setVueListe] = useState(false);
  const [familleOuverte, setFamilleOuverte] = useState(null);
  const [drawerOuvert, setDrawerOuvert] = useState(false);

  const basculerSon = () => {
    const nouveau = !sonActif;
    definirSonActif(nouveau);
    setSonActif(nouveau);
  };

  return (
    <div className="stage" style={{ padding: '32px 34px 40px', display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="stripes-bg" />

      <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}>
        <div>
          <p className="eyebrow" style={{ color: 'var(--accent-yellow)' }}>Manche {manche}</p>
          <h1 className="display-title" style={{ fontSize: 'clamp(24px, 3.6vw, 36px)', margin: '6px 0 0' }}>Choisis le mini-jeu</h1>
          <p style={{ fontSize: 13, color: 'var(--text-dim)', marginTop: 6 }}>{GAMES.length} jeux · tout le monde y passe avant de changer.</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={basculerSon}
            className="btn"
            style={{ width: 52, height: 52, padding: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, background: 'var(--bg-panel-raised)' }}
          >
            <span style={{ fontSize: 16 }}>{sonActif ? '🔊' : '🔇'}</span>
            <span className="display-title" style={{ fontSize: 8, color: 'var(--text-dim)' }}>SON</span>
          </button>
          <button
            onClick={() => setDrawerOuvert(true)}
            className="btn"
            style={{ width: 52, height: 52, padding: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, background: 'var(--bg-panel-raised)' }}
          >
            <span style={{ fontSize: 16 }}>⚙️</span>
            <span className="display-title" style={{ fontSize: 8, color: 'var(--text-dim)' }}>RÉGLER</span>
          </button>
        </div>
      </div>

      <div style={{ position: 'relative', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 220px', minWidth: 0, display: 'flex', gap: 6, background: 'var(--bg-panel-raised)', border: '3px solid var(--outline)', borderRadius: 18, padding: 4 }}>
          <button
            onClick={() => setSegment('manuel')}
            className="display-title"
            style={{ flex: 1, height: 52, borderRadius: 14, border: 'none', cursor: 'pointer', fontSize: 13, background: segment === 'manuel' ? 'var(--accent-yellow)' : 'transparent', color: segment === 'manuel' ? 'var(--outline)' : 'var(--text-muted)', boxShadow: segment === 'manuel' ? 'var(--shadow-hard-sm)' : 'none' }}
          >
            Choix manuel
          </button>
          <button
            onClick={() => setSegment('auto')}
            className="display-title"
            style={{ flex: 1, height: 52, borderRadius: 14, border: 'none', cursor: 'pointer', fontSize: 13, background: segment === 'auto' ? 'var(--accent-yellow)' : 'transparent', color: segment === 'auto' ? 'var(--outline)' : 'var(--text-muted)', boxShadow: segment === 'auto' ? 'var(--shadow-hard-sm)' : 'none' }}
          >
            Mode auto
          </button>
        </div>
        <button
          onClick={onOuvrirParis}
          className="btn"
          style={{ flex: '1 1 160px', minWidth: 0, background: 'var(--bg-panel-raised)', borderColor: 'var(--accent-magenta)', color: 'var(--accent-magenta)', padding: '0 18px', fontSize: 12, whiteSpace: 'nowrap' }}
        >
          Paris du jour{nbParis > 0 ? ` (${nbParis})` : ''}
        </button>
      </div>

      <div style={{ position: 'relative' }}>
        {segment === 'manuel' ? (
          <>
            {vueListe ? <VueListeCompacte onChoisir={onChoisir} /> : <VueFamilles familleOuverte={familleOuverte} setFamilleOuverte={setFamilleOuverte} onChoisir={onChoisir} />}
            <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
              <button className="btn btn-primary" style={{ flex: 1, fontSize: 16, padding: '16px' }} onClick={onHasard}>
                Jeu au hasard
              </button>
              <button
                className="btn btn-secondary"
                style={{ width: 56, padding: 0, fontSize: 10 }}
                onClick={() => setVueListe((v) => !v)}
              >
                {vueListe ? 'Grille' : 'Liste'}
              </button>
            </div>
          </>
        ) : (
          <VueModeAuto nbJoueurs={nbJoueurs} onLancerAuto={onLancerAuto} />
        )}
      </div>

      <SettingsDrawer
        ouvert={drawerOuvert}
        onFermer={() => setDrawerOuvert(false)}
        vitesseReglage={vitesseReglage}
        onChangerVitesse={onChangerVitesse}
        sonActif={sonActif}
        onBasculerSon={basculerSon}
        selectionJoueur={selectionJoueur}
        onChangerSelectionJoueur={onChangerSelectionJoueur}
        remote={remote}
      />
    </div>
  );
}
