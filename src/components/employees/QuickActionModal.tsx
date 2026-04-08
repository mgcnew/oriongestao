'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { createOccurrence, createLeave } from '@/app/actions/employee-actions'

interface QuickActionModalProps {
  employeeId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  type: 'occurrence' | 'leave'
}

export function QuickActionModal({ employeeId, open, onOpenChange, type }: QuickActionModalProps) {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    
    try {
      if (type === 'occurrence') {
        const result = await createOccurrence({
          employeeId,
          type: formData.get('type') as string,
          date: formData.get('date') as string,
          description: formData.get('description') as string,
          severity: formData.get('severity') as any,
        })
        if (result.success) {
          toast.success('Ocorrência registrada com sucesso!')
          onOpenChange(false)
        } else {
          toast.error(result.error || 'Erro ao registrar ocorrência')
        }
      } else {
        const result = await createLeave({
          employeeId,
          type: formData.get('type') as string,
          startDate: formData.get('startDate') as string,
          endDate: formData.get('endDate') as string,
          reason: formData.get('reason') as string,
        })
        if (result.success) {
          toast.success('Licença/Férias lançada com sucesso!')
          onOpenChange(false)
        } else {
          toast.error(result.error || 'Erro ao lançar licença')
        }
      }
    } catch (error) {
      toast.error('Erro ao processar solicitação')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {type === 'occurrence' ? 'Registrar Ocorrência' : 'Lançar Férias'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {type === 'occurrence' ? (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="type">Tipo de Ocorrência</Label>
                  <Select name="type" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="atraso">Atraso</SelectItem>
                      <SelectItem value="falta">Falta injustificada</SelectItem>
                      <SelectItem value="advertencia">Advertência</SelectItem>
                      <SelectItem value="suspensao">Suspensão</SelectItem>
                      <SelectItem value="elogio">Elogio/Feedback Positivo</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="severity">Gravidade</Label>
                  <Select name="severity" defaultValue="low">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Baixa</SelectItem>
                      <SelectItem value="medium">Média</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="date">Data</Label>
                  <Input id="date" name="date" type="date" required defaultValue={new Date().toISOString().split('T')[0]} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea id="description" name="description" placeholder="Detalhes da ocorrência..." required />
                </div>
              </>
            ) : (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="type">Tipo de Ausência</Label>
                  <Select name="type" defaultValue="ferias">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ferias">Férias</SelectItem>
                      <SelectItem value="licenca_medica">Licença Médica</SelectItem>
                      <SelectItem value="folga">Folga Compensatória</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="startDate">Início</Label>
                    <Input id="startDate" name="startDate" type="date" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="endDate">Término</Label>
                    <Input id="endDate" name="endDate" type="date" required />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="reason">Motivo/Observações</Label>
                  <Textarea id="reason" name="reason" placeholder="Observações adicionais..." />
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Confirmar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
