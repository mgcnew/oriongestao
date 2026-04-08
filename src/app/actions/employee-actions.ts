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

    const { error } = await (supabase as any)
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

export async function terminateContract(data: {
  employeeId: string
  terminationDate: string
  reason: string
  notes?: string
}) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Não autorizado')

    const { error } = await (supabase as any)
      .from('employees')
      .update({
        status: 'terminated',
        termination_date: data.terminationDate,
        notes: data.notes ? `DEMISSÃO: ${data.reason}\n\n${data.notes}` : `DEMISSÃO: ${data.reason}`
      })
      .eq('id', data.employeeId)

    if (error) throw error

    revalidatePath(`/funcionarios/${data.employeeId}`)
    return { success: true }
  } catch (error: any) {
    console.error('Error terminating contract:', error)
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

    const { error } = await (supabase as any)
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

export async function registerAttendance(data: {
  employeeId: string
  workDate: string
  status: string
  checkIn: string | null
  checkOut: string | null
  breakStart: string | null
  breakEnd: string | null
}) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Não autorizado')

    // Basic calculation for total hours if check_in and check_out are present
    let totalHours = null
    let overtimeHours = null

    if (data.checkIn && data.checkOut) {
      const start = new Date(data.checkIn)
      const end = new Date(data.checkOut)
      let diffMs = end.getTime() - start.getTime()
      
      // subtract break time if present
      if (data.breakStart && data.breakEnd) {
        const breakS = new Date(data.breakStart)
        const breakE = new Date(data.breakEnd)
        diffMs -= Math.max(0, breakE.getTime() - breakS.getTime())
      }
      
      totalHours = Math.max(0, diffMs / (1000 * 60 * 60))
      
      // Calculate basic overtime (e.g., above 8 hours)
      // This is a naive calculation, real businesses have complex OT rules
      if (totalHours > 8) {
        overtimeHours = totalHours - 8
      }
    }

    const { error } = await (supabase as any)
      .from('attendance')
      .upsert({
      employee_id: data.employeeId,
      work_date: data.workDate, 
      status: data.status,
      check_in: data.checkIn,
      check_out: data.checkOut,
      break_start: data.breakStart,
      break_end: data.breakEnd,
      total_hours: totalHours,
      overtime_hours: overtimeHours,
      created_by: user.id
    }, { onConflict: 'employee_id,work_date' })

    if (error) throw error

    revalidatePath(`/funcionarios/${data.employeeId}`)
    return { success: true }
  } catch (error: any) {
    console.error('Error registering attendance:', error)
    return { success: false, error: error.message }
  }
}

export async function getEmployees() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Não autorizado')

    const { data, error } = await (supabase as any)
      .from('employees')
      .select('id, full_name, role')
      .eq('status', 'active')
      .order('full_name')

    if (error) throw error

    return { success: true, data }
  } catch (error: any) {
    console.error('Error fetching employees:', error)
    return { success: false, error: error.message, data: [] }
  }
}
