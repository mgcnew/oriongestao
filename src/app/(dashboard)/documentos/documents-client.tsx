'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Filter, FolderOpen, Upload, Plus } from 'lucide-react'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { UploadDocumentModal } from '@/components/employees/modals/UploadDocumentModal'

interface DocumentosClientProps {
  employees: { id: string, full_name: string }[]
}

export function DocumentosClient({ employees }: DocumentosClientProps) {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)

  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Buscar documentos..." className="pl-10" />
          </div>
          <Button variant="outline" size="icon"><Filter className="w-4 h-4" /></Button>
        </div>
        
        <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
          <DialogTrigger render={<Button className="w-full sm:w-auto gap-2 bg-violet-600 hover:bg-violet-700" />}>
            <Upload className="w-4 h-4" />
            Enviar Documento
          </DialogTrigger>
          <UploadDocumentModal 
            employees={employees} 
            onClose={() => setIsUploadModalOpen(false)} 
          />
        </Dialog>
      </div>

      <Card className="flex flex-col items-center justify-center py-20 border-dashed bg-muted/5">
        <div className="w-16 h-16 rounded-2xl bg-violet-500/10 flex items-center justify-center mb-4">
          <FolderOpen className="w-8 h-8 text-violet-500" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">Gestão de Documentos</h3>
        <p className="text-muted-foreground text-sm mt-1 text-center max-w-sm">
          Acesse os prontuários dos funcionários para visualizar documentos específicos ou use o botão acima para um novo upload.
        </p>
        <Button 
          variant="outline"
          className="mt-6 gap-2 border-violet-200 text-violet-700 hover:bg-violet-50"
          onClick={() => setIsUploadModalOpen(true)}
        >
          <Plus className="w-4 h-4" />
          Novo Upload Global
        </Button>
      </Card>
    </>
  )
}
