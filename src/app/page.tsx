import Link from "next/link";
import { starterArticles } from "@/lib/articles";
export default function Home() {
 return <main>
  <nav className="nav wrap"><Link className="brand" href="/">MEH<span>.</span></Link><div><a href="#articles">Articles</a><Link href="/admin">Admin</Link></div></nav>
  <section className="hero wrap"><div className="eyebrow">THE INTEGRATION ENGINEERING COMMUNITY</div><h1>Build better integrations.<br/><em>One API at a time.</em></h1><p>Practical MuleSoft tutorials, DataWeave patterns, API architecture and production lessons for engineers building connected systems.</p><a className="primary" href="#articles">Explore articles <span>↗</span></a><div className="hero-tags"><span>MULE 4</span><span>DATAWEAVE 2.0</span><span>API-LED CONNECTIVITY</span><span>CLOUDHUB</span></div></section>
  <section id="articles" className="wrap articles"><div className="section-head"><div><div className="eyebrow">LEARN · BUILD · SHARE</div><h2>Latest engineering notes</h2></div><span className="count">{starterArticles.length} STARTER ARTICLES</span></div>
  <div className="grid">{starterArticles.map((a,i)=><article className="article-card" key={a.id}><div className="card-top"><span>{a.category}</span><span>0{i+1}</span></div><h3><Link href={`/articles/${a.slug}`}>{a.title}</Link></h3><p>{a.excerpt}</p><div className="card-bottom"><span>{a.reading_minutes} min read</span><Link href={`/articles/${a.slug}`}>Read article ↗</Link></div></article>)}</div></section>
  <footer className="wrap footer"><span>© 2026 MuleSoft Engineering Hub</span><span>Independent learning community · Built by engineers</span></footer>
 </main>;
}