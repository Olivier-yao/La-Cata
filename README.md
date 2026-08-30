# La Cata

Jeu de soirée pour PC, à jouer à plusieurs autour d'un même écran (façon
Jackbox mais en local, sans téléphones nécessaires pour l'instant).

Principe : un texte défile, tu dois le lire — avec des contraintes qui
varient selon le mini-jeu (vitesse qui explose, accent imposé, sérieux à
tenir). Le groupe vote la performance, les points s'accumulent.

## Mini-jeux inclus dans ce MVP

1. **Virelangue Express** — le texte accélère tout seul pendant la lecture
2. **Accent Surprise** — un accent imposé s'affiche, à tenir sur un texte neutre
3. **Sans Rire** — lire un texte absurde en gardant son sérieux, pendant que
   les autres essaient de déstabiliser le lecteur
4. **Défi Chrono Absurde** — une action physique ridicule à réussir avant la
   fin du compte à rebours (seul mini-jeu qui sort du texte défilant)

Un mini-jeu aléatoire est tiré à chaque tour, les joueurs passent chacun leur
tour, le score s'affiche en continu en haut de l'écran.

## Structure du projet

```
la-cata/
├── index.html
├── src/
│   ├── main.jsx
│   ├── App.jsx                 # bascule accueil / setup joueurs / manches
│   ├── theme.css                # identité visuelle (aubergine + magenta/lime)
│   ├── data/
│   │   ├── games.js             # registre des mini-jeux
│   │   ├── virelangues.js
│   │   ├── accents.js
│   │   ├── sansRire.js
│   │   └── defis.js
│   ├── components/
│   │   ├── ScrollingText.jsx    # le texte défilant réutilisable (cœur du jeu)
│   │   ├── CountdownTimer.jsx
│   │   ├── PlayerSetup.jsx
│   │   └── ScoreBoard.jsx
│   ├── games/
│   │   ├── VirelangueExpress.jsx
│   │   ├── AccentSurprise.jsx
│   │   ├── SansRire.jsx
│   │   └── DefiChronoAbsurde.jsx
│   └── screens/
│       ├── HomeScreen.jsx
│       └── RoundScreen.jsx      # moteur de manche : tirage jeu + rotation joueurs
```

## Lancer le projet

```bash
npm install
npm run dev
```

Ouvre l'URL affichée (généralement `http://localhost:5173`) sur le PC branché
à la TV/l'écran de la soirée.

## Prochaines étapes suggérées

1. **Mode manettes-téléphones** : chaque joueur scanne un QR code pour
   rejoindre la partie depuis son téléphone (vote, boutons) pendant que
   l'écran principal reste sur le PC — nécessiterait un petit serveur
   WebSocket (Node + `ws` ou Socket.IO) pour synchroniser PC ↔ téléphones.
2. Ajouter les autres variantes évoquées : Doublage Sauvage, Chant Imposé,
   Le Menteur, Statue Surprise.
3. Musique/sons d'ambiance et bruitages (buzzer, applaudissements) pour
   renforcer l'effet "jeu télé".
4. Écran de fin de soirée avec podium et récap des pires/meilleures manches.
