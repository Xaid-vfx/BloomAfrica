import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
    try {
        const { recipient_code, amount } = await request.json();

        if (!recipient_code || !amount) {
            console.error('Missing required fields:', { recipient_code, amount });
            return NextResponse.json({ error: 'Recipient code and amount are required' }, { status: 400 });
        }

        console.log('Initiating transfer with details:', { recipient_code, amount });

        const response = await axios.post('https://api.paystack.co/transfer', {
            source: 'balance',
            amount,
            recipient: recipient_code,
        }, {
            headers: {
                Authorization: process.env.PAYSTACK_KEY, // Replace with your Paystack secret key
            },
        });

        console.log('Transfer response:', response.data);

        return NextResponse.json(response.data);
    } catch (error: any) {
        console.error('Error initiating transfer:', error);

        if (axios.isAxiosError(error)) {
            console.error('Axios error response:', error.response?.data);
            return NextResponse.json({ error: error.response?.data.message || 'An error occurred' }, { status: 500 });
        }

        return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
    }
}
