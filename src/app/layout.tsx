import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
 title: {default:"MuleSoft Engineering Hub",template:"%s | MuleSoft Engineering Hub"},
 description:"Practical MuleSoft engineering tutorials, DataWeave examples, API design, integration architecture and production support guides.",
 applicationName:"MuleSoft Engineering Hub",
 keywords:["MuleSoft","Mule 4","DataWeave 2.0","RAML","API-led connectivity","Anypoint Platform","CloudHub 2.0","MUnit","Integration Engineering"],
 openGraph:{type:"website",title:"MuleSoft Engineering Hub",description:"Engineering Better Integrations, One API at a Time."},
};
export default function RootLayout({children}:{children:React.ReactNode}) {
 return <html lang="en"><body>{children}</body></html>;
}
