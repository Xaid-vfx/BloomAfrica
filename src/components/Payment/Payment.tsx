'use client'
import { useState, useEffect } from "react"
import { PaystackButton } from 'react-paystack';

interface PaymentProps {
    jobId: string;
    seekerId: string;
    amount: number;
    onPaymentSuccess?: () => void;
    initialPaymentStatus?: string;
}

export default function PaymentComponent({ jobId, seekerId, amount, onPaymentSuccess, initialPaymentStatus }: PaymentProps) {
    const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY
    const [email, setEmail] = useState("zaid@gmail.com")
    const [name, setName] = useState("David Onadipe")
    const [phone, setPhone] = useState("+2348149623803")
    const [paymentStatus, setPaymentStatus] = useState('');
    const [splitConfig, setSplitConfig] = useState(null);
    const [paymentAmount, setPaymentAmount] = useState(0);

    useEffect(() => {
        setPaymentAmount(amount * 100)
    }, [amount])


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
                    amount: paymentAmount
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

    useEffect(() => {
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
        amount: paymentAmount,
        metadata: {
            name,
            phone,
        },
        publicKey,
        text: "Pay Now",
        className: "text-center bg-[#E9EBFD] text-[#4A2C84] px-4 py-2 font-semibold rounded-xl my-3",
        split: splitConfig,
        onSuccess: (reference) => {
            verifyTransaction(reference.reference);
        },
        onClose: () => alert("Wait! Don't leave :("),
    }

    return (
        <>
            {initialPaymentStatus === 'success' ? (
                <div className="text-center bg-green-100 text-green-800 px-4 py-2 font-semibold rounded-xl">
                    Paid ✓
                </div>
            ) : (
                <>
                    {splitConfig ? (
                        <PaystackButton {...componentProps} />
                    ) : (
                        <div className="text-center bg-[#E9EBFD] text-[#4A2C84] px-4 py-2 font-semibold rounded-xl">
                            Fetching...
                        </div>
                    )}
                    {paymentStatus && <p>Payment Status: {paymentStatus}</p>}
                </>
            )}
        </>
    )
}