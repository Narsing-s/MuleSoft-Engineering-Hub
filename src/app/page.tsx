import Link from "next/link";
import {supabaseServer} from "@/lib/supabase-server";
import {starterArticles} from "@/lib/articles";
import ArticleLibrary from "@/components/article-library";
export const dynamic="force-dynamic";
export default async function Home(){
 let articles=starterArticles;
 try{
  const sb=await supabaseServer();
  const {data,error}=await sb.from("articles").select("id,title,slug,excerpt,category,content,published_at").eq("published",true).order("published_at",{ascending:false});
  if(!error&&data){
   const live=data.map(a=>({...a,reading_minutes:Math.max(1,Math.ceil(a.content.split(/\s+/).length/220))}));
   const liveSlugs=new Set(live.map(a=>a.slug));
   articles=[...live,...starterArticles.filter(a=>!liveSlugs.has(a.slug))];
  }
 }catch{}
 return <main className="site-shell">
  <div className="ambient ambient-one" aria-hidden="true"/><div className="ambient ambient-two" aria-hidden="true"/><div className="ambient-grid" aria-hidden="true"/>
  <nav className="nav wrap" data-reveal="down"><Link className="brand" href="/">MEH<span>.</span></Link><div><a href="#articles">Articles</a><Link href="/admin">Admin</Link></div></nav>
  <section className="hero wrap">
   <div className="eyebrow hero-eyebrow" data-reveal>THE INTEGRATION ENGINEERING COMMUNITY</div>
   <h1 data-reveal>Build better integrations.<br/><em>One API at a time.</em></h1>
   <p data-reveal>Practical MuleSoft tutorials, DataWeave patterns, API architecture and production lessons for engineers building connected systems.</p>
   <a className="primary hero-cta" data-reveal href="#articles">Explore articles <span>↗</span></a>
   <div className="hero-tags" data-reveal><span>MULE 4</span><span>DATAWEAVE 2.0</span><span>API-LED CONNECTIVITY</span><span>CLOUDHUB</span><span>PRODUCTION SUPPORT</span></div>
  </section>
  <section id="articles" className="wrap articles">
   <div className="section-head" data-reveal><div><div className="eyebrow">LEARN · BUILD · SHARE</div><h2>Engineering learning library</h2><p className="section-intro">Step-by-step tutorials, code walkthroughs, architecture diagrams and real-world operational guidance.</p></div><span className="count">{articles.length} ARTICLES</span></div>
   <ArticleLibrary articles={articles}/>
  </section>
  <footer className="wrap footer" data-reveal><span>© 2026 MuleSoft Engineering Hub</span><span>Engineering Better Integrations, One API at a Time.</span></footer>
 </main>;
}
