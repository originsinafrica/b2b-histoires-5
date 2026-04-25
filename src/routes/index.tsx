import { createFileRoute } from "@tanstack/react-router";
import { series } from "@/data/series";
import { PosterCard } from "@/components/PosterCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Noix·fi — Découvrir" },
      { name: "description", content: "Découvrez les séries documentaires et investissez dans les voix qui vous touchent." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10 opacity-60"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 80% 50% at 20% 0%, hsl(var(--accent) / 0.45), transparent 60%), radial-gradient(ellipse 60% 40% at 90% 10%, hsl(var(--noix-deep) / 0.30), transparent 60%)",
          }}
        />
        <div className="mx-auto max-w-7xl px-6 pt-12 pb-8 sm:pt-16 sm:pb-10">
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight">
            À l'affiche
          </h2>
        </div>
      </section>

      {/* Carousel swipe */}
      <section className="pb-24">
        <Carousel
          opts={{ align: "start", dragFree: true, loop: false }}
          className="mx-auto max-w-7xl px-6"
        >
          <CarouselContent className="-ml-4">
            {series.map((s) => (
              <CarouselItem
                key={s.id}
                className="pl-4 basis-[60%] sm:basis-[40%] md:basis-[28%] lg:basis-[22%]"
              >
                <PosterCard serie={s} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </section>
    </div>
  );
}
