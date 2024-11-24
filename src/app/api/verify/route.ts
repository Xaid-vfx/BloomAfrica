import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
    try {
        const { reference } = await request.json();

        if (!reference) {
            return NextResponse.json({ error: 'Reference is required' }, { status: 400 });
        }

        const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
            headers: {
                Authorization: process.env.PAYSTACK_KEY // Replace with your Paystack secret key
            },
        });

        if (response.data.status && response.data.data.split) {
            console.log('Split payment details:', response.data.data.split);
        }

        return NextResponse.json(response.data);
    } catch (error: any) {
        console.error('Error verifying transaction:', error);

        // Handle axios errors differently
        if (axios.isAxiosError(error)) {
            return NextResponse.json({ error: error.response?.data.message || 'An error occurred' }, { status: 500 });
        }

        // Handle unexpected errors
        return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
    }
}
