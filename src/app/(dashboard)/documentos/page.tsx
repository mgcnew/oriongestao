import { Header } from '@/components/layout/sidebar'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FileText, Upload, Search, Filter, FolderOpen, Plus } from 'lucide-react'
import { getEmployees } from '@/app/actions/employee-actions'
import { DocumentosClient } from './documents-client'

export default async function DocumentosPage() {
  const employeesResult = await getEmployees()
  const employees = employeesResult.success ? employeesResult.data : []

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header title="Documentos" subtitle="Documentação digital centralizada e organizada" />
      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        <DocumentosClient employees={employees} />
      </div>
    </div>
  )
}
