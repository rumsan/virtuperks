import { Providers } from "@/providers/providers";
import { GraphQueryProvider } from "@/providers/subgraph-provider";
import Validation from "@/providers/validation";
import { Wagmi } from "@/providers/wagmi-provider";
import { Toaster } from "@workspace/ui/components/toaster";
import "@workspace/ui/globals.css";
import { Geist, Geist_Mono } from "next/font/google";




const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased `}
      >
        <Wagmi>
          
          <GraphQueryProvider>
            <Providers>
              

  <Validation>{children}</Validation>


              </Providers>
             
            </GraphQueryProvider>
             
        </Wagmi>
        <Toaster />
      </body>
    </html>
  );
}
