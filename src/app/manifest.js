export default function manifest() {
  return {
    name: "Self Love — Wellness Companion",
    short_name: "Self Love",
    description: "Track mood, movement, hydration, sleep & self-care — gently.",
    start_url: "/dashboard",
    display: "standalone",
    orientation: "portrait",
    background_color: "#fff5f7",
    theme_color: "#f43f8a",
    categories: ["health", "lifestyle", "wellness"],
    icons: [
      { src: "/selfcare.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/selfcare.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/selfcare.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
