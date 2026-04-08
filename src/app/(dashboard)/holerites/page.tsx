import { Header } from '@/components/layout/sidebar'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Receipt, Upload } from 'lucide-react'

export default function HoleritesPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header title="Holerites" subtitle="Armazenamento e histórico de contracheques" />
      <div className="flex-1 overflow-y-auto p-6">
        <Card className="flex flex-col items-center justify-center py-20 border-dashed">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 flex items-center justify-center mb-4">
            <Receipt className="w-8 h-8 text-rose-500" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Holerites Digitais</h3>
          <p className="text-muted-foreground text-sm mt-2 text-center max-w-sm">
            Faça upload dos holerites em PDF ou imagem e mantenha o histórico financeiro organizado.
          </p>
          <Button className="mt-6 gap-2 bg-rose-600 hover:bg-rose-700">
            <Upload className="w-4 h-4" />
            Enviar Holerite
          </Button>
        </Card>
      </div>
    </div>
  )
}
