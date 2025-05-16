'use client'
import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { SupabaseClient } from '@supabase/supabase-js';

// Admin credentials - moved to environment variables
const ALLOWED_EMAILS = ['mohammad.zaid@gmail.com', 'your.friend@email.com'];

interface TestAccount {
    id: string;
    email: string;
    password: string;
    type: 'seeker' | 'recruiter';
    created_at: string;
}

export default function QuickAccountPage() {
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [accountType, setAccountType] = useState<'seeker' | 'recruiter'>('seeker');
    const [customEmail, setCustomEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [createdAccount, setCreatedAccount] = useState<{ email: string; password: string; userId: string } | null>(null);
    const [testAccounts, setTestAccounts] = useState<TestAccount[]>([]);
    const [isLoadingAccounts, setIsLoadingAccounts] = useState(false);
    const router = useRouter();
    const supabase = createClientComponentClient();

    // Set up real-time subscription
    useEffect(() => {
        if (!isAuthenticated) return;

        // Initial fetch
        fetchTestAccounts();

        // Set up real-time subscription
        const channel = supabase
            .channel('test_accounts_changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'test_accounts'
                },
                () => {
                    console.log('Test accounts changed, refreshing...');
                    fetchTestAccounts();
                }
            )
            .subscribe();

        // Cleanup subscription
        return () => {
            channel.unsubscribe();
        };
    }, [isAuthenticated, supabase]);

    const fetchTestAccounts = async () => {
        setIsLoadingAccounts(true);
        try {
            // Use service role API to fetch test accounts
            const response = await fetch('/api/admin/get-test-accounts');
            if (!response.ok) {
                throw new Error('Failed to fetch test accounts');
            }
            const data = await response.json();
            setTestAccounts(data.accounts || []);
        } catch (error) {
            console.error('Error fetching test accounts:', error);
            toast.error('Failed to load test accounts');
        } finally {
            setIsLoadingAccounts(false);
        }
    };

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            const response = await fetch('/api/admin/verify-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password }),
            });

            if (response.ok) {
                setIsAuthenticated(true);
            } else {
                toast.error('Invalid password');
            }
        } catch (error) {
            console.error('Error verifying password:', error);
            toast.error('Authentication failed');
        }
    };

    const generateRandomEmail = () => {
        const random = Math.random().toString(36).substring(2, 10);
        // Using a domain that doesn't require email verification in Supabase
        return `test_${random}@test.com`;
    };

    const generateRandomPhoneNumber = () => {
        // Generate a random 10-digit number
        const random = Math.floor(Math.random() * 10000000000).toString().padStart(10, '0');
        return `+234${random}`;
    };

    const deleteTestAccount = async (accountId: string, email: string, type: 'seeker' | 'recruiter') => {
        try {
            const response = await fetch('/api/admin/delete-test-account', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: accountId,
                    email,
                    type
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to delete account');
            }

            // Remove the account from the local state
            setTestAccounts(prev => prev.filter(account => account.id !== accountId));
            toast.success('Account deleted successfully');
        } catch (error: any) {
            console.error('Error deleting account:', error);
            toast.error(error.message || 'Failed to delete account');
        }
    };

    const createQuickAccount = async () => {
        if (isLoading) return;
        setIsLoading(true);
        setCreatedAccount(null);

        try {
            const email = customEmail || generateRandomEmail();
            const defaultPassword = 'Test@123';
            const phoneNumber = generateRandomPhoneNumber();
            
            // Create account using API
            const response = await fetch('/api/create-test-account', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password: defaultPassword,
                    accountType
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create account');
            }

            const userId = data.user.id;

            // Create profile data based on type
            if (accountType === 'seeker') {
                const { error: seekerError } = await supabase
                    .from('Seekers')
                    .insert({
                        unique_id: userId,
                        name: 'Test User',
                        email: email,
                        number: phoneNumber,
                        dob: '2000-01-01',
                        gender: 'male',
                        country: 'Nigeria',
                        state: 'Lagos'
                    });

                if (seekerError) throw seekerError;

                // Add education
                await supabase
                    .from('Education')
                    .insert({
                        unique_id: userId,
                        level: 'Graduation',
                        school_name: 'Test University',
                        field: 'Computer Science',
                        year: '2024'
                    });

            } else {
                // Recruiter account
                const { error: recruiterError } = await supabase
                    .from('Recruiters')
                    .insert({
                        uniqueid: userId,
                        name: 'Test Recruiter',
                        email: email,
                        number: phoneNumber,
                        dob: '2000-01-01',
                        gender: 'male',
                        country: 'Nigeria',
                        state: 'Lagos'
                    });

                if (recruiterError) throw recruiterError;

                // Add company info
                await supabase
                    .from('CompanyInfo')
                    .insert({
                        unique_id: userId,
                        name: 'Test Company',
                        website: 'https://testcompany.com',
                        description: 'A test company',
                        position_in_company: 'Recruiter'
                    });
            }

            // Add user type
            await supabase
                .from('users')
                .insert({
                    name: accountType === 'seeker' ? 'Test User' : 'Test Recruiter',
                    email: email,
                    type: accountType
                });

            // Create test account record using service role API
            const testAccountResponse = await fetch('/api/admin/create-test-account-record', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: userId,
                    email,
                    password: defaultPassword,
                    type: accountType
                }),
            });

            if (!testAccountResponse.ok) {
                throw new Error('Failed to create test account record');
            }

            // Refresh the list
            await fetchTestAccounts();

            setCreatedAccount({ email, password: defaultPassword, userId });
            toast.success('Account created successfully!');

        } catch (error: any) {
            console.error('Error creating account:', error);
            toast.error(error?.message || 'Failed to create account');
            setCreatedAccount(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignIn = async () => {
        if (!createdAccount) return;
        
        try {
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: createdAccount.email,
                password: createdAccount.password
            });

            if (signInError) throw signInError;

            // Redirect based on account type
            router.push(accountType === 'recruiter' ? '/recruiter' : '/all-trainings');
        } catch (error: any) {
            console.error('Error signing in:', error);
            toast.error('Failed to sign in. Please try again.');
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
                    <div>
                        <h2 className="text-center text-3xl font-extrabold text-gray-900">
                            Admin Access
                        </h2>
                    </div>
                    <form className="mt-8 space-y-6" onSubmit={handleAuth}>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                                placeholder="Enter admin password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                            >
                                Access
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                    <h2 className="text-2xl font-bold text-center mb-8">Quick Account Creation</h2>
                    
                    {createdAccount ? (
                        <div className="space-y-6">
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <h3 className="text-lg font-medium text-green-800 mb-4">Account Created Successfully!</h3>
                                <div className="space-y-2">
                                    <div>
                                        <span className="font-medium text-gray-700">Email:</span>
                                        <span className="ml-2 text-gray-600">{createdAccount.email}</span>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-700">Password:</span>
                                        <span className="ml-2 text-gray-600">{createdAccount.password}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <button
                                    onClick={handleSignIn}
                                    className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                >
                                    Sign In Now
                                </button>
                                <button
                                    onClick={() => setCreatedAccount(null)}
                                    className="flex-1 flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                                >
                                    Create Another Account
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Account Type</label>
                                <select
                                    value={accountType}
                                    onChange={(e) => setAccountType(e.target.value as 'seeker' | 'recruiter')}
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                                >
                                    <option value="seeker">Seeker</option>
                                    <option value="recruiter">Recruiter</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Custom Email (Optional)
                                </label>
                                <input
                                    type="email"
                                    value={customEmail}
                                    onChange={(e) => setCustomEmail(e.target.value)}
                                    placeholder="Leave empty for random email"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                />
                            </div>

                            <button
                                onClick={createQuickAccount}
                                disabled={isLoading}
                                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${
                                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                {isLoading ? 'Creating...' : 'Create Account'}
                            </button>
                        </div>
                    )}
                </div>

                {/* Test Accounts List */}
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold mb-6">Test Accounts</h2>
                    {isLoadingAccounts ? (
                        <div className="text-center py-4">Loading accounts...</div>
                    ) : testAccounts.length === 0 ? (
                        <div className="text-center py-4 text-gray-500">No test accounts created yet</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Password</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {testAccounts.map((account) => (
                                        <tr key={account.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{account.email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{account.password}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">{account.type}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {new Date(account.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                <button
                                                    onClick={() => deleteTestAccount(account.id, account.email, account.type)}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 