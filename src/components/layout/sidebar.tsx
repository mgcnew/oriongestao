'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  Building2,
  LayoutDashboard,
  Users,
  FileText,
  Clock,
  AlertTriangle,
  Receipt,
  Umbrella,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Bell,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/badge'

const navItems = [
  { href: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/funcionarios', icon: Users, label: 'Funcionários' },
  { href: '/documentos', icon: FileText, label: 'Documentos' },
  { href: '/ponto', icon: Clock, label: 'Controle de Ponto' },
  { href: '/ocorrencias', icon: AlertTriangle, label: 'Ocorrências' },
  { href: '/holerites', icon: Receipt, label: 'Holerites' },
  { href: '/ferias', icon: Umbrella, label: 'Férias e Licenças' },
  { href: '/relatorios', icon: BarChart3, label: 'Relatórios' },
]

const bottomItems = [
  { href: '/configuracoes', icon: Settings, label: 'Configurações' },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <aside
      className={cn(
        'relative flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out shrink-0',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className={cn('flex items-center gap-3 px-4 py-5 border-b border-sidebar-border', collapsed && 'justify-center px-0')}>
        <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shrink-0">
          <Building2 className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-white font-bold text-sm leading-none">Orion</p>
            <p className="text-sidebar-foreground/50 text-xs mt-0.5">Gestão</p>
          </div>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 w-6 h-6 rounded-full bg-sidebar-border border border-sidebar-border flex items-center justify-center text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors z-10"
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1 scrollbar-hidden">
        {navItems.map((item) => (
          <NavItem
            key={item.href}
            item={item}
            isActive={isActive(item.href)}
            collapsed={collapsed}
          />
        ))}
      </nav>

      {/* Bottom items */}
      <div className="px-2 py-2 border-t border-sidebar-border space-y-1">
        {bottomItems.map((item) => (
          <NavItem
            key={item.href}
            item={item}
            isActive={isActive(item.href)}
            collapsed={collapsed}
          />
        ))}

        {/* Logout */}
        <Tooltip>
          <TooltipTrigger
            render={
              <button
                onClick={handleLogout}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground/60 hover:text-red-400 hover:bg-red-500/10 transition-all duration-150 group',
                  collapsed && 'justify-center'
                )}
              >
                <LogOut className="w-4 h-4 shrink-0" />
                {!collapsed && <span className="text-sm font-medium truncate">Sair</span>}
              </button>
            }
          />
          {collapsed && <TooltipContent side="right">Sair</TooltipContent>}
        </Tooltip>
      </div>

      {/* User Card */}
      {!collapsed && (
        <div className="px-3 py-3 border-t border-sidebar-border">
          <div className="flex items-center gap-3 rounded-lg px-2 py-2">
            <Avatar className="w-8 h-8 shrink-0">
              <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">AD</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-sidebar-foreground text-xs font-semibold truncate">Administrador</p>
              <p className="text-sidebar-foreground/40 text-xs truncate">admin@empresa.com</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}

function NavItem({
  item,
  isActive,
  collapsed,
}: {
  item: { href: string; icon: React.ElementType; label: string }
  isActive: boolean
  collapsed: boolean
}) {
  const Icon = item.icon

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Link
            href={item.href}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group',
              collapsed && 'justify-center',
              isActive
                ? 'bg-sidebar-primary/20 text-sidebar-primary'
                : 'text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent'
            )}
          >
            <Icon className={cn('w-4 h-4 shrink-0', isActive && 'text-sidebar-primary')} />
            {!collapsed && (
              <span className="text-sm font-medium truncate">{item.label}</span>
            )}
            {isActive && !collapsed && (
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-sidebar-primary" />
            )}
          </Link>
        }
      />
      {collapsed && <TooltipContent side="right">{item.label}</TooltipContent>}
    </Tooltip>
  )
}

export function Header({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between shrink-0">
      <div>
        <h1 className="text-lg font-semibold text-foreground leading-none">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <button className="relative w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
          <Bell className="w-4 h-4" />
          <Badge className="absolute -top-1 -right-1 w-4 h-4 p-0 text-[10px] flex items-center justify-center bg-primary text-white border-0">
            3
          </Badge>
        </button>
        <Avatar className="w-9 h-9 cursor-pointer">
          <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">AD</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
