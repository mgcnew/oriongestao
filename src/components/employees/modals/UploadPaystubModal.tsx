'use client'

import { useState, useTransition } from 'react'
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { FileText, Loader2 } from 'lucide-react'
import { uploadPaystub } from '@/app/actions/employee-paystubs'

interface UploadPaystubModalProps {
  employeeId?: string
  employees?: { id: string, full_name: string }[]
  onClose: () => void
}

const PAYSTUB_TYPES = [
  { value: 'mensal', label: 'Mensal / Folha' },
  { value: 'adiantamento', label: 'Adiantamento Quinzenal' },
  { value: '13_salario', label: '13º Salário' },
  { value: 'ferias', label: 'Férias' },
  { value: 'rescisao', label: 'Rescisão' },
]

export function UploadPaystubModal({ employeeId, employees, onClose }: UploadPaystubModalProps) {
  const [isPending, startTransition] = useTransition()
  const [file, setFile] = useState<File | null>(null)
  const [selectedType, setSelectedType] = useState('mensal')
  const [selectedEmployee, setSelectedEmployee] = useState(employeeId || '')
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0]
      if (selected.size > 5 * 1024 * 1024) {
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

    const finalEmployeeId = employeeId || selectedEmployee
    if (!finalEmployeeId) {
      toast.error('Erro', { description: 'Por favor selecione um funcionário.'})
      return
    }

    const formData = new FormData(e.currentTarget)
    formData.set('employeeId', finalEmployeeId)
    formData.set('type', selectedType)

    startTransition(async () => {
      const res = await uploadPaystub(formData)
      if (res.success) {
        toast.success('Pronto!', { description: res.message })
        setFile(null)
        onClose()
      } else {
        toast.error('Falha no upload', { description: res.error })
      }
    })
  }

  const currentMonth = new Date().toISOString().substring(0, 7) // YYYY-MM

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Importar Novo Holerite</DialogTitle>
        <DialogDescription>
          Envie o comprovante de pagamento em PDF para o histórico do colaborador.
        </DialogDescription>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-5 pt-4">
        {!employeeId && employees && (
          <div className="space-y-2">
            <Label htmlFor="employee">Funcionário</Label>
            <Select 
              value={selectedEmployee} 
              onValueChange={setSelectedEmployee}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o funcionário..." />
              </SelectTrigger>
              <SelectContent>
                {employees.map(emp => (
                  <SelectItem key={emp.id} value={emp.id}>{emp.full_name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="referenceMonth">Mês de Referência</Label>
            <Input id="referenceMonth" name="referenceMonth" type="month" defaultValue={currentMonth} required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Tipo</Label>
            <Select 
              name="type" 
              required 
              defaultValue={selectedType}
              onValueChange={setSelectedType}
            >
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
          <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
          <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700" disabled={isPending}>
            {isPending ? (
               <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processando...</>
            ) : 'Confirmar Envio'}
          </Button>
        </div>
      </form>
    </DialogContent>
  )
}
