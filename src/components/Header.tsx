import { Link } from "@tanstack/react-router";
import { useWallet } from "@/store/wallet";
import { Sparkles, Briefcase } from "lucide-react";

export function Header() {
  const solde = useWallet((s) => s.solde);
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/75 border-b border-border/60">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="font-serif text-2xl font-bold tracking-tight text-foreground">
            Noix<span className="text-accent">·</span>fi
          </span>
          <span className="hidden sm:inline text-[10px] uppercase tracking-[0.18em] text-muted-foreground mt-1">
            Stories. Stakes.
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            to="/portfolio"
            activeProps={{ className: "text-foreground" }}
            className="hidden sm:inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition"
          >
            <Briefcase className="h-3.5 w-3.5" />
            Portfolio
          </Link>
          <div className="flex items-center gap-2 rounded-full px-4 py-2 bg-foreground text-background shadow-luxe">
            <Sparkles className="h-3.5 w-3.5 text-accent" strokeWidth={2.5} />
            <span className="text-sm font-semibold tabular-nums">{solde.toFixed(0)}</span>
            <span className="text-[10px] uppercase tracking-wider text-background/70">Noix</span>
          </div>
        </div>
      </div>
    </header>
  );
}
