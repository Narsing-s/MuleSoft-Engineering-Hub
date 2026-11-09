import Link from "next/link";
import {supabaseServer} from "@/lib/supabase-server";
import {starterArticles} from "@/lib/articles";
export const dynamic="force-dynamic";
export default async function Home(){
 let articles=starterArticles;
 try{
  const sb=await supabaseServer();
  const {data,error}=await sb.from("articles").select("id,title,slug,excerpt,category,content").eq("published",true).order("published_at",{ascending:false});
  if(!error&&data&&data.length>0) articles=data.map(a=>({...a,reading_minutes:Math.max(1,Math.ceil(a.content.split(/\s+/).length/220))}));
 }catch{}
 return <main>
  <nav className="nav wrap"><Link className="brand" href="/">MEH<span>.</span></Link><div><a href="#articles">Articles</a><Link href="/admin">Admin</Link></div></nav>
  <section className="hero wrap">
   <div className="eyebrow">THE INTEGRATION ENGINEERING COMMUNITY</div>
   <h1>Build better integrations.<br/><em>One API at a time.</em></h1>
   <p>Practical MuleSoft tutorials, DataWeave patterns, API architecture and production lessons for engineers building connected systems.</p>
   <a className="primary" href="#articles">Explore articles <span>↗</span></a>
   <div className="hero-tags"><span>MULE 4</span><span>DATAWEAVE 2.0</span><span>API-LED CONNECTIVITY</span><span>CLOUDHUB</span><span>PRODUCTION SUPPORT</span></div>
  </section>
  <section id="articles" className="wrap articles">
   <div className="section-head"><div><div className="eyebrow">LEARN · BUILD · SHARE</div><h2>Engineering learning library</h2><p className="section-intro">Step-by-step tutorials, tested patterns, code walkthroughs and real-world operational guidance.</p></div><span className="count">{articles.length} ARTICLES</span></div>
   <div className="grid">{articles.map((a,i)=><article className="article-card" key={a.id}><div className="card-top"><span>{a.category}</span><span>{String(i+1).padStart(2,"0")}</span></div><h3><Link href={`/articles/${a.slug}`}>{a.title}</Link></h3><p>{a.excerpt}</p><div className="card-bottom"><span>{a.reading_minutes} min read</span><Link href={`/articles/${a.slug}`}>Read tutorial ↗</Link></div></article>)}</div>
  </section>
  <footer className="wrap footer"><span>© 2026 MuleSoft Engineering Hub</span><span>Engineering Better Integrations, One API at a Time.</span></footer>
 </main>;
}
