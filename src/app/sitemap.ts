import type { MetadataRoute } from "next";
import { SERVICES } from "@/content/services";
import { SITE_URL } from "@/content/site";

/* La página principal y una página por servicio */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    ...SERVICES.map((s) => ({
      url: `${SITE_URL}/servicios/${s.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
