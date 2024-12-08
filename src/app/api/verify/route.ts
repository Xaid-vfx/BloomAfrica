import { NextResponse } from 'next/server';
import axios from 'axios';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const { reference, jobId, seekerId, amount } = await request.json();
        console.log('Received payment data:', { reference, jobId, seekerId, amount });

        const supabase = createRouteHandlerClient({ cookies });

        // Check if payment already exists
        const { data: existingPayment, error: checkError } = await supabase
            .from('jobpayments')
            .select()
            .eq('job_id', jobId)
            .eq('seeker_id', seekerId)
            .eq('status', 'success')
            .single();

        if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "not found" error
            console.error('Error checking existing payment:', checkError);
            throw new Error('Failed to check existing payment');
        }

        if (existingPayment) {
            return NextResponse.json({
                status: false,
                message: 'Payment already exists for this job'
            });
        }

        // Verify with Paystack
        console.log('Verifying payment with Paystack...');
        const response = await axios.get(
            `https://api.paystack.co/transaction/verify/${reference}`,
            {
                headers: {
                    'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
                },
            }
        );

        console.log('Paystack verification response:', response.data);

        // Store payment information
        const { error: insertError } = await supabase
            .from('jobpayments')
            .insert({
                job_id: jobId,
                seeker_id: seekerId,
                amount: amount,
                reference: reference,
                status: response.data.data.status === 'success' ? 'success' : 'failed'
            });

        if (insertError) {
            console.error('Database insertion error:', insertError);
            throw new Error(`Failed to store payment information: ${insertError.message}`);
        }

        return NextResponse.json({
            status: true,
            data: response.data
        });
    } catch (error) {
        console.error('Payment verification error:', error);
        return NextResponse.json({
            status: false,
            error: error instanceof Error ? error.message : 'An error occurred',
            details: error
        }, { status: 500 });
    }
}
