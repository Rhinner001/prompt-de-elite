// lib/firebase-admin.ts (VERSÃO BLINDADA CONTRA HMR E PRODUÇÃO)

import admin from 'firebase-admin';

// Blindagem para evitar multiplas inits (HMR/SSR)
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'), // O replace é FUNDAMENTAL!
      }),
    });
    console.log("✅ Conexão de Administrador com Firebase INICIALIZADA.");
  } catch (error) {
    console.error("❌ Falha na inicialização do Firebase Admin:", error);
  }
}

export default admin.firestore();
