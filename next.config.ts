import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    /*
      Fotos de referencia de Unsplash (reemplazar por fotografía propia). Con el patrón como objeto
      y sin `search` se aceptan sus parámetros (?auto=format&w=...); `new URL(...)` deja search
      vacío y el optimizador respondía 400 a cada foto.
    */
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com", pathname: "/**" }],
  },
};

export default nextConfig;
