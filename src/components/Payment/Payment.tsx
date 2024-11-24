'use client'
import { useState, useEffect } from "react"
import { PaystackButton } from 'react-paystack';

export default function PaymentComponent() {
    console.log(process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY);

    const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY
    const amount = 20000
    const [email, setEmail] = useState("zaid@gmail.com")
    const [name, setName] = useState("David Onadipe")
    const [phone, setPhone] = useState("+2348149623803")
    const [paid, setpaid] = useState(false)
    const [paymentStatus, setPaymentStatus] = useState('');
    const [splitConfig, setSplitConfig] = useState(null);

    // Fetch split configuration from backend
    const fetchSplitConfig = async () => {
        try {
            const response = await fetch('/api/get-split-config', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    subaccount: "ACCT_qn0go52fe3gaddr",
                    amount: amount
                })
            });
            const data = await response.json();
            if (data.status) {
                setSplitConfig(data.splitConfig);
            }
        } catch (error) {
            console.error('Error fetching split config:', error);
        }
    };

    // Fetch split config when component mounts
    useEffect(() => {
        fetchSplitConfig();
    }, []);

    const verifyTransaction = async (reference) => {
        console.log(reference);

        try {
            const response = await fetch('/api/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ "reference": reference }),
            });

            const data = await response.json();
            console.log(data);

            if (data.status === true) {
                // Create transfer recipient
                const recipientResponse = await fetch('/api/create-recipient', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: 'ABAYOMI MOSES ONADIPE',
                        account_number: '9031735674',
                        bank_code: '50515',
                    }),
                });
                const recipientData = await recipientResponse.json();

                if (recipientData.status === true) {
                    // Make the transfer
                    const transferResponse = await fetch('/api/transfer', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            recipient_code: recipientData.data.recipient_code,
                            amount: data.data.amount,
                        }),
                    });
                    const transferData = await transferResponse.json();

                    if (transferData.status === 'success') {
                        setPaymentStatus('Paid');
                    } else {
                        setPaymentStatus('Failed to Transfer');
                    }
                } else {
                    setPaymentStatus('Failed to Create Recipient');
                }
            } else {
                setPaymentStatus('Failed to Verify');
            }
        } catch (error) {
            console.error('Error verifying transaction:', error);
            setPaymentStatus('Failed to Verify');
        }
    };

    const componentProps = {
        email,
        amount,
        metadata: {
            name,
            phone,
        },
        publicKey,
        text: "Pay Now",
        className: "text-center bg-[#E9EBFD] text-[#4A2C84] px-4 py-2 font-semibold rounded-3xl",
        split: splitConfig, // Use the server-provided split configuration
        onSuccess: (reference) => {
            verifyTransaction(reference.reference);
        },
        onClose: () => alert("Wait! Don't leave :("),
    }

    return (
        <>
            {splitConfig ? (
                <PaystackButton {...componentProps} />
            ) : (
                <p>Loading...</p>
            )}
            {paymentStatus && <p>Payment Status: {paymentStatus}</p>}
        </>
    )
}