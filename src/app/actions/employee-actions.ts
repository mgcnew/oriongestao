'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createOccurrence(data: {
  employeeId: string
  type: string
  date: string
  description: string
  severity: 'low' | 'medium' | 'high'
}) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Não autorizado')

    const { error } = await supabase
      .from('occurrences')
      .insert({
        employee_id: data.employeeId,
        type: data.type,
        occurrence_date: data.date,
        description: data.description,
        severity: data.severity,
        created_by: user.id
      })

    if (error) throw error

    revalidatePath(`/funcionarios/${data.employeeId}`)
    return { success: true }
  } catch (error: any) {
    console.error('Error creating occurrence:', error)
    return { success: false, error: error.message }
  }
}

export async function createLeave(data: {
  employeeId: string
  type: string
  startDate: string
  endDate: string
  reason: string
}) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Não autorizado')

    const { error } = await supabase
      .from('leaves')
      .insert({
        employee_id: data.employeeId,
        leave_type: data.type,
        start_date: data.startDate,
        end_date: data.endDate,
        reason: data.reason,
        status: 'pending',
        created_by: user.id
      })

    if (error) throw error

    revalidatePath(`/funcionarios/${data.employeeId}`)
    return { success: true }
  } catch (error: any) {
    console.error('Error creating leave:', error)
    return { success: false, error: error.message }
  }
}
