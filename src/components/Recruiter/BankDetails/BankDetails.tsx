'use client'
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { IoMdArrowRoundBack } from "react-icons/io";

type Props = {
    user: any;
    recruiter: any;
    handleChangeTabIndex: (index: number) => void;
}

type Bank = {
    code: string;
    name: string;
}

export default function BankDetails({ user, recruiter, handleChangeTabIndex }: Props) {
    const [accountNumber, setAccountNumber] = useState('');
    const [accountName, setAccountName] = useState('');
    const [bankName, setBankName] = useState('');
    const [bankCode, setBankCode] = useState('');
    const [banks, setBanks] = useState<Bank[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetchingBanks, setFetchingBanks] = useState(true);
    const [existingDetails, setExistingDetails] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        fetchBanks();
        fetchExistingBankDetails();
    }, [user.id]);

    const fetchExistingBankDetails = async () => {
        const supabase = createClientComponentClient();
        const { data, error } = await supabase
            .from('RecruiterBankDetails')
            .select('*')
            .eq('recruiter_id', user.id)
            .single();

        if (data) {
            setExistingDetails(data);
            setAccountNumber(data.account_number);
            setAccountName(data.account_name);
            setBankName(data.bank_name);
            setBankCode(data.bank_code);
        }
    };

    const fetchBanks = async () => {
        try {
            setFetchingBanks(true);
            const response = await fetch('/api/get-banks');
            const data = await response.json();

            if (!response.ok || !data.status) {
                throw new Error(data.error || 'Failed to fetch banks');
            }

            if (!Array.isArray(data.data)) {
                throw new Error('Invalid bank data received');
            }

            setBanks(data.data);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to load banks');
        } finally {
            setFetchingBanks(false);
        }
    };

    const validateForm = () => {
        if (!bankCode) {
            toast.error('Please select a bank');
            return false;
        }
        if (!accountNumber || accountNumber.length !== 10) {
            toast.error('Please enter a valid 10-digit account number');
            return false;
        }
        if (!accountName) {
            toast.error('Please enter account name');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        setLoading(true);

        try {
            const response = await fetch('/api/create-subaccount', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    account_number: accountNumber,
                    bank_code: bankCode,
                    business_name: accountName,
                    bank_name: bankName,
                    user_id: user.id
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to process bank details');
            }

            toast.success(data.message);
            router.refresh();
            fetchExistingBankDetails();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to process bank details');
        } finally {
            setLoading(false);
        }
    };

    if (fetchingBanks) {
        return (
            <div className="lg:py-8 lg:px-8 lg:bg-[#F5F5F5] h-[95%] w-full">
                <div className="bg-white rounded-xl p-6 lg:mt-6">
                    <div className="flex flex-col items-center justify-center h-40">
                        <div className="animate-spin rounded-xl h-8 w-8 border-b-2 border-[#4A2C84] mb-4"></div>
                        <p className="text-sm text-gray-600">Loading bank list...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (banks.length === 0) {
        return (
            <div className="lg:py-8 lg:px-8  lg:bg-[#F5F5F5] h-[95%] w-full">
                <div className="bg-white rounded-xl border-gray-300 border-[1px] p-6 lg:mt-6">
                    <div className="flex flex-col  items-center justify-center h-40">
                        <p className="text-red-500 mb-4">Failed to load banks</p>
                        <button
                            onClick={() => fetchBanks()}
                            className="bg-[#4A2C84] text-white px-7 py-2 rounded-xl hover:bg-[#3a2266]"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="lg:py-8 lg:px-8 lg:bg-[#F5F5F5] h-[95%] w-full">
            <button
                onClick={() => handleChangeTabIndex(0)}
                className="lg:hidden flex items-center gap-2 text-[#4A2C84] hover:underline px-4 mb-6"
            >
                <IoMdArrowRoundBack className="text-xl" />
                <span>Back to Dashboard</span>
            </button>

            <div className='flex flex-col border-gray-300 border-[1px] h-full w-full rounded-xl bg-white p-5 lg:p-8 overflow-scroll'>
                <h1 className="text-2xl font-bold text-[#4A2C84] lg:px-0 mb-6">Bank Details</h1>
                <div className="bg-white rounded-xl  ">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Bank Name</label>
                            <select
                                className="w-full border rounded-lg px-4 py-2 text-sm"
                                value={bankCode}
                                onChange={(e) => {
                                    setBankCode(e.target.value);
                                    const selectedBank = banks.find(bank => bank.code === e.target.value);
                                    setBankName(selectedBank?.name || '');
                                }}
                                required
                                disabled={loading}
                            >
                                <option value="">Select Bank</option>
                                {banks.map((bank) => (
                                    <option key={bank.code} value={bank.code}>
                                        {bank.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Account Number</label>
                            <input
                                type="text"
                                className="w-full border rounded-lg px-4 py-2 text-sm"
                                value={accountNumber}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '');
                                    setAccountNumber(value);
                                }}
                                required
                                pattern="\d{10}"
                                maxLength={10}
                                disabled={loading}
                                placeholder="Enter 10-digit account number"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Account Name</label>
                            <input
                                type="text"
                                className="w-full border rounded-lg px-4 py-2 text-sm"
                                value={accountName}
                                onChange={(e) => setAccountName(e.target.value)}
                                required
                                disabled={loading}
                                placeholder="Enter account holder's name"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-[#4A2C84] text-white px-6 py-2 rounded-xl disabled:opacity-50 hover:bg-[#3a2266] transition-colors duration-200"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="animate-spin rounded-xl h-4 w-4 border-b-2 border-white"></div>
                                    <span>Saving...</span>
                                </div>
                            ) : (
                                existingDetails ? 'Update Details' : 'Save Bank Details'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
} 