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
import { registerAttendance } from '@/app/actions/employee-actions'

interface RegisterAttendanceModalProps {
  employeeId: string
  onClose: () => void
}

export function RegisterAttendanceModal({ employeeId, onClose }: RegisterAttendanceModalProps) {
  const [isPending, startTransition] = useTransition()
  const [selectedStatus, setSelectedStatus] = useState('regular')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    const formData = new FormData(e.currentTarget)
    
    startTransition(async () => {
      const workDate = formData.get('workDate') as string
      const timeToIso = (time: string) => {
        if (!time) return null
        return new Date(`${workDate}T${time}:00`).toISOString()
      }

      const status = formData.get('status') as string || selectedStatus

      const res = await registerAttendance({
        employeeId,
        workDate,
        status,
        checkIn: timeToIso(formData.get('checkIn') as string),
        checkOut: timeToIso(formData.get('checkOut') as string),
        breakStart: timeToIso(formData.get('breakStart') as string),
        breakEnd: timeToIso(formData.get('breakEnd') as string),
      })
      
      if (res.success) {
        toast.success('Ponto registrado', { description: 'Os horários foram salvos com sucesso.' })
        onClose()
      } else {
        toast.error('Erro ao registrar', { description: res.error })
      }
    })
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <DialogContent className="sm:max-w-[450px]">
      <DialogHeader>
        <DialogTitle>Registrar Ponto Manual</DialogTitle>
        <DialogDescription>
          Insira os horários e o status de frequência para a data específica.
        </DialogDescription>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-4 pt-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="workDate">Data</Label>
            <Input id="workDate" name="workDate" type="date" required defaultValue={today} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select 
              name="status" 
              required 
              defaultValue={selectedStatus}
              onValueChange={setSelectedStatus}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="regular">Regular</SelectItem>
                <SelectItem value="late">Atraso</SelectItem>
                <SelectItem value="absent">Falta</SelectItem>
                <SelectItem value="justified_absence">Falta Justificada</SelectItem>
                <SelectItem value="holiday">Feriado</SelectItem>
                <SelectItem value="day_off">Folga</SelectItem>
                <SelectItem value="half_day">Meio Expediente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="checkIn">Entrada</Label>
            <Input id="checkIn" name="checkIn" type="time" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="checkOut">Saída</Label>
            <Input id="checkOut" name="checkOut" type="time" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="breakStart">Início Intervalo</Label>
            <Input id="breakStart" name="breakStart" type="time" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="breakEnd">Fim Intervalo</Label>
            <Input id="breakEnd" name="breakEnd" type="time" />
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isPending}>
            {isPending ? 'Salvando...' : 'Registrar'}
          </Button>
        </div>
      </form>
    </DialogContent>
  )
}
