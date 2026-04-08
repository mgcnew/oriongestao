import { Header } from '@/components/layout/sidebar'
import { EmployeeDocumentsTab } from '@/components/employees/EmployeeDocumentsTab'
import { EmployeeAttendanceTab } from '@/components/employees/EmployeeAttendanceTab'
import { EmployeePaystubsTab } from '@/components/employees/EmployeePaystubsTab'
import { EmployeeQuickActions } from '@/components/employees/EmployeeQuickActions'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { 
  ArrowLeft, 
  Building2, 
  Mail, 
  Phone, 
  CalendarDays, 
  Clock, 
  Wallet,
  Settings,
  Edit2,
  FileText,
  AlertTriangle,
  History,
  DownloadCloud,
  FileCheck2,
  UploadCloud,
  Briefcase
} from 'lucide-react'

// Next.js 15 requires async params
interface PageProps {
  params: Promise<{ id: string }>
}

const statusConfig: Record<string, { label: string; class: string }> = {
  active: { label: 'Ativo', class: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  inactive: { label: 'Inativo', class: 'bg-gray-100 text-gray-600 border-gray-200' },
  on_leave: { label: 'Afastado', class: 'bg-amber-100 text-amber-700 border-amber-200' },
  terminated: { label: 'Desligado', class: 'bg-red-100 text-red-700 border-red-200' },
}

export default async function FuncionarioPerfilPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch the employee
  const { data: employee, error } = await supabase
    .from('employees')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !employee) {
    notFound()
  }

  // Fetch documents
  const { data: documentsData } = await (supabase as any)
    .from('employee_documents')
    .select('*')
    .eq('employee_id', id)
    .order('uploaded_at', { ascending: false })

  const documents = documentsData || []

  // Fetch attendance records
  const { data: attendanceData } = await (supabase as any)
    .from('attendance')
    .select('*')
    .eq('employee_id', id)
    .order('work_date', { ascending: false })
    .limit(30)

  const attendanceRecords = attendanceData || []

  // Fetch paystubs
  const { data: paystubsData } = await (supabase as any)
    .from('employee_paystubs')
    .select('*')
    .eq('employee_id', id)
    .order('month', { ascending: false })

  const paystubs = paystubsData || []
  const birthDateStr = employee.birth_date ? new Date(employee.birth_date).toLocaleDateString('pt-BR') : 'Não informado'
  const hireDateStr = employee.hire_date ? new Date(employee.hire_date).toLocaleDateString('pt-BR') : 'Não informado'

  return (
    <div className="flex flex-col h-full overflow-hidden bg-muted/10">
      <Header title="Perfil do Funcionário" subtitle="Informações e gestão completa do colaborador" />

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Topbar Actions */}
        <div className="flex items-center justify-between">
          <Link href="/funcionarios">
            <Button variant="ghost" className="gap-2 -ml-3 text-muted-foreground">
              <ArrowLeft className="w-4 h-4" />
              Voltar para lista
            </Button>
          </Link>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2 bg-background shadow-sm">
              <DownloadCloud className="w-4 h-4" />
              Exportar
            </Button>
            <Button className="gap-2 shadow-sm">
              <Edit2 className="w-4 h-4" />
              Editar Perfil
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="p-6 border-border shadow-sm overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-sidebar-primary/20 to-sidebar-primary/5 dark:from-sidebar-primary/10 dark:to-background border-b border-border/50" />
              
              <div className="relative pt-8 flex flex-col items-center">
                <Avatar className="h-24 w-24 border-4 border-background shadow-md">
                  <AvatarImage src={employee.avatar_url || ''} />
                  <AvatarFallback className="bg-primary/10 text-primary text-3xl font-medium">
                    {employee.full_name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="mt-4 text-center">
                  <h2 className="text-xl font-bold text-foreground">{employee.full_name}</h2>
                  <p className="text-sm font-medium text-muted-foreground mt-1 flex items-center justify-center gap-1.5">
                    <Briefcase className="w-4 h-4" />
                    {employee.position || 'Cargo não definido'}
                  </p>
                </div>

                <Badge 
                  variant="outline" 
                  className={`mt-4 px-3 py-1 text-xs font-semibold uppercase tracking-wider ${statusConfig[employee.status || '']?.class || ''}`}
                >
                  {statusConfig[employee.status || '']?.label || employee.status || 'Desconhecido'}
                </Badge>
              </div>

              <Separator className="my-6" />

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs text-muted-foreground font-medium mb-0.5">E-mail Profissional</p>
                    <p className="text-sm text-foreground truncate">{employee.email || '—'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium mb-0.5">Telefone</p>
                    <p className="text-sm text-foreground">{employee.phone || '—'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-violet-500/10 flex items-center justify-center shrink-0">
                    <Building2 className="w-4 h-4 text-violet-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium mb-0.5">Departamento</p>
                    <p className="text-sm text-foreground">{employee.department || '—'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                    <CalendarDays className="w-4 h-4 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium mb-0.5">Data de Admissão</p>
                    <p className="text-sm text-foreground">{hireDateStr}</p>
                  </div>
                </div>
              </div>
            </Card>

            <EmployeeQuickActions employeeId={id} />
          </div>

          {/* Right Column - Details and Tabs */}
          <div className="lg:col-span-8">
            <Tabs defaultValue="visao-geral" className="w-full">
              <TabsList className="grid grid-cols-4 sm:grid-cols-4 lg:inline-flex w-full sm:w-auto h-auto p-1 bg-muted/50 rounded-xl mb-6 shadow-sm border border-border/50">
                <TabsTrigger value="visao-geral" className="text-xs sm:text-sm py-2.5 rounded-lg data-[state=active]:shadow-sm">Visão Geral</TabsTrigger>
                <TabsTrigger value="documentos" className="text-xs sm:text-sm py-2.5 rounded-lg data-[state=active]:shadow-sm">Documentos</TabsTrigger>
                <TabsTrigger value="ponto" className="text-xs sm:text-sm py-2.5 rounded-lg data-[state=active]:shadow-sm">Ponto e Frequência</TabsTrigger>
                <TabsTrigger value="holerites" className="text-xs sm:text-sm py-2.5 rounded-lg data-[state=active]:shadow-sm">Holerites</TabsTrigger>
              </TabsList>

              <TabsContent value="visao-geral" className="space-y-6 mt-0">
                <Card className="p-6 shadow-sm">
                  <h3 className="text-lg font-semibold mb-5 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-500" />
                    Informações Pessoais
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-xs text-muted-foreground font-medium mb-1">Nome Completo</p>
                      <p className="text-sm font-medium text-foreground">{employee.full_name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium mb-1">CPF</p>
                      <p className="text-sm font-medium text-foreground">{employee.cpf}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium mb-1">RG</p>
                      <p className="text-sm font-medium text-foreground">{employee.rg || '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium mb-1">Data de Nascimento</p>
                      <p className="text-sm font-medium text-foreground">{birthDateStr}</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 shadow-sm">
                  <h3 className="text-lg font-semibold mb-5 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-violet-500" />
                    Dados Profissionais
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-xs text-muted-foreground font-medium mb-1">Matrícula</p>
                      <p className="text-sm font-medium text-foreground">{employee.registration_number}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium mb-1">Tipo de Contrato</p>
                      <p className="text-sm font-medium text-foreground uppercase">{employee.contract_type}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium mb-1">Salário Base</p>
                      <p className="text-sm font-medium text-foreground">
                        {employee.salary ? `R$ ${employee.salary.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '—'}
                      </p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-xs text-muted-foreground font-medium mb-1">Jornada de Trabalho</p>
                      <p className="text-sm font-medium text-foreground">{employee.work_schedule || '—'}</p>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="documentos" className="mt-0">
                <EmployeeDocumentsTab employeeId={id} documents={documents} />
              </TabsContent>

              <TabsContent value="ponto" className="mt-0">
                <EmployeeAttendanceTab employeeId={id} attendanceRecords={attendanceRecords} />
              </TabsContent>

              <TabsContent value="holerites" className="mt-0">
                <EmployeePaystubsTab employeeId={id} paystubs={paystubs as any} />
              </TabsContent>

            </Tabs>
          </div>

        </div>
      </div>
    </div>
  )
}

// Ensure icons like User don't break if not imported, let's make sure we imported User.
import { User } from 'lucide-react'
