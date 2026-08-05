import { NextResponse } from 'next/server';
import { createClient } from '../../../lib/supabase/server';
import { prisma } from '../../../lib/prisma';
import { logger } from '../../../lib/logger';

export async function GET() {
  try {
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();

    if (!userData || !userData.user) {
      logger.warn('API_CHILDREN', 'GET /api/children Unauthorized attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = userData.user.id;
    const userEmail = userData.user.email || '';
    const fullName = userData.user.user_metadata?.full_name || userData.user.user_metadata?.name || userEmail || 'Parent';

    logger.info('API_CHILDREN', 'GET /api/children for user', { userId, email: userEmail });

    // Ensure profile exists in DB
    const profile = await prisma.profile.upsert({
      where: { id: userId },
      update: { email: userEmail, fullName, updatedAt: new Date() },
      create: { id: userId, email: userEmail, fullName },
    });
    logger.success('API_CHILDREN', 'Profile upserted', profile);

    const children = await prisma.child.findMany({
      where: { parentId: userId },
      orderBy: { createdAt: 'asc' },
    });
    logger.success('API_CHILDREN', `Fetched ${children.length} children`, children);

    return NextResponse.json({ children });
  } catch (error: any) {
    logger.error('API_CHILDREN', 'GET /api/children error', { error: error.message || error });
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();

    if (!userData || !userData.user) {
      logger.warn('API_CHILDREN', 'POST /api/children Unauthorized attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { childName, targetAgeGroup, preferredTheme } = body;

    logger.info('API_CHILDREN', 'POST /api/children payload', { userId: userData.user.id, body });

    if (!childName) {
      return NextResponse.json({ error: 'childName is required' }, { status: 400 });
    }

    const userId = userData.user.id;
    const userEmail = userData.user.email || '';
    const fullName = userData.user.user_metadata?.full_name || userData.user.user_metadata?.name || userEmail || 'Parent';

    // Ensure parent profile exists
    const profile = await prisma.profile.upsert({
      where: { id: userId },
      update: { email: userEmail, fullName, updatedAt: new Date() },
      create: { id: userId, email: userEmail, fullName },
    });
    logger.success('API_CHILDREN', 'Parent profile verified/upserted before child creation', profile);

    const child = await prisma.child.create({
      data: {
        parentId: userId,
        childName,
        targetAgeGroup: targetAgeGroup || 'age6',
        preferredTheme: preferredTheme || 'dino',
        stars: 0,
        skillElo: 100,
      },
    });
    logger.success('API_CHILDREN', 'Child record created successfully in DB', child);

    return NextResponse.json({ child });
  } catch (error: any) {
    logger.error('API_CHILDREN', 'POST /api/children error', { error: error.message || error });
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();

    if (!userData || !userData.user) {
      logger.warn('API_CHILDREN', 'PUT /api/children Unauthorized attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, childName, targetAgeGroup, preferredTheme, stars, skillElo } = body;

    logger.info('API_CHILDREN', 'PUT /api/children payload', { userId: userData.user.id, body });

    if (!id) {
      return NextResponse.json({ error: 'Child ID is required' }, { status: 400 });
    }

    const child = await prisma.child.update({
      where: { id },
      data: {
        ...(childName && { childName }),
        ...(targetAgeGroup && { targetAgeGroup }),
        ...(preferredTheme && { preferredTheme }),
        ...(stars !== undefined && { stars }),
        ...(skillElo !== undefined && { skillElo }),
        updatedAt: new Date(),
      },
    });
    logger.success('API_CHILDREN', 'Child record updated successfully in DB', child);

    return NextResponse.json({ child });
  } catch (error: any) {
    logger.error('API_CHILDREN', 'PUT /api/children error', { error: error.message || error });
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
