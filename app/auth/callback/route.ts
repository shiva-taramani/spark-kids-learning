import { NextResponse } from 'next/server';
import { createClient } from '../../../lib/supabase/server';

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
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        return NextResponse.redirect(`${publicOrigin}${next}`);
      }
      console.error('OAuth code exchange error:', error);
    } catch (e) {
      console.error('OAuth callback exception:', e);
    }
  }

  return NextResponse.redirect(`${publicOrigin}/login?error=Could%20not%20authenticate%20user`);
}
