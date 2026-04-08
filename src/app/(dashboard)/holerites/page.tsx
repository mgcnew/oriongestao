import { Header } from '@/components/layout/sidebar'
import { getEmployees } from '@/app/actions/employee-actions'
import { HoleritesClient } from './holerites-client'

export default async function HoleritesPage() {
  const employeesResult = await getEmployees()
  const employees = employeesResult.success ? employeesResult.data : []

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header title="Holerites" subtitle="Armazenamento e histórico de contracheques" />
      <div className="flex-1 overflow-y-auto p-6">
        <HoleritesClient employees={employees} />
      </div>
    </div>
  )
}
