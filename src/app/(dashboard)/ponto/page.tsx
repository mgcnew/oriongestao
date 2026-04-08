import { Header } from '@/components/layout/sidebar'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Clock, Plus } from 'lucide-react'

export default function PontoPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header title="Controle de Ponto" subtitle="Registro de jornada e horas trabalhadas" />
      <div className="flex-1 overflow-y-auto p-6">
        <Card className="flex flex-col items-center justify-center py-20 border-dashed">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-4">
            <Clock className="w-8 h-8 text-cyan-500" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Controle de Ponto</h3>
          <p className="text-muted-foreground text-sm mt-2 text-center max-w-sm">
            Registre e acompanhe a jornada de trabalho dos funcionários. Cadastre funcionários primeiro.
          </p>
          <Button className="mt-6 gap-2 bg-cyan-600 hover:bg-cyan-700">
            <Plus className="w-4 h-4" />
            Registrar Ponto
          </Button>
        </Card>
      </div>
    </div>
  )
}
