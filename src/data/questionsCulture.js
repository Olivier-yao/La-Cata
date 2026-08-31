// questionsCulture.js — trivia cinéma / musique / jeux vidéo pour
// "Souvenirs de Ciné" (buzzer + QCM jugé par l'hôte).

import { creerPickerAleatoire } from '../lib/randomSansRepeat.js';

export const QUESTIONS_CULTURE = [
  { question: 'Quel personnage porte un chapeau et un fouet dans une célèbre saga d\'aventure ?', options: ['James Bond', 'Indiana Jones', 'Han Solo', 'Jack Sparrow'], bonneReponse: 1 },
  { question: 'Quel studio a créé les films "Toy Story" et "Le Monde de Nemo" ?', options: ['DreamWorks', 'Pixar', 'Illumination', 'Blue Sky'], bonneReponse: 1 },
  { question: 'Quel jeu vidéo met en scène un plombier moustachu qui sauve une princesse ?', options: ['Sonic', 'Mario', 'Zelda', 'Kirby'], bonneReponse: 1 },
  { question: 'Quel artiste est surnommé "le roi de la pop" ?', options: ['Prince', 'Michael Jackson', 'Elvis Presley', 'James Brown'], bonneReponse: 1 },
  { question: 'Dans quel film un jeune sorcier porte des lunettes rondes et une cicatrice en forme d\'éclair ?', options: ['Le Seigneur des Anneaux', 'Harry Potter', 'Narnia', 'Percy Jackson'], bonneReponse: 1 },
  { question: 'Quel groupe a chanté "Bohemian Rhapsody" ?', options: ['The Beatles', 'Queen', 'Pink Floyd', 'Led Zeppelin'], bonneReponse: 1 },
  { question: 'Quel super-héros porte un bouclier en forme d\'étoile ?', options: ['Iron Man', 'Captain America', 'Thor', 'Hulk'], bonneReponse: 1 },
  { question: 'Quel jeu vidéo consiste à construire et miner dans un monde de blocs ?', options: ['Fortnite', 'Minecraft', 'Roblox', 'Terraria'], bonneReponse: 1 },
  { question: 'Quel film raconte l\'histoire d\'un lion qui devient roi de la savane ?', options: ['Madagascar', 'Le Roi Lion', 'Kung Fu Panda', 'Zootopie'], bonneReponse: 1 },
  { question: 'Quelle chanteuse ivoirienne/africaine est connue pour le titre "Coupé Décalé" popularisé par le mouvement du même nom ?', options: ['Aya Nakamura', 'DJ Arafat', 'Tiken Jah Fakoly', 'Yodé et Siro'], bonneReponse: 1 },
  { question: 'Quel personnage de jeu vidéo est un hérisson bleu ultra-rapide ?', options: ['Mario', 'Sonic', 'Crash Bandicoot', 'Rayman'], bonneReponse: 1 },
  { question: 'Quel film d\'animation met en scène des jouets qui prennent vie ?', options: ['Toy Story', 'Cars', 'Les Indestructibles', 'Ratatouille'], bonneReponse: 0 },
  { question: 'Quel est l\'instrument principal utilisé dans le zouglou ivoirien ?', options: ['La guitare électrique', 'Les percussions', 'Le piano', 'Le violon'], bonneReponse: 1 },
  { question: 'Quel film met en scène un bateau qui coule après avoir heurté un iceberg ?', options: ['Titanic', 'Le Poséidon', 'Speed 2', 'Deep Impact'], bonneReponse: 0 },
  { question: 'Quel jeu vidéo oppose des joueurs sur une île qui rétrécit ?', options: ['Minecraft', 'Fortnite', 'Among Us', 'FIFA'], bonneReponse: 1 },
];

export const questionCultureAleatoire = creerPickerAleatoire(QUESTIONS_CULTURE);
