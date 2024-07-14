'use client'
import { useState } from "react"
import { PaystackButton } from 'react-paystack';

export default function PaymentComponent() {
    const publicKey = "pk_test_3a02d400f8e79c7f90bb43dc9f496d547774d9f9"
    const amount = 200000
    const [email, setEmail] = useState("zaid@gmail.com")
    const [name, setName] = useState("Ernest")
    const [phone, setPhone] = useState("+2348149623803")
    const [paid, setpaid] = useState(false)
    const [paymentStatus, setPaymentStatus] = useState('');

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
                        name: 'John Doe',
                        account_number: '0000000000',
                        bank_code: '057',
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
        onSuccess: (reference) => {
            verifyTransaction(reference.reference);
            // if (reference.status === "success") {
            //     setpaid(true)
            //     alert("Payment successful")
            // }
        },
        onClose: () => alert("Wait! Don't leave :("),
    }

    return (
        <>
            <PaystackButton {...componentProps} />
            {paymentStatus && <p>Payment Status: {paymentStatus}</p>}
        </>

    )
}