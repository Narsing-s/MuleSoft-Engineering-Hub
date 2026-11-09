import Link from "next/link";
import { notFound } from "next/navigation";
import { starterArticles } from "@/lib/articles";
export function generateStaticParams(){return starterArticles.map(a=>({slug:a.slug}));}
export default async function ArticlePage({params}:{params:Promise<{slug:string}>}) {
 const {slug}=await params; const a=starterArticles.find(x=>x.slug===slug); if(!a) notFound();
 return <main><nav className="nav wrap"><Link className="brand" href="/">MEH<span>.</span></Link><Link href="/">← All articles</Link></nav><article className="reader"><div className="eyebrow">{a.category} · {a.reading_minutes} MIN READ</div><h1>{a.title}</h1><p className="lead">{a.excerpt}</p><div className="prose">{a.content.split("\\n").map((line,i)=>line.startsWith("## ")?<h2 key={i}>{line.slice(3)}</h2>:line.startsWith("```")?<div key={i} className="code-label">Code example</div>:line?<p key={i}>{line}</p>:null)}</div><Link className="back" href="/">← Back to the hub</Link></article></main>;
}