import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Sparkles,
  TrendingUp,
  Shield,
  Wallet as WalletIcon,
} from "lucide-react";
import { useWallet, plusValue, portfolioValue } from "@/store/wallet";
import { getProfil, getSerie } from "@/data/series";
import { Sparkline } from "@/components/Sparkline";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio — Noix·fi" },
      { name: "description", content: "Vos investissements en Noix Bénies." },
    ],
  }),
  component: PortfolioPage,
});

function PortfolioPage() {
  const investissements = useWallet((s) => s.investissements);
  const solde = useWallet((s) => s.solde);
  const effectivePrice = useWallet((s) => s.effectivePrice);
  const getSparkline = useWallet((s) => s.getSparkline);

  const totalInvesti = investissements.reduce((a, i) => a + i.montantNoix, 0);
  const valeurTotale = portfolioValue(investissements, effectivePrice);
  const plusValueTotale = +(valeurTotale - totalInvesti).toFixed(2);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex items-center gap-2 mb-3">
        <span className="h-px w-8 bg-foreground/40" />
        <span className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          Votre portefeuille
        </span>
      </div>
      <h1 className="font-serif text-5xl font-bold tracking-tight">Portfolio</h1>
      <p className="mt-2 text-muted-foreground max-w-xl">
        Vos investissements dans les voix qui vous touchent. Capital protégé sous
        le prix d'entrée.
      </p>

      <div className="mt-10 grid sm:grid-cols-4 gap-4">
        <Stat
          label="Solde"
          value={solde.toFixed(0)}
          unit="Noix"
          icon={<WalletIcon className="h-4 w-4 text-accent" />}
        />
        <Stat
          label="Investi"
          value={totalInvesti.toFixed(0)}
          unit="Noix"
          icon={<Sparkles className="h-4 w-4 text-accent" />}
        />
        <Stat
          label="Valeur actuelle"
          value={valeurTotale.toFixed(2)}
          unit="Noix"
          icon={<Shield className="h-4 w-4 text-success" />}
        />
        <Stat
          label="Plus-value"
          value={
            (plusValueTotale >= 0 ? "+" : "") + plusValueTotale.toFixed(2)
          }
          unit="Noix"
          icon={<TrendingUp className="h-4 w-4 text-success" />}
          highlight={plusValueTotale > 0}
        />
      </div>

      <div className="mt-12">
        <h2 className="font-serif text-2xl font-semibold mb-5">Vos positions</h2>

        {investissements.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center">
            <p className="text-muted-foreground mb-4">
              Vous n'avez pas encore investi.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 gradient-noix text-white font-medium shadow-luxe"
            >
              Découvrir les séries
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-poster">
            <div className="hidden md:grid grid-cols-[64px_1.4fr_0.9fr_0.8fr_0.8fr_1fr_90px] items-center gap-4 px-5 py-3 border-b border-border/60 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              <span>Affiche</span>
              <span>Personnage</span>
              <span className="text-right">Noix investies</span>
              <span className="text-right">Cours achat</span>
              <span className="text-right">Cours actuel</span>
              <span className="text-right">Plus-value</span>
              <span className="text-right">Tendance</span>
            </div>

            <ul className="divide-y divide-border/60">
              {investissements.map((inv) => {
                const profil = getProfil(inv.profilId);
                if (!profil) return null;
                const serie = getSerie(profil.seriesId);
                const prix = effectivePrice(inv.profilId);
                const pv = plusValue(inv, prix);
                const sparkValues = getSparkline(inv.profilId, 12);
                const trendUp =
                  sparkValues[sparkValues.length - 1] >= sparkValues[0];
                const pvPct = ((prix - inv.valeurAchat) / inv.valeurAchat) * 100;

                return (
                  <li key={inv.id}>
                    <Link
                      to="/profil/$profilId"
                      params={{ profilId: profil.id }}
                      className="grid grid-cols-[1fr] md:grid-cols-[64px_1.4fr_0.9fr_0.8fr_0.8fr_1fr_90px] items-center gap-4 px-5 py-4 hover:bg-muted/40 transition"
                    >
                      <div className="hidden md:block h-12 w-12 rounded-lg overflow-hidden bg-muted">
                        {serie?.affiche ? (
                          <img
                            src={serie.affiche}
                            alt={serie.titre}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div
                            className="h-full w-full"
                            style={{ background: serie?.posterGradient }}
                          />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="font-serif text-base font-semibold truncate">
                          {profil.nomComplet}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {serie?.titre} · {profil.profession}
                        </p>
                      </div>

                      <Cell value={inv.montantNoix.toFixed(0)} />
                      <Cell value={inv.valeurAchat.toFixed(2)} />
                      <Cell value={prix.toFixed(2)} />

                      <div className="text-right">
                        <p
                          className={`text-sm font-semibold tabular-nums ${
                            pv > 0 ? "text-success" : "text-muted-foreground"
                          }`}
                        >
                          {pv > 0 ? "+" : ""}
                          {pv.toFixed(2)} NB
                        </p>
                        <p className="text-[10px] text-muted-foreground tabular-nums">
                          {pvPct >= 0 ? "+" : ""}
                          {pvPct.toFixed(1)}%
                        </p>
                      </div>

                      <div className="hidden md:flex justify-end">
                        <Sparkline values={sparkValues} positive={trendUp} />
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  unit,
  icon,
  highlight,
}: {
  label: string;
  value: string;
  unit: string;
  icon: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-5 border shadow-poster ${
        highlight
          ? "bg-success/5 border-success/30"
          : "bg-card border-border/60"
      }`}
    >
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="mt-2 flex items-baseline gap-1.5">
        <span className="font-serif text-3xl font-bold tabular-nums">
          {value}
        </span>
        <span className="text-xs text-muted-foreground">{unit}</span>
      </div>
    </div>
  );
}

function Cell({ value }: { value: string }) {
  return (
    <p className="hidden md:block text-right text-sm font-medium tabular-nums">
      <Sparkles className="inline h-3 w-3 mr-0.5 text-accent" />
      {value}
    </p>
  );
}
