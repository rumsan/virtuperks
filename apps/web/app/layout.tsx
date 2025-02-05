import { Providers } from "@/provider/providers";
import { GraphQueryProvider } from "@/provider/subgraph-provider";
import { Wagmi } from "@/provider/wagmi-provider";
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
            {/* {children} */}
            <Providers>{children}</Providers>
          </GraphQueryProvider>
        </Wagmi>
      </body>
    </html>
  );
}
