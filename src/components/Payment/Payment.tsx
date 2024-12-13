'use client'
import { useState, useEffect } from "react"
import { PaystackButton } from 'react-paystack';

interface PaymentProps {
    jobId: string;
    seekerId: string;
    amount: number;
    onPaymentSuccess?: () => void;
}

export default function PaymentComponent({ jobId, seekerId, amount, onPaymentSuccess }: PaymentProps) {
    console.log(seekerId);

    const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY
    const [email, setEmail] = useState("zaid@gmail.com")
    const [name, setName] = useState("David Onadipe")
    const [phone, setPhone] = useState("+2348149623803")
    const [paid, setpaid] = useState(false)
    const [paymentStatus, setPaymentStatus] = useState('');
    const [splitConfig, setSplitConfig] = useState(null);
    const [initialPaymentStatus, setInitialPaymentStatus] = useState<string | null>(null);

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

    // Add function to check initial payment status
    const checkInitialPaymentStatus = async () => {
        try {
            const response = await fetch('/api/check-payment-status', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    jobId,
                    seekerId
                })
            });
            const data = await response.json();
            if (data.status === 'success') {
                setInitialPaymentStatus('success');
            }
        } catch (error) {
            console.error('Error checking payment status:', error);
        }
    };

    // Modify useEffect to check initial payment status
    useEffect(() => {
        checkInitialPaymentStatus();
        fetchSplitConfig();
    }, []);

    const verifyTransaction = async (reference) => {
        try {
            const response = await fetch('/api/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    reference,
                    jobId,
                    seekerId,
                    amount
                }),
            });

            const data = await response.json();
            if (data.status === true) {
                setPaymentStatus('Payment Successful');
                setInitialPaymentStatus('success');
                onPaymentSuccess?.();
            } else {
                setPaymentStatus('Payment Failed');
            }
        } catch (error) {
            console.error('Error:', error);
            setPaymentStatus('Payment Failed');
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
            {initialPaymentStatus === 'success' ? (
                <div className="text-center bg-green-100 text-green-800 px-4 py-2 font-semibold rounded-3xl">
                    Paid ✓
                </div>
            ) : (
                <>
                    {splitConfig ? (
                        <PaystackButton {...componentProps} />
                    ) : (
                        <p>Loading...</p>
                    )}
                    {paymentStatus && <p>Payment Status: {paymentStatus}</p>}
                </>
            )}
        </>
    )
}