import { Sidebar } from '@/components/layout/sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/sonner'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider delay={500}>
      <div className="flex h-screen overflow-hidden bg-[#fafafa]">
        <Sidebar />
        <main className="flex-1 flex flex-col overflow-hidden my-4 ml-2 mr-4 bg-white border border-border shadow-sm rounded-3xl">
          {children}
        </main>
      </div>
      <Toaster position="top-right" richColors />
    </TooltipProvider>
  )
}
