import medInBlack from "@/assets/posters/med-in-black.png";
import monHistoire from "@/assets/posters/mon-histoire.png";
import parFoi from "@/assets/posters/par-foi.png";
import transeMission from "@/assets/posters/transe-mission.png";
import uneFoisParent from "@/assets/posters/une-fois-parent.png";
import wowmen from "@/assets/posters/wowmen.png";
import blacksOne from "@/assets/posters/blacks-one.png";
import coachMe from "@/assets/posters/coach-me.png";
import dixeat from "@/assets/posters/dixeat.png";
import fiatLuxe from "@/assets/posters/fiat-luxe.png";
import hautLaMain from "@/assets/posters/haut-la-main.png";
import ilsNousZem from "@/assets/posters/ils-nous-zem.png";
import influences from "@/assets/posters/influences.png";
import parcoursRetour from "@/assets/posters/parcours-retour.png";
import lieuxDits from "@/assets/posters/lieux-dits.png";
import marcheConclu from "@/assets/posters/marche-conclu.png";
import photoAmara from "@/assets/profiles/amara.jpg";
import photoKemi from "@/assets/profiles/kemi.jpg";
import photoIbrahim from "@/assets/profiles/ibrahim.jpg";
import photoNaima from "@/assets/profiles/naima.jpg";

export type Episode = {
  numero: number;
  titre: string;
  question: string;
  videoUrl: string;
};

export type Profil = {
  id: string;
  seriesId: string;
  nomComplet: string;
  age: number;
  profession: string;
  bioCourte: string;
  ville: string;
  initiales: string;
  accent: string; // hex for avatar background
  photoUrl?: string;
  valeurInitiale: number;
  episodes: Episode[];
};

export type Serie = {
  id: string;
  titre: string;
  synopsis: string;
  affiche: string | null;
  posterGradient: string;
  posterAccent: string;
  casting: string;
  themes: string[];
};

// Vidéo MP4 libre de droits (Big Buck Bunny) — utilisée comme placeholder
// pour permettre la mesure réelle du watch_time côté client.
const SAMPLE_VIDEOS = [
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
];
const pickVideo = (seed: string) => {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return SAMPLE_VIDEOS[Math.abs(h) % SAMPLE_VIDEOS.length];
};

const ep = (n: number, titre: string, question: string, seed: string): Episode => ({
  numero: n,
  titre,
  question,
  videoUrl: pickVideo(seed),
});

export const series: Serie[] = [
  {
    id: "lieux-dits",
    titre: "Lieux-dits",
    synopsis: "Les sites historiques ne sont pas muets ; ils sont les haut-parleurs de notre mémoire collective.",
    affiche: lieuxDits,
    posterGradient: "linear-gradient(160deg, #2a3d2e, #6e8a6f)",
    posterAccent: "#f4e3b2",
    casting: "Quatre gardiens de mémoire : un berger, une libraire, un architecte et une conteuse.",
    themes: ["Mémoire", "Territoire", "Identité"],
  },
  {
    id: "parcours-retour",
    titre: "Le Parcours du Retour",
    synopsis: "Le portrait de ceux dont le chemin vers soi a nécessité un demi-tour géographique vers la terre mère.",
    affiche: parcoursRetour,
    posterGradient: "linear-gradient(140deg, #1f2c4a, #d4845a)",
    posterAccent: "#ffd9a8",
    casting: "Une entrepreneuse, un médecin, un agriculteur et une écrivaine de la diaspora.",
    themes: ["Diaspora", "Racines", "Reconstruction"],
  },
  {
    id: "blacks-one",
    titre: "Blacks One",
    synopsis: "L'incarnation d'une conscience panafricaine moderne et d'une excellence qui ne connaît plus de frontières.",
    affiche: blacksOne,
    posterGradient: "linear-gradient(135deg, #0f0f12, #c9a84c)",
    posterAccent: "#f3d97a",
    casting: "Un trader, une chercheuse, un avocat d'affaires et une fondatrice de startup.",
    themes: ["Excellence", "Héritage", "Vision"],
  },
  {
    id: "une-fois-parent",
    titre: "Une fois parent",
    synopsis: "L'aventure la plus radicale de l'existence humaine : l'art de transmettre et le devoir de protéger l'enfance.",
    affiche: uneFoisParent,
    posterGradient: "linear-gradient(160deg, #5a3a2a, #c98a6a)",
    posterAccent: "#ffe0c8",
    casting: "Deux mères, deux pères — quatre regards sur la transmission et le sacrifice.",
    themes: ["Famille", "Transmission", "Amour"],
  },
  {
    id: "haut-la-main",
    titre: "Haut la main",
    synopsis: "Éloge de l'ingéniosité manuelle. Transformer chaque panne en succès et chaque objet cassé en œuvre d'art.",
    affiche: hautLaMain,
    posterGradient: "linear-gradient(155deg, #3a2418, #b86b3a)",
    posterAccent: "#f0c89a",
    casting: "Un horloger, une couturière, un menuisier et une céramiste.",
    themes: ["Artisanat", "Geste", "Savoir-faire"],
  },
  {
    id: "dixeat",
    titre: "Dixeat",
    synopsis: "Ce que nous disons à table est plus vital que ce que nous mangeons. La nourriture comme lien sacré.",
    affiche: dixeat,
    posterGradient: "linear-gradient(140deg, #6a2820, #e8a85a)",
    posterAccent: "#ffe9b8",
    casting: "Un chef, une grand-mère, un sommelier et une food-journaliste.",
    themes: ["Cuisine", "Partage", "Mémoire"],
  },
  {
    id: "wowmen",
    titre: "WoWmen",
    synopsis: "La force silencieuse et invincible des femmes qui portent, chaque jour, l'économie et l'avenir du pays.",
    affiche: wowmen,
    posterGradient: "linear-gradient(150deg, #1a4a52, #e8714a)",
    posterAccent: "#ffd0b8",
    casting: "Quatre femmes qui ont choisi le devoir avant la lumière, et la lumière les a trouvées.",
    themes: ["Féminin", "Leadership", "Discret"],
  },
  {
    id: "coach-me",
    titre: "Coach me if you can",
    synopsis: "La vie comme premier mentor. Une exploration du coaching naturel et de l'échange vital entre générations.",
    affiche: coachMe,
    posterGradient: "linear-gradient(135deg, #1c2840, #5ab8a0)",
    posterAccent: "#c8f0e0",
    casting: "Un coach sportif, une mentor business, un éducateur de rue et une thérapeute.",
    themes: ["Mentorat", "Sagesse", "Relais"],
  },
  {
    id: "par-foi",
    titre: "Par foi",
    synopsis: "Croire en l'invisible pour bâtir enfin le visible. Le saut dans le vide nécessaire à tous les bâtisseurs.",
    affiche: parFoi,
    posterGradient: "linear-gradient(160deg, #2a1f18, #8a6a4a)",
    posterAccent: "#e8c8a0",
    casting: "Un pasteur, une entrepreneuse, un militant et une artiste.",
    themes: ["Conviction", "Spiritualité", "Courage"],
  },
  {
    id: "med-in-black",
    titre: "Med in Black",
    synopsis: "L'excellence médicale au Bénin. Quand la rigueur de la science rencontre la fragilité de l'humain.",
    affiche: medInBlack,
    posterGradient: "linear-gradient(150deg, #1a2a4a, #a48ad4)",
    posterAccent: "#d8c8f0",
    casting: "Un urgentiste, une sage-femme, un psychiatre et une infirmière de nuit.",
    themes: ["Médecine", "Humain", "Engagement"],
  },
  {
    id: "mon-histoire",
    titre: "Mon Histoire fera le travail",
    synopsis: "Le parcours de vie comme CV ultime. La résilience de terrain face à la tyrannie des diplômes classiques.",
    affiche: monHistoire,
    posterGradient: "linear-gradient(155deg, #3a1f5a, #c89adc)",
    posterAccent: "#f0d8ff",
    casting: "Quatre autodidactes qui ont fait du vécu leur métier.",
    themes: ["Résilience", "Self-made", "Revanche"],
  },
  {
    id: "influences",
    titre: "Influences",
    synopsis: "Inspirer sans jamais se trahir. L'impact réel et profond des nouveaux créateurs sur la société béninoise.",
    affiche: influences,
    posterGradient: "linear-gradient(140deg, #1a1a2e, #e85d8a)",
    posterAccent: "#ffc8d8",
    casting: "Une créatrice, un activiste, une journaliste et un musicien numérique.",
    themes: ["Numérique", "Vérité", "Impact"],
  },
  {
    id: "ils-nous-zem",
    titre: "Ils Nous Zem",
    synopsis: "Les conducteurs de taxi-moto comme messagers du quotidien et véritable pouls battant de la cité.",
    affiche: ilsNousZem,
    posterGradient: "linear-gradient(150deg, #1a1a1a, #d4842a)",
    posterAccent: "#ffd092",
    casting: "Quatre conducteurs — taxi, VTC, livreur, moto — gardiens de mille vies anonymes.",
    themes: ["Rue", "Solidarité", "Humanité"],
  },
  {
    id: "marche-conclu",
    titre: "Marché Conclu",
    synopsis: "Le marché comme théâtre d'intelligence commerciale, de joutes oratoires et de pures relations humaines.",
    affiche: marcheConclu,
    posterGradient: "linear-gradient(145deg, #2a1810, #b87838)",
    posterAccent: "#f0c89a",
    casting: "Un brocanteur, une commerciale, un agent immobilier et une marchande d'art.",
    themes: ["Négociation", "Émotion", "Valeur"],
  },
  {
    id: "transe-mission",
    titre: "Transe Mission",
    synopsis: "La perpétuation des traditions millénaires et des rythmes sacrés. Le lien vivant entre hier et demain.",
    affiche: transeMission,
    posterGradient: "linear-gradient(160deg, #1a3a6a, #e8b04a)",
    posterAccent: "#ffe0a8",
    casting: "Un tradipraticien, une chanteuse rituelle, un griot et une danseuse-chorégraphe.",
    themes: ["Spirituel", "Ancêtres", "Rite"],
  },
  {
    id: "fiat-luxe",
    titre: "Fiât Luxe",
    synopsis: "L'abondance assumée avec éclat. Une célébration de la réussite, du prestige et de l'art de vivre béninois.",
    affiche: fiatLuxe,
    posterGradient: "linear-gradient(135deg, #1a1a1a, #c9a84c)",
    posterAccent: "#f0d97a",
    casting: "Un hôtelier, une joaillière, un designer et une mécène.",
    themes: ["Luxe", "Mérite", "Élévation"],
  },
];

export const episodesBySerie: Record<string, Episode[]> = {
  "lieux-dits": [
    ep(1, "L'Éveil des Pierres", "Racontez le jour où un lieu vous a parlé.", "ld1"),
    ep(2, "Le Secret des Murs", "Un endroit qui a changé votre état d'esprit.", "ld2"),
    ep(3, "Le Gardien de l'Histoire", "Le moment où vous vous êtes senti gardien d'une histoire.", "ld3"),
    ep(4, "La Rencontre des Racines", "Une rencontre qui a changé votre regard sur vos racines.", "ld4"),
  ],
  "parcours-retour": [
    ep(1, "La Bascule", "Le moment où l'ailleurs n'était plus votre maison.", "pr1"),
    ep(2, "Le Défi de l'Acceptation", "Le défi pour se faire accepter à nouveau.", "pr2"),
    ep(3, "La Redécouverte de Soi", "Redécouvrir une part de soi oubliée.", "pr3"),
    ep(4, "La Première Pierre", "La première pierre de votre retour.", "pr4"),
  ],
  "blacks-one": [
    ep(1, "L'Atout Maître", "Transformer une différence en avantage.", "bo1"),
    ep(2, "La Clé Identitaire", "Quand l'identité ouvre une porte fermée.", "bo2"),
    ep(3, "L'Héritier de Lignée", "Fierté d'être l'héritier de bâtisseurs.", "bo3"),
    ep(4, "L'Excellence Affirmée", "Vision d'un futur d'excellence.", "bo4"),
  ],
  "une-fois-parent": [
    ep(1, "Le Miroir", "Le jour où votre regard sur l'avenir a radicalement changé.", "up1"),
    ep(2, "Le Sacrifice", "Un geste d'amour que vous ne regretterez jamais.", "up2"),
    ep(3, "L'Héritage", "Le moment où vous avez vu vos propres parents en vous.", "up3"),
    ep(4, "La Promesse", "Ce que vous souhaitez laisser de plus précieux que l'argent.", "up4"),
  ],
  "haut-la-main": [
    ep(1, "La Solution des Mains", "Les mains trouvent la solution avant la tête.", "hm1"),
    ep(2, "L'Outil Sauveur", "L'outil qui vous a sauvé.", "hm2"),
    ep(3, "L'Intelligence des Doigts", "L'intelligence au bout des doigts.", "hm3"),
    ep(4, "La Fierté du Geste", "La fierté d'un objet qui fonctionne à nouveau.", "hm4"),
  ],
  "dixeat": [
    ep(1, "Le Partage Royal", "Le partage plus important que l'assiette.", "dx1"),
    ep(2, "La Vérité de Table", "Une vérité dite autour d'une table.", "dx2"),
    ep(3, "Le Goût de la Force", "Un goût qui redonne de la force.", "dx3"),
    ep(4, "Le Pont Gourmand", "La nourriture comme pont entre deux mondes.", "dx4"),
  ],
  "wowmen": [
    ep(1, "Le Leader Invisible", "Porter une responsabilité sans titre officiel.", "ww1"),
    ep(2, "Le Défi par Amour", "Un défi relevé par pur devoir.", "ww2"),
    ep(3, "Ouvrir la Voie", "Ouvrir une voie pour les suivantes.", "ww3"),
    ep(4, "L'Inspiration Verticale", "Réaliser que votre force inspire les autres.", "ww4"),
  ],
  "coach-me": [
    ep(1, "La Leçon de l'Inconnu", "Leçon reçue d'une personne inattendue.", "cm1"),
    ep(2, "La Sagesse de l'Erreur", "Une erreur devenue votre plus grande sagesse.", "cm2"),
    ep(3, "Révéler l'Autre", "Aider quelqu'un à se révéler.", "cm3"),
    ep(4, "Devenir le Guide", "Devenir le guide à son tour.", "cm4"),
  ],
  "par-foi": [
    ep(1, "La Conviction Pure", "Agir par conviction sans aucune garantie.", "pf1"),
    ep(2, "L'Impossible Possible", "Quand l'impossible devient possible.", "pf2"),
    ep(3, "Le Signe de Route", "Le petit signe qui vous a empêché d'abandonner.", "pf3"),
    ep(4, "Le Bon Chemin", "La certitude d'être sur le bon chemin.", "pf4"),
  ],
  "med-in-black": [
    ep(1, "La Vie entre les Mains", "La fragilité de la vie entre vos mains.", "mb1"),
    ep(2, "L'Intuition Médicale", "Quand le savoir médical s'adapte à l'humain.", "mb2"),
    ep(3, "Porter l'Espoir", "Rester solide pour porter l'espoir de l'autre.", "mb3"),
    ep(4, "Leçon d'Existence", "Ce que soigner vous apprend sur vous-même.", "mb4"),
  ],
  "mon-histoire": [
    ep(1, "La Compétence de Galère", "Une épreuve de vie devenue une compétence métier.", "mh1"),
    ep(2, "L'Expérience Gagnante", "L'expérience plus forte que le diplôme.", "mh2"),
    ep(3, "L'Instinct de Gestion", "Utiliser son instinct de survie en gestion.", "mh3"),
    ep(4, "Le Pari de Soi", "Réussir un pari que personne n'osait prendre.", "mh4"),
  ],
  "influences": [
    ep(1, "Le Destin d'Autrui", "Le jour où vos paroles ont changé un destin.", "in1"),
    ep(2, "Le Choix de la Vérité", "Choisir d'être soi plutôt que de plaire à la foule.", "in2"),
    ep(3, "L'Impact Concret", "Un impact concret né du monde numérique.", "in3"),
    ep(4, "La Transmission Vraie", "Transmettre le vrai dans un monde d'apparences.", "in4"),
  ],
  "ils-nous-zem": [
    ep(1, "L'Aventure Humaine", "Un trajet devenu une confidence humaine.", "iz1"),
    ep(2, "La Solidarité de Route", "Solidarité immédiate entre inconnus sur la route.", "iz2"),
    ep(3, "Le Fardeau Partagé", "Un fardeau partagé avec un client.", "iz3"),
    ep(4, "La Leçon de la Rue", "Ce que la ville vous a appris sur la nature humaine.", "iz4"),
  ],
  "marche-conclu": [
    ep(1, "La Confiance Gagne", "Une négociation gagnée par l'émotion.", "mc1"),
    ep(2, "La Valeur de l'Histoire", "La valeur dépend uniquement de l'histoire racontée.", "mc2"),
    ep(3, "L'Amitié Durable", "Un simple échange devenu une amitié.", "mc3"),
    ep(4, "L'Achat Précieux", "Acheter ou vendre quelque chose qui n'a pas de prix.", "mc4"),
  ],
  "transe-mission": [
    ep(1, "La Connexion Totale", "Connexion avec ce qui nous dépasse.", "tm1"),
    ep(2, "Le Rythme Sacré", "Un rythme qui transforme votre esprit.", "tm2"),
    ep(3, "Le Lien Vivant", "Être le lien entre vos ancêtres et le futur.", "tm3"),
    ep(4, "Le Savoir Transmis", "Transmettre un savoir qui n'est pas dans les livres.", "tm4"),
  ],
  "fiat-luxe": [
    ep(1, "Le Choix de l'Excellence", "Décider que l'on mérite l'excellence.", "fl1"),
    ep(2, "L'Abondance Partagée", "L'abondance qui sert à élever les autres.", "fl2"),
    ep(3, "La Meilleure Version", "La beauté comme moteur de changement social.", "fl3"),
    ep(4, "Le Luxe Ultime", "Votre définition personnelle du luxe ultime.", "fl4"),
  ],
};

// 4 archetypes per series — 64 total
const profileTemplates: Array<{ prenom: string; nom: string; age: number; profession: string; bio: string; ville: string; accent: string; photo: string }> = [
  { prenom: "Amara", nom: "Diallo", age: 34, profession: "Architecte", bio: "Conçoit des espaces qui racontent.", ville: "Dakar", accent: "#d4845a", photo: photoAmara },
  { prenom: "Kémi", nom: "Adjovi", age: 41, profession: "Entrepreneuse", bio: "A bâti trois maisons depuis rien.", ville: "Cotonou", accent: "#5a8a9a", photo: photoKemi },
  { prenom: "Ibrahim", nom: "Sow", age: 29, profession: "Réalisateur", bio: "Filme ce que les autres ne voient plus.", ville: "Paris", accent: "#8a6a4a", photo: photoIbrahim },
  { prenom: "Naïma", nom: "Bensoussan", age: 37, profession: "Avocate", bio: "Plaide pour celles qu'on n'écoute pas.", ville: "Marseille", accent: "#c98a6a", photo: photoNaima },
];

export const profils: Profil[] = series.flatMap((s) =>
  profileTemplates.map((t, i) => {
    const id = `${s.id}-p${i + 1}`;
    return {
      id,
      seriesId: s.id,
      nomComplet: `${t.prenom} ${t.nom}`,
      age: t.age + (i % 2),
      profession: t.profession,
      bioCourte: t.bio,
      ville: t.ville,
      initiales: `${t.prenom[0]}${t.nom[0]}`,
      accent: [s.posterAccent, t.accent, "#8a6a4a", "#5a8a9a"][i],
      photoUrl: t.photo,
      valeurInitiale: 10,
      episodes: episodesBySerie[s.id],
    };
  })
);

export function getSerie(id: string) {
  return series.find((s) => s.id === id);
}

export function getProfil(id: string) {
  return profils.find((p) => p.id === id);
}

export function getProfilsForSerie(seriesId: string) {
  return profils.filter((p) => p.seriesId === seriesId);
}

// Stable pseudo-random history seeded by profile id
function seedRandom(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return () => {
    h = (h * 1664525 + 1013904223) | 0;
    return ((h >>> 0) % 1000) / 1000;
  };
}

export function getPriceHistory(profilId: string) {
  const rand = seedRandom(profilId);
  const points: { jour: string; valeur: number }[] = [];
  let v = 10;
  for (let i = 0; i < 14; i++) {
    const drift = (rand() - 0.45) * 0.18;
    v = Math.max(2, +(v * (1 + drift)).toFixed(2));
    points.push({ jour: `J${i + 1}`, valeur: v });
  }
  return points;
}

export function currentPrice(profilId: string) {
  const h = getPriceHistory(profilId);
  return h[h.length - 1].valeur;
}
