"use client";

import {useMemo,useState} from "react";
import Link from "next/link";

type ArticleCardData={id:string;title:string;slug:string;excerpt:string;category:string;reading_minutes:number};

export default function ArticleLibrary({articles}:{articles:ArticleCardData[]}){
 const [query,setQuery]=useState("");
 const [category,setCategory]=useState("All categories");
 const [page,setPage]=useState(1);
 const pageSize=9;
 const categories=useMemo(()=>["All categories",...Array.from(new Set(articles.map(a=>a.category))).sort()], [articles]);
 const filtered=useMemo(()=>{
  const q=query.trim().toLowerCase();
  return articles.filter(a=>(category==="All categories"||a.category===category)&&(!q||[a.title,a.excerpt,a.category].some(v=>v.toLowerCase().includes(q))));
 },[articles,category,query]);
 const pages=Math.max(1,Math.ceil(filtered.length/pageSize));
 const current=Math.min(page,pages);
 const visible=filtered.slice((current-1)*pageSize,current*pageSize);
 function changeQuery(value:string){setQuery(value);setPage(1);}
 function changeCategory(value:string){setCategory(value);setPage(1);}
 return <div className="library">
  <div className="library-tools">
   <label className="search-box"><span aria-hidden="true">⌕</span><input type="search" value={query} onChange={e=>changeQuery(e.target.value)} placeholder="Search MuleSoft, DataWeave, APIs..." aria-label="Search articles"/></label>
   <label className="category-select"><span>Category</span><select value={category} onChange={e=>changeCategory(e.target.value)}>{categories.map(c=><option key={c}>{c}</option>)}</select></label>
  </div>
  <div className="library-status" aria-live="polite"><span>Showing <strong>{visible.length?((current-1)*pageSize+1):0}–{Math.min(current*pageSize,filtered.length)}</strong> of <strong>{filtered.length}</strong> articles</span><span>{pageSize} articles per page</span></div>
  {visible.length?<div className="grid">{visible.map((a,i)=><article className="article-card" key={a.slug}><div className="card-top"><span>{a.category}</span><span>{String((current-1)*pageSize+i+1).padStart(2,"0")}</span></div><h3><Link href={`/articles/${a.slug}`}>{a.title}</Link></h3><p>{a.excerpt}</p><div className="card-bottom"><span>{a.reading_minutes} min read</span><Link href={`/articles/${a.slug}`}>Read tutorial ↗</Link></div></article>)}</div>:<div className="empty-results"><h3>No matching articles</h3><p>Try another keyword or choose a different category.</p><button type="button" onClick={()=>{changeQuery("");changeCategory("All categories");}}>Clear filters</button></div>}
  {pages>1&&<nav className="pagination" aria-label="Article pages"><button type="button" onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={current===1}>← Previous</button><span>Page {current} of {pages}</span><button type="button" onClick={()=>setPage(p=>Math.min(pages,p+1))} disabled={current===pages}>Next →</button></nav>}
 </div>;
}
