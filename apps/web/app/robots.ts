import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard",
          "/polls/create",
          "/polls/*/edit",
          "/polls/*/analytics",
          "/api/",
        ],
      },
    ],
    sitemap: "https://opinion.atharvdangedev.in/sitemap.xml",
  };
}
