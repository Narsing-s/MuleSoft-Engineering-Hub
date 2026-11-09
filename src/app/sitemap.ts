import type {MetadataRoute} from "next";
import {starterArticles} from "@/lib/articles";
export default function sitemap():MetadataRoute.Sitemap{
 const base=process.env.NEXT_PUBLIC_SITE_URL||"https://mulesoft-engineering-hub.vercel.app";
 return [
  {url:base,lastModified:new Date(),changeFrequency:"weekly",priority:1},
  ...starterArticles.map(article=>({url:`${base}/articles/${article.slug}`,lastModified:new Date(article.published_at),changeFrequency:"monthly" as const,priority:0.7}))
 ];
}
