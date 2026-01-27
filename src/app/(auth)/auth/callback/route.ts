import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { type CookieOptions, createServerClient } from '@supabase/ssr'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') || ''
  const route = searchParams.get('route')
  const type = searchParams.get('type') // 'seeker' or 'recruiter'

  if (code) {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.delete({ name, ...options })
          },
        },
      }
    )
    console.log('type = ', type);

    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      // Create Seeker or Recruiter record if it doesn't exist
      if (type === 'seeker') {
        await supabase.from('Seekers').upsert({
          unique_id: data.user.id,
          email: data.user.email
        }, { onConflict: 'unique_id', ignoreDuplicates: true })
      } else if (type === 'recruiter') {
        await supabase.from('Recruiters').upsert({
          uniqueid: data.user.id,
          email: data.user.email
        }, { onConflict: 'uniqueid', ignoreDuplicates: true })
      }

      const continueParam = next ? `?continue=${next}` : ''
      return NextResponse.redirect(`${origin}${route}${continueParam}`)
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}