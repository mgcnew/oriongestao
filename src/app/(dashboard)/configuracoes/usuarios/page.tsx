import { Header } from '@/components/layout/sidebar'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { UserPlus, Mail, Shield, Crown, User } from 'lucide-react'

const roleConfig: Record<string, { label: string; icon: React.ElementType; class: string }> = {
  admin: { label: 'Administrador', icon: Crown, class: 'bg-amber-100 text-amber-700 border-amber-200' },
  administrative: { label: 'Administrativo', icon: Shield, class: 'bg-blue-100 text-blue-700 border-blue-200' },
  operational: { label: 'Operacional', icon: User, class: 'bg-gray-100 text-gray-600 border-gray-200' },
}

export default function UsuariosPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header title="Usuários do Sistema" subtitle="Gerencie quem tem acesso ao sistema" />
      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">
              Controle total de quem pode acessar e o que cada pessoa pode fazer.
            </p>
          </div>
          <Button className="gap-2">
            <Mail className="w-4 h-4" />
            Enviar Convite
          </Button>
        </div>

        {/* Legend */}
        <Card className="p-5 bg-muted/30">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            Níveis de Acesso
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {Object.entries(roleConfig).map(([key, value]) => {
              const Icon = value.icon
              return (
                <div key={key} className="flex items-start gap-3 p-3 rounded-lg bg-background border border-border">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{value.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {key === 'admin' && 'Acesso total ao sistema'}
                      {key === 'administrative' && 'Acesso a módulos autorizados'}
                      {key === 'operational' && 'Acesso granular configurável'}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        <Card className="flex flex-col items-center justify-center py-16 border-dashed">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <UserPlus className="w-7 h-7 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Nenhum usuário convidado ainda</h3>
          <p className="text-muted-foreground text-sm mt-2 text-center max-w-sm">
            Envie convites por e-mail para dar acesso ao sistema. Cada usuário receberá um link seguro.
          </p>
          <Button className="mt-6 gap-2">
            <Mail className="w-4 h-4" />
            Enviar primeiro convite
          </Button>
        </Card>
      </div>
    </div>
  )
}
