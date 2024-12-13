import { NextResponse } from 'next/server';
import axios from 'axios';

async function fetchBanks() {
    try {
        const response = await axios.get('https://api.paystack.co/bank', {
            headers: {
                Authorization: `Bearer sk_test_a7a626236f00ef0b342fc92e4c1079d5a3ad0ed5`, // Replace with your Paystack secret key
            },
        });

        console.log('Available banks:', response.data.data);
        return response.data.data;
    } catch (error: any) {
        console.error('Error fetching banks:', error);
        throw new Error('Unable to fetch banks');
    }
}

export async function POST(request: Request) {
    try {
        const { name, account_number, bank_code } = await request.json();

        if (!name || !account_number || !bank_code) {
            console.error('Missing required fields:', { name, account_number, bank_code });
            return NextResponse.json({ error: 'Name, account number, and bank code are required' }, { status: 400 });
        }

        console.log('Creating recipient with details:', { name, account_number, bank_code });

        const response = await axios.post('https://api.paystack.co/transferrecipient', {
            type: 'nuban',
            name,
            account_number,
            bank_code,
            currency: 'NGN',
        }, {
            headers: {
                Authorization: process.env.PAYSTACK_KEY, // Replace with your Paystack secret key
            },
        });

        console.log('Recipient creation response:', response.data);

        return NextResponse.json(response.data);
    } catch (error: any) {
        console.error('Error creating recipient:', error);

        if (axios.isAxiosError(error)) {
            console.error('Axios error response:', error.response?.data);
            return NextResponse.json({ error: error.response?.data.message || 'An error occurred' }, { status: 500 });
        }

        return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
    }
}
