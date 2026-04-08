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
import { createOccurrence, createLeave, terminateContract } from '@/app/actions/employee-actions'

interface QuickActionModalProps {
  employeeId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  type: 'occurrence' | 'leave' | 'termination'
}

export function QuickActionModal({ employeeId, open, onOpenChange, type }: QuickActionModalProps) {
  const [loading, setLoading] = useState(false)
  const [selectedType, setSelectedType] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    
    try {
      if (type === 'occurrence') {
        const result = await createOccurrence({
          employeeId,
          type: (formData.get('type') as string) || selectedType,
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
      } else if (type === 'leave') {
        const result = await createLeave({
          employeeId,
          type: (formData.get('type') as string) || selectedType,
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
      } else if (type === 'termination') {
        const result = await terminateContract({
          employeeId,
          terminationDate: formData.get('terminationDate') as string,
          reason: (formData.get('reason') as string) || selectedType,
          notes: formData.get('notes') as string,
        })
        if (result.success) {
          toast.success('Contrato finalizado com sucesso!')
          onOpenChange(false)
          window.location.reload() // Reload to show new status
        } else {
          toast.error(result.error || 'Erro ao finalizar contrato')
        }
      }
    } catch (error) {
      toast.error('Erro ao processar solicitação')
    } finally {
      setLoading(false)
    }
  }

  const getTitle = () => {
    switch(type) {
      case 'occurrence': return 'Registrar Ocorrência'
      case 'leave': return 'Lançar Férias'
      case 'termination': return 'Finalizar Contrato'
      default: return 'Ação'
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{getTitle()}</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {type === 'occurrence' && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="type">Tipo de Ocorrência</Label>
                  <Select name="type" required defaultValue="atraso" onValueChange={(val) => setSelectedType(val || '')}>
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
            )}

            {type === 'leave' && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="type">Tipo de Ausência</Label>
                  <Select name="type" defaultValue="ferias" onValueChange={(val) => setSelectedType(val || '')}>
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

            {type === 'termination' && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="terminationDate">Data de Desligamento</Label>
                  <Input id="terminationDate" name="terminationDate" type="date" required defaultValue={new Date().toISOString().split('T')[0]} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="reason">Motivo da Saída</Label>
                  <Select name="reason" required defaultValue="resignation" onValueChange={(val) => setSelectedType(val || '')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="resignation">Pedido de Demissão</SelectItem>
                      <SelectItem value="termination_with_cause">Demissão por Justa Causa</SelectItem>
                      <SelectItem value="termination_without_cause">Demissão sem Justa Causa</SelectItem>
                      <SelectItem value="end_of_contract">Término de Contrato</SelectItem>
                      <SelectItem value="mutual_agreement">Acordo Mútuo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="notes">Observações</Label>
                  <Textarea id="notes" name="notes" placeholder="Detalhes sobre o desligamento..." />
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className={type === 'termination' ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground' : ''}>
              {loading ? 'Salvando...' : 'Confirmar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

