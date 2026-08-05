import { NextResponse } from 'next/server';
import { createClient } from '../../../lib/supabase/server';
import { prisma } from '../../../lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  // Extract true public origin behind Railway/proxy reverse proxies
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'spark-kids-learning-production.up.railway.app';
  const proto = request.headers.get('x-forwarded-proto') || 'https';
  const publicOrigin = host.includes('localhost:3000') ? `http://${host}` : `${proto}://${host}`;

  if (code) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error && data && data.user) {
        // Non-blocking profile upsert so DB latency never breaks authentication redirect
        try {
          const userEmail = data.user.email || '';
          const userFullName =
            data.user.user_metadata?.full_name ||
            data.user.user_metadata?.name ||
            userEmail ||
            'Parent';

          await prisma.profile.upsert({
            where: { id: data.user.id },
            update: {
              email: userEmail,
              fullName: userFullName,
              updatedAt: new Date(),
            },
            create: {
              id: data.user.id,
              email: userEmail,
              fullName: userFullName,
            },
          });
        } catch (profileError) {
          console.error('Non-blocking profile upsert note:', profileError);
        }

        return NextResponse.redirect(`${publicOrigin}${next}`);
      }
      console.error('OAuth code exchange error:', error);
    } catch (e) {
      console.error('OAuth callback exception:', e);
    }
  }

  return NextResponse.redirect(`${publicOrigin}/login?error=Could%20not%20authenticate%20user`);
}
