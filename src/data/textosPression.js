import { creerPickerAleatoire } from '../lib/randomSansRepeat.js';

// textosPression.js — messages absurdes et longs à retaper mot pour mot,
// à toute vitesse, pour "Texto Sous Pression".

export const TEXTOS_PRESSION = [
  "Salut, je voulais juste te dire que le chat du voisin a encore dormi sur ma voiture toute la nuit et qu'il refuse catégoriquement de s'excuser.",
  "Urgent : j'ai perdu mon deuxième chausson gauche dans le gbaka de ce matin, si quelqu'un le retrouve merci de me contacter avant qu'il ne devienne célèbre.",
  "Petit rappel amical que la réunion de demain a été déplacée à une heure que personne ne connaît encore, dans une salle qui n'existe peut-être pas.",
  "Je confirme officiellement que l'attiéké de ce midi était si bon que j'ai sérieusement envisagé de lui écrire une lettre de remerciement manuscrite.",
  "Attention, le wifi du quartier a des sautes d'humeur depuis ce matin et personne ne sait exactement pourquoi, ni même s'il le sait lui-même.",
  "Je tiens à préciser que ce n'est absolument pas moi qui ai fini le dernier paquet de biscuits, même si les miettes sur mon clavier suggèrent le contraire.",
  "Message important : le voisin du dessus a recommencé à répéter sa chorégraphie à minuit pile, et franchement, ça devient presque impressionnant.",
  "Je te préviens que si tu m'envoies encore un mème de chat aujourd'hui, je vais devoir t'envoyer dix mèmes de chèvres en représailles immédiates.",
  "Compte rendu de la journée : trois gbaka en retard, un vendeur d'eau glacée héroïque, et une averse qui n'avait clairement pas prévenu personne.",
  "Sache que j'ai passé la moitié de mon après-midi à chercher mes clés avant de réaliser qu'elles étaient dans ma main depuis le tout début.",
  "Petite annonce : le tonton du quartier organise une réunion improvisée sur le prix du taxi, et visiblement tout le monde a un avis très tranché là-dessus.",
  "Je confirme avoir vu un homme promener trois perroquets en laisse ce matin, et non, personne autour de lui n'avait l'air surpris le moins du monde.",
];

export const textoPressionAleatoire = creerPickerAleatoire(TEXTOS_PRESSION);
