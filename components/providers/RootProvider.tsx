"use client"

import { ThemeProvider } from "next-themes"
import { ReactNode } from "react"
import { QueryClientProvider, QueryClient } from "react-query"


function RootProvider({ children }: { children: ReactNode }) {
    const queryClient = new QueryClient()

    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                {children}
            </ThemeProvider>
        </QueryClientProvider>

    )
}

export default RootProvider
