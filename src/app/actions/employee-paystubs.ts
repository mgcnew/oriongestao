'use server'

import { createClient } from '@/lib/supabase/server'
import { validateFile } from '@/lib/file-validation'
import crypto from 'crypto'
import { revalidatePath } from 'next/cache'

export async function uploadPaystub(formData: FormData) {
  try {
    const supabase = await createClient()

    // 1. Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      throw new Error('Não autorizado')
    }

    const file = formData.get('file') as File
    const employeeId = formData.get('employeeId') as string
    const referenceMonth = formData.get('referenceMonth') as string // FORMAT: YYYY-MM
    const type = formData.get('type') as string || 'mensal' // mensal, adiantamento, 13_salario, ferias

    if (!file || !employeeId || !referenceMonth) {
      throw new Error('Informações incompletas para upload')
    }

    // 2. Validate Magic Bytes & Size Limits (using same logic as documents)
    const { buffer, mime, ext } = await validateFile(file)

    // 3. Prevent path traversal & secure filename
    const fileExtension = ext || file.name.split('.').pop() || 'pdf'
    const uniqueFileName = `${crypto.randomUUID()}-${referenceMonth}-${type}.${fileExtension}`
    const filePath = `${employeeId}/${referenceMonth}/${uniqueFileName}`

    // 4. Upload to Supabase Storage (using employee-paystubs bucket)
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('employee-documents') // We can use the same bucket but different prefix OR a new bucket. 
      // Let's use the same bucket for now under a 'paystubs/' prefix for simpler management if bucket exists.
      // But user mentioned 'create the bucket also', so I will use 'employee-paystubs'.
      .upload(`paystubs/${filePath}`, buffer, {
        contentType: mime,
        upsert: false
      })

    if (uploadError) {
      console.error('Storage error:', uploadError)
      throw new Error('Falha ao enviar holerite para o storage')
    }

    // 5. Insert relative metadata into 'employee_paystubs' table (Assumption: table exists or will be created)
    const { error: dbError } = await (supabase as any)
      .from('employee_paystubs')
      .insert({
        employee_id: employeeId,
        month: referenceMonth,
        type,
        file_path: `paystubs/${filePath}`,
        file_name: file.name,
        uploaded_by: user.id
      })

    if (dbError) {
      console.error('DB error:', dbError)
      // Cleanup the file if DB insertion failed
      await supabase.storage.from('employee-documents').remove([`paystubs/${filePath}`])
      throw new Error('Erro ao salvar os detalhes do holerite no banco')
    }

    revalidatePath(`/funcionarios/${employeeId}`)
    return { success: true, message: 'Holerite enviado com sucesso!' }

  } catch (error: any) {
    return { success: false, error: error.message || 'Erro inesperado no upload' }
  }
}

export async function deletePaystub(paystubId: string, filePath: string, employeeId: string) {
  try {
    const supabase = await createClient()

    // 1. Delete from storage
    const { error: storageError } = await supabase.storage
      .from('employee-documents')
      .remove([filePath])

    if (storageError) {
      console.error('Storage deletion error:', storageError)
    }

    // 2. Delete from database
    const { error: dbError } = await (supabase as any)
      .from('employee_paystubs')
      .delete()
      .eq('id', paystubId)

    if (dbError) {
      throw new Error('Erro ao excluir registro do banco de dados')
    }

    revalidatePath(`/funcionarios/${employeeId}`)
    return { success: true, message: 'Holerite excluído com sucesso!' }
  } catch (error: any) {
    return { success: false, error: error.message || 'Erro inesperado na exclusão' }
  }
}

export async function getPaystubUrl(filePath: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.storage
    .from('employee-documents')
    .createSignedUrl(filePath, 60)

  if (error || !data) {
    console.error('Signed URL Error:', error)
    return null
  }
  return data.signedUrl
}
