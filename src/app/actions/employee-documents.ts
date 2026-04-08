'use server'

import { createClient } from '@/lib/supabase/server'
import { validateFile } from '@/lib/file-validation'
import crypto from 'crypto'
import { revalidatePath } from 'next/cache'

export async function uploadEmployeeDocument(formData: FormData) {
  try {
    const supabase = await createClient()

    // 1. Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      throw new Error('Não autorizado')
    }

    const file = formData.get('file') as File
    const employeeId = formData.get('employeeId') as string
    const category = formData.get('category') as string
    const title = formData.get('title') as string
    const description = formData.get('description') as string

    if (!file || !employeeId || !category || !title) {
      throw new Error('Informações incompletas para upload')
    }

    // 2. Validate Magic Bytes & Size Limits
    const { buffer, mime, ext } = await validateFile(file)

    // 3. Prevent path traversal & secure filename
    const sanitizedTitle = title.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 50)
    const fileExtension = ext || file.name.split('.').pop() || 'tmp'
    const uniqueFileName = `${crypto.randomUUID()}-${sanitizedTitle}.${fileExtension}`
    const filePath = `${employeeId}/${category}/${uniqueFileName}`

    // 4. Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('employee-documents')
      .upload(filePath, buffer, {
        contentType: mime,
        upsert: false
      })

    if (uploadError) {
      console.error('Storage error:', uploadError)
      throw new Error('Falha ao enviar arquivo para o storage')
    }

    // 5. Insert relative metadata into 'employee_documents' table
    const { error: dbError } = await supabase
      .from('employee_documents')
      .insert({
        employee_id: employeeId,
        category,
        title,
        file_path: filePath,
        file_type: mime,
        file_size: file.size,
        file_name: file.name,
        description,
        uploaded_by: user.id
      })

    if (dbError) {
      console.error('DB error:', dbError)
      // Cleanup the file if DB insertion failed
      await supabase.storage.from('employee-documents').remove([filePath])
      throw new Error('Erro ao salvar os detalhes do documento no banco')
    }

    revalidatePath(`/funcionarios/${employeeId}`)
    return { success: true, message: 'Documento anexado com sucesso!' }

  } catch (error: any) {
    return { success: false, error: error.message || 'Erro inesperado no upload' }
  }
}

export async function deleteEmployeeDocument(documentId: string, filePath: string, employeeId: string) {
  try {
    const supabase = await createClient()

    // 1. Delete from storage first
    const { error: storageError } = await supabase.storage
      .from('employee-documents')
      .remove([filePath])

    if (storageError) {
      console.error('Storage deletion error:', storageError)
    }

    // 2. Delete from database
    const { error: dbError } = await supabase
      .from('employee_documents')
      .delete()
      .eq('id', documentId)

    if (dbError) {
      throw new Error('Erro ao excluir registro do banco de dados')
    }

    revalidatePath(`/funcionarios/${employeeId}`)
    return { success: true, message: 'Documento excluído com sucesso!' }
  } catch (error: any) {
    return { success: false, error: error.message || 'Erro inesperado na exclusão' }
  }
}

// Get presigned URL for secure download/viewing
export async function getDocumentUrl(filePath: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.storage
    .from('employee-documents')
    .createSignedUrl(filePath, 60) // valid for 60 seconds

  if (error || !data) {
    console.error('Signed URL Error:', error)
    return null
  }
  return data.signedUrl
}
