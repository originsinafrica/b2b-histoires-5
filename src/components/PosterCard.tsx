import { Link } from "@tanstack/react-router";
import type { Serie } from "@/data/series";

export function PosterCard({ serie }: { serie: Serie }) {
  return (
    <Link
      to="/serie/$seriesId"
      params={{ seriesId: serie.id }}
      className="group relative block aspect-[3/4] overflow-hidden rounded-2xl shadow-poster bg-muted transition-all duration-500 hover:-translate-y-1 hover:shadow-luxe"
    >
      {serie.affiche ? (
        <img
          src={serie.affiche}
          alt={serie.titre}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <div
          className="absolute inset-0 flex items-end p-5"
          style={{ background: serie.posterGradient }}
        >
          <div className="absolute top-5 left-5 right-5 flex items-start justify-between">
            <div
              className="h-1.5 w-10 rounded-full"
              style={{ background: serie.posterAccent }}
            />
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/70">
              Série · 4 ép
            </span>
          </div>
          <h3
            className="font-serif text-3xl font-bold leading-[0.95] text-white text-balance"
            style={{ textShadow: "0 2px 24px rgba(0,0,0,0.35)" }}
          >
            {serie.titre}
          </h3>
        </div>
      )}
    </Link>
  );
}
