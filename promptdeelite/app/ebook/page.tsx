// app/ebook/page.tsx
import { redirect } from 'next/navigation';

export default function EbookRedirect() {
  redirect('/acesso');
  return null; // Só para não dar warning, nunca será renderizado
}
