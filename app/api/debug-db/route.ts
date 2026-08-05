import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { createClient } from '../../../lib/supabase/server';
import { logger } from '../../../lib/logger';

export async function GET() {
  const dbUrl = process.env.DATABASE_URL || '';
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

  // Redact passwords from database URL for security
  const maskedDbUrl = dbUrl.replace(/\/\/[^:]+:[^@]+@/, '//***:***@');

  logger.info('DEBUG_DB', 'Inspecting database environment variables', {
    databaseUrlHost: maskedDbUrl,
    supabaseUrl,
    hasAnonKey: !!anonKey,
  });

  const report: any = {
    env: {
      databaseUrlHost: maskedDbUrl,
      supabaseUrl,
      hasAnonKey: !!anonKey,
    },
    prisma: {},
    supabase: {},
  };

  // 1. Check Prisma connection & tables
  try {
    const profileCount = await prisma.profile.count();
    const childCount = await prisma.child.count();
    const recentProfiles = await prisma.profile.findMany({ take: 5, orderBy: { createdAt: 'desc' } });
    const recentChildren = await prisma.child.findMany({ take: 5, orderBy: { createdAt: 'desc' } });

    report.prisma = {
      status: 'CONNECTED',
      profileCount,
      childCount,
      recentProfiles,
      recentChildren,
    };
    logger.success('DEBUG_DB', 'Prisma query succeeded', report.prisma);
  } catch (e: any) {
    report.prisma = { status: 'ERROR', error: e.message || String(e) };
    logger.error('DEBUG_DB', 'Prisma query failed', e);
  }

  // 2. Check Supabase Client connection & tables
  try {
    const supabase = createClient();
    const { data: userAuth } = await supabase.auth.getUser();
    const { data: sbProfiles, error: pErr } = await supabase.from('profiles').select('*').limit(5);
    const { data: sbChildren, error: cErr } = await supabase.from('children').select('*').limit(5);

    report.supabase = {
      currentUser: userAuth?.user?.email || null,
      profilesResult: sbProfiles,
      profilesError: pErr ? pErr.message : null,
      childrenResult: sbChildren,
      childrenError: cErr ? cErr.message : null,
    };
    logger.info('DEBUG_DB', 'Supabase client query result', report.supabase);
  } catch (e: any) {
    report.supabase = { status: 'ERROR', error: e.message || String(e) };
    logger.error('DEBUG_DB', 'Supabase client query failed', e);
  }

  return NextResponse.json(report);
}
