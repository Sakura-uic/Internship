import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

interface LoadingContextType {
  isLoading: boolean
}

const LoadingContext = createContext<LoadingContextType>({ isLoading: false })

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate initial data fetch
    const timer = setTimeout(() => setIsLoading(false), 1200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <LoadingContext.Provider value={{ isLoading }}>
      {children}
    </LoadingContext.Provider>
  )
}

export function useLoading() {
  return useContext(LoadingContext)
}