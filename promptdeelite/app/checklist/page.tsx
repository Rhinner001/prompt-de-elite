// app/checklist/page.tsx
import { redirect } from 'next/navigation';

export default function ChecklistRedirect() {
  redirect('/acesso');
  return null;
}
