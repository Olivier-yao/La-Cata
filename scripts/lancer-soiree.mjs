// lancer-soiree.mjs — un seul point d'entrée pour démarrer la soirée :
// lance l'écran principal (Vite) et le serveur manette ensemble, dans le
// même terminal, sans avoir à ouvrir deux fenêtres séparées.
//
// Si l'un des deux tourne déjà (laissé actif d'une soirée précédente, ou
// npm start lancé deux fois par erreur), on ne relance pas une deuxième
// instance en double — on affiche juste un message clair au lieu de
// l'erreur Node brute que ça produirait autrement.

import { spawn } from 'node:child_process';
import net from 'node:net';

const PORT_DEV = 5183;
const PORT_REMOTE = 5185;
const processus = [];
let arretEnCours = false;

function portOccupe(port) {
  return new Promise((resolve) => {
    // Pas d'adresse précisée : on reproduit exactement le binding par
    // défaut des deux serveurs (dual-stack "::"), sinon un test explicite
    // sur 0.0.0.0 peut réussir à tort à côté d'un socket déjà lié en ::.
    const testeur = net.createServer();
    testeur.once('error', () => resolve(true));
    testeur.once('listening', () => testeur.close(() => resolve(false)));
    testeur.listen(port);
  });
}

function arreterTout() {
  if (arretEnCours) return;
  arretEnCours = true;
  processus.forEach((p) => p.kill());
  process.exit();
}

process.on('SIGINT', arreterTout);
process.on('SIGTERM', arreterTout);

const [devDejaLance, remoteDejaLance] = await Promise.all([
  portOccupe(PORT_DEV),
  portOccupe(PORT_REMOTE),
]);

if (devDejaLance) {
  console.log(`\n(L'écran principal sur le port ${PORT_DEV} tourne déjà — ouvre juste http://localhost:${PORT_DEV} dans le navigateur.)`);
} else {
  const dev = spawn('npx vite --host', { stdio: 'inherit', shell: true });
  processus.push(dev);
  dev.on('exit', arreterTout);
}

if (remoteDejaLance) {
  console.log(`(Le serveur manette sur le port ${PORT_REMOTE} tourne déjà — pas besoin de le relancer.)\n`);
} else {
  const remote = spawn('node', ['server/remote-server.mjs'], { stdio: 'inherit' });
  processus.push(remote);
  remote.on('exit', arreterTout);
}

if (devDejaLance && remoteDejaLance) {
  console.log('Tout tourne déjà — rien à faire ici, tu peux fermer ce terminal.');
  process.exit();
}
