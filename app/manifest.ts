import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "GrimCast",
    short_name: "GrimCast",
    description: "Real weather. Bad attitude.",
    start_url: "/",
    display: "standalone",
    background_color: "#050509",
    theme_color: "#ff4d6d",
    icons: [
      {
        src: "/grimcast-logo.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/grimcast-logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}