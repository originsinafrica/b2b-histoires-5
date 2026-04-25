import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Shield,
  X,
} from "lucide-react";
import {
  getProfil,
  getSerie,
  getPriceHistory,
  getProfilsForSerie,
} from "@/data/series";
import { useWallet } from "@/store/wallet";
import { Avatar } from "@/components/Avatar";
import { EpisodeCarousel } from "@/components/EpisodeCarousel";
import { PriceChart } from "@/components/PriceChart";
import { ProfileCard } from "@/components/ProfileCard";
import { useSwipeUp } from "@/hooks/use-swipe-up";
import videoPoster from "@/assets/video-poster.jpg";

export const Route = createFileRoute("/profil/$profilId")({
  component: ProfilPage,
});

function ProfilPage() {
  const { profilId } = Route.useParams();
  const navigate = useNavigate();
  const profil = getProfil(profilId);
  const serie = profil ? getSerie(profil.seriesId) : undefined;
  const history = profil ? getPriceHistory(profil.id) : [];

  const price = useWallet((s) => (profil ? s.effectivePrice(profil.id) : 0));
  const solde = useWallet((s) => s.solde);
  const investir = useWallet((s) => s.investir);

  const [open, setOpen] = useState(false);
  const [montant, setMontant] = useState(50);
  const [feedback, setFeedback] = useState<{
    type: "ok" | "err";
    msg: string;
  } | null>(null);

  // Swipe vers le haut → retour à la série (si profil chargé)
  useSwipeUp(
    () => {
      if (serie) {
        navigate({ to: "/serie/$seriesId", params: { seriesId: serie.id } });
      } else {
        navigate({ to: "/" });
      }
    },
    !!profil && !open,
  );

  if (!profil || !serie) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-24 text-center">
        <p className="text-muted-foreground">Profil introuvable.</p>
        <Link to="/" className="mt-4 inline-block text-sm underline">
          Retour
        </Link>
      </div>
    );
  }

  const variation =
    ((price - profil.valeurInitiale) / profil.valeurInitiale) * 100;
  const positive = variation >= 0;
  const liveHistory = [...history, { jour: "Maintenant", valeur: price }];

  function handleInvest() {
    if (!profil) return;
    const res = investir(profil.id, montant);
    if (res.ok) {
      setFeedback({
        type: "ok",
        msg: `Investissement validé · ${montant} Noix`,
      });
      setTimeout(() => {
        setOpen(false);
        setFeedback(null);
      }, 900);
    } else {
      setFeedback({ type: "err", msg: res.error ?? "Erreur" });
    }
  }

  return (
    <div className="pb-24 lg:pb-0">
      {/* Hero */}
      <section className="border-b border-border/60">
        <div className="mx-auto max-w-7xl px-6 pt-8 pb-10">
          <button
            type="button"
            onClick={() =>
              navigate({ to: "/serie/$seriesId", params: { seriesId: serie.id } })
            }
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            {serie.titre}
          </button>

          <div className="flex items-start gap-5 mb-8">
            <Avatar profil={profil} size={88} />
            <div className="flex-1 min-w-0">
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
                {serie.titre}
              </p>
              <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight leading-[1] text-balance">
                {profil.nomComplet}
              </h1>
              <p className="mt-2 text-foreground/70">
                {profil.profession} · {profil.age} ans · {profil.ville}
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-[1fr_400px] gap-10 items-start">
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-foreground/5 border border-border/60 shadow-poster">
              <video
                src={profil.episodes[0]?.videoUrl}
                poster={videoPoster}
                controls
                playsInline
                preload="metadata"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="rounded-2xl bg-card border border-border/60 shadow-luxe p-6 flex flex-col">
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                  Cours actuel
                </span>
                <div
                  className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                    positive
                      ? "bg-success/10 text-success"
                      : "bg-danger/10 text-danger"
                  }`}
                >
                  {positive ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {variation >= 0 ? "+" : ""}
                  {variation.toFixed(1)}%
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-5xl font-bold tabular-nums">
                  {price.toFixed(2)}
                </span>
                <span className="text-sm text-muted-foreground">
                  Noix Bénies
                </span>
              </div>
              <div className="mt-4 -mx-2">
                <PriceChart data={liveHistory} initial={profil.valeurInitiale} />
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                <Shield className="h-3.5 w-3.5 text-success" />
                Capital protégé sous votre prix d'entrée
              </div>
              <button
                onClick={() => setOpen(true)}
                className="mt-5 w-full rounded-xl gradient-noix text-white font-semibold py-3.5 shadow-luxe hover:brightness-105 active:scale-[0.99] transition"
              >
                Investir des Noix Bénies
              </button>
              <p className="mt-2 text-center text-xs text-muted-foreground">
                Solde ·{" "}
                <span className="tabular-nums text-foreground">
                  {solde.toFixed(0)}
                </span>{" "}
                Noix
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Episodes */}
      <section className="mx-auto max-w-7xl px-6 py-14">
        <EpisodeCarousel
          episodes={profil.episodes}
          profilNom={profil.nomComplet}
          profilId={profil.id}
        />
      </section>

      {/* Suggestions */}
      <SuggestionsSection
        currentProfilId={profil.id}
        seriesId={serie.id}
      />

      {/* Sticky invest bar — mobile */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border/60 bg-card/95 backdrop-blur-md shadow-luxe">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground leading-none">
              Cours
            </p>
            <p className="font-serif text-xl font-semibold tabular-nums leading-tight flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              {price.toFixed(2)}
              <span
                className={`ml-1 text-[11px] font-medium ${
                  positive ? "text-success" : "text-danger"
                }`}
              >
                {variation >= 0 ? "+" : ""}
                {variation.toFixed(1)}%
              </span>
            </p>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="rounded-xl gradient-noix text-white font-semibold px-5 py-3 shadow-luxe active:scale-[0.98] transition whitespace-nowrap"
          >
            Investir
          </button>
        </div>
      </div>

      {/* Invest modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-card shadow-luxe p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 h-8 w-8 rounded-full hover:bg-muted flex items-center justify-center text-muted-foreground"
              aria-label="Fermer"
            >
              <X className="h-4 w-4" />
            </button>
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
              Investir dans
            </p>
            <h3 className="font-serif text-2xl font-semibold mb-5">
              {profil.nomComplet}
            </h3>

            <label className="block">
              <span className="text-xs text-muted-foreground">
                Montant (Noix Bénies)
              </span>
              <input
                type="number"
                min={1}
                max={solde}
                value={montant}
                onChange={(e) => setMontant(Number(e.target.value))}
                className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-3 text-2xl font-serif font-semibold tabular-nums focus:outline-none focus:ring-2 focus:ring-accent/50"
              />
            </label>
            <div className="mt-3 flex gap-2">
              {[25, 50, 100, 250].map((v) => (
                <button
                  key={v}
                  onClick={() => setMontant(v)}
                  disabled={v > solde}
                  className="flex-1 text-xs rounded-full border border-border py-1.5 hover:bg-muted disabled:opacity-40 transition"
                >
                  {v}
                </button>
              ))}
            </div>

            <div className="mt-5 rounded-xl bg-secondary/60 p-4 text-sm space-y-1.5">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cours d'entrée</span>
                <span className="tabular-nums font-medium">
                  <Sparkles className="inline h-3 w-3 mr-0.5 text-accent" />
                  {price.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Parts acquises</span>
                <span className="tabular-nums font-medium">
                  {(montant / price).toFixed(3)}
                </span>
              </div>
              <div className="flex justify-between border-t border-border pt-1.5">
                <span className="text-muted-foreground">Solde après</span>
                <span className="tabular-nums font-medium">
                  {(solde - montant).toFixed(0)} Noix
                </span>
              </div>
            </div>

            <button
              onClick={handleInvest}
              disabled={montant <= 0 || montant > solde}
              className="mt-5 w-full rounded-xl gradient-noix text-white font-semibold py-3.5 shadow-luxe hover:brightness-105 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Confirmer l'investissement
            </button>

            {feedback && (
              <p
                className={`mt-3 text-center text-sm ${
                  feedback.type === "ok" ? "text-success" : "text-danger"
                }`}
              >
                {feedback.msg}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function SuggestionsSection({
  currentProfilId,
  seriesId,
}: {
  currentProfilId: string;
  seriesId: string;
}) {
  const others = getProfilsForSerie(seriesId)
    .filter((p) => p.id !== currentProfilId)
    .slice(0, 3);

  if (others.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-6 pb-20">
      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
            Suggestions
          </p>
          <h2 className="font-serif text-2xl font-semibold">
            Les autres voix de cette série
          </h2>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {others.map((p) => (
          <ProfileCard key={p.id} profil={p} />
        ))}
      </div>
    </section>
  );
}
