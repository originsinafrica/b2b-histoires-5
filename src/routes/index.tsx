import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { series } from "@/data/series";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Noix·fi — Découvrir" },
      {
        name: "description",
        content:
          "Découvrez les séries documentaires et investissez dans les voix qui vous touchent.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    dragFree: false,
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

  const current = series[selected] ?? series[0];

  function openSerie(id: string) {
    if (lockRef.current) return;
    lockRef.current = true;
    navigate({ to: "/serie/$seriesId", params: { seriesId: id } });
  }

  return (
    <div
      className="relative h-[100svh] w-full overflow-hidden bg-background"
      style={{
        backgroundImage:
          "radial-gradient(ellipse 80% 50% at 20% 0%, hsl(var(--accent) / 0.18), transparent 60%), radial-gradient(ellipse 60% 40% at 90% 100%, hsl(var(--noix-deep) / 0.18), transparent 60%)",
      }}
    >
      {/* Carousel plein écran */}
      <div className="h-full w-full" ref={emblaRef}>
        <div className="flex h-full">
          {series.map((s, i) => {
            const isActive = i === selected;
            return (
              <div
                key={s.id}
                className="relative flex h-full w-full shrink-0 grow-0 basis-full items-center justify-center px-6"
              >
                <button
                  type="button"
                  onClick={() => isActive && openSerie(s.id)}
                  className={`group relative aspect-[3/4] w-[min(78vw,420px)] overflow-hidden rounded-3xl shadow-luxe transition-all duration-500 ${
                    isActive
                      ? "scale-100 opacity-100"
                      : "scale-90 opacity-60"
                  }`}
                  aria-label={`Ouvrir ${s.titre}`}
                >
                  {s.affiche ? (
                    <img
                      src={s.affiche}
                      alt={s.titre}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      draggable={false}
                    />
                  ) : (
                    <div
                      className="absolute inset-0 flex items-end p-6"
                      style={{ background: s.posterGradient }}
                    >
                      <h3 className="font-serif text-4xl font-bold text-white">
                        {s.titre}
                      </h3>
                    </div>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Flèches navigation (desktop) */}
      <button
        type="button"
        onClick={() => emblaApi?.scrollPrev()}
        className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 items-center justify-center rounded-full bg-foreground/10 backdrop-blur-md text-foreground hover:bg-foreground/20 transition"
        aria-label="Précédent"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        type="button"
        onClick={() => emblaApi?.scrollNext()}
        className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 items-center justify-center rounded-full bg-foreground/10 backdrop-blur-md text-foreground hover:bg-foreground/20 transition"
        aria-label="Suivant"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Overlay synopsis bas */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 px-6 pb-8 pt-20 bg-gradient-to-t from-background via-background/85 to-transparent">
        <div className="mx-auto max-w-2xl text-center">
          <div className="flex flex-wrap justify-center gap-1.5 mb-3">
            {current.themes.map((t) => (
              <span
                key={t}
                className="text-[10px] uppercase tracking-[0.18em] px-2.5 py-1 rounded-full bg-foreground/5 text-foreground/70 border border-border"
              >
                {t}
              </span>
            ))}
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-balance">
            {current.titre}
          </h1>
          <p className="mt-3 text-sm sm:text-base text-foreground/75 leading-relaxed text-balance">
            {current.synopsis}
          </p>
          <p className="mt-4 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Touchez l'affiche pour découvrir les voix
          </p>
        </div>
      </div>

      {/* Indicateur position */}
      <div className="pointer-events-none absolute top-6 inset-x-0 flex justify-center">
        <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground tabular-nums">
          {String(selected + 1).padStart(2, "0")} / {String(series.length).padStart(2, "0")}
        </div>
      </div>
    </div>
  );
}
