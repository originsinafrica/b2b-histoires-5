import type { Profil } from "@/data/series";

export function Avatar({ profil, size = 64 }: { profil: Profil; size?: number }) {
  if (profil.photoUrl) {
    return (
      <img
        src={profil.photoUrl}
        alt={profil.nomComplet}
        width={size}
        height={size}
        loading="lazy"
        className="rounded-full object-cover shrink-0 ring-1 ring-black/5"
        style={{
          width: size,
          height: size,
          boxShadow: `0 6px 20px -8px ${profil.accent}99`,
        }}
      />
    );
  }
  return (
    <div
      className="relative flex items-center justify-center rounded-full font-serif font-semibold text-white shrink-0"
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 30% 30%, ${profil.accent}, ${profil.accent}cc 60%, ${profil.accent}88)`,
        fontSize: size * 0.36,
        boxShadow: `0 6px 20px -8px ${profil.accent}99, inset 0 1px 0 rgba(255,255,255,0.25)`,
      }}
    >
      <span style={{ textShadow: "0 1px 2px rgba(0,0,0,0.2)" }}>{profil.initiales}</span>
      <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-black/5" />
    </div>
  );
}
