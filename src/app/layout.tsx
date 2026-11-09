import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {title:"MuleSoft Engineering Hub",description:"Practical MuleSoft engineering, DataWeave, API design and integration patterns."};
export default function RootLayout({children}:{children:React.ReactNode}) {
 return <html lang="en"><body>{children}</body></html>;
}