// lib/firebase-admin.ts (VERSÃO BLINDADA CONTRA HMR)

import admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin/app';
import serviceAccount from '../serviceAccountKey.json';

// Verificamos se já existe uma instância em um "cache global" do Node.js
// Se não existir, criamos uma.
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as ServiceAccount)
    });
    console.log("✅ Conexão de Administrador com Firebase INICIALIZADA.");
  } catch (error) {
    console.error("❌ Falha na inicialização do Firebase Admin:", error);
  }
}

// Exportamos a conexão do Firestore para ser usada em outros lugares
// Esta linha será executada em cada "hot reload", mas a inicialização acima só ocorre uma vez.
export default admin.firestore();