import { Header } from '@/components/layout/sidebar'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FileText, Upload, Search, Filter, FolderOpen } from 'lucide-react'

export default function DocumentosPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header title="Documentos" subtitle="Documentação digital centralizada e organizada" />
      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Buscar documentos..." className="pl-10" />
            </div>
            <Button variant="outline" size="icon"><Filter className="w-4 h-4" /></Button>
          </div>
          <Button className="w-full sm:w-auto gap-2">
            <Upload className="w-4 h-4" />
            Enviar Documento
          </Button>
        </div>
        <Card className="flex flex-col items-center justify-center py-20 border-dashed">
          <div className="w-16 h-16 rounded-2xl bg-violet-500/10 flex items-center justify-center mb-4">
            <FolderOpen className="w-8 h-8 text-violet-500" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Nenhum documento ainda</h3>
          <p className="text-muted-foreground text-sm mt-2 text-center max-w-sm">
            Faça upload de documentos dos funcionários para começar a organizar a documentação digital.
          </p>
          <Button className="mt-6 gap-2 bg-violet-600 hover:bg-violet-700">
            <Upload className="w-4 h-4" />
            Enviar primeiro documento
          </Button>
        </Card>
      </div>
    </div>
  )
}
