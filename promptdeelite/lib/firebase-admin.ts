// Ficheiro: lib/firebase-admin.ts

import admin from 'firebase-admin';

// Verifica se já existe uma instância para não inicializar várias vezes
if (!admin.apps.length) {
  try {
    // Inicializa o app usando as variáveis de ambiente
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // O .replace() é essencial para formatar a chave privada corretamente
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
    console.log("✅ Conexão de Administrador com Firebase inicializada.");
  } catch (error) {
    console.error("❌ Falha na inicialização do Firebase Admin:", error);
  }
}

// Exporta a instância do Firestore pronta para uso
export default admin.firestore();