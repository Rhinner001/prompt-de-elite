import { NextResponse } from 'next/server';
import adminDb from '@/lib/firebase-admin';

export async function GET() {
  try {
    const snapshot = await adminDb.collection('prompts').limit(1).get();
    return NextResponse.json({ count: snapshot.size });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
