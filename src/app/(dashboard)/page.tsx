import Link from 'next/link'
import { Header } from '@/components/layout/sidebar'
import {
  Users,
  FileText,
  Clock,
  AlertTriangle,
  Receipt,
  Umbrella,
  TrendingUp,
  TrendingDown,
  Calendar,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const kpis = [
  {
    label: 'Funcionários Ativos',
    value: '0',
    change: '+0 este mês',
    trend: 'neutral',
    icon: Users,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    href: '/funcionarios',
  },
  {
    label: 'Documentos Digitais',
    value: '0',
    change: '0 enviados hoje',
    trend: 'neutral',
    icon: FileText,
    color: 'text-violet-500',
    bg: 'bg-violet-500/10',
    href: '/documentos',
  },
  {
    label: 'Ocorrências Abertas',
    value: '0',
    change: '0 este mês',
    trend: 'neutral',
    icon: AlertTriangle,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    href: '/ocorrencias',
  },
  {
    label: 'Férias Programadas',
    value: '0',
    change: 'Próximos 30 dias',
    trend: 'neutral',
    icon: Umbrella,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    href: '/ferias',
  },
]

const quickActions = [
  { label: 'Novo Funcionário', icon: Users, href: '/funcionarios', desc: 'Cadastrar colaborador', color: 'bg-blue-500' },
  { label: 'Upload Documento', icon: FileText, href: '/documentos', desc: 'Enviar arquivo', color: 'bg-violet-500' },
  { label: 'Registrar Ponto', icon: Clock, href: '/ponto', desc: 'Lançar jornada', color: 'bg-cyan-500' },
  { label: 'Nova Ocorrência', icon: AlertTriangle, href: '/ocorrencias', desc: 'Registrar evento', color: 'bg-amber-500' },
  { label: 'Enviar Holerite', icon: Receipt, href: '/holerites', desc: 'Upload de holerite', color: 'bg-rose-500' },
  { label: 'Solicitar Férias', icon: Umbrella, href: '/ferias', desc: 'Período de descanso', color: 'bg-emerald-500' },
]

const alerts = [
  { type: 'warning', message: 'Nenhum alerta no momento', desc: 'O sistema está funcionando normalmente.' },
]

export default function DashboardPage() {
  const now = new Date()
  const greeting = now.getHours() < 12 ? 'Bom dia' : now.getHours() < 18 ? 'Boa tarde' : 'Boa noite'
  const dateStr = now.toLocaleDateString('pt-BR', {
    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
  })

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header title="Dashboard" subtitle={dateStr} />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Greeting */}
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">{greeting}, Administrador 👋</h2>
            <p className="text-muted-foreground mt-1">Aqui está um resumo do seu sistema hoje.</p>
          </div>
          <Badge variant="outline" className="hidden sm:flex items-center gap-1.5 text-emerald-600 border-emerald-200 bg-emerald-50">
            <CheckCircle2 className="w-3 h-3" />
            Sistema operacional
          </Badge>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi) => {
            const Icon = kpi.icon
            return (
              <Link key={kpi.label} href={kpi.href}>
                <Card className="p-5 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer group border-border">
                  <div className="flex items-start justify-between">
                    <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', kpi.bg)}>
                      <Icon className={cn('w-5 h-5', kpi.color)} />
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground/0 group-hover:text-muted-foreground transition-all duration-200 group-hover:translate-x-0.5" />
                  </div>
                  <div className="mt-4">
                    <p className="text-3xl font-bold text-foreground">{kpi.value}</p>
                    <p className="text-sm font-medium text-foreground/80 mt-1">{kpi.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{kpi.change}</p>
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <Card className="p-5">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold text-foreground">Ações Rápidas</h3>
                <p className="text-xs text-muted-foreground">Acesso direto às funcionalidades</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {quickActions.map((action) => {
                  const Icon = action.icon
                  return (
                    <Link
                      key={action.label}
                      href={action.href}
                      className="group flex flex-col items-center gap-3 p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-accent transition-all duration-200"
                    >
                      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', action.color)}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-foreground leading-tight">{action.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{action.desc}</p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </Card>
          </div>

          {/* Alerts / Status */}
          <div className="space-y-4">
            <Card className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-4 h-4 text-muted-foreground" />
                <h3 className="font-semibold text-foreground">Alertas do Sistema</h3>
              </div>
              <div className="space-y-3">
                {alerts.map((alert, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{alert.message}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{alert.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <h3 className="font-semibold text-foreground">Próximos Eventos</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Nenhum evento programado. Cadastre funcionários para ver aniversários e vencimentos de férias.
              </p>
            </Card>

            <Card className="p-5 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <h3 className="font-semibold text-foreground mb-2">🚀 Sistema Iniciado</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Comece cadastrando os funcionários para aproveitar todas as funcionalidades.
              </p>
              <Link
                href="/funcionarios"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                Cadastrar primeiro funcionário
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
