"use client";

import { useEffect } from "react";

// Registers the no-op service worker (public/sw.js) needed for PWA installability. Kept as
// its own client component so app/layout.js can stay a server component.
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch((err) => {
        console.error("Service worker registration failed:", err);
      });
    }
  }, []);

  return null;
}
