import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, ArrowUp, Sparkles, TrendingUp } from "lucide-react";
import {
  getSerie,
  getProfilsForSerie,
  type Profil,
} from "@/data/series";
import { useWallet } from "@/store/wallet";
import { Avatar } from "@/components/Avatar";
import { useSwipeUp } from "@/hooks/use-swipe-up";

export const Route = createFileRoute("/serie/$seriesId")({
  component: SeriePage,
});

function SeriePage() {
  const { seriesId } = Route.useParams();
  const serie = getSerie(seriesId);
  const profils = getProfilsForSerie(seriesId);
  const navigate = useNavigate();

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    skipSnaps: false,
  });
  const [selected, setSelected] = useState(0);
  const lockRef = useRef(false);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  // Swipe vers le haut → retour aux affiches
  useSwipeUp(() => {
    if (lockRef.current) return;
    lockRef.current = true;
    navigate({ to: "/" });
  });

  if (!serie) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-24 text-center">
        <p className="text-muted-foreground">Série introuvable.</p>
        <button
          onClick={() => navigate({ to: "/" })}
          className="mt-4 text-sm underline"
        >
          Retour à la découverte
        </button>
      </div>
    );
  }

  const current = profils[selected] ?? profils[0];

  function openProfil(id: string) {
    if (lockRef.current) return;
    lockRef.current = true;
    navigate({ to: "/profil/$profilId", params: { profilId: id } });
  }

  return (
    <div
      className="relative h-[100svh] w-full overflow-hidden bg-background"
      style={{
        backgroundImage: serie.posterGradient
          ? `${serie.posterGradient}`
          : undefined,
        backgroundSize: "cover",
      }}
    >
      {/* Voile */}
      <div className="absolute inset-0 bg-background/82 backdrop-blur-2xl" />

      {/* Bandeau haut : indication retour */}
      <div className="relative z-10 pt-6 px-6 flex items-center justify-between">
        <button
          onClick={() => navigate({ to: "/" })}
          className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground hover:text-foreground transition flex items-center gap-1.5"
        >
          <ArrowUp className="h-3 w-3" /> Affiches
        </button>
        <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          {serie.titre}
        </div>
        <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground tabular-nums">
          {String(selected + 1).padStart(2, "0")} /{" "}
          {String(profils.length).padStart(2, "0")}
        </div>
      </div>

      {/* Carousel plein écran */}
      <div className="relative z-10 h-[calc(100svh-56px)] w-full" ref={emblaRef}>
        <div className="flex h-full">
          {profils.map((p, i) => (
            <div
              key={p.id}
              className="relative flex h-full w-full shrink-0 grow-0 basis-full items-center justify-center px-6"
            >
              <ProfilTallCard
                profil={p}
                active={i === selected}
                onOpen={() => openProfil(p.id)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Flèches */}
      <button
        type="button"
        onClick={() => emblaApi?.scrollPrev()}
        className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 h-12 w-12 items-center justify-center rounded-full bg-foreground/10 backdrop-blur-md text-foreground hover:bg-foreground/20 transition"
        aria-label="Précédent"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        type="button"
        onClick={() => emblaApi?.scrollNext()}
        className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 h-12 w-12 items-center justify-center rounded-full bg-foreground/10 backdrop-blur-md text-foreground hover:bg-foreground/20 transition"
        aria-label="Suivant"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Hint bas */}
      <div className="pointer-events-none absolute bottom-4 inset-x-0 z-10 flex justify-center">
        <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground flex items-center gap-1.5">
          <ArrowUp className="h-3 w-3" />
          Glissez vers le haut pour revenir
        </div>
      </div>

      {/* preload nom courant pour SEO */}
      <span className="sr-only">{current?.nomComplet}</span>
    </div>
  );
}

function ProfilTallCard({
  profil,
  active,
  onOpen,
}: {
  profil: Profil;
  active: boolean;
  onOpen: () => void;
}) {
  const price = useWallet((s) => s.effectivePrice(profil.id));
  const trend = price >= profil.valeurInitiale;
  const variation =
    ((price - profil.valeurInitiale) / profil.valeurInitiale) * 100;

  return (
    <button
      type="button"
      onClick={() => active && onOpen()}
      className={`group relative flex w-[min(82vw,360px)] flex-col rounded-3xl bg-card border border-border/60 overflow-hidden shadow-luxe transition-all duration-500 ${
        active ? "scale-100 opacity-100" : "scale-90 opacity-50"
      }`}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted">
        {profil.photoUrl ? (
          <img
            src={profil.photoUrl}
            alt={profil.nomComplet}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            draggable={false}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Avatar profil={profil} size={140} />
          </div>
        )}
        <div
          className={`absolute top-3 right-3 flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full backdrop-blur-md ${
            trend
              ? "bg-success/90 text-success-foreground"
              : "bg-background/80 text-muted-foreground"
          }`}
        >
          <TrendingUp className="h-3 w-3" />
          {trend ? "+" : ""}
          {variation.toFixed(1)}%
        </div>
      </div>
      <div className="flex flex-col p-5 text-left">
        <h4 className="font-serif text-2xl font-semibold leading-tight text-foreground">
          {profil.nomComplet}
        </h4>
        <p className="text-sm text-muted-foreground mt-1">
          {profil.profession} · {profil.age} ans
        </p>
        <div className="mt-4 flex items-center justify-between rounded-lg bg-foreground/[0.03] px-3 py-2 border border-border/60">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Cours
          </span>
          <span className="flex items-center gap-1 font-semibold tabular-nums text-foreground">
            <Sparkles className="h-3 w-3 text-accent" />
            {price.toFixed(2)}
          </span>
        </div>
      </div>
    </button>
  );
}
