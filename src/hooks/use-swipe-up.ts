import { useEffect } from "react";

/**
 * Détecte un swipe vers le haut (sur tactile) ou un wheel/scroll vers le bas
 * sur la fenêtre, et déclenche `onSwipeUp`. Utilisé pour "remonter" hors
 * d'une vue plein écran.
 */
export function useSwipeUp(onSwipeUp: () => void, enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    let startY: number | null = null;
    let startX: number | null = null;
    let triggered = false;

    function onTouchStart(e: TouchEvent) {
      if (e.touches.length !== 1) return;
      startY = e.touches[0].clientY;
      startX = e.touches[0].clientX;
      triggered = false;
    }
    function onTouchMove(e: TouchEvent) {
      if (startY === null || startX === null || triggered) return;
      const dy = startY - e.touches[0].clientY; // positif = swipe vers le haut
      const dx = Math.abs(e.touches[0].clientX - startX);
      if (dy > 70 && dx < 60) {
        triggered = true;
        onSwipeUp();
      }
    }
    function onTouchEnd() {
      startY = null;
      startX = null;
    }

    let wheelAccum = 0;
    let wheelTimer: ReturnType<typeof setTimeout> | null = null;
    function onWheel(e: WheelEvent) {
      // un scroll vertical "vers le bas de la page" = swipe up
      if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
      wheelAccum += e.deltaY;
      if (wheelTimer) clearTimeout(wheelTimer);
      wheelTimer = setTimeout(() => {
        wheelAccum = 0;
      }, 250);
      if (wheelAccum > 120) {
        wheelAccum = 0;
        onSwipeUp();
      }
    }

    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowUp" || e.key === "Escape") onSwipeUp();
    }

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      if (wheelTimer) clearTimeout(wheelTimer);
    };
  }, [onSwipeUp, enabled]);
}
