import Link from "next/link";
import Image from "next/image";
import {notFound} from "next/navigation";
import {supabaseServer} from "@/lib/supabase-server";
import {starterArticles} from "@/lib/articles";
import type {ReactNode} from "react";
export const dynamic="force-dynamic";
function renderContent(source:string):ReactNode[]{
 const lines=source.split(/\r?\n/);const out:ReactNode[]=[];let code:string[]=[];let inCode=false;let list:string[]=[];let key=0;
 const flush=()=>{if(list.length){out.push(<ul key={key++}>{list.map((v,i)=><li key={i}>{v}</li>)}</ul>);list=[];}};
 for(const line of lines){
  if(line.trim().startsWith("```")){flush();if(inCode){out.push(<pre key={key++}><code>{code.join("\n")}</code></pre>);code=[];}inCode=!inCode;continue;}
  if(inCode){code.push(line);continue;}
  if(line.startsWith("- ")){list.push(line.slice(2));continue;}
  flush();if(!line.trim())continue;
  const imageMatch=line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
  if(imageMatch){out.push(<figure className="article-figure" key={key++}><Image src={imageMatch[2]} alt={imageMatch[1]} width={1100} height={430} unoptimized/><figcaption>{imageMatch[1]}</figcaption></figure>);continue;}
  if(line.startsWith("### "))out.push(<h3 key={key++}>{line.slice(4)}</h3>);
  else if(line.startsWith("## "))out.push(<h2 key={key++}>{line.slice(3)}</h2>);
  else if(line.startsWith("# "))out.push(<h2 key={key++}>{line.slice(2)}</h2>);
  else if(line.startsWith("> "))out.push(<blockquote key={key++}>{line.slice(2)}</blockquote>);
  else out.push(<p key={key++}>{line}</p>);
 }
 flush();if(code.length)out.push(<pre key={key++}><code>{code.join("\n")}</code></pre>);return out;
}
export default async function ArticlePage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;let a:any=null;
 try{const sb=await supabaseServer();const {data}=await sb.from("articles").select("*").eq("slug",slug).eq("published",true).maybeSingle();a=data;}catch{}
 if(!a)a=starterArticles.find(x=>x.slug===slug);if(!a)notFound();
 const minutes=Math.max(1,Math.ceil(a.content.split(/\s+/).length/220));
 return <main><nav className="nav wrap"><Link className="brand" href="/">MEH<span>.</span></Link><Link href="/">← All articles</Link></nav><article className="reader"><div className="eyebrow">{a.category} · {minutes} MIN READ</div><h1>{a.title}</h1><p className="lead">{a.excerpt}</p><div className="prose">{renderContent(a.content)}</div><Link className="back" href="/">← Back to the hub</Link></article><footer className="wrap footer"><span>© 2026 MuleSoft Engineering Hub</span><span>Independent technical learning publication</span></footer></main>;
}
