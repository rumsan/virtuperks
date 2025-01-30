// "use client"

// import { ConnectKitProvider } from "connectkit"
// import { ThemeProvider as NextThemesProvider } from "next-themes"
// import * as React from "react"

// export function Providers({ children }: { children: React.ReactNode }) {
//   return (
//     <NextThemesProvider
//       attribute="class"
//       defaultTheme="system"
//       enableSystem
//       disableTransitionOnChange
//       enableColorScheme
//     >
//       <ConnectKitProvider theme="soft">{children}</ConnectKitProvider>
//     </NextThemesProvider>
//   )
// }

"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ConnectKitProvider } from "connectkit"
import * as React from "react"

interface QueryProviderProps {
  children: React.ReactNode
}

export function Providers({ children }: QueryProviderProps) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: false
      },
      mutations: {
        retry: false
      }
    }
  })
  return (
    <QueryClientProvider client={queryClient}><ConnectKitProvider theme="soft">{children}</ConnectKitProvider></QueryClientProvider>
  )
}
