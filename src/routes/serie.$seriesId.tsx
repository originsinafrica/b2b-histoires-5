import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import {
  getSerie,
  getProfilsForSerie,
  type Profil,
} from "@/data/series";
import { ProfileCard } from "@/components/ProfileCard";

export const Route = createFileRoute("/serie/$seriesId")({
  component: SeriePage,
});

function SeriePage() {
  const { seriesId } = Route.useParams();
  const serie = getSerie(seriesId);
  const profils = getProfilsForSerie(seriesId);

  if (!serie) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-24 text-center">
        <p className="text-muted-foreground">Série introuvable.</p>
        <Link to="/" className="mt-4 inline-block text-sm underline">
          Retour à la découverte
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div
          className="absolute inset-0 -z-10 opacity-20"
          style={{ background: serie.posterGradient }}
        />
        <div className="mx-auto max-w-7xl px-6 pt-10 pb-14">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Toutes les séries
          </Link>
          <div className="grid md:grid-cols-[260px_1fr] gap-10 items-start">
            <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-luxe">
              {serie.affiche ? (
                <img
                  src={serie.affiche}
                  alt={serie.titre}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div
                  className="h-full w-full flex items-end p-6"
                  style={{ background: serie.posterGradient }}
                >
                  <h2 className="font-serif text-3xl font-bold text-white leading-tight">
                    {serie.titre}
                  </h2>
                </div>
              )}
            </div>
            <div>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {serie.themes.map((t: string) => (
                  <span
                    key={t}
                    className="text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full bg-foreground/5 text-foreground/70 border border-border"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <h1 className="font-serif text-5xl sm:text-6xl font-bold tracking-tight leading-[0.95] text-balance">
                {serie.titre}
              </h1>
              <p className="mt-6 text-lg text-foreground/80 leading-relaxed max-w-2xl">
                {serie.synopsis}
              </p>
              <div className="mt-8 pt-6 border-t border-border/60 max-w-2xl">
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-2">
                  Casting
                </p>
                <p className="text-foreground/85">{serie.casting}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Voix */}
      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="flex items-end justify-between mb-6">
          <h2 className="font-serif text-3xl font-semibold">
            Les voix de cette série
          </h2>
          <span className="text-xs text-muted-foreground">
            Glissez pour découvrir →
          </span>
        </div>
        <div className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4 -mx-6 px-6 scrollbar-none">
          {profils.map((p: Profil) => (
            <ProfileCard key={p.id} profil={p} serie={serie} />
          ))}
        </div>
      </section>
    </div>
  );
}
