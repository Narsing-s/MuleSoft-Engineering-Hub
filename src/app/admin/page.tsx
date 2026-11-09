 "use client";
import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase";
const owner = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "narsingbeesetti006@gmail.com";
export default function Admin() {
 const [email,setEmail]=useState(owner),[sent,setSent]=useState(false),[error,setError]=useState("");
 async function login(e:React.FormEvent){e.preventDefault();setError("");try{const sb=supabaseBrowser();const {error}=await sb.auth.signInWithOtp({email,options:{emailRedirectTo:window.location.origin+"/admin"}});if(error)throw error;setSent(true);}catch(err){setError(err instanceof Error?err.message:"Unable to send sign-in link. Check Supabase configuration.");}}
 return <main><nav className="nav wrap"><a className="brand" href="/">MEH<span>.</span></a><a href="/">← Public site</a></nav><section className="login"><div className="eyebrow">PRIVATE WORKSPACE</div><h1>Admin sign in</h1><p>Only the site owner can access the publishing dashboard.</p><form onSubmit={login}><label>Email address</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} required/><button className="primary">Send secure sign-in link</button></form>{sent&&<p className="success">Check your inbox for the secure sign-in link.</p>}{error&&<p className="error">{error}</p>}<small>Publishing actions are not enabled until Supabase is configured and database policies are applied. See README.</small></section></main>;
}