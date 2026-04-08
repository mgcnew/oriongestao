import { Header } from '@/components/layout/sidebar'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Plus } from 'lucide-react'

export default function OcorrenciasPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header title="Ocorrências" subtitle="Advertências, faltas e outros registros" />
      <div className="flex-1 overflow-y-auto p-6">
        <Card className="flex flex-col items-center justify-center py-20 border-dashed">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-amber-500" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Gestão de Ocorrências</h3>
          <p className="text-muted-foreground text-sm mt-2 text-center max-w-sm">
            Registre advertências, suspensões, faltas e elogios. Mantenha o histórico completo.
          </p>
          <Button className="mt-6 gap-2 bg-amber-600 hover:bg-amber-700">
            <Plus className="w-4 h-4" />
            Nova Ocorrência
          </Button>
        </Card>
      </div>
    </div>
  )
}
