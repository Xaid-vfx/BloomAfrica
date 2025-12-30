'use client'
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useRecruiter } from "@/context/RecruiterContext";
import { Wallet, Building2, CreditCard, Save, X } from "lucide-react";

type Bank = {
    code: string;
    name: string;
}

export default function BankDetails() {
    const { user, recruiter, company } = useRecruiter();
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
            <div className='relative flex flex-col h-full w-full bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden'>
                <div className="flex items-center justify-center h-full">
                    <div className="flex flex-col items-center gap-3">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#14B8A6]"></div>
                        <p className="text-[#14B8A6] font-medium">Loading banks...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (banks.length === 0) {
        return (
            <div className='relative flex flex-col h-full w-full bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden'>
                <div className="flex flex-col items-center justify-center h-full">
                    <div className="bg-red-50 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                        <X className="text-red-500" size={32} />
                    </div>
                    <p className="text-red-500 mb-4 font-medium">Failed to load banks</p>
                    <button
                        onClick={() => fetchBanks()}
                        className="bg-[#14B8A6] hover:bg-[#0D9488] text-white px-7 py-2.5 rounded-xl transition-colors shadow-lg shadow-[#14B8A6]/30"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className='relative flex flex-col h-full w-full bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden'>
            {/* Decorative Blobs */}
            <svg viewBox="0 0 500 500" className="absolute top-0 right-0 w-[300px] h-[300px] opacity-[0.03] pointer-events-none -z-10" style={{ transform: 'translate(20%, -10%)' }}>
                <path fill="#14B8A6" d="M432.7,219.4c-15.4,59.7-61.3,105.6-121,121c-59.7,15.4-121.9-5.6-164.1-55.3c-42.2-49.7-56.6-117.7-37.7-179.2C129,44.4,175,2.5,231.2,0.2c56.2-2.3,114.8,35.6,144.8,93.8C406,152.2,448.1,159.7,432.7,219.4z"/>
            </svg>

            {/* Fixed Header */}
            <div className="flex-shrink-0 p-6 lg:p-8 border-b border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                    <div className="bg-[#14B8A6]/10 rounded-full p-3">
                        <Wallet className="text-[#14B8A6]" size={28} />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-[#0A1F44]">Bank Details</h1>
                </div>
                <p className="text-gray-600">Manage your payment information for receiving apprenticeship funds</p>
            </div>

            {/* Scrollable Content */}
            <div className='flex-1 overflow-y-auto p-6 lg:p-8'>
                <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 lg:p-8 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-[#0A1F44]/10 rounded-full p-3">
                            <Building2 className="text-[#0A1F44]" size={24} />
                        </div>
                        <h2 className="text-xl font-semibold text-[#0A1F44]">Account Information</h2>
                    </div>
                    <div className="bg-white rounded-xl">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name</label>
                            <select
                                className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-[#14B8A6] focus:outline-none transition-colors bg-white"
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
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <CreditCard size={16} className="text-[#14B8A6]" />
                                Account Number
                            </label>
                            <input
                                type="text"
                                className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-[#14B8A6] focus:outline-none transition-colors"
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
                            <label className="block text-sm font-medium text-gray-700 mb-2">Account Name</label>
                            <input
                                type="text"
                                className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-[#14B8A6] focus:outline-none transition-colors"
                                value={accountName}
                                onChange={(e) => setAccountName(e.target.value)}
                                required
                                disabled={loading}
                                placeholder="Enter account holder's name"
                            />
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center justify-center gap-2 w-full bg-[#14B8A6] hover:bg-[#0D9488] text-white px-6 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-[#14B8A6]/30 font-medium"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save size={18} />
                                        {existingDetails ? 'Update Details' : 'Save Bank Details'}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                    </div>
                </div>
            </div>
        </div>
    );
} 