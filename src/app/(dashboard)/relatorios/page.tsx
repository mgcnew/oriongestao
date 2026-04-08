import { Header } from '@/components/layout/sidebar'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BarChart3, Download } from 'lucide-react'

export default function RelatoriosPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header title="Relatórios" subtitle="Análises e exportações inteligentes" />
      <div className="flex-1 overflow-y-auto p-6">
        <Card className="flex flex-col items-center justify-center py-20 border-dashed">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-4">
            <BarChart3 className="w-8 h-8 text-indigo-500" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Relatórios e Análises</h3>
          <p className="text-muted-foreground text-sm mt-2 text-center max-w-sm">
            Gere relatórios completos por funcionário, exportações PDF para uso jurídico e análises da equipe.
          </p>
          <Button className="mt-6 gap-2 bg-indigo-600 hover:bg-indigo-700">
            <Download className="w-4 h-4" />
            Gerar Relatório
          </Button>
        </Card>
      </div>
    </div>
  )
}
