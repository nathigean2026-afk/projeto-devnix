import { MetadataRoute } from "next"

const BASE_URL = "https://elevanthe.com"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/quem-somos", "/projetos", "/crm-plus", "/glossario"],
        disallow: ["/admin", "/sign-in", "/sign-up", "/api/"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  }
}
