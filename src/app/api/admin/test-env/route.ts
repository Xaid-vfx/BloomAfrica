import { NextResponse } from 'next/server';

export async function GET() {
    const adminPassword = process.env.ADMIN_QUICK_ACCOUNT_PASSWORD;
    
    return new NextResponse(JSON.stringify({
        exists: !!adminPassword,
        length: adminPassword?.length || 0,
        // Show first and last character only for security
        firstChar: adminPassword?.[0] || '',
        lastChar: adminPassword?.[adminPassword.length - 1] || ''
    }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
} 