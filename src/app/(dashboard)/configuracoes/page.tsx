import { Header } from '@/components/layout/sidebar'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Settings, Users, Shield, Bell } from 'lucide-react'
import Link from 'next/link'

const sections = [
  {
    icon: Users,
    label: 'Usuários do Sistema',
    desc: 'Gerencie usuários, convites e acessos',
    href: '/configuracoes/usuarios',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    icon: Shield,
    label: 'Permissões',
    desc: 'Controle o que cada usuário pode ver e fazer',
    href: '/configuracoes/usuarios',
    color: 'text-violet-500',
    bg: 'bg-violet-500/10',
  },
  {
    icon: Bell,
    label: 'Notificações',
    desc: 'Configure alertas automáticos do sistema',
    href: '/configuracoes',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
  },
]

export default function ConfiguracoesPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header title="Configurações" subtitle="Gerencie usuários, permissões e preferências" />
      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {sections.map((s) => {
            const Icon = s.icon
            return (
              <Link key={s.label} href={s.href}>
                <Card className="p-5 hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer group">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${s.bg}`}>
                    <Icon className={`w-5 h-5 ${s.color}`} />
                  </div>
                  <h3 className="font-semibold text-foreground">{s.label}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{s.desc}</p>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
