'use client'

import { useState, useTransition } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Wallet, UploadCloud, Download, Trash2, FileText, Loader2, Info } from 'lucide-react'
import { uploadPaystub, deletePaystub, getPaystubUrl } from '@/app/actions/employee-paystubs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'
import { UploadPaystubModal } from './modals/UploadPaystubModal'

export interface PaystubRecord {
  id: string
  employee_id: string
  month: string
  type: string
  file_path: string
  file_name: string | null
  uploaded_at: string | null
}

interface EmployeePaystubsTabProps {
  employeeId: string
  paystubs: PaystubRecord[]
}

const PAYSTUB_TYPES = [
  { value: 'mensal', label: 'Mensal / Folha' },
  { value: 'adiantamento', label: 'Adiantamento Quinzenal' },
  { value: '13_salario', label: '13º Salário' },
  { value: 'ferias', label: 'Férias' },
  { value: 'rescisao', label: 'Rescisão' },
]

export function EmployeePaystubsTab({ employeeId, paystubs }: EmployeePaystubsTabProps) {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const router = useRouter()

  const handleDownload = async (filePath: string, fileName: string | null) => {
    try {
      const url = await getPaystubUrl(filePath)
      if (!url) throw new Error('Não foi possível gerar um link seguro para o holerite.')
      
      const a = document.createElement('a')
      a.href = url
      a.target = '_blank'
      a.download = fileName || 'holerite'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    } catch (error: any) {
       toast.error("Erro no download", {
        description: error.message,
      })
    }
  }

  const handleDelete = async (paystubId: string, filePath: string) => {
    if (!confirm('Tem certeza que deseja excluir este holerite?')) return

    const res = await deletePaystub(paystubId, filePath, employeeId)
    if (res.success) {
      toast.success('Sucesso', { description: res.message })
      router.refresh()
    } else {
      toast.error('Erro', { description: res.error })
    }
  }

  const formatMonth = (monthStr: string) => {
    if (!monthStr) return '—'
    const [year, month] = monthStr.split('-')
    const date = new Date(parseInt(year), parseInt(month) - 1)
    return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
  }

  return (
    <Card className="p-6 shadow-sm min-h-[400px]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
           <Wallet className="w-5 h-5 text-emerald-600" />
           <h3 className="text-lg font-semibold">Holerites e Comprovantes</h3>
        </div>
        <div className="flex gap-2">
          <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
            <DialogTrigger render={<Button size="sm" className="gap-2 bg-emerald-600 hover:bg-emerald-700" />}>
              <UploadCloud className="w-4 h-4" />
              Importar Holerite
            </DialogTrigger>
            <UploadPaystubModal 
              employeeId={employeeId} 
              onClose={() => {
                setIsUploadModalOpen(false)
                router.refresh()
              }} 
            />
          </Dialog>
        </div>
      </div>

      {paystubs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-border rounded-xl bg-muted/10">
          <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
            <Info className="w-8 h-8 text-emerald-500" />
          </div>
          <h4 className="text-base font-semibold text-foreground">Ainda sem holerites</h4>
          <p className="text-sm text-muted-foreground text-center mt-2 max-w-[280px]">
             Os comprovantes de pagamento digitalizados aparecerão nesta lista após o envio.
          </p>
          <Button 
            variant="outline" 
            className="mt-6 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
            onClick={() => setIsUploadModalOpen(true)}
          >
            Importar Primeiro Holerite
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paystubs.map((paystub) => (
            <Card key={paystub.id} className="p-4 flex items-center justify-between group transition-all hover:shadow-md border-border/60 hover:border-emerald-300/50 bg-white">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100/50">
                  <FileText className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="flex flex-col">
                  <h4 className="font-semibold text-sm text-foreground capitalize">
                    {formatMonth(paystub.month)}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 bg-muted text-muted-foreground font-normal">
                      {PAYSTUB_TYPES.find(t => t.value === paystub.type)?.label || paystub.type}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50" onClick={() => handleDownload(paystub.file_path, paystub.file_name)}>
                  <Download className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(paystub.id, paystub.file_path)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Card>
  )
}

