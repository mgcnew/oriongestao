'use client'

import { AlertTriangle, History, Settings } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { QuickActionModal } from './QuickActionModal'

interface EmployeeQuickActionsProps {
  employeeId: string
}

export function EmployeeQuickActions({ employeeId }: EmployeeQuickActionsProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState<'occurrence' | 'leave' | 'termination'>('occurrence')

  const openModal = (type: 'occurrence' | 'leave' | 'termination') => {
    setModalType(type)
    setModalOpen(true)
  }

  return (
    <>
      <Card className="p-6 border-border shadow-sm bg-primary/5 border-primary/20">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Settings className="w-4 h-4 text-primary" />
          Ações Rápidas
        </h3>
        <div className="space-y-2">
          <Button 
            variant="outline" 
            className="w-full justify-start gap-3 bg-background"
            onClick={() => openModal('occurrence')}
          >
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            Registrar Ocorrência
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start gap-3 bg-background"
            onClick={() => openModal('leave')}
          >
            <History className="w-4 h-4 text-blue-500" />
            Lançar Férias
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start gap-3 bg-background text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => openModal('termination')}
          >
            <Settings className="w-4 h-4" />
            Finalizar Contrato
          </Button>
        </div>
      </Card>

      <QuickActionModal 
        employeeId={employeeId}
        open={modalOpen}
        onOpenChange={setModalOpen}
        type={modalType}
      />
    </>
  )
}
