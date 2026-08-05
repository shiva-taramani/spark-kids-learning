import { NextResponse } from 'next/server';
import { autoSeedDatabase } from '../../../lib/seedDatabase';

export async function GET() {
  await autoSeedDatabase();
  return NextResponse.json({ success: true, message: 'Database auto-seeded successfully! 🚀' });
}
