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
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error && data && data.user) {
        // Upsert parent profile record into profiles table
        await supabase.from('profiles').upsert({
          id: data.user.id,
          email: data.user.email || '',
          parent_name: data.user.user_metadata?.full_name || data.user.user_metadata?.name || data.user.email || 'Parent',
          full_name: data.user.user_metadata?.full_name || data.user.user_metadata?.name || data.user.email || 'Parent',
          updated_at: new Date().toISOString(),
        });
        return NextResponse.redirect(`${publicOrigin}${next}`);
      }
      console.error('OAuth code exchange error:', error);
    } catch (e) {
      console.error('OAuth callback exception:', e);
    }
  }

  return NextResponse.redirect(`${publicOrigin}/login?error=Could%20not%20authenticate%20user`);
}
