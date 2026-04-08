'use client'

import { useState, useTransition } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Wallet, UploadCloud, Download, Trash2, Calendar, FileText, Loader2, Info } from 'lucide-react'
import { uploadPaystub, deletePaystub, getPaystubUrl } from '@/app/actions/employee-paystubs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'

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
        <UploadPaystubModal 
          employeeId={employeeId} 
          open={isUploadModalOpen} 
          onOpenChange={setIsUploadModalOpen} 
        />
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
                <div>
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

              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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

function UploadPaystubModal({ employeeId, open, onOpenChange }: { employeeId: string, open: boolean, onOpenChange: (open: boolean) => void }) {
  const [isPending, startTransition] = useTransition()
  const [file, setFile] = useState<File | null>(null)
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0]
      if (selected.size > 5 * 1024 * 1024) { // 5MB limit for paystubs
        toast.error('Arquivo muito grande', { description: 'Holerites devem ter no máximo 5MB.'})
        e.target.value = ''
        return
      }
      setFile(selected)
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!file) {
      toast.error('Selecione um arquivo', { description: 'É necessário anexar o PDF do holerite.'})
      return
    }

    const formData = new FormData(e.currentTarget)
    formData.append('employeeId', employeeId)

    startTransition(async () => {
      const res = await uploadPaystub(formData)
      if (res.success) {
        toast.success('Pronto!', { description: res.message })
        onOpenChange(false)
        setFile(null)
      } else {
        toast.error('Falha no upload', { description: res.error })
      }
    })
  }

  const currentMonth = new Date().toISOString().substring(0, 7) // YYYY-MM

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger render={<Button size="sm" className="gap-2 bg-emerald-600 hover:bg-emerald-700" />}>
        <UploadCloud className="w-4 h-4" />
        Importar Holerite
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Importar Novo Holerite</DialogTitle>
          <DialogDescription>
            Envie o comprovante de pagamento em PDF para este colaborador.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-5 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="referenceMonth">Mês de Referência</Label>
              <Input id="referenceMonth" name="referenceMonth" type="month" defaultValue={currentMonth} required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <Select name="type" required defaultValue="mensal">
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {PAYSTUB_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
             <Label htmlFor="file">Arquivo PDF</Label>
             <div className="flex border border-dashed border-emerald-200 rounded-xl p-6 bg-emerald-50/30 items-center justify-center flex-col text-center px-4 hover:bg-emerald-50/50 transition-colors cursor-pointer relative">
               <input 
                 type="file" 
                 id="file" 
                 name="file" 
                 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                 accept=".pdf"
                 onChange={handleFileChange}
                 required
               />
               <FileText className="w-8 h-8 text-emerald-600/50 mb-3" />
               <p className="text-sm font-medium text-foreground">
                 {file ? file.name : 'Selecione o PDF do holerite'}
               </p>
               <p className="text-xs text-muted-foreground mt-1">
                 {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'Máximo 5MB'}
               </p>
             </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700" disabled={isPending}>
              {isPending ? (
                 <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processando...</>
              ) : 'Confirmar Envio'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
