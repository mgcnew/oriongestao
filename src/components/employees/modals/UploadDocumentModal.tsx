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
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { UploadCloud, Loader2, FileText } from 'lucide-react'
import { uploadEmployeeDocument } from '@/app/actions/employee-documents'

interface UploadDocumentModalProps {
  employeeId?: string
  employees?: { id: string, full_name: string }[]
  onClose: () => void
}

const CATEGORIES = [
  { value: 'identity', label: 'Identificação (RG/CPF)' },
  { value: 'contract', label: 'Contratos e Termos' },
  { value: 'medical', label: 'Exames Médicos (ASO)' },
  { value: 'certification', label: 'Certificados e Treinamentos' },
  { value: 'disciplinary', label: 'Advertências e Ocorrências' },
  { value: 'other', label: 'Outros' },
]

export function UploadDocumentModal({ employeeId, employees, onClose }: UploadDocumentModalProps) {
  const [isPending, startTransition] = useTransition()
  const [file, setFile] = useState<File | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('identity')
  const [selectedEmployee, setSelectedEmployee] = useState(employeeId || '')
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0]
      if (selected.size > 10 * 1024 * 1024) {
        toast.error('Atenção', { description: 'O arquivo não pode ser maior que 10MB.'})
        e.target.value = ''
        return
      }
      setFile(selected)
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!file) {
      toast.error('Erro', { description: 'Por favor selecione um arquivo.'})
      return
    }

    const finalEmployeeId = employeeId || selectedEmployee
    if (!finalEmployeeId) {
      toast.error('Erro', { description: 'Por favor selecione um funcionário.'})
      return
    }

    const formData = new FormData(e.currentTarget)
    formData.set('employeeId', finalEmployeeId)
    formData.set('category', selectedCategory)

    startTransition(async () => {
      const res = await uploadEmployeeDocument(formData)
      if (res.success) {
        toast.success('Sucesso', { description: res.message })
        setFile(null)
        onClose()
      } else {
        toast.error('Erro', { description: res.error })
      }
    })
  }

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Anexar Documento</DialogTitle>
        <DialogDescription>
          Faça upload seguro de arquivos PDF ou imagens. Máximo de 10MB.
        </DialogDescription>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-4 pt-4">
        {!employeeId && employees && (
          <div className="space-y-2">
            <Label htmlFor="employee">Funcionário</Label>
            <Select 
              value={selectedEmployee} 
              onValueChange={(val) => setSelectedEmployee(val || '')}
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

        <div className="space-y-2">
          <Label htmlFor="title">Título do Documento</Label>
          <Input id="title" name="title" placeholder="Ex: Cópia do RG" required />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category">Categoria</Label>
          <Select 
            name="category" 
            required 
            defaultValue={selectedCategory}
            onValueChange={(val) => setSelectedCategory(val || '')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
           <Label htmlFor="description">Descrição <span className="text-muted-foreground font-normal">(Opcional)</span></Label>
           <Textarea id="description" name="description" placeholder="Informações adicionais relevantes..." className="h-20" />
        </div>

        <div className="space-y-2">
           <Label htmlFor="file">Arquivo (PDF, JPG, PNG)</Label>
           <div className="flex border border-dashed border-border rounded-lg p-6 bg-muted/20 items-center justify-center flex-col text-center px-4 hover:bg-muted/40 transition-colors cursor-pointer relative">
             <input 
               type="file" 
               id="file" 
               name="file" 
               className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
               accept=".pdf,.png,.jpg,.jpeg,.webp"
               onChange={handleFileChange}
               required
             />
             <UploadCloud className="w-8 h-8 text-muted-foreground mb-3" />
             <p className="text-sm font-medium text-foreground">
               {file ? file.name : 'Clique para selecionar ou arraste o arquivo'}
             </p>
             <p className="text-xs text-muted-foreground mt-1">
               {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'Máximo 10MB'}
             </p>
           </div>
        </div>

        <div className="pt-4 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
          <Button type="submit" disabled={isPending} className="bg-violet-600 hover:bg-violet-700">
            {isPending ? (
               <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...</>
            ) : 'Anexar Documento'}
          </Button>
        </div>
      </form>
    </DialogContent>
  )
}
