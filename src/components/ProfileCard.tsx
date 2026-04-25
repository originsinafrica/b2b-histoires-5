import { Link } from "react-router-dom";
import type { Profil, Serie } from "@/data/series";
import { Avatar } from "./Avatar";
import { useWallet } from "@/store/wallet";
import { Sparkles, TrendingUp } from "lucide-react";

export function ProfileCard({
  profil,
  serie,
}: {
  profil: Profil;
  serie?: Serie;
}) {
  const price = useWallet((s) => s.effectivePrice(profil.id));
  const trend = price >= profil.valeurInitiale;
  const variation =
    ((price - profil.valeurInitiale) / profil.valeurInitiale) * 100;

  return (
    <Link
      to={`/profil/${profil.id}`}
      className="group flex w-[300px] shrink-0 snap-start flex-col rounded-2xl bg-card border border-border/60 overflow-hidden shadow-poster hover:shadow-luxe transition-all duration-300 hover:-translate-y-0.5"
    >
      {/* Grande photo */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted">
        {profil.photoUrl ? (
          <img
            src={profil.photoUrl}
            alt={profil.nomComplet}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
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

      {/* Infos */}
      <div className="flex flex-1 flex-col p-5">
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

        {/* Affiche miniature + titre série */}
        {serie && (
          <div className="mt-4 pt-4 border-t border-border/60 flex items-center gap-3">
            <div className="h-14 w-10 shrink-0 overflow-hidden rounded-md bg-muted shadow-sm">
              {serie.affiche ? (
                <img
                  src={serie.affiche}
                  alt={serie.titre}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div
                  className="h-full w-full"
                  style={{ background: serie.posterGradient }}
                />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Série
              </p>
              <p className="font-serif text-sm font-semibold text-foreground truncate">
                {serie.titre}
              </p>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
