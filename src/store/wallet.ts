import { create } from "zustand";
import { persist } from "zustand/middleware";
import { currentPrice, getProfil } from "@/data/series";

export type Investissement = {
  id: string;
  profilId: string;
  montantNoix: number; // amount of Noix invested
  valeurAchat: number; // price per "share" at purchase
  parts: number; // montant / valeurAchat
  date: number;
  // local boost from evaluations made by THIS player on this profile
  bonus: number; // multiplier added on top of base price for this player
};

export type Evaluation = {
  profilId: string;
  episodeNumero: number;
  originalite: number;
  authenticite: number;
  impact: number;
  watchVerified: boolean; // true si watch_time réel >= 80%
  ts: number;
};

// Watch time tracking per (profilId, episodeNumero)
export type WatchEntry = {
  profilId: string;
  episodeNumero: number;
  cumulativeTime: number; // seconds reellement passées en lecture
  duration: number; // duree totale connue (s)
  verified: boolean; // 80% atteint
};

// Snapshot du cours pour sparkline
export type CourseSnapshot = {
  profilId: string;
  ts: number;
  valeur: number;
};

type WalletState = {
  solde: number;
  investissements: Investissement[];
  evaluations: Evaluation[];
  watchTimes: WatchEntry[];
  // valeur "vivante" du cours par profil (modifiée par les votes vérifiés)
  liveValues: Record<string, number>;
  history: CourseSnapshot[];

  // actions
  reportWatch: (profilId: string, episodeNumero: number, cumulativeTime: number, duration: number) => void;
  saveEvaluation: (e: Omit<Evaluation, "watchVerified" | "ts">) => { ok: boolean; error?: string };
  investir: (profilId: string, montant: number) => { ok: boolean; error?: string };

  // selectors
  isUnlocked: (profilId: string, episodeNumero: number) => boolean;
  getWatch: (profilId: string, episodeNumero: number) => WatchEntry | undefined;
  effectivePrice: (profilId: string) => number;
  averageScore: (profilId: string) => number | null;
  hasVerifiedEvaluation: (profilId: string) => boolean;
  getSparkline: (profilId: string, points?: number) => number[];
};

const WATCH_THRESHOLD = 0.8; // 80%

export const useWallet = create<WalletState>()(
  persist(
    (set, get) => ({
      solde: 1000,
      investissements: [],
      evaluations: [],
      watchTimes: [],
      liveValues: {},
      history: [],

      // Track cumulative real watch time. Only credit forward progress
      // (caller is responsible for not adding seek-jumps) — this simulates
      // an anti-triche: on n'incrémente que par petits deltas réels.
      reportWatch: (profilId, episodeNumero, cumulativeTime, duration) =>
        set((state) => {
          const others = state.watchTimes.filter(
            (w) => !(w.profilId === profilId && w.episodeNumero === episodeNumero)
          );
          const verified = duration > 0 && cumulativeTime / duration >= WATCH_THRESHOLD;
          return {
            watchTimes: [
              ...others,
              { profilId, episodeNumero, cumulativeTime, duration, verified },
            ],
          };
        }),

      isUnlocked: (profilId, episodeNumero) => {
        const w = get().watchTimes.find(
          (x) => x.profilId === profilId && x.episodeNumero === episodeNumero
        );
        return !!w?.verified;
      },

      getWatch: (profilId, episodeNumero) =>
        get().watchTimes.find(
          (x) => x.profilId === profilId && x.episodeNumero === episodeNumero
        ),

      hasVerifiedEvaluation: (profilId) =>
        get().evaluations.some((e) => e.profilId === profilId && e.watchVerified),

      averageScore: (profilId) => {
        const evs = get().evaluations.filter((e) => e.profilId === profilId);
        if (evs.length === 0) return null;
        const sum = evs.reduce(
          (acc, e) => acc + (e.originalite + e.authenticite + e.impact) / 3,
          0
        );
        return sum / evs.length;
      },

      // Cours actuel = base initiale + somme des deltas vivants stockés.
      // Si pas encore de vote, on retombe sur currentPrice (historique seedé).
      effectivePrice: (profilId) => {
        const profil = getProfil(profilId);
        if (!profil) return 0;
        const live = get().liveValues[profilId];
        if (typeof live === "number") return +live.toFixed(2);
        return currentPrice(profilId);
      },

      saveEvaluation: ({ profilId, episodeNumero, originalite, authenticite, impact }) => {
        const state = get();
        const watch = state.watchTimes.find(
          (w) => w.profilId === profilId && w.episodeNumero === episodeNumero
        );
        // Anti-triche: refuse le vote si watch_time < 80%
        if (!watch || !watch.verified) {
          return { ok: false, error: "Visionnage incomplet — évaluation refusée." };
        }

        const score_brut = (originalite + authenticite + impact) / 3;
        const coeff_retention = 1.5; // toujours 1.5 ici car watch verifié
        const delta = (score_brut - 50) * coeff_retention * 0.01;

        const profil = getProfil(profilId);
        const baseValeur =
          state.liveValues[profilId] ?? (profil ? currentPrice(profilId) : 0);
        const nouvelleValeur = Math.max(1, +(baseValeur + delta).toFixed(2));

        const others = state.evaluations.filter(
          (x) => !(x.profilId === profilId && x.episodeNumero === episodeNumero)
        );

        const snapshot: CourseSnapshot = {
          profilId,
          ts: Date.now(),
          valeur: nouvelleValeur,
        };
        // garde les 50 derniers snapshots par profil pour rester léger
        const historyForProfile = state.history
          .filter((h) => h.profilId === profilId)
          .slice(-49);
        const historyOther = state.history.filter((h) => h.profilId !== profilId);

        set({
          evaluations: [
            ...others,
            {
              profilId,
              episodeNumero,
              originalite,
              authenticite,
              impact,
              watchVerified: true,
              ts: Date.now(),
            },
          ],
          liveValues: { ...state.liveValues, [profilId]: nouvelleValeur },
          history: [...historyOther, ...historyForProfile, snapshot],
        });

        return { ok: true };
      },

      investir: (profilId, montant) => {
        const state = get();
        if (montant <= 0) return { ok: false, error: "Montant invalide" };
        if (montant > state.solde) return { ok: false, error: "Solde insuffisant" };
        const prix = state.effectivePrice(profilId);
        if (prix <= 0) return { ok: false, error: "Cours indisponible" };
        const parts = +(montant / prix).toFixed(4);
        const inv: Investissement = {
          id: `${profilId}-${Date.now()}`,
          profilId,
          montantNoix: montant,
          valeurAchat: prix,
          parts,
          date: Date.now(),
          bonus: 0,
        };
        set({
          solde: +(state.solde - montant).toFixed(2),
          investissements: [...state.investissements, inv],
        });
        return { ok: true };
      },

      getSparkline: (profilId, points = 12) => {
        const snaps = get()
          .history.filter((h) => h.profilId === profilId)
          .slice(-points)
          .map((s) => s.valeur);
        if (snaps.length >= 2) return snaps;
        // fallback: utilise l'historique seedé
        const profil = getProfil(profilId);
        if (!profil) return [];
        const live = get().effectivePrice(profilId);
        // génère une mini-courbe à partir de la valeur initiale -> live
        const start = profil.valeurInitiale;
        const end = live;
        const arr: number[] = [];
        for (let i = 0; i < points; i++) {
          const t = i / (points - 1);
          arr.push(+(start + (end - start) * t).toFixed(2));
        }
        return arr;
      },
    }),
    { name: "noix-benies-wallet-v2" }
  )
);

// Portfolio computations
export function portfolioValue(
  investissements: Investissement[],
  effectivePrice: (id: string) => number
) {
  return investissements.reduce((acc, inv) => {
    const valActuelle = effectivePrice(inv.profilId) * inv.parts;
    // Capital protection: never realize less than the entry capital
    const protege = Math.max(valActuelle, inv.montantNoix);
    return acc + protege;
  }, 0);
}

export function plusValue(inv: Investissement, prixActuel: number) {
  const valActuelle = prixActuel * inv.parts;
  if (valActuelle <= inv.montantNoix) return 0; // protégé
  return +(valActuelle - inv.montantNoix).toFixed(2);
}
