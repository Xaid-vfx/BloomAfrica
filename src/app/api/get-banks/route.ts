import { NextResponse } from 'next/server';

export async function GET() {
    try {
        if (!process.env.PAYSTACK_SECRET_KEY) {
            console.error('Paystack secret key is missing');
            throw new Error('Paystack secret key is not configured');
        }

        console.log('Fetching banks...');
        const response = await fetch('https://api.paystack.co/bank', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer sk_live_b272797ced3db495d0d259e5e5a86a6345049950`,
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            }
        });

        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Response data:', data);

        if (!response.ok) {
            console.error('Paystack API Error:', data);
            throw new Error(data.message || 'Failed to fetch banks from Paystack');
        }

        return NextResponse.json({
            status: true,
            data: data.data || []
        });
    } catch (error) {
        console.error('Error in get-banks:', error);
        return NextResponse.json(
            {
                status: false,
                error: error instanceof Error ? error.message : 'Failed to fetch banks'
            },
            { status: 500 }
        );
    }
} 