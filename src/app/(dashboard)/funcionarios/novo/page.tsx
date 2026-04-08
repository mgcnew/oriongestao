'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Header } from '@/components/layout/sidebar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft, Save, Loader2, User, Briefcase, MapPin, Building, CreditCard } from 'lucide-react'
import { toast } from 'sonner'

export default function NovoFuncionarioPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    full_name: '',
    cpf: '',
    rg: '',
    birth_date: '',
    email: '',
    phone: '',
    registration_number: '',
    position: '',
    department: '',
    hire_date: '',
    salary: '',
    contract_type: 'clt',
    work_schedule: '',
    status: 'active',
  })

  // Basic numeric formatting for display purposes (real app should use input masks)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Generate a default registration number if empty
    let registration = formData.registration_number
    if (!registration) {
      registration = Math.floor(Math.random() * 1000000).toString().padStart(6, '0')
    }

    const { error } = await supabase.from('employees').insert({
      full_name: formData.full_name,
      cpf: formData.cpf,
      rg: formData.rg || null,
      birth_date: formData.birth_date || null,
      email: formData.email || null,
      phone: formData.phone || null,
      registration_number: registration,
      position: formData.position || null,
      department: formData.department || null,
      hire_date: formData.hire_date || new Date().toISOString().split('T')[0],
      salary: formData.salary ? parseFloat(formData.salary) : null,
      contract_type: formData.contract_type,
      work_schedule: formData.work_schedule || null,
      status: formData.status,
    })

    setLoading(false)

    if (error) {
      toast.error('Erro ao cadastrar funcionário', {
        description: error.message
      })
      console.error(error)
    } else {
      toast.success('Funcionário cadastrado com sucesso!')
      router.push('/funcionarios')
      router.refresh()
    }
  }

  return (
    <div className="flex flex-col h-full overflow-hidden bg-muted/20">
      <Header title="Novo Funcionário" subtitle="Cadastro completo de colaborador" />

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <Link href="/funcionarios">
              <Button variant="ghost" className="gap-2 -ml-3 text-muted-foreground">
                <ArrowLeft className="w-4 h-4" />
                Voltar para lista
              </Button>
            </Link>
            <Button onClick={handleSubmit} disabled={loading} className="gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {loading ? 'Salvando...' : 'Salvar Cadastro'}
            </Button>
          </div>

          <form id="new-employee-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Informações Pessoais */}
            <Card className="p-6 border-border shadow-sm">
              <div className="flex items-center gap-2 mb-5 pb-4 border-b border-border">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-500" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">Dados Pessoais</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="full_name">Nome Completo <span className="text-destructive">*</span></Label>
                  <Input id="full_name" name="full_name" value={formData.full_name} onChange={handleChange} required placeholder="Ex: João da Silva" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF <span className="text-destructive">*</span></Label>
                  <Input id="cpf" name="cpf" value={formData.cpf} onChange={handleChange} required placeholder="000.000.000-00" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="rg">RG</Label>
                  <Input id="rg" name="rg" value={formData.rg} onChange={handleChange} placeholder="00.000.000-0" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="birth_date">Data de Nascimento</Label>
                  <Input id="birth_date" name="birth_date" type="date" value={formData.birth_date} onChange={handleChange} />
                </div>
              </div>
            </Card>

            {/* Contato */}
            <Card className="p-6 border-border shadow-sm">
              <div className="flex items-center gap-2 mb-5 pb-4 border-b border-border">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-emerald-500" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">Contato</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail Profissional</Label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="joao@empresa.com" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone / WhatsApp</Label>
                  <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="(00) 00000-0000" />
                </div>
              </div>
            </Card>

            {/* Profissional */}
            <Card className="p-6 border-border shadow-sm">
              <div className="flex items-center gap-2 mb-5 pb-4 border-b border-border">
                <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-violet-500" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">Vínculo Empregatício</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="registration_number">Matrícula (opcional)</Label>
                  <Input id="registration_number" name="registration_number" value={formData.registration_number} onChange={handleChange} placeholder="Deixe em branco para auto-gerar" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(val) => handleSelectChange('status', val || '')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Ativo</SelectItem>
                      <SelectItem value="inactive">Inativo</SelectItem>
                      <SelectItem value="on_leave">Afastado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="position">Cargo</Label>
                  <Input id="position" name="position" value={formData.position} onChange={handleChange} placeholder="Ex: Analista Financeiro" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="department">Setor/Departamento</Label>
                  <Input id="department" name="department" value={formData.department} onChange={handleChange} placeholder="Ex: Financeiro" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="hire_date">Data de Admissão <span className="text-destructive">*</span></Label>
                  <Input id="hire_date" name="hire_date" type="date" value={formData.hire_date} onChange={handleChange} required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contract_type">Tipo de Contrato</Label>
                  <Select value={formData.contract_type} onValueChange={(val) => handleSelectChange('contract_type', val || '')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="clt">CLT</SelectItem>
                      <SelectItem value="pj">PJ</SelectItem>
                      <SelectItem value="intern">Estagiário</SelectItem>
                      <SelectItem value="temporary">Temporário</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="salary">Salário Base (R$)</Label>
                  <Input id="salary" name="salary" type="number" step="0.01" value={formData.salary} onChange={handleChange} placeholder="0.00" />
                </div>

                 <div className="space-y-2">
                  <Label htmlFor="work_schedule">Jornada de Trabalho</Label>
                  <Input id="work_schedule" name="work_schedule" value={formData.work_schedule} onChange={handleChange} placeholder="Ex: Segunda à Sexta, 08:00 as 18:00" />
                </div>
              </div>
            </Card>

          </form>
        </div>
      </div>
    </div>
  )
}
