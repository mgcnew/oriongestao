'use client'

import { useState, useTransition } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, FileCheck2, UploadCloud, Download, Trash2, Plus, Upload, Loader2 } from 'lucide-react'
import { uploadEmployeeDocument, deleteEmployeeDocument, getDocumentUrl } from '@/app/actions/employee-documents'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { UploadDocumentModal } from './modals/UploadDocumentModal'

interface DocumentRecord {
  id: string
  category: string
  title: string
  file_path: string
  file_type: string | null
  file_size: number | null
  uploaded_at: string | null
  file_name: string | null
  description?: string | null
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
  const router = useRouter()

  const handleDownload = async (filePath: string, fileName: string | null) => {
    try {
      const url = await getDocumentUrl(filePath)
      if (!url) throw new Error('Não foi possível gerar um link seguro para download.')
      
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

  const handleDelete = async (id: string, filePath: string) => {
    if (!confirm('Tem certeza que deseja excluir este documento?')) return

    try {
      const res = await deleteEmployeeDocument(id, filePath, employeeId)
      if (res.success) {
        toast.success('Documento excluído')
        router.refresh()
      } else {
        toast.error('Erro ao excluir', { description: res.error })
      }
    } catch (err) {
      toast.error('Erro ao processar exclusão')
    }
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <FileCheck2 className="w-5 h-5 text-violet-500" />
          Documentação Digital
        </h3>
        <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2 bg-violet-600 hover:bg-violet-700">
              <Plus className="w-4 h-4" />
              Novo Documento
            </Button>
          </DialogTrigger>
          <UploadDocumentModal 
            employeeId={employeeId} 
            onClose={() => {
              setIsUploadModalOpen(false)
              router.refresh()
            }} 
          />
        </Dialog>
      </div>

      {documents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-border rounded-xl bg-muted/10">
          <div className="w-16 h-16 rounded-full bg-violet-500/10 flex items-center justify-center mb-4">
            <Upload className="w-8 h-8 text-violet-500" />
          </div>
          <h4 className="text-base font-semibold text-foreground">Nenhum documento anexado</h4>
          <p className="text-sm text-muted-foreground text-center mt-2 max-w-[280px]">
            O prontuário digital deste funcionário ainda está vazio.
          </p>
          <Button 
            variant="outline" 
            className="mt-6 border-violet-200 text-violet-700 hover:bg-violet-50 gap-2"
            onClick={() => setIsUploadModalOpen(true)}
          >
            <Plus className="w-4 h-4" />
            Anexar Primeiro Documento
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documents.map((doc) => (
            <Card key={doc.id} className="p-4 flex flex-col group transition-all hover:shadow-md border-border/60 hover:border-violet-300/50 bg-white relative">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-violet-600" />
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
                
                <div className="flex items-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
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

