// emojisFloutes.js — émojis à deviner pour "Vision Floue" : un gros émoji
// flou qui se précise progressivement sur l'écran principal, les
// téléphones buzzent pour deviner à voix haute. Volontairement visuel,
// pas de mot à lire.

import { creerPickerAleatoire } from '../lib/randomSansRepeat.js';

export const EMOJIS_FLOUTES = [
  '🦁', '🍕', '🚀', '🐙', '🎸', '🦖', '🍿', '🐝', '🎃', '🦄',
  '🍔', '🐬', '🎲', '🦂', '🍩', '🐧', '🎷', '🦋', '🍉', '🐳',
  '⚽', '🐍', '🎯', '🦩', '🍓', '🐢', '🎈', '🦉', '🥑', '🐘',

  '🦈', '🐸', '🦥', '🦓', '🐿️', '🦔', '🐺', '🦭', '🐡', '🦒',
  '🐨', '🦜', '🦦', '🐜', '🦡', '🐹', '🦧', '🐷', '🦤', '🐊',
  '🦇', '🐭', '🦞', '🐇', '🦚', '🐴', '🦘', '🐔', '🦙', '🦫',
  '🕷️', '🦗', '🦑', '🦎', '🐫',

  '🌮', '🍦', '🍒', '🍇', '🍄', '🍭', '🍌', '🍪', '🍑', '🍋',
  '🍅', '🍆', '🍎', '🍊', '🍍', '🥕', '🥭', '🍐', '🥝', '🌽',

  '🎪', '🎻', '🥁', '🎨', '🎭', '🎹', '🎺', '🎱', '🎢', '🎡',
  '🎳', '🪀', '🎣', '🎤', '🪗',
];

export const emojiFlouteAleatoire = creerPickerAleatoire(EMOJIS_FLOUTES);
