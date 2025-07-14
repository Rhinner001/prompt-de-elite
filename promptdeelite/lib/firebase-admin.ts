import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

// Verificação das variáveis
const projectId = process.env.FIREBASE_PROJECT_ID
const privateKey = process.env.FIREBASE_PRIVATE_KEY
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL

console.log('🔍 Firebase Admin Config Check:')
console.log('PROJECT_ID:', projectId)
console.log('CLIENT_EMAIL:', clientEmail)
console.log('PRIVATE_KEY length:', privateKey?.length)

if (!projectId || !privateKey || !clientEmail) {
  const missing = []
  if (!projectId) missing.push('FIREBASE_PROJECT_ID')
  if (!privateKey) missing.push('FIREBASE_PRIVATE_KEY')
  if (!clientEmail) missing.push('FIREBASE_CLIENT_EMAIL')
  
  throw new Error(`Variáveis do Firebase faltando: ${missing.join(', ')}`)
}

let app: any

try {
  if (getApps().length === 0) {
    const serviceAccount = {
      projectId,
      privateKey: privateKey.replace(/\\n/g, '\n'),
      clientEmail,
    }

    app = initializeApp({
      credential: cert(serviceAccount),
      projectId,
    })

    console.log('✅ Firebase Admin inicializado:', projectId)
  } else {
    app = getApps()[0]
    console.log('✅ Firebase Admin já inicializado')
  }
} catch (error) {
  console.error('❌ Erro Firebase Admin:', error)
  throw error
}

// Exports nomeados
export const adminApp = app
export const adminDb = getFirestore(app)

// DEFAULT EXPORT (para manter compatibilidade com seu código atual)
const firestoreAdmin = getFirestore(app)
export default firestoreAdmin
