import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

let app: any

try {
  if (getApps().length === 0) {
    let serviceAccount: any

    // ESTRATÉGIA DUAL: Produção vs Desenvolvimento
    if (process.env.NODE_ENV === 'production') {
      // PRODUÇÃO: Usa variáveis de ambiente (Vercel)
      console.log('🚀 Modo PRODUÇÃO: Usando variáveis de ambiente')
      
      const projectId = process.env.FIREBASE_PROJECT_ID
      const privateKey = process.env.FIREBASE_PRIVATE_KEY
      const clientEmail = process.env.FIREBASE_CLIENT_EMAIL

      if (!projectId || !privateKey || !clientEmail) {
        const missing = []
        if (!projectId) missing.push('FIREBASE_PROJECT_ID')
        if (!privateKey) missing.push('FIREBASE_PRIVATE_KEY')
        if (!clientEmail) missing.push('FIREBASE_CLIENT_EMAIL')
        
        throw new Error(`❌ Variáveis de ambiente faltando: ${missing.join(', ')}`)
      }

      serviceAccount = {
        type: "service_account",
        project_id: projectId,
        private_key: privateKey.replace(/\\n/g, '\n'),
        client_email: clientEmail,
      }

      console.log('✅ Credenciais carregadas via ENV VARS')
      
    } else {
      // DESENVOLVIMENTO: Usa arquivo JSON local
      console.log('🔧 Modo DESENVOLVIMENTO: Usando serviceAccountKey.json')
      
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        serviceAccount = require('../serviceAccountKey.json')
        console.log('✅ serviceAccountKey.json carregado com sucesso')
      } catch (error) {
        console.error('❌ Erro ao carregar serviceAccountKey.json:', error)
        throw new Error('serviceAccountKey.json não encontrado na raiz do projeto!')
      }
    }

    // INICIALIZAR FIREBASE ADMIN
    app = initializeApp({
      credential: cert(serviceAccount),
      projectId: serviceAccount.project_id || serviceAccount.projectId,
    })

    const projectName = serviceAccount.project_id || serviceAccount.projectId
    const clientEmail = serviceAccount.client_email || serviceAccount.clientEmail
    
    console.log(`✅ Firebase Admin inicializado: ${projectName}`)
    console.log(`📧 Service Account: ${clientEmail}`)
    
  } else {
    app = getApps()[0]
    console.log('✅ Firebase Admin já inicializado')
  }

  // TESTE DE CONECTIVIDADE
  console.log('🔗 Firestore conectado com sucesso')

} catch (error) {
  console.error('❌ ERRO CRÍTICO Firebase Admin:', error)
  throw error
}

// EXPORTS PRINCIPAIS
export const adminApp = app
export const adminDb = getFirestore(app)

// DEFAULT EXPORT (compatibilidade com código existente)
export default getFirestore(app)

// HELPER FUNCTION
export const getFirebaseAdminInfo = () => {
  return {
    app: adminApp,
    db: adminDb,
    isProduction: process.env.NODE_ENV === 'production'
  }
}
