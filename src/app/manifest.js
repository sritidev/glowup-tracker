export default function manifest() {
  return {
    name: "MyAura — Wellness Companion",
    short_name: "MyAura",
    description: "Track mood, movement, hydration, sleep & self-care — gently.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#fff5f7",
    theme_color: "#f43f8a",
    categories: ["health", "lifestyle", "wellness"],
    icons: [
      { src: "/icon-192.png",      sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png",      sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
