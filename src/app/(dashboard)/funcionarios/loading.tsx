import { Header } from '@/components/layout/sidebar'
import { Card } from '@/components/ui/card'

export default function Loading() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header title="Funcionários" subtitle="Gerenciamento de equipe" />

      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {/* Skeleton Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-4 flex flex-col items-center justify-center animate-pulse">
              <div className="h-8 w-16 bg-muted rounded-md mb-2"></div>
              <div className="h-3 w-20 bg-muted/60 rounded-md"></div>
            </Card>
          ))}
        </div>

        {/* Skeleton Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-pulse">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="h-10 w-full sm:w-72 bg-muted rounded-md"></div>
            <div className="h-10 w-10 bg-muted rounded-md"></div>
            <div className="h-10 w-10 bg-muted rounded-md"></div>
          </div>
          <div className="h-10 w-full sm:w-40 bg-muted rounded-md"></div>
        </div>

        {/* Skeleton Table */}
        <Card className="overflow-hidden animate-pulse">
          <div className="bg-muted/50 h-12 border-b border-border w-full"></div>
          <div className="divide-y divide-border">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex p-5 items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 bg-muted rounded-full"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-muted rounded-md"></div>
                    <div className="h-3 w-24 bg-muted/60 rounded-md"></div>
                  </div>
                </div>
                <div className="h-4 w-24 bg-muted rounded-md hidden sm:block"></div>
                <div className="h-4 w-32 bg-muted rounded-md hidden sm:block"></div>
                <div className="h-4 w-20 bg-muted rounded-md hidden md:block"></div>
                <div className="h-6 w-16 bg-muted rounded-full"></div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
