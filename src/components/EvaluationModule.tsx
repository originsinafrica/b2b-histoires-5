import { useState } from "react";
import { useWallet } from "@/store/wallet";

const tracks = [
  {
    key: "originalite" as const,
    label: "Originalité",
    color: "oklch(0.68 0.18 145)", // vert
    track: "oklch(0.68 0.18 145 / 0.18)",
  },
  {
    key: "authenticite" as const,
    label: "Authenticité",
    color: "oklch(0.82 0.17 90)", // jaune
    track: "oklch(0.82 0.17 90 / 0.22)",
  },
  {
    key: "impact" as const,
    label: "Impact",
    color: "oklch(0.62 0.24 27)", // rouge
    track: "oklch(0.62 0.24 27 / 0.18)",
  },
];

type Props = {
  profilId: string;
  episodeNumero: number;
  videoUrl: string;
};

/**
 * Module d'évaluation — version DÉVERROUILLÉE (mode test).
 * Les 3 curseurs (Originalité / Authenticité / Impact) sont actifs en
 * permanence pour permettre les tests utilisateurs. La logique de
 * verrouillage anti-triche basée sur le watch_time reviendra plus tard.
 *
 * Couleurs imposées : vert / jaune / rouge.
 */
export function EvaluationModule({ profilId, episodeNumero, videoUrl: _videoUrl }: Props) {
  const saveEvaluation = useWallet((s) => s.saveEvaluation);
  const reportWatch = useWallet((s) => s.reportWatch);
  const [values, setValues] = useState({ originalite: 50, authenticite: 50, impact: 50 });
  const [submitState, setSubmitState] = useState<null | "ok" | "err">(null);
  const [submitMsg, setSubmitMsg] = useState<string>("");

  function handleValidate() {
    // En mode test, on simule un visionnage complet pour activer le coeff x1.5
    reportWatch(profilId, episodeNumero, 100, 100);
    const res = saveEvaluation({
      profilId,
      episodeNumero,
      ...values,
    });
    if (res.ok) {
      setSubmitState("ok");
      setSubmitMsg("Évaluation enregistrée — cours mis à jour");
    } else {
      setSubmitState("err");
      setSubmitMsg(res.error ?? "Erreur");
    }
    setTimeout(() => setSubmitState(null), 2400);
  }

  return (
    <div className="rounded-xl bg-white border border-border/60 p-5 h-full flex flex-col">
      <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-5">
        Évaluez ce témoignage
      </p>

      <div className="space-y-5 flex-1">
        {tracks.map((t) => (
          <div key={t.key}>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-medium text-foreground/80">{t.label}</span>
              <span
                className="tabular-nums font-semibold"
                style={{ color: t.color }}
              >
                {values[t.key]}
              </span>
            </div>
            <ColoredSlider
              value={values[t.key]}
              color={t.color}
              trackColor={t.track}
              onChange={(v) =>
                setValues((prev) => ({ ...prev, [t.key]: v }))
              }
              ariaLabel={t.label}
            />
          </div>
        ))}
      </div>

      <button
        onClick={handleValidate}
        className="mt-6 w-full rounded-lg bg-foreground text-background text-sm font-medium py-2.5 hover:opacity-90 transition"
      >
        Valider mon évaluation
      </button>

      {submitState && (
        <p
          className={`mt-3 text-center text-xs ${
            submitState === "ok" ? "text-success" : "text-danger"
          }`}
        >
          {submitMsg}
        </p>
      )}
    </div>
  );
}

/**
 * Slider personnalisé avec curseur (thumb) coloré et visible,
 * utilisant l'input range natif overlayé pour une accessibilité totale.
 */
function ColoredSlider({
  value,
  color,
  trackColor,
  onChange,
  ariaLabel,
}: {
  value: number;
  color: string;
  trackColor: string;
  onChange: (v: number) => void;
  ariaLabel: string;
}) {
  return (
    <div className="relative h-6 flex items-center">
      {/* Track de fond */}
      <div
        className="absolute inset-x-0 h-2 rounded-full"
        style={{ background: trackColor }}
      />
      {/* Range remplie */}
      <div
        className="absolute h-2 rounded-full transition-[width] duration-100 pointer-events-none"
        style={{
          width: `calc(${value}% )`,
          background: color,
        }}
      />
      {/* Thumb visible */}
      <div
        className="absolute h-5 w-5 rounded-full border-2 border-white shadow-md pointer-events-none transition-[left] duration-100"
        style={{
          left: `calc(${value}% - 10px)`,
          background: color,
        }}
      />
      {/* Input natif transparent par-dessus pour la captation */}
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="absolute inset-x-0 w-full h-6 opacity-0 cursor-pointer z-10"
        aria-label={ariaLabel}
      />
    </div>
  );
}
