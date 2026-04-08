import { Header } from '@/components/layout/sidebar'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Download,
  MoreHorizontal,
  Building2,
  Phone,
  Mail
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const statusConfig: Record<string, { label: string; class: string }> = {
  active: { label: 'Ativo', class: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  inactive: { label: 'Inativo', class: 'bg-gray-100 text-gray-600 border-gray-200' },
  on_leave: { label: 'Afastado', class: 'bg-amber-100 text-amber-700 border-amber-200' },
  terminated: { label: 'Desligado', class: 'bg-red-100 text-red-700 border-red-200' },
}

export const revalidate = 0 // Opt out of static caching for this page

export default async function FuncionariosPage() {
  const supabase = await createClient()
  
  const { data: employees, error } = await supabase
    .from('employees')
    .select('*')
    .order('full_name', { ascending: true })

  const total = employees?.length || 0
  const active = employees?.filter(e => e.status === 'active').length || 0
  const onLeave = employees?.filter(e => e.status === 'on_leave').length || 0
  const terminated = employees?.filter(e => e.status === 'terminated').length || 0

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header title="Funcionários" subtitle="Gerencie todos os colaboradores da empresa" />

      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total', value: total, color: 'text-foreground' },
            { label: 'Ativos', value: active, color: 'text-emerald-600' },
            { label: 'Afastados', value: onLeave, color: 'text-amber-600' },
            { label: 'Desligados', value: terminated, color: 'text-red-600' },
          ].map((s) => (
            <Card key={s.label} className="p-4 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </Card>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Buscar por nome, CPF, matrícula..." className="pl-10" />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Download className="w-4 h-4" />
            </Button>
          </div>
          <Link href="/funcionarios/novo" className="w-full sm:w-auto">
            <Button className="w-full gap-2 border border-transparent shadow-sm hover:shadow">
              <UserPlus className="w-4 h-4" />
              Novo Funcionário
            </Button>
          </Link>
        </div>

        {employees && employees.length > 0 ? (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
                  <tr>
                    <th className="px-5 py-3 font-medium">Funcionário</th>
                    <th className="px-5 py-3 font-medium">Cargo/Setor</th>
                    <th className="px-5 py-3 font-medium">Contato</th>
                    <th className="px-5 py-3 font-medium">Admissão</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {employees.map((employee) => (
                    <tr key={employee.id} className="hover:bg-muted/30 transition-colors group">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <Link href={`/funcionarios/${employee.id}`} className="shrink-0">
                            <Avatar className="h-9 w-9 hover:opacity-80 transition-opacity">
                              <AvatarImage src={employee.avatar_url || ''} />
                              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                                {employee.full_name.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          </Link>
                          <div>
                            <Link href={`/funcionarios/${employee.id}`} className="font-semibold text-foreground hover:text-primary transition-colors hover:underline">
                              {employee.full_name}
                            </Link>
                            <p className="text-[11px] text-muted-foreground mt-0.5">Matrícula: {employee.registration_number}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <p className="font-medium text-foreground">{employee.position || '—'}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Building2 className="w-3 h-3" />
                          {employee.department || '—'}
                        </p>
                      </td>
                      <td className="px-5 py-3">
                        <p className="text-xs text-foreground flex items-center gap-1.5">
                          <Mail className="w-3 h-3 text-muted-foreground" />
                          {employee.email || '—'}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                          <Phone className="w-3 h-3" />
                          {employee.phone || '—'}
                        </p>
                      </td>
                      <td className="px-5 py-3 text-foreground">
                        {new Date(employee.hire_date).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-5 py-3">
                        <Badge 
                          variant="outline" 
                          className={statusConfig[employee.status || '']?.class || ''}
                        >
                          {statusConfig[employee.status || '']?.label || employee.status || 'Desconhecido'}
                        </Badge>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <Link href={`/funcionarios/${employee.id}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        ) : (
          <Card className="flex flex-col items-center justify-center py-20 border-dashed">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Nenhum funcionário cadastrado</h3>
            <p className="text-muted-foreground text-sm mt-2 text-center max-w-sm">
              Comece cadastrando os colaboradores da empresa para ter acesso a todas as funcionalidades do sistema.
            </p>
            <Link href="/funcionarios/novo" className="mt-6">
              <Button className="gap-2">
                <UserPlus className="w-4 h-4" />
                Cadastrar primeiro funcionário
              </Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  )
}
