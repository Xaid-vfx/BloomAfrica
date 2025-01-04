import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log('Received request body:', body);

        // Validate required fields
        if (!body.account_number || !body.bank_code || !body.business_name || !body.user_id) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Check if user already has a subaccount
        const supabase = createRouteHandlerClient({ cookies });
        const { data: existingAccount, error: fetchError } = await supabase
            .from('RecruiterBankDetails')
            .select('*')
            .eq('recruiter_id', body.user_id)
            .single();

        if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is the "not found" error
            throw new Error(`Failed to check existing account: ${fetchError.message}`);
        }

        let paystackResponse;
        let paystackData;

        if (existingAccount) {
            // Update existing subaccount
            paystackResponse = await fetch(
                `https://api.paystack.co/subaccount/${existingAccount.subaccount_code}`,
                {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        business_name: body.business_name,
                        bank_code: body.bank_code,
                        account_number: body.account_number,
                        settlement_bank: body.bank_code
                    })
                }
            );
        } else {
            // Create new subaccount
            const businessEmail = `${body.business_name.toLowerCase().replace(/[^a-z0-9]/g, '')}@bloom.com`;

            paystackResponse = await fetch('https://api.paystack.co/subaccount', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    business_name: body.business_name,
                    bank_code: body.bank_code,
                    account_number: body.account_number,
                    percentage_charge: 80,
                    primary_contact_email: businessEmail,
                    settlement_bank: body.bank_code
                })
            });
        }

        paystackData = await paystackResponse.json();
        console.log('Paystack API Response:', paystackData);

        if (!paystackResponse.ok) {
            throw new Error(paystackData.message || 'Failed to process subaccount');
        }

        // Update or insert into Supabase
        const dbOperation = existingAccount ?
            supabase
                .from('RecruiterBankDetails')
                .update({
                    account_number: body.account_number,
                    account_name: body.business_name,
                    bank_name: body.bank_name,
                    bank_code: body.bank_code,
                    last_verified_at: new Date().toISOString()
                })
                .eq('recruiter_id', body.user_id) :
            supabase
                .from('RecruiterBankDetails')
                .insert({
                    recruiter_id: body.user_id,
                    account_number: body.account_number,
                    account_name: body.business_name,
                    bank_name: body.bank_name,
                    bank_code: body.bank_code,
                    subaccount_code: paystackData.data.subaccount_code,
                    is_primary: true,
                    is_verified: true,
                    last_verified_at: new Date().toISOString()
                });

        const { error: dbError } = await dbOperation;

        if (dbError) {
            throw new Error(`Database operation failed: ${dbError.message}`);
        }

        return NextResponse.json({
            status: true,
            data: paystackData.data,
            message: existingAccount ? 'Account Updated Successfully' : 'Account added successfully'
        });

    } catch (error) {
        console.error('Server Error:', error);
        return NextResponse.json(
            {
                status: false,
                error: error instanceof Error ? error.message : 'Internal server error',
                details: error
            },
            { status: 500 }
        );
    }
}