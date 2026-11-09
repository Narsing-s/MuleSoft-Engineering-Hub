import Link from "next/link";
import Image from "next/image";
import {notFound} from "next/navigation";
import {supabaseServer} from "@/lib/supabase-server";
import {starterArticles, type Article} from "@/lib/articles";
import type {ReactNode} from "react";
export const dynamic="force-dynamic";

function slugHeading(value:string){return value.toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g)||"section";}
function collectHeadings(source:string){
 const counts=new Map<string,number>();
 return source.split(/\r?\n/).flatMap(line=>{
  const match=line.match(/^#{2,3}\s+(.+)$/);if(!match)return [];
  const text=match[1].trim();const base=slugHeading(text);const count=counts.get(base)||0;counts.set(base,count+1);
  return [{text,level:line.startsWith("###")?3:2,id:count?base+"-"+count:base}];
 });
}
function renderContent(source:string):ReactNode[]{
 const lines=source.split(/\r?\n/);const out:ReactNode[]=[];let code:string[]=[];let inCode=false;let list:string[]=[];let listType:"ul"|"ol"="ul";let key=0;const headingCounts=new Map<string,number>();
 const flush=()=>{if(list.length){const items=list.map((v,i)=><li key={i}>{v}</li>);out.push(listType==="ol"?<ol key={key++}>{items}</ol>:<ul key={key++}>{items}</ul>);list=[];}};
 const heading=(text:string,level:2|3)=>{const base=slugHeading(text);const count=headingCounts.get(base)||0;headingCounts.set(base,count+1);const id=count?base+"-"+count:base;out.push(level===2?<h2 id={id} key={key++}>{text}</h2>:<h3 id={id} key={key++}>{text}</h3>);};
 for(const line of lines){
  if(line.trim().startsWith("```")){flush();if(inCode){out.push(<pre key={key++}><code>{code.join("\n")}</code></pre>);code=[];}inCode=!inCode;continue;}
  if(inCode){code.push(line);continue;}
  if(line.startsWith("- ")){if(list.length&&listType!=="ul")flush();listType="ul";list.push(line.slice(2));continue;}
  const ordered=line.match(/^\d+\.\s+(.*)$/);if(ordered){if(list.length&&listType!=="ol")flush();listType="ol";list.push(ordered[1]);continue;}
  flush();if(!line.trim())continue;
  const imageMatch=line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
  if(imageMatch){out.push(<figure className="article-figure" key={key++}><Image src={imageMatch[2]} alt={imageMatch[1]} width={1100} height={430} unoptimized/><figcaption>{imageMatch[1]}</figcaption></figure>);continue;}
  if(line.startsWith("### "))heading(line.slice(4),3);
  else if(line.startsWith("## "))heading(line.slice(3),2);
  else if(line.startsWith("# "))heading(line.slice(2),2);
  else if(line.startsWith("> "))out.push(<blockquote key={key++}>{line.slice(2)}</blockquote>);
  else out.push(<p key={key++}>{line}</p>);
 }
 flush();if(code.length)out.push(<pre key={key++}><code>{code.join("\n")}</code></pre>);return out;
}
export default async function ArticlePage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;let a:Article|null=null;
 try{const sb=await supabaseServer();const {data}=await sb.from("articles").select("*").eq("slug",slug).eq("published",true).maybeSingle();a=data;}catch{}
 if(!a)a=starterArticles.find(x=>x.slug===slug)??null;if(!a)notFound();
 const minutes=Math.max(1,Math.ceil(a.content.split(/\s+/).length/220));
 const headings=collectHeadings(a.content);
 const related=starterArticles.filter(item=>item.slug!==a!.slug&&item.category===a!.category).slice(0,3);
 return <main><nav className="nav wrap"><Link className="brand" href="/">MEH<span>.</span></Link><Link href="/">← All articles</Link></nav><article className="reader"><div className="eyebrow">{a.category} · {minutes} MIN READ</div><h1>{a.title}</h1><p className="lead">{a.excerpt}</p>{headings.length>2&&<nav className="table-of-contents" aria-label="Table of contents"><strong>In this article</strong><ol>{headings.map(h=><li className={h.level===3?"toc-sub":""} key={h.id}><a href={"#"+h.id}>{h.text}</a></li>)}</ol></nav>}<div className="prose">{renderContent(a.content)}</div>{related.length>0&&<aside className="related-articles"><h2>More in {a.category}</h2><ul>{related.map(item=><li key={item.slug}><Link href={"/articles/"+item.slug}>{item.title} ↗</Link></li>)}</ul></aside>}<Link className="back" href="/">← Back to the hub</Link></article><footer className="wrap footer"><span>© 2026 MuleSoft Engineering Hub</span><span>Independent technical learning publication</span></footer></main>;
}
