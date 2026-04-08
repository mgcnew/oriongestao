import { fileTypeFromBuffer } from 'file-type'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

// Add more as needed
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
]

export async function validateFile(file: File) {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('Arquivo excede o tamanho máximo de 10MB.')
  }

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  
  const type = await fileTypeFromBuffer(buffer)

  if (!type || !ALLOWED_MIME_TYPES.includes(type.mime)) {
     // fallback if file-type cannot determine text/csv or docx accurately sometimes,
     // but for PDFs and images it is extremely accurate.
     if (!ALLOWED_MIME_TYPES.includes(file.type) && type === undefined) {
         throw new Error(`Tipo de arquivo não permitido ou corrompido. Tente novamente.`)
     } else if (type && !ALLOWED_MIME_TYPES.includes(type.mime)) {
         throw new Error(`Tipo de arquivo não permitido: ${type.mime}`)
     }
  }

  return { buffer, mime: type?.mime || file.type, ext: type?.ext }
}
