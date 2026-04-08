'use client'

import { useState, useTransition } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, FileCheck2, UploadCloud, Download, Trash2, ShieldAlert, File, AlertCircle, Loader2 } from 'lucide-react'
import { uploadEmployeeDocument, deleteEmployeeDocument, getDocumentUrl } from '@/app/actions/employee-documents'
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
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

interface DocumentRecord {
  id: string
  category: string
  title: string
  file_path: string
  file_type: string | null
  file_size: number | null
  uploaded_at: string | null
  file_name: string | null
  description?: string
}

interface EmployeeDocumentsTabProps {
  employeeId: string
  documents: DocumentRecord[]
}

const CATEGORIES = [
  { value: 'identity', label: 'Identificação (RG/CPF)' },
  { value: 'contract', label: 'Contratos e Termos' },
  { value: 'medical', label: 'Exames Médicos (ASO)' },
  { value: 'certification', label: 'Certificados e Treinamentos' },
  { value: 'disciplinary', label: 'Advertências e Ocorrências' },
  { value: 'other', label: 'Outros' },
]

export function EmployeeDocumentsTab({ employeeId, documents }: EmployeeDocumentsTabProps) {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)

  const handleDownload = async (filePath: string, fileName: string | null) => {
    try {
      const url = await getDocumentUrl(filePath)
      if (!url) throw new Error('Não foi possível gerar um link seguro para download.')
      
      // Create a temporary link element to trigger the download
      const a = document.createElement('a')
      a.href = url
      a.target = '_blank'
      a.download = fileName || 'documento'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    } catch (error: any) {
       toast.error("Erro no download", {
        description: error.message,
      })
    }
  }

  const handleDelete = async (docId: string, filePath: string) => {
    if (!confirm('Tem certeza que deseja excluir permanentemente este documento?')) return

    const res = await deleteEmployeeDocument(docId, filePath, employeeId)
    if (res.success) {
      toast.success('Sucesso', { description: res.message })
    } else {
      toast.error('Erro', { description: res.error })
    }
  }

  return (
    <Card className="p-6 shadow-sm min-h-[400px]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <FileCheck2 className="w-5 h-5 text-emerald-500" />
          Documentos Digitais
        </h3>
        <UploadDocumentModal 
          employeeId={employeeId} 
          open={isUploadModalOpen} 
          onOpenChange={setIsUploadModalOpen} 
        />
      </div>
      
      {documents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-border rounded-xl bg-muted/10">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <ShieldAlert className="w-8 h-8 text-primary" />
          </div>
          <h4 className="text-base font-semibold text-foreground">Nenhum documento anexado</h4>
          <p className="text-sm text-muted-foreground text-center mt-2 max-w-[280px]">
            Faça o upload do RG, CPF, Contrato e outros documentos para digitalizar a pasta do funcionário.
          </p>
          <Button 
            variant="default" 
            className="mt-6"
            onClick={() => setIsUploadModalOpen(true)}
          >
            Adicionar Primeiro Documento
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <Card key={doc.id} className="p-4 flex flex-col gap-3 group relative overflow-hidden transition-all hover:shadow-md border-border/60 hover:border-primary/30">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm line-clamp-1" title={doc.title}>{doc.title}</h4>
                    <span className="text-xs text-muted-foreground uppercase">
                      {CATEGORIES.find(c => c.value === doc.category)?.label || doc.category}
                    </span>
                  </div>
                </div>
              </div>

              {doc.description && (
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1 px-1">
                  {doc.description}
                </p>
              )}

              <div className="mt-auto pt-4 flex items-center justify-between border-t border-border/50">
                <p className="text-[11px] text-muted-foreground">
                  Adicionado em {doc.uploaded_at ? new Date(doc.uploaded_at).toLocaleDateString('pt-BR') : 'Data desconhecida'} <br/>
                  {doc.file_size ? (doc.file_size / 1024 / 1024).toFixed(2) : '0.00'} MB
                </p>
                
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50" onClick={() => handleDownload(doc.file_path, doc.file_name)}>
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(doc.id, doc.file_path)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Card>
  )
}

function UploadDocumentModal({ employeeId, open, onOpenChange }: { employeeId: string, open: boolean, onOpenChange: (open: boolean) => void }) {
  const [isPending, startTransition] = useTransition()
  
  const [file, setFile] = useState<File | null>(null)
  
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
      toast.error('Erro', { description: 'Por favor seleccione um arquivo.'})
      return
    }

    const formData = new FormData(e.currentTarget)
    formData.append('employeeId', employeeId)

    startTransition(async () => {
      const res = await uploadEmployeeDocument(formData)
      if (res.success) {
        toast.success('Sucesso', { description: res.message })
        onOpenChange(false)
        setFile(null)
      } else {
        toast.error('Erro', { description: res.error })
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger render={<Button size="sm" className="gap-2" />}>
        <UploadCloud className="w-4 h-4" />
        Novo Documento
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Anexar Documento</DialogTitle>
          <DialogDescription>
            Faça upload seguro de arquivos PDF ou imagens. Máximo de 10MB.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título do Documento</Label>
            <Input id="title" name="title" placeholder="Ex: Cópia do RG" required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <Select name="category" required defaultValue="identity">
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
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                 <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...</>
              ) : 'Anexar Documento'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
