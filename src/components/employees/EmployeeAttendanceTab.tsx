'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, CalendarX2, Briefcase, FileSpreadsheet, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useRouter } from 'next/navigation'
import { RegisterAttendanceModal } from './modals/RegisterAttendanceModal'

export interface AttendanceRecord {
  id: string
  employee_id: string
  work_date: string | null
  check_in: string | null
  check_out: string | null
  break_start: string | null
  break_end: string | null
  status: string | null
  total_hours: number | null
  overtime_hours: number | null
  notes: string | null
}

interface EmployeeAttendanceTabProps {
  employeeId: string
  attendanceRecords: AttendanceRecord[]
}

const statusConfig: Record<string, { label: string; bg: string; text: string; icon?: React.ReactNode }> = {
  regular: { label: 'Regular', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', text: 'text-emerald-600', icon: <Clock className="w-3 h-3" /> },
  late: { label: 'Atraso', bg: 'bg-amber-50 text-amber-700 border-amber-200', text: 'text-amber-600', icon: <Clock className="w-3 h-3" /> },
  absent: { label: 'Falta', bg: 'bg-red-50 text-red-700 border-red-200', text: 'text-red-600', icon: <CalendarX2 className="w-3 h-3" /> },
  justified_absence: { label: 'Falta Justificada', bg: 'bg-violet-50 text-violet-700 border-violet-200', text: 'text-violet-600', icon: <CalendarX2 className="w-3 h-3" /> },
  holiday: { label: 'Feriado', bg: 'bg-blue-50 text-blue-700 border-blue-200', text: 'text-blue-600', icon: <Briefcase className="w-3 h-3" /> },
  day_off: { label: 'Folga', bg: 'bg-gray-100 text-gray-700 border-gray-200', text: 'text-gray-600', icon: <Briefcase className="w-3 h-3" /> },
  half_day: { label: 'Meio Expediente', bg: 'bg-orange-50 text-orange-700 border-orange-200', text: 'text-orange-600', icon: <Clock className="w-3 h-3" /> },
}

export function EmployeeAttendanceTab({ employeeId, attendanceRecords }: EmployeeAttendanceTabProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()

  const formatTime = (isoString: string | null) => {
    if (!isoString) return '--:--'
    return new Date(isoString).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '--/--/----'
    const [year, month, day] = dateString.split('-')
    return `${day}/${month}/${year}`
  }

  return (
    <Card className="p-6 shadow-sm min-h-[400px]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-500" />
          Controle de Ponto e Frequência
        </h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2 text-muted-foreground">
            <FileSpreadsheet className="w-4 h-4" />
            Exportar
          </Button>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger render={<Button size="sm" className="gap-2 bg-blue-600 hover:bg-blue-700" />}>
              <Plus className="w-4 h-4" />
              Registrar Ponto
            </DialogTrigger>
            <RegisterAttendanceModal 
              employeeId={employeeId} 
              onClose={() => {
                setIsModalOpen(false)
                router.refresh()
              }} 
            />
          </Dialog>
        </div>
      </div>

      {attendanceRecords.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-border rounded-xl bg-muted/10">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <CalendarX2 className="w-8 h-8 text-primary" />
          </div>
          <h4 className="text-base font-semibold text-foreground">Sem registros de ponto</h4>
          <p className="text-sm text-muted-foreground text-center mt-2 max-w-[280px]">
            Nenhum registro de entrada ou saída encontrado para este funcionário no período atual.
          </p>
          <Button 
            variant="outline" 
            className="mt-6 border-blue-200 text-blue-700 hover:bg-blue-50 gap-2"
            onClick={() => {
              setIsModalOpen(true)
            }}
          >
            <Plus className="w-4 h-4" />
            Registrar Primeiro Ponto
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border/50">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border/50">
              <tr>
                <th className="px-4 py-3 font-medium">Data</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Entrada</th>
                <th className="px-4 py-3 font-medium bg-muted/20 border-x border-border/10 text-center" colSpan={2}>Intervalo</th>
                <th className="px-4 py-3 font-medium">Saída</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">H. Extra</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {attendanceRecords.map((record) => {
                const config = record.status ? (statusConfig[record.status] || { label: record.status, bg: 'bg-muted text-muted-foreground', text: 'text-muted-foreground' }) : { label: 'Sem Status', bg: 'bg-muted text-muted-foreground', text: 'text-muted-foreground' }
                
                return (
                  <tr key={record.id} className="hover:bg-muted/10 transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">
                      {formatDate(record.work_date)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={`font-medium gap-1 flex w-fit items-center px-2 py-0.5 ${config.bg}`}>
                        {config.icon}
                        {config.label}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-foreground font-medium">
                      {formatTime(record.check_in)}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground border-l border-border/10 bg-muted/5 text-center">
                      {formatTime(record.break_start)}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground border-r border-border/10 bg-muted/5 text-center">
                      {formatTime(record.break_end)}
                    </td>
                    <td className="px-4 py-3 text-foreground font-medium">
                      {formatTime(record.check_out)}
                    </td>
                    <td className="px-4 py-3 text-foreground">
                      {record.total_hours ? `${Number(record.total_hours).toFixed(2)}h` : '--'}
                    </td>
                    <td className={`px-4 py-3 font-medium ${record.overtime_hours && record.overtime_hours > 0 ? 'text-amber-600' : 'text-muted-foreground'}`}>
                      {record.overtime_hours && record.overtime_hours > 0 ? `+${Number(record.overtime_hours).toFixed(2)}h` : '--'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  )
}
