import { Header } from '@/components/layout/sidebar'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Umbrella, Plus } from 'lucide-react'

export default function FeriasPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header title="Férias e Licenças" subtitle="Controle de períodos e aprovações" />
      <div className="flex-1 overflow-y-auto p-6">
        <Card className="flex flex-col items-center justify-center py-20 border-dashed">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-4">
            <Umbrella className="w-8 h-8 text-emerald-500" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Férias e Licenças</h3>
          <p className="text-muted-foreground text-sm mt-2 text-center max-w-sm">
            Gerencie solicitações de férias, licenças médicas, maternidade e outros afastamentos.
          </p>
          <Button className="mt-6 gap-2 bg-emerald-600 hover:bg-emerald-700">
            <Plus className="w-4 h-4" />
            Nova Solicitação
          </Button>
        </Card>
      </div>
    </div>
  )
}
