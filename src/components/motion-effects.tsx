"use client";

import {useEffect} from "react";

export default function MotionEffects(){
 useEffect(()=>{
  const reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const progress=document.querySelector<HTMLElement>(".scroll-progress");
  const updateProgress=()=>{
   if(!progress)return;
   const max=document.documentElement.scrollHeight-window.innerHeight;
   progress.style.transform=`scaleX(${max>0?window.scrollY/max:0})`;
  };
  updateProgress();
  window.addEventListener("scroll",updateProgress,{passive:true});
  if(reduce||!("IntersectionObserver" in window)){
   document.body.classList.add("motion-ready");
   return ()=>window.removeEventListener("scroll",updateProgress);
  }
  document.body.classList.add("motion-ready");
  const reveal=new IntersectionObserver(entries=>{
   entries.forEach(entry=>{
    if(entry.isIntersecting){
     (entry.target as HTMLElement).classList.add("is-visible");
     reveal.unobserve(entry.target);
    }
   });
  },{threshold:0.12,rootMargin:"0px 0px -36px 0px"});
  const observe=(root:ParentNode)=>{
   root.querySelectorAll<HTMLElement>("[data-reveal],.article-card,.reader > *, .login > *, .admin-shell > *").forEach((el,index)=>{
    if(el.dataset.motionObserved)return;
    el.dataset.motionObserved="true";
    el.classList.add("motion-reveal");
    if(el.classList.contains("article-card"))el.style.setProperty("--reveal-delay",`${(index%9)*55}ms`);
    reveal.observe(el);
   });
  };
  observe(document);
  const mutations=new MutationObserver(records=>records.forEach(record=>record.addedNodes.forEach(node=>{
   if(node instanceof HTMLElement){observe(node.parentNode??document);if(node.matches("[data-reveal],.article-card"))observe(document);}
  })));
  mutations.observe(document.body,{childList:true,subtree:true});
  return ()=>{
   reveal.disconnect();
   mutations.disconnect();
   window.removeEventListener("scroll",updateProgress);
   document.body.classList.remove("motion-ready");
  };
 },[]);
 return <div className="scroll-progress" aria-hidden="true"/>;
}
