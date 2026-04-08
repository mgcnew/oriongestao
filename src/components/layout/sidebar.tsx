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
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip'
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
        'relative flex flex-col h-[calc(100vh-2rem)] my-4 ml-4 mr-2 bg-sidebar border border-sidebar-border shadow-2xl transition-all duration-300 ease-in-out shrink-0 rounded-3xl',
        collapsed ? 'w-20' : 'w-72'
      )}
    >
      {/* Logo */}
      <div className={cn('flex items-center gap-3 px-4 py-5 border-b border-sidebar-border overflow-hidden', collapsed && 'justify-center px-0')}>
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
        className="absolute -right-3 top-10 w-6 h-6 rounded-full bg-sidebar border border-sidebar-border flex items-center justify-center text-sidebar-foreground/60 hover:text-primary hover:border-primary transition-all z-20 shadow-md"
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
        <Tooltip key={collapsed ? 'c' : 'e'}>
          <TooltipTrigger
            render={
              <button
                onClick={handleLogout}
                className={cn(
                  'flex items-center h-12 w-full px-3 rounded-2xl transition-all duration-200 group relative',
                  'text-sidebar-foreground/60 hover:text-red-400 hover:bg-red-500/10'
                )}
              >
                <div className={cn('flex items-center justify-center w-8 h-8 shrink-0', collapsed && 'w-full')}>
                  <LogOut className="w-[18px] h-[18px]" />
                </div>
                
                <div className={cn(
                  'flex items-center overflow-hidden transition-all duration-300 ease-in-out',
                  collapsed ? 'w-0 opacity-0' : 'w-full opacity-100 ml-3'
                )}>
                  <span className="text-sm font-medium whitespace-nowrap">Sair</span>
                </div>
              </button>
            }
          />
          {collapsed && <TooltipContent side="right">Sair</TooltipContent>}
        </Tooltip>
      </div>

      {/* User Card */}
      <div className={cn("px-3 py-4 border-t border-sidebar-border transition-all duration-300 overflow-hidden", collapsed ? "items-center" : "")}>
        <div className={cn("flex items-center gap-3 rounded-2xl px-2 py-2 bg-sidebar-accent/30", collapsed && "justify-center")}>
          <Avatar className="w-9 h-9 border-2 border-primary/20 shrink-0">
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">AD</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-sidebar-foreground text-[11px] font-bold truncate">Administrador</p>
              <p className="text-sidebar-foreground/40 text-[10px] truncate leading-none mt-1">admin@empresa.com</p>
            </div>
          )}
        </div>
      </div>
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
    <Tooltip key={collapsed ? 'c' : 'e'}>
      <TooltipTrigger
        render={
          <Link
            href={item.href}
            className={cn(
              'flex items-center h-12 px-3 rounded-2xl transition-all duration-200 group relative',
              isActive
                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                : 'text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent'
            )}
          >
            <div className={cn('flex items-center justify-center w-8 h-8 shrink-0', collapsed && 'w-full')}>
              <Icon className="w-[18px] h-[18px]" />
            </div>
            
            <div className={cn(
              'flex items-center overflow-hidden transition-all duration-300 ease-in-out',
              collapsed ? 'w-0 opacity-0' : 'w-full opacity-100 ml-3'
            )}>
              <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              )}
            </div>
          </Link>
        }
      />
      {collapsed && <TooltipContent side="right">{item.label}</TooltipContent>}
    </Tooltip>
  )
}

export function Header({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="h-20 bg-transparent px-8 flex items-center justify-between shrink-0">
      <div>
        <h1 className="text-xl font-bold text-foreground tracking-tight">{title}</h1>
        {subtitle && <p className="text-xs text-muted-foreground font-medium mt-1">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-4">
        <button className="relative w-10 h-10 rounded-xl border border-border bg-white/50 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all shadow-sm">
          <Bell className="w-[18px] h-[18px]" />
          <Badge className="absolute -top-1 -right-1 w-4 h-4 p-0 text-[10px] flex items-center justify-center bg-primary text-white border-2 border-white">
            3
          </Badge>
        </button>
        <div className="h-8 w-[1px] bg-border mx-1" />
        <Avatar className="w-10 h-10 cursor-pointer border-2 border-white shadow-sm hover:scale-105 transition-transform">
          <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">AD</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
