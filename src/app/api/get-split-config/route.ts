import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { subaccount, amount } = await request.json();

        // Get split configuration from your database or business logic
        const splitConfig = {
            type: "percentage",
            subaccounts: [
                {
                    subaccount: subaccount,
                    // Share percentage based on your business rules
                    share: determineSplitShare(amount)
                }
            ]
        };

        return NextResponse.json({
            status: true,
            splitConfig
        });
    } catch (error) {
        console.error('Error getting split config:', error);
        return NextResponse.json({
            status: false,
            error: 'Failed to get split configuration'
        }, { status: 500 });
    }
}

// Function to determine split share based on business rules
function determineSplitShare(amount: number): number {
    // Implement your business logic here
    // For example:
    // if (amount >= 100000) {
    //     return 70; // 70% for large amounts
    // } else if (amount >= 50000) {
    //     return 60; // 60% for medium amounts
    // }
    return 80; // 50% for small amounts
} 