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
                Authorization: `Bearer sk_test_a7a626236f00ef0b342fc92e4c1079d5a3ad0ed5`, // Replace with your Paystack secret key
            },
        });

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
