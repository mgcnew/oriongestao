'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Receipt, Upload, Plus } from 'lucide-react'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { UploadPaystubModal } from '@/components/employees/modals/UploadPaystubModal'

interface HoleritesClientProps {
  employees: { id: string, full_name: string }[]
}

export function HoleritesClient({ employees }: HoleritesClientProps) {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)

  return (
    <>
      <div className="flex justify-end mb-6">
        <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700">
              <Upload className="w-4 h-4" />
              Importar Holerite
            </Button>
          </DialogTrigger>
          <UploadPaystubModal 
            employees={employees} 
            onClose={() => setIsUploadModalOpen(false)} 
          />
        </Dialog>
      </div>

      <Card className="flex flex-col items-center justify-center py-20 border-dashed bg-muted/5">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-4">
          <Receipt className="w-8 h-8 text-emerald-500" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">Central de Holerites</h3>
        <p className="text-muted-foreground text-sm mt-2 text-center max-w-sm">
          Faça o upload em massa ou individual dos contracheques. Eles serão automaticamente vinculados ao perfil de cada colaborador.
        </p>
        <Button 
          variant="outline"
          className="mt-6 gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
          onClick={() => setIsUploadModalOpen(true)}
        >
          <Plus className="w-4 h-4" />
          Novo Holerite
        </Button>
      </Card>
    </>
  )
}
