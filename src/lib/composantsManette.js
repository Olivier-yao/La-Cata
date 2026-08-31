import BuzzerPhone from '../manette/BuzzerPhone.jsx';
import MashPhone from '../manette/MashPhone.jsx';
import QcmPhone from '../manette/QcmPhone.jsx';
import SequencePhone from '../manette/SequencePhone.jsx';
import DessinPhone from '../manette/DessinPhone.jsx';
import RolePhone from '../manette/RolePhone.jsx';
import EstimationPhone from '../manette/EstimationPhone.jsx';

// composantsManette.js — associe le `prim` d'un payload d'action-broadcast
// au composant téléphone qui sait l'afficher. Un seul point d'entrée pour
// les 20 mini-jeux manette, tous bâtis sur ces 6 primitives — voir
// src/manette/*.

export const COMPOSANTS_MANETTE_PAR_PRIM = {
  buzzer: BuzzerPhone,
  mash: MashPhone,
  qcm: QcmPhone,
  sequence: SequencePhone,
  dessin: DessinPhone,
  'role-secret': RolePhone,
  estimation: EstimationPhone,
};
