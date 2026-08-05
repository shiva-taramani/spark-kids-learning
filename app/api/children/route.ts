import { NextResponse } from 'next/server';
import { createClient } from '../../../lib/supabase/server';
import { prisma } from '../../../lib/prisma';

export async function GET() {
  try {
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();

    if (!userData || !userData.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = userData.user.id;
    const userEmail = userData.user.email || '';
    const fullName = userData.user.user_metadata?.full_name || userData.user.user_metadata?.name || userEmail || 'Parent';

    // Ensure profile exists in DB
    await prisma.profile.upsert({
      where: { id: userId },
      update: { email: userEmail, fullName, updatedAt: new Date() },
      create: { id: userId, email: userEmail, fullName },
    });

    const children = await prisma.child.findMany({
      where: { parentId: userId },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({ children });
  } catch (error: any) {
    console.error('API GET /api/children error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();

    if (!userData || !userData.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { childName, targetAgeGroup, preferredTheme } = body;

    if (!childName) {
      return NextResponse.json({ error: 'childName is required' }, { status: 400 });
    }

    const userId = userData.user.id;
    const userEmail = userData.user.email || '';
    const fullName = userData.user.user_metadata?.full_name || userData.user.user_metadata?.name || userEmail || 'Parent';

    // Ensure parent profile exists
    await prisma.profile.upsert({
      where: { id: userId },
      update: { email: userEmail, fullName, updatedAt: new Date() },
      create: { id: userId, email: userEmail, fullName },
    });

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

    return NextResponse.json({ child });
  } catch (error: any) {
    console.error('API POST /api/children error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();

    if (!userData || !userData.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, childName, targetAgeGroup, preferredTheme, stars, skillElo } = body;

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

    return NextResponse.json({ child });
  } catch (error: any) {
    console.error('API PUT /api/children error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
