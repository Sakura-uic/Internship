import { useState } from 'react'
import { Outlet } from 'react-router'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { LoadingProvider } from '@/context/LoadingContext'
import { AppProvider } from '@/context/AppContext'
import { ToastContainer } from '@/components/shared/ToastContainer'

export function Layout() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <AppProvider>
      <LoadingProvider>
        <div className="flex h-screen overflow-hidden bg-[#f8f9fb]">
          <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
          <div className="flex flex-col flex-1 overflow-hidden min-w-0">
            <TopBar />
            <main className="flex-1 overflow-y-auto">
              <Outlet />
            </main>
          </div>
        </div>
        <ToastContainer />
      </LoadingProvider>
    </AppProvider>
  )
}