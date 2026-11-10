import type { MetadataRoute } from "next";
import { SITE_URL } from "@/content/site";

/* Todo el sitio se puede rastrear (menos la API) y el sitemap queda anunciado */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: "/api/" }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
