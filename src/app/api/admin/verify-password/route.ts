import { NextResponse } from 'next/server';
import { createHash } from 'crypto';

// Constant-time string comparison to prevent timing attacks
function safeCompare(a: string, b: string) {
    if (!a || !b) return false;
    
    // Remove any trailing whitespace that might have been added
    a = a.trim();
    b = b.trim();
    
    const aHash = createHash('sha256').update(a).digest('hex');
    const bHash = createHash('sha256').update(b).digest('hex');
    
    // Debug logging
    console.log('Comparing values:', {
        input: a,
        env: b,
        inputLength: a.length,
        envLength: b.length
    });
    
    return aHash === bHash;
}

export async function POST(request: Request) {
    try {
        const { password } = await request.json();
        
        // Get password from environment variable
        const adminPassword = process.env.ADMIN_QUICK_ACCOUNT_PASSWORD;
        
        // Debug all environment variables
        console.log('All env variables:', {
            ADMIN_PWD_EXISTS: !!process.env.ADMIN_QUICK_ACCOUNT_PASSWORD,
            ADMIN_PWD_LENGTH: process.env.ADMIN_QUICK_ACCOUNT_PASSWORD?.length,
            ADMIN_PWD_VALUE: process.env.ADMIN_QUICK_ACCOUNT_PASSWORD,
        });

        if (!adminPassword) {
            console.error('Admin password not configured in environment variables');
            return new NextResponse(JSON.stringify({ error: 'Server configuration error' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Verify the password using constant-time comparison
        const isValid = safeCompare(password, adminPassword);

        if (isValid) {
            return new NextResponse(JSON.stringify({ success: true }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        } else {
            return new NextResponse(JSON.stringify({ 
                error: 'Invalid password',
                debug: {
                    receivedLength: password?.length,
                    envLength: adminPassword?.length,
                }
            }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }
    } catch (error) {
        console.error('Error in password verification:', error);
        return new NextResponse(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
} 