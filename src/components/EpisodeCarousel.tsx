import { useState } from "react";
import { Mail, Send } from "lucide-react";
import type { Episode } from "@/data/series";
import { EvaluationModule } from "@/components/EvaluationModule";
import videoPoster from "@/assets/video-poster.jpg";

type Props = {
  episodes: Episode[];
  profilNom: string;
  profilId: string;
};

/**
 * Carrousel horizontal en boucle : 4 épisodes (vidéo + évaluation sur le
 * même fond blanc) + 1 slide contact. Navigation par swipe tactile et
 * glisser-déposer souris uniquement (aucune flèche, aucun dot).
 */
export function EpisodeCarousel({ episodes, profilNom, profilId }: Props) {
  const slides = episodes.length + 1;
  const [index, setIndex] = useState(0);
  const [dragStartX, setDragStartX] = useState<number | null>(null);

  const go = (dir: 1 | -1) => setIndex((i) => (i + dir + slides) % slides);

  function startDrag(x: number) {
    setDragStartX(x);
  }
  function endDrag(x: number) {
    if (dragStartX === null) return;
    const dx = x - dragStartX;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
    setDragStartX(null);
  }

  return (
    <div
      className="overflow-hidden rounded-2xl border border-border/60 bg-white shadow-poster select-none"
      onTouchStart={(e) => startDrag(e.touches[0].clientX)}
      onTouchEnd={(e) => endDrag(e.changedTouches[0].clientX)}
      onMouseDown={(e) => startDrag(e.clientX)}
      onMouseUp={(e) => endDrag(e.clientX)}
      onMouseLeave={() => setDragStartX(null)}
    >
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {episodes.map((ep) => (
          <div key={ep.numero} className="min-w-full p-6 bg-white">
            <div className="mb-4">
              <h3 className="font-serif text-2xl font-semibold mb-2">{ep.titre}</h3>
              <p className="text-foreground/80 italic leading-relaxed">"{ep.question}"</p>
            </div>
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="aspect-square w-full rounded-xl overflow-hidden bg-foreground/5 border border-border/60">
                <video
                  src={ep.videoUrl}
                  poster={videoPoster}
                  controls
                  playsInline
                  preload="metadata"
                  className="h-full w-full object-cover"
                />
              </div>
              <EvaluationModule
                profilId={profilId}
                episodeNumero={ep.numero}
                videoUrl={ep.videoUrl}
              />
            </div>
          </div>
        ))}

        <div className="min-w-full p-6 bg-white">
          <ContactSlide profilNom={profilNom} />
        </div>
      </div>
    </div>
  );
}

function ContactSlide({ profilNom }: { profilNom: string }) {
  const [form, setForm] = useState({ nom: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nom.trim() || !form.email.trim() || !form.message.trim()) return;
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setForm({ nom: "", email: "", message: "" });
    }, 2400);
  }

  return (
    <div className="flex flex-col">
      <div className="mb-4">
        <div className="flex items-center gap-3 mb-2">
          <Mail className="h-5 w-5 text-accent" />
          <h3 className="font-serif text-2xl font-semibold">Contacter {profilNom}</h3>
        </div>
        <p className="text-foreground/80 italic leading-relaxed">
          "Une question, un projet, une rencontre — laissez un mot."
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="w-full rounded-xl bg-secondary/40 border border-border/60 p-5 flex flex-col gap-3"
      >
        <div className="grid sm:grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Votre nom"
            value={form.nom}
            maxLength={100}
            onChange={(e) => setForm({ ...form, nom: e.target.value })}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
            required
          />
          <input
            type="email"
            placeholder="Votre email"
            value={form.email}
            maxLength={255}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
            required
          />
        </div>
        <textarea
          placeholder="Votre message"
          value={form.message}
          maxLength={1000}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          rows={4}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent/50"
          required
        />
        <button
          type="submit"
          className="self-end inline-flex items-center gap-2 rounded-lg bg-foreground text-background text-sm font-medium px-4 py-2 hover:opacity-90 transition"
        >
          <Send className="h-4 w-4" />
          {sent ? "Message envoyé" : "Envoyer"}
        </button>
      </form>
    </div>
  );
}
