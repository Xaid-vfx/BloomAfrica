'use client'
import TextInput from "@/components/Input/Text";
import { AgreementModal } from "@/components/Modal/AgreementModal";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { TagsInput } from "react-tag-input-component";
import { toast } from "sonner";
import UAParser from "ua-parser-js";
import { getStatesWithCache } from "@/lib/constants/states";
import { getCitiesWithCache } from "@/lib/constants/cities";
import getIP from "@/lib/api/getIP";
import { useRecruiter } from "@/context/RecruiterContext";
import { Briefcase, MapPin, DollarSign, FileText, GraduationCap, Clock, Lock, AlertTriangle, BookOpen, CheckCircle, Loader2, ExternalLink, CreditCard, Building2, Save } from "lucide-react";
import { useLocalStorageAutoSave } from "@/hooks/useAutoSave";
import AutoSaveIndicator from "@/components/trainer/AutoSaveIndicator/AutoSaveIndicator";
import SkillsInput from "@/components/trainer/SkillsInput/SkillsInput";
import TextAreaInput from "@/components/trainer/Forms/TextAreaInput";
import Link from "next/link";

type Bank = {
    code: string;
    name: string;
}

// Inline Bank Details Form Component
function InlineBankDetailsForm({
    userId,
    onSuccess,
    onCancel
}: {
    userId: string;
    onSuccess: (details: any) => void;
    onCancel: () => void;
}) {
    const [accountNumber, setAccountNumber] = useState('');
    const [accountName, setAccountName] = useState('');
    const [bankName, setBankName] = useState('');
    const [bankCode, setBankCode] = useState('');
    const [banks, setBanks] = useState<Bank[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetchingBanks, setFetchingBanks] = useState(true);

    useEffect(() => {
        fetchBanks();
    }, []);

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
                    user_id: userId
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to process bank details');
            }

            toast.success(data.message);
            onSuccess({
                account_number: accountNumber,
                account_name: accountName,
                bank_name: bankName,
                bank_code: bankCode
            });
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to process bank details');
        } finally {
            setLoading(false);
        }
    };

    if (fetchingBanks) {
        return (
            <div className="flex items-center gap-2 py-4">
                <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
                <span className="text-sm text-amber-700">Loading banks...</span>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-amber-800 mb-1">Bank Name</label>
                <select
                    className="w-full border-2 border-amber-200 rounded-lg px-3 py-2 text-sm focus:border-amber-400 focus:outline-none bg-white"
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
                <label className="block text-sm font-medium text-amber-800 mb-1 flex items-center gap-2">
                    <CreditCard size={14} />
                    Account Number
                </label>
                <input
                    type="text"
                    className="w-full border-2 border-amber-200 rounded-lg px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
                    value={accountNumber}
                    onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        setAccountNumber(value);
                    }}
                    required
                    maxLength={10}
                    disabled={loading}
                    placeholder="Enter 10-digit account number"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-amber-800 mb-1">Account Name</label>
                <input
                    type="text"
                    className="w-full border-2 border-amber-200 rounded-lg px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    required
                    disabled={loading}
                    placeholder="Enter account holder's name"
                />
            </div>

            <div className="flex gap-2 pt-2">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={loading}
                    className="flex-1 border-2 border-amber-300 text-amber-700 py-2 px-4 rounded-lg font-medium text-sm hover:bg-amber-100 transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-lg font-medium text-sm transition-colors disabled:opacity-50"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save size={16} />
                            Save Details
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}

interface ShortlistedCurriculum {
    id: string;
    shortlistId: string;
    name: string;
    slug: string;
    description?: string;
    short_description?: string;
    primary_industry: string;
    program_type?: string;
    duration_weeks?: number;
    skill_level?: 'beginner' | 'intermediate' | 'advanced';
    is_featured?: boolean;
}

export default function Post() {
    const { user, recruiter, company, subscription, subscriptionStatus, hasActiveSubscription, canPostApprenticeships, isAccountApproved, accountStatus } = useRecruiter();
    const router = useRouter();
    const supabase = createClientComponentClient()

    // All hooks must be called before any conditional returns
    const [title, settitle] = useState("")
    const [desc, setdesc] = useState("")
    const [type, settype] = useState("")
    const [category, setcategory] = useState("")
    const [loc, setloc] = useState("")
    const [wya, setwya] = useState("")
    const [extras, setextras] = useState("")
    const [limit, setlimit] = useState("")
    const [settlement, setSettlement] = useState("")
    const [skills, setskills] = useState<string[]>([])
    const [paymenttype, setpaymenttype] = useState("")
    const [signupfee, setsignupfee] = useState("")
    const [accomodation, setaccomodation] = useState("")
    const [hasSignupFee, setHasSignupFee] = useState("")
    const [trainingMode, setTrainingMode] = useState("")
    const [providesCertificate, setProvidesCertificate] = useState<boolean | null>(null)
    const [teachingMethod, setTeachingMethod] = useState("")
    const [learningOutcomes, setLearningOutcomes] = useState<string>("")
    const [scheduling, setScheduling] = useState("")
    const [outcomes, setOutcomes] = useState("")
    const [trainerCredentials, setTrainerCredentials] = useState("")

    // Duration - structured input
    const [durationValue, setDurationValue] = useState<number | ''>('')
    const [durationUnit, setDurationUnit] = useState('weeks')

    // Facility features
    const [facilityFeatures, setFacilityFeatures] = useState<string[]>([])

    // Split date fields
    const [deadlineDay, setDeadlineDay] = useState('')
    const [deadlineMonth, setDeadlineMonth] = useState('')
    const [deadlineYear, setDeadlineYear] = useState('')
    const [startDay, setStartDay] = useState('')
    const [startMonth, setStartMonth] = useState('')
    const [startYear, setStartYear] = useState('')

    // New fields from onboarding
    const [programType, setProgramType] = useState("")
    const [outcomeIntent, setOutcomeIntent] = useState<string[]>([])
    const [supportProvided, setSupportProvided] = useState<string[]>([])

    // Curriculum selection
    const [selectedCurriculum, setSelectedCurriculum] = useState<string | null>(null)
    const [shortlistedCurriculums, setShortlistedCurriculums] = useState<ShortlistedCurriculum[]>([])
    const [loadingCurriculums, setLoadingCurriculums] = useState(true)

    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [showAgreements, setShowAgreements] = useState(false);

    const [bankDetails, setBankDetails] = useState<any>(null);
    const [checkingBankDetails, setCheckingBankDetails] = useState(false);
    const [showBankForm, setShowBankForm] = useState(false);

    // Country locked to Nigeria
    const country = "Nigeria";
    const [state, setState] = useState("");
    const [stateList, setStateList] = useState<string[]>([]);
    const [isLoadingStates, setIsLoadingStates] = useState(false);

    const [city, setCity] = useState("");
    const [cityList, setCityList] = useState<string[]>([]);
    const [isLoadingCities, setIsLoadingCities] = useState(false);

    // Add this state for tracking which fields have errors
    const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({});

    // Check if subscription has Prentis Accreditation
    const hasPrentisAccreditation = hasActiveSubscription && (subscription?.accreditation_amount || 0) > 0;

    // Fetch shortlisted curriculums on mount
    const fetchShortlistedCurriculums = useCallback(async () => {
        setLoadingCurriculums(true)
        try {
            const response = await fetch('/api/curriculums/shortlist')
            const data = await response.json()

            if (response.ok) {
                setShortlistedCurriculums(data.curriculums || [])
            }
        } catch (error) {
            console.error('Error fetching shortlisted curriculums:', error)
        } finally {
            setLoadingCurriculums(false)
        }
    }, [])

    useEffect(() => {
        fetchShortlistedCurriculums()
    }, [fetchShortlistedCurriculums])

    // Fetch Nigerian states on mount
    useEffect(() => {
        async function loadStates() {
            setIsLoadingStates(true);
            try {
                const states = await getStatesWithCache("Nigeria");
                setStateList(states);
            } catch (error) {
                console.error('Error fetching states:', error);
                toast.error("Failed to load states");
            } finally {
                setIsLoadingStates(false);
            }
        }
        loadStates();
    }, []);

    // Date helper function (defined before use)
    const formatDateFromDropdowns = (day: string, month: string, year: string) => {
        if (!day || !month || !year) return null;
        return `${year}-${month}-${day.padStart(2, '0')}`;
    };

    // Auto-save form data to localStorage (hook must be called unconditionally)
    const duration = durationValue ? `${durationValue} ${durationUnit}` : '';
    const deadline = formatDateFromDropdowns(deadlineDay, deadlineMonth, deadlineYear);
    const startDate = formatDateFromDropdowns(startDay, startMonth, startYear);

    const formDataForAutoSave = {
        title, desc, type, category, wya, settlement, skills, durationValue, durationUnit,
        paymenttype, accomodation, signupfee, limit, deadlineDay, deadlineMonth, deadlineYear,
        startDay, startMonth, startYear, trainingMode, providesCertificate, teachingMethod,
        learningOutcomes, scheduling, outcomes, trainerCredentials, state, city,
        programType, outcomeIntent, supportProvided, selectedCurriculum, facilityFeatures
    };

    const { status: autoSaveStatus, lastSaved } = useLocalStorageAutoSave(
        `post-job-draft-${user?.id}`,
        formDataForAutoSave,
        2000
    );

    // Check if user can post - need both payment AND approval
    const isLocked = !canPostApprenticeships;

    // If locked, show appropriate locked state
    if (isLocked) {
        const isPendingPayment = !hasActiveSubscription;
        const isPendingReview = hasActiveSubscription && !isAccountApproved;

        return (
            <div className="relative flex flex-col h-full w-full bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden">
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                    <div className={`p-6 rounded-full mb-6 ${isPendingPayment ? 'bg-amber-100' : 'bg-blue-100'}`}>
                        {isPendingPayment ? (
                            <Lock className="h-12 w-12 text-amber-600" />
                        ) : (
                            <Clock className="h-12 w-12 text-blue-600" />
                        )}
                    </div>
                    <h2 className="text-2xl font-bold text-[#0A1F44] mb-3">
                        {isPendingPayment ? 'Payment Required' : 'Account Under Review'}
                    </h2>
                    <p className="text-gray-600 max-w-md mb-6">
                        {isPendingPayment
                            ? 'Complete your subscription payment to unlock the ability to post new apprenticeships and access all platform features.'
                            : 'Your account is currently being reviewed by our team. Once approved, you\'ll be able to post apprenticeships.'}
                    </p>
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg mb-6 ${
                        isPendingPayment ? 'text-amber-600 bg-amber-50' : 'text-blue-600 bg-blue-50'
                    }`}>
                        {isPendingPayment ? (
                            <AlertTriangle className="h-4 w-4" />
                        ) : (
                            <Clock className="h-4 w-4" />
                        )}
                        <span className="text-sm font-medium">
                            {isPendingPayment ? 'Payment pending' : 'Review in progress'}
                        </span>
                    </div>
                    <button
                        onClick={() => router.push('/recruiter/dashboard')}
                        className="bg-[#14B8A6] hover:bg-[#0D9488] text-white py-3 px-6 rounded-xl font-semibold transition-colors shadow-lg shadow-[#14B8A6]/30"
                    >
                        {isPendingPayment ? 'Go to Dashboard to Pay' : 'Back to Dashboard'}
                    </button>
                </div>
            </div>
        );
    }

    // Facility features constant
    const FACILITY_FEATURES = [
        'On-site tools',
        'Safety gear provided',
        'Internet access',
        'Air conditioning',
        'Parking space',
        'Cafeteria/Break room',
        'Library/Resource center'
    ];

    // Date helper functions
    const getDaysInMonth = (month: number, year: number) => {
        if (!month || !year) return 31;
        return new Date(year, month, 0).getDate();
    };

    const months = [
        { value: '01', label: 'January' },
        { value: '02', label: 'February' },
        { value: '03', label: 'March' },
        { value: '04', label: 'April' },
        { value: '05', label: 'May' },
        { value: '06', label: 'June' },
        { value: '07', label: 'July' },
        { value: '08', label: 'August' },
        { value: '09', label: 'September' },
        { value: '10', label: 'October' },
        { value: '11', label: 'November' },
        { value: '12', label: 'December' }
    ];

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 6 }, (_, i) => currentYear + i);

    const isValidDate = (day: string, month: string, year: string) => {
        if (!day || !month || !year) return true; // Empty is valid (optional)
        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        return date.getDate() === parseInt(day) &&
               date.getMonth() === parseInt(month) - 1 &&
               date.getFullYear() === parseInt(year);
    };

    const isDateInFuture = (day: string, month: string, year: string) => {
        if (!day || !month || !year) return true;
        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date >= today;
    };

    const categories = [
        "Agriculture & Farming",
        "Building & Construction",
        "Hospitality",
        "Mechanical Engineering",
        "Electrical Engineering",
        "Textiles & Tailoring",
        "Retail & Business",
        "Food & Catering",
        "Arts & Craftsmanship",
        "Beauty & Cosmetology",
        "Other"
    ];

    async function fetchCities(stateName: string) {
        setIsLoadingCities(true);
        setCity(""); // Reset city when state changes
        try {
            const cities = await getCitiesWithCache("Nigeria", stateName);
            setCityList(cities);
        } catch (error) {
            console.error('Error fetching cities:', error);
            toast.error("Failed to load cities");
        } finally {
            setIsLoadingCities(false);
        }
    }

    async function postJob(agreement_id: string) {
        setLoading(true);
        try {
            const { data: recruiterdata, error: recruitererror } = await supabase
                .from('Recruiters')
                .select(`
                    *,
                    CompanyInfo (
                        name
                    )
                `)
                .eq('uniqueid', user.id)
                .single()

            // Get curriculum name for denormalized storage
            const selectedCurriculumData = shortlistedCurriculums.find(c => c.id === selectedCurriculum)

            // Determine certificate value - auto-set if has Prentis Accreditation
            const certificateValue = hasPrentisAccreditation ? true : providesCertificate;

            const { data: job, error: jobError } = await supabase
                .from('Jobs')
                .upsert({
                    title,
                    description: desc,
                    type,
                    category,
                    location: `${city}, ${state}, ${country}`,
                    who_we_are: wya,
                    settlement: settlement,
                    skills,
                    duration,
                    company_name: recruiterdata?.CompanyInfo?.name,
                    payment_type: paymenttype,
                    accomodation: accomodation,
                    signup_fee: signupfee,
                    limit: parseInt(limit) || 1,
                    deadline: deadline || null,
                    country: country,
                    state: state,
                    city: city,
                    start_date: startDate || null,
                    training_mode: trainingMode,
                    provides_certificate: certificateValue,
                    teaching_method: teachingMethod,
                    learning_outcomes: learningOutcomes,
                    scheduling: scheduling,
                    outcomes: outcomes,
                    trainer_credentials: trainerCredentials,
                    // Note: program_type, outcome_intent, support_provided, facility_features,
                    // curriculum_id, curriculum_name columns need to be added to Jobs table
                })
                .select('uid')
                .single()

            if (jobError) {
                setErrorMessage("An error occurred while posting the apprenticeship.");
                throw jobError;
            }
            console.log(job);

            const { data, error: updateError } = await supabase
                .from('Agreements')
                .update({ job_id: job.uid })
                .eq('agreement_id', agreement_id);

            if (updateError) console.log(updateError);

            else {
                setShowAgreements(false);
                toast.success("Apprenticeship posted", {
                    description: "Click here to view",
                    action: {
                        label: "View",
                        onClick: () => router.push('/recruiter/listings'),
                    },
                })
                setSuccessMessage("Apprenticeship posted successfully!");
                setErrorMessage("");
                settitle("");
                setdesc("");
                settype("");
                setcategory("");
                setloc("");
                setwya("");
                setskills([]);
                setDurationValue('');
                setDurationUnit('weeks');
                setSettlement("");
                setpaymenttype("");
                setsignupfee("");
                setaccomodation("");
                setHasSignupFee("");
                setDeadlineDay("");
                setDeadlineMonth("");
                setDeadlineYear("");
                setStartDay("");
                setStartMonth("");
                setStartYear("");
                setTrainingMode("");
                setProvidesCertificate(null);
                setTeachingMethod("");
                setLearningOutcomes("");
                setScheduling("");
                setOutcomes("");
                setTrainerCredentials("");
                setProgramType("");
                setOutcomeIntent([]);
                setSupportProvided([]);
                setFacilityFeatures([]);
                setSelectedCurriculum(null);
                router.refresh();
            }
        } catch (error) {
            setErrorMessage("An error occurred while posting the apprenticeship.");
            setSuccessMessage("");
            console.error(error);
        }
        setLoading(false);
    }

    async function handleAgreement() {
        const ip = await getIP();
        const parser = new UAParser();
        const agent = parser.getResult();

        try {
            const { data, error } = await supabase
                .from('Agreements')
                .insert(
                    {
                        version: '1.0',
                        ip_address: ip,
                        agent: agent
                    }
                )
                .select('agreement_id')
                .single()
            if (error) throw error
            else {
                postJob(data.agreement_id)
                return true;
            }
        }
        catch (error) {
            console.error(error)
            toast.error("Error while inserting agreement")
        }
    }

    async function handleSubmit() {
        // Define required fields with their display names
        const requiredFieldsMap = {
            curriculum: {
                value: !!selectedCurriculum,
                message: "Please select a curriculum for this apprenticeship"
            },
            title: {
                value: !!title,
                message: "Please enter apprenticeship title"
            },
            description: {
                value: !!desc && desc.length >= 300,
                message: desc.length === 0 ? "Please enter description" : "Description must be at least 300 characters"
            },
            type: {
                value: !!type,
                message: "Please select type"
            },
            category: {
                value: !!category,
                message: "Please select category"
            },
            country: {
                value: !!country,
                message: "Please select country"
            },
            state: {
                value: !!state,
                message: "Please select state"
            },
            city: {
                value: !!city,
                message: "Please enter city"
            },
            whoWeAre: {
                value: !!wya && wya.length >= 300,
                message: wya.length === 0 ? "Please enter company information" : "Company information must be at least 300 characters"
            },
            skills: {
                value: !!skills && skills.length >= 3,
                message: skills.length === 0 ? "Please enter required skills" : "Please enter at least 3 required skills"
            },
            duration: {
                value: durationValue !== '' && durationValue > 0,
                message: "Please enter a valid duration"
            },
            limit: {
                value: !!limit,
                message: "Please enter number of apprentices"
            },
            startDate: {
                value: !!startDay && !!startMonth && !!startYear && isValidDate(startDay, startMonth, startYear) && isDateInFuture(startDay, startMonth, startYear),
                message: !startDay || !startMonth || !startYear
                    ? "Please select a start date"
                    : !isValidDate(startDay, startMonth, startYear)
                    ? "Please select a valid date"
                    : "Start date must be in the future"
            },
            trainingMode: {
                value: !!trainingMode,
                message: "Please select training mode"
            },
            providesCertificate: {
                value: hasPrentisAccreditation || providesCertificate !== null,
                message: "Please specify if you provide certification"
            },
            hasSignupFee: {
                value: !!hasSignupFee,
                message: "Please specify if there is a signup fee"
            },
            signupFee: {
                value: hasSignupFee === "No" || (hasSignupFee === "Yes" && !!signupfee && signupfee !== "0"),
                message: "Please enter signup fee amount"
            },
            teachingMethod: {
                value: !!teachingMethod && teachingMethod.length >= 300,
                message: teachingMethod.length === 0 ? "Please explain your teaching method" : "Teaching method must be at least 300 characters"
            },
            learningOutcomes: {
                value: !!learningOutcomes.trim() && learningOutcomes.length >= 300,
                message: learningOutcomes.length === 0 ? "Please list what apprentices will learn" : "Learning outcomes must be at least 300 characters"
            },
            scheduling: {
                value: !!scheduling && scheduling.length >= 300,
                message: scheduling.length === 0 ? "Please provide scheduling details" : "Scheduling details must be at least 300 characters"
            },
            outcomes: {
                value: !!outcomes && outcomes.length >= 300,
                message: outcomes.length === 0 ? "Please explain the expected outcomes" : "Career outcomes must be at least 300 characters"
            },
            trainerCredentials: {
                value: !!trainerCredentials && trainerCredentials.length >= 300,
                message: trainerCredentials.length === 0 ? "Please share your trainer credentials" : "Trainer credentials must be at least 300 characters"
            },
            programType: {
                value: !!programType,
                message: "Please select a program type"
            },
            outcomeIntent: {
                value: outcomeIntent.length > 0,
                message: "Please select at least one outcome intent"
            }
        };

        // Update fieldErrors state based on validation
        const errors: Record<string, boolean> = {};
        Object.entries(requiredFieldsMap).forEach(([key, field]) => {
            errors[key] = !field.value;
        });
        setFieldErrors(errors);

        // Find first error and show specific message
        const firstError = Object.entries(requiredFieldsMap).find(([_, field]) => !field.value);
        if (firstError) {
            setErrorMessage(firstError[1].message);
            toast.error(firstError[1].message);
            return;
        }

        if (parseInt(limit) < 1) {
            setErrorMessage("Number of apprentices must be at least 1");
            toast.error("Number of apprentices must be at least 1");
            return;
        }

        if (hasSignupFee === "Yes") {
            const hasBankDetails = await checkBankDetails();
            if (!hasBankDetails) {
                toast.error("Please add your bank details before posting an apprenticeship with signup fee", {
                    description: "Click here to add bank details",
                    action: {
                        label: "Add Details",
                        onClick: () => router.push('/recruiter/bank-details'),
                    },
                });
                return;
            }
        }

        setShowAgreements(true);
    }

    async function fetchBankDetails() {
        setCheckingBankDetails(true);
        try {
            const { data } = await supabase
                .from('RecruiterBankDetails')
                .select('*')
                .eq('recruiter_id', user.id)
                .single();
            setBankDetails(data || null);
        } catch {
            setBankDetails(null);
        }
        setCheckingBankDetails(false);
    }

    function fillSampleData() {
        settitle("Software Development Engineer");
        setdesc("We are looking for a passionate Software Engineer to design, develop and install software solutions.");
        settype("Full Time");
        setcategory("Technology");
        setloc("Lagos, Nigeria");
        setwya("We are a tech company focused on innovation.");
        setskills(["JavaScript", "React", "Node.js"]);
        setduration("12 months");
        setSettlement("100000");
        setpaymenttype("Monthly");
        setsignupfee("5000");
        setaccomodation("Yes");
    }

    const checkBankDetails = async () => {
        const { data, error } = await supabase
            .from('RecruiterBankDetails')
            .select('*')
            .eq('recruiter_id', user.id)
            .single();

        if (error || !data) {
            return false;
        }
        return true;
    };

    return (
        <div className='relative flex flex-col h-full w-full bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden'>
            {/* Decorative Blobs */}
            <svg viewBox="0 0 500 500" className="absolute top-0 right-0 w-[300px] h-[300px] opacity-[0.03] pointer-events-none -z-10" style={{ transform: 'translate(20%, -10%)' }}>
                <path fill="#14B8A6" d="M432.7,219.4c-15.4,59.7-61.3,105.6-121,121c-59.7,15.4-121.9-5.6-164.1-55.3c-42.2-49.7-56.6-117.7-37.7-179.2C129,44.4,175,2.5,231.2,0.2c56.2-2.3,114.8,35.6,144.8,93.8C406,152.2,448.1,159.7,432.7,219.4z"/>
            </svg>

            <AgreementModal handleAgreement={handleAgreement} type={1} showAgreements={showAgreements} setShowAgreements={setShowAgreements} />

            {/* Auto-Save Indicator */}
            <AutoSaveIndicator status={autoSaveStatus} lastSaved={lastSaved} position="fixed" />

            {/* Fixed Header */}
            <div className="flex-shrink-0 px-4 py-6 lg:p-8 border-b border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                    <div className="bg-[#14B8A6]/10 rounded-full p-3">
                        <Briefcase className="text-[#14B8A6]" size={28} />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-[#0A1F44]">Post an Apprenticeship</h1>
                </div>
                <p className="text-gray-600">Create a new apprenticeship opportunity and find talented individuals</p>
            </div>

            {/* Scrollable Content */}
            <div className='flex-1 overflow-y-auto px-4 py-6 lg:p-8'>
                <div className='mb-10'>
                    {/* General Section */}
                    <div className="bg-white border-2 border-gray-100 rounded-2xl px-4 py-6 lg:p-8 mb-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-[#14B8A6]/10 rounded-full p-3">
                                <FileText className="text-[#14B8A6]" size={24} />
                            </div>
                            <h2 className="text-xl font-semibold text-[#0A1F44]">General Information</h2>
                        </div>

                        <div className="flex flex-col gap-2 my-4">
                            <div className="mb-1">
                                <p className="font-[550] text-lg my-1">Apprenticeship Title *</p>
                                <input
                                    value={title}
                                    className={`px-4 py-3 rounded-lg border placeholder:text-xs w-full text-xs ${fieldErrors.title ? 'border-red-500 bg-red-50' : ''
                                        }`}
                                    type="text"
                                    placeholder="e.g. Software Engineer"
                                    onChange={(e) => { settitle(e.target.value) }}
                                />
                            </div>
                            <div className="my-2">
                                <p className="font-[550] text-lg my-1">Apprenticeship Category *</p>
                                <select
                                    value={category}
                                    onChange={(e) => { setcategory(e.target.value) }}
                                    className={`bg-white px-4 py-3 rounded-lg border placeholder:text-xs text-xs w-full ${fieldErrors.category ? 'border-red-500 bg-red-50' : ''
                                        }`}
                                >
                                    <option>Select category</option>
                                    {
                                        categories.map((category) => {
                                            return <option key={category} value={category}>{category}</option>
                                        })
                                    }
                                </select>
                            </div>


                            <div className='flex flex-col gap-4'>
                                <div>
                                    <p className="font-[550] text-lg mb-2">Training Mode *</p>
                                    <p className="text-xs text-gray-500 mb-3">How will the training be delivered?</p>
                                    <div className={`grid grid-cols-1 sm:grid-cols-3 gap-3 ${fieldErrors.trainingMode ? 'ring-2 ring-red-500 rounded-xl p-1' : ''}`}>
                                        {['In-Person', 'Online', 'Hybrid'].map((mode) => (
                                            <button
                                                key={mode}
                                                type="button"
                                                onClick={() => setTrainingMode(mode)}
                                                className={`p-4 rounded-xl border-2 transition-all text-left ${
                                                    trainingMode === mode
                                                        ? 'border-[#14B8A6] bg-[#14B8A6]/5'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                            >
                                                <p className="font-medium text-gray-900 text-sm">{mode}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <p className="font-[550] text-lg mb-2">Type *</p>
                                    <p className="text-xs text-gray-500 mb-3">What is the commitment level?</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {['Full Time', 'Part Time'].map((t) => (
                                            <button
                                                key={t}
                                                type="button"
                                                onClick={() => settype(t)}
                                                className={`p-4 rounded-xl border-2 transition-all text-left ${
                                                    type === t
                                                        ? 'border-[#14B8A6] bg-[#14B8A6]/5'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                            >
                                                <p className="font-medium text-gray-900 text-sm">{t}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>


                            <div className="mt-2">
                                <p className="font-[550] text-lg my-1">Duration *</p>
                                <div className="flex gap-3">
                                    <input
                                        value={durationValue}
                                        className={`px-4 py-3 rounded-lg border placeholder:text-xs w-24 text-sm ${fieldErrors.duration ? 'border-red-500 bg-red-50' : ''}`}
                                        placeholder="e.g. 3"
                                        type="number"
                                        min="1"
                                        onChange={(e) => setDurationValue(e.target.value ? parseInt(e.target.value) : '')}
                                    />
                                    <select
                                        value={durationUnit}
                                        onChange={(e) => setDurationUnit(e.target.value)}
                                        className="flex-1 px-4 py-3 rounded-lg border text-sm bg-white"
                                    >
                                        <option value="days">Days</option>
                                        <option value="weeks">Weeks</option>
                                        <option value="months">Months</option>
                                        <option value="years">Years</option>
                                    </select>
                                </div>
                            </div>
                            <SkillsInput
                                label="Required Skills"
                                value={skills}
                                onChange={setskills}
                                required
                                minSkills={3}
                                maxSkills={10}
                                placeholder="Enter a skill"
                                error={fieldErrors.skills ? "Please add at least 3 required skills" : undefined}
                                helperText="Add skills that apprentices should have or will learn"
                            />
                        </div>


                    </div>

                    {/* Curriculum Selection Section */}
                    <div className={`bg-white border-2 rounded-2xl px-4 py-6 lg:p-8 mb-6 shadow-sm hover:shadow-md transition-shadow ${fieldErrors.curriculum ? 'border-red-300 bg-red-50/30' : 'border-gray-100'}`}>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-[#14B8A6]/10 rounded-full p-3">
                                <BookOpen className="text-[#14B8A6]" size={24} />
                            </div>
                            <h2 className="text-xl font-semibold text-[#0A1F44]">Curriculum *</h2>
                        </div>

                        <p className="text-sm text-gray-600 mb-4">
                            Select the curriculum you&apos;ll use for this apprenticeship. You can manage your curriculum shortlist in the <Link href="/recruiter/curriculum" className="text-[#14B8A6] hover:underline">Curriculum</Link> page.
                        </p>

                        {loadingCurriculums ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="w-6 h-6 animate-spin text-[#14B8A6]" />
                            </div>
                        ) : shortlistedCurriculums.length === 0 ? (
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
                                <div className="p-3 bg-amber-100 rounded-full inline-flex mb-3">
                                    <AlertTriangle className="w-6 h-6 text-amber-600" />
                                </div>
                                <h3 className="font-medium text-amber-800 mb-1">No Curriculums Selected</h3>
                                <p className="text-sm text-amber-700 mb-4">
                                    You need to add at least one curriculum to your shortlist before posting an apprenticeship.
                                </p>
                                <Link
                                    href="/recruiter/curriculum"
                                    className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white py-2.5 px-4 rounded-lg font-medium text-sm transition-colors"
                                >
                                    <BookOpen size={16} />
                                    Browse Curriculums
                                    <ExternalLink size={14} />
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {shortlistedCurriculums.map((curriculum) => {
                                    const isSelected = selectedCurriculum === curriculum.id

                                    const getSkillLevelBadge = (level?: string) => {
                                        const colors: Record<string, string> = {
                                            beginner: 'bg-green-100 text-green-700',
                                            intermediate: 'bg-amber-100 text-amber-700',
                                            advanced: 'bg-[#0A1F44]/10 text-[#0A1F44]',
                                        }
                                        return colors[level || 'beginner'] || colors.beginner
                                    }

                                    return (
                                        <button
                                            key={curriculum.id}
                                            type="button"
                                            onClick={() => setSelectedCurriculum(curriculum.id)}
                                            className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                                                isSelected
                                                    ? 'border-[#14B8A6] bg-[#14B8A6]/5 shadow-md'
                                                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                                            }`}
                                        >
                                            {isSelected && (
                                                <div className="absolute top-3 right-3">
                                                    <CheckCircle className="w-5 h-5 text-[#14B8A6]" />
                                                </div>
                                            )}

                                            <h3 className="font-semibold text-[#0A1F44] text-sm mb-1 pr-6">
                                                {curriculum.name}
                                            </h3>
                                            <p className="text-xs text-gray-500 mb-2">
                                                {curriculum.primary_industry}
                                            </p>
                                            <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                                                {curriculum.short_description || curriculum.description}
                                            </p>

                                            <div className="flex items-center gap-2 flex-wrap">
                                                {curriculum.duration_weeks && (
                                                    <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded">
                                                        {curriculum.duration_weeks} weeks
                                                    </span>
                                                )}
                                                <span className={`text-xs px-2 py-0.5 rounded capitalize ${getSkillLevelBadge(curriculum.skill_level)}`}>
                                                    {curriculum.skill_level || 'beginner'}
                                                </span>
                                                {curriculum.is_featured && (
                                                    <span className="text-xs bg-amber-50 text-amber-600 px-2 py-0.5 rounded">
                                                        Featured
                                                    </span>
                                                )}
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>
                        )}

                        {fieldErrors.curriculum && (
                            <p className="text-sm text-red-500 mt-3">Please select a curriculum for this apprenticeship</p>
                        )}
                    </div>

                    {/* Program Details Section */}
                    <div className="bg-white border-2 border-gray-100 rounded-2xl px-4 py-6 lg:p-8 mb-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-[#14B8A6]/10 rounded-full p-3">
                                <GraduationCap className="text-[#14B8A6]" size={24} />
                            </div>
                            <h2 className="text-xl font-semibold text-[#0A1F44]">Program Details</h2>
                        </div>

                        <div className="flex flex-col gap-4">
                            {/* Program Type */}
                            <div>
                                <p className="font-[550] text-lg mb-2">Program Type *</p>
                                <p className="text-xs text-gray-500 mb-3">What kind of training program is this?</p>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {['Hands-on Craft/Trade', 'Technical/Engineering', 'Business & Operations'].map((pType) => (
                                        <button
                                            key={pType}
                                            type="button"
                                            onClick={() => setProgramType(pType)}
                                            className={`p-4 rounded-xl border-2 transition-all text-left ${
                                                programType === pType
                                                    ? 'border-[#14B8A6] bg-[#14B8A6]/5'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            <p className="font-medium text-gray-900 text-sm">{pType}</p>
                                        </button>
                                    ))}
                                </div>
                                {fieldErrors.programType && (
                                    <p className="text-xs text-red-500 mt-2">Please select a program type</p>
                                )}
                            </div>

                            {/* Outcome Intent */}
                            <div>
                                <p className="font-[550] text-lg mb-2">Outcome Intent *</p>
                                <p className="text-xs text-gray-500 mb-3">What happens after apprentices complete the program? Select all that apply.</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {['Direct Hire', 'Market Ready'].map((intent) => (
                                        <button
                                            key={intent}
                                            type="button"
                                            onClick={() => {
                                                if (outcomeIntent.includes(intent)) {
                                                    setOutcomeIntent(outcomeIntent.filter(i => i !== intent))
                                                } else {
                                                    setOutcomeIntent([...outcomeIntent, intent])
                                                }
                                            }}
                                            className={`p-4 rounded-xl border-2 transition-all text-left ${
                                                outcomeIntent.includes(intent)
                                                    ? 'border-[#14B8A6] bg-[#14B8A6]/5'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            <p className="font-medium text-gray-900 text-sm">{intent}</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {intent === 'Direct Hire'
                                                    ? 'Apprentices may be hired by your organization'
                                                    : 'Apprentices will be ready to work independently or start their own business'}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                                {fieldErrors.outcomeIntent && (
                                    <p className="text-xs text-red-500 mt-2">Please select at least one outcome intent</p>
                                )}
                            </div>

                            {/* Support Provided */}
                            <div>
                                <p className="font-[550] text-lg mb-2">Support Provided</p>
                                <p className="text-xs text-gray-500 mb-3">What additional support will apprentices receive? Select all that apply.</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {['Monthly Stipend', 'Tools and Equipment', 'Workspace/Studio Access', 'Housing/Accommodation'].map((support) => (
                                        <button
                                            key={support}
                                            type="button"
                                            onClick={() => {
                                                if (supportProvided.includes(support)) {
                                                    setSupportProvided(supportProvided.filter(s => s !== support))
                                                } else {
                                                    setSupportProvided([...supportProvided, support])
                                                }
                                            }}
                                            className={`p-4 rounded-xl border-2 transition-all text-left ${
                                                supportProvided.includes(support)
                                                    ? 'border-[#14B8A6] bg-[#14B8A6]/5'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            <p className="font-medium text-gray-900 text-sm">{support}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Facility Features */}
                            <div>
                                <p className="font-[550] text-lg mb-2">Facility Features</p>
                                <p className="text-xs text-gray-500 mb-3">What facilities and amenities are available at your training location? Select all that apply.</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {FACILITY_FEATURES.map((feature) => (
                                        <button
                                            key={feature}
                                            type="button"
                                            onClick={() => {
                                                if (facilityFeatures.includes(feature)) {
                                                    setFacilityFeatures(facilityFeatures.filter(f => f !== feature))
                                                } else {
                                                    setFacilityFeatures([...facilityFeatures, feature])
                                                }
                                            }}
                                            className={`p-4 rounded-xl border-2 transition-all text-left ${
                                                facilityFeatures.includes(feature)
                                                    ? 'border-[#14B8A6] bg-[#14B8A6]/5'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            <p className="font-medium text-gray-900 text-sm">{feature}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Deadline and Opening Section */}
                    <div className="bg-white border-2 border-gray-100 rounded-2xl px-4 py-6 lg:p-8 mb-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-[#0A1F44]/10 rounded-full p-3">
                                <Clock className="text-[#0A1F44]" size={24} />
                            </div>
                            <h2 className="text-xl font-semibold text-[#0A1F44]">Deadline and Opening</h2>
                        </div>
                        <div className="flex flex-col gap-4 my-4">
                            <div>
                                <p className="font-[550] text-lg my-1">Maximum Number of Applicants? *</p>
                                <input
                                    value={limit}
                                    className={`px-4 py-3 rounded-lg border placeholder:text-xs w-full text-sm ${fieldErrors.limit ? 'border-red-500 bg-red-50' : ''}`}
                                    type="number"
                                    min="1"
                                    required
                                    placeholder="Enter number of apprentices"
                                    onChange={(e) => {
                                        const value = Math.max(0, parseInt(e.target.value) || 0);
                                        setlimit(value.toString());
                                    }}
                                />
                            </div>

                            <div>
                                <p className="font-[550] text-lg my-1">Application Deadline (Optional)</p>
                                <p className="text-xs text-gray-500 mb-2">Leave empty if applications are open indefinitely</p>
                                <div className="grid grid-cols-3 gap-3">
                                    <select
                                        value={deadlineDay}
                                        onChange={(e) => setDeadlineDay(e.target.value)}
                                        className="px-3 py-3 rounded-lg border text-sm bg-white"
                                    >
                                        <option value="">Day</option>
                                        {Array.from({ length: getDaysInMonth(parseInt(deadlineMonth), parseInt(deadlineYear)) }, (_, i) => i + 1).map(day => (
                                            <option key={day} value={day.toString()}>{day}</option>
                                        ))}
                                    </select>
                                    <select
                                        value={deadlineMonth}
                                        onChange={(e) => setDeadlineMonth(e.target.value)}
                                        className="px-3 py-3 rounded-lg border text-sm bg-white"
                                    >
                                        <option value="">Month</option>
                                        {months.map(month => (
                                            <option key={month.value} value={month.value}>{month.label}</option>
                                        ))}
                                    </select>
                                    <select
                                        value={deadlineYear}
                                        onChange={(e) => setDeadlineYear(e.target.value)}
                                        className="px-3 py-3 rounded-lg border text-sm bg-white"
                                    >
                                        <option value="">Year</option>
                                        {years.map(year => (
                                            <option key={year} value={year.toString()}>{year}</option>
                                        ))}
                                    </select>
                                </div>
                                {deadlineDay && deadlineMonth && deadlineYear && !isValidDate(deadlineDay, deadlineMonth, deadlineYear) && (
                                    <p className="text-xs text-red-500 mt-1">Please select a valid date</p>
                                )}
                            </div>

                            <div>
                                <p className="font-[550] text-lg my-1">What date does training start? *</p>
                                <div className={`grid grid-cols-3 gap-3 ${fieldErrors.startDate ? 'border border-red-500 rounded-lg p-2 bg-red-50' : ''}`}>
                                    <select
                                        value={startDay}
                                        onChange={(e) => setStartDay(e.target.value)}
                                        className="px-3 py-3 rounded-lg border text-sm bg-white"
                                    >
                                        <option value="">Day</option>
                                        {Array.from({ length: getDaysInMonth(parseInt(startMonth), parseInt(startYear)) }, (_, i) => i + 1).map(day => (
                                            <option key={day} value={day.toString()}>{day}</option>
                                        ))}
                                    </select>
                                    <select
                                        value={startMonth}
                                        onChange={(e) => setStartMonth(e.target.value)}
                                        className="px-3 py-3 rounded-lg border text-sm bg-white"
                                    >
                                        <option value="">Month</option>
                                        {months.map(month => (
                                            <option key={month.value} value={month.value}>{month.label}</option>
                                        ))}
                                    </select>
                                    <select
                                        value={startYear}
                                        onChange={(e) => setStartYear(e.target.value)}
                                        className="px-3 py-3 rounded-lg border text-sm bg-white"
                                    >
                                        <option value="">Year</option>
                                        {years.map(year => (
                                            <option key={year} value={year.toString()}>{year}</option>
                                        ))}
                                    </select>
                                </div>
                                {startDay && startMonth && startYear && !isValidDate(startDay, startMonth, startYear) && (
                                    <p className="text-xs text-red-500 mt-1">Please select a valid date</p>
                                )}
                                {startDay && startMonth && startYear && isValidDate(startDay, startMonth, startYear) && !isDateInFuture(startDay, startMonth, startYear) && (
                                    <p className="text-xs text-red-500 mt-1">Start date must be in the future</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Location Section */}
                    <div className="bg-white border-2 border-gray-100 rounded-2xl px-4 py-6 lg:p-8 mb-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-[#14B8A6]/10 rounded-full p-3">
                                <MapPin className="text-[#14B8A6]" size={24} />
                            </div>
                            <h2 className="text-xl font-semibold text-[#0A1F44]">Location</h2>
                        </div>
                        <div className='flex flex-col sm:flex-row gap-x-5'>
                            <div className="my-2 w-full">
                                <p className="font-[550] text-lg my-1">Country *</p>
                                <input
                                    value="Nigeria"
                                    disabled
                                    className="bg-gray-100 px-4 py-3 rounded-lg border text-sm w-full cursor-not-allowed text-gray-600"
                                />
                            </div>

                            <div className="my-2 w-full">
                                <p className="font-[550] text-lg my-1">State *</p>
                                <select
                                    value={state}
                                    onChange={(e) => {
                                        setState(e.target.value);
                                        if (e.target.value) {
                                            fetchCities(e.target.value);
                                        }
                                    }}
                                    disabled={isLoadingStates}
                                    className={`bg-white px-4 py-3 rounded-lg border text-sm w-full ${fieldErrors.state ? 'border-red-500 bg-red-50' : ''}`}
                                >
                                    <option value="">
                                        {isLoadingStates ? "Loading states..." : "Select state"}
                                    </option>
                                    {stateList.map((stateName, index) => (
                                        <option key={index} value={stateName}>
                                            {stateName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="my-2 w-full">
                                <p className="font-[550] text-lg my-1">City *</p>
                                <input
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    type="text"
                                    placeholder="Enter city"
                                    className={`bg-white px-4 py-3 rounded-lg border text-sm w-full ${fieldErrors.city ? 'border-red-500 bg-red-50' : ''}`}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Compensation and Fees Section */}
                    <div className="bg-white border-2 border-gray-100 rounded-2xl px-4 py-6 lg:p-8 mb-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-[#0A1F44]/10 rounded-full p-3">
                                <DollarSign className="text-[#0A1F44]" size={24} />
                            </div>
                            <h2 className="text-xl font-semibold text-[#0A1F44]">Compensation & Fees</h2>
                        </div>

                        {/* Compensation - what trainer GIVES apprentice */}
                        <div className="mb-6">
                            <p className="font-semibold text-lg mb-1">Apprentice Compensation</p>
                            <p className="text-xs text-gray-500 mb-3">
                                What will you provide to apprentices during training?
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {[
                                    { value: 'Unpaid', label: 'Unpaid', desc: 'No monetary compensation' },
                                    { value: 'Monthly', label: 'Monthly Stipend', desc: 'Regular monthly payment' },
                                    { value: 'Settlement', label: 'Settlement', desc: 'Payment upon completion' }
                                ].map((option) => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => setpaymenttype(option.value)}
                                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                                            paymenttype === option.value
                                                ? 'border-[#14B8A6] bg-[#14B8A6]/5'
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        <p className="font-medium text-gray-900 text-sm">{option.label}</p>
                                        <p className="text-xs text-gray-500 mt-1">{option.desc}</p>
                                    </button>
                                ))}
                            </div>
                            {paymenttype === "Settlement" && (
                                <div className="mt-3">
                                    <p className="font-medium text-sm mb-1">Settlement Details</p>
                                    <input
                                        value={settlement}
                                        className="px-4 py-3 rounded-lg border placeholder:text-xs w-full text-sm"
                                        placeholder="e.g. A toolbox, Complete set of equipment, ₦500,000"
                                        type="text"
                                        onChange={(e) => setSettlement(e.target.value)}
                                    />
                                </div>
                            )}
                            {paymenttype === "Monthly" && (
                                <div className="mt-3">
                                    <p className="font-medium text-sm mb-1">Monthly Stipend Amount</p>
                                    <input
                                        value={settlement}
                                        className="px-4 py-3 rounded-lg border placeholder:text-xs w-full text-sm"
                                        placeholder="e.g. ₦50,000 - ₦100,000"
                                        type="text"
                                        onChange={(e) => setSettlement(e.target.value)}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Fees - what trainer COLLECTS from apprentice */}
                        <div className="pt-6 border-t">
                            <p className="font-semibold text-lg mb-1">Enrollment Fee</p>
                            <p className="text-xs text-gray-500 mb-3">
                                Will apprentices pay a fee to enroll in your program?
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setHasSignupFee("Yes")
                                        fetchBankDetails()
                                    }}
                                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                                        hasSignupFee === "Yes"
                                            ? 'border-[#14B8A6] bg-[#14B8A6]/5'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    <p className="font-medium text-gray-900 text-sm">Yes</p>
                                    <p className="text-xs text-gray-500 mt-1">Apprentices will pay to enroll</p>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setHasSignupFee("No")
                                        setsignupfee("")
                                        setShowBankForm(false)
                                    }}
                                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                                        hasSignupFee === "No"
                                            ? 'border-[#14B8A6] bg-[#14B8A6]/5'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    <p className="font-medium text-gray-900 text-sm">No</p>
                                    <p className="text-xs text-gray-500 mt-1">Free enrollment</p>
                                </button>
                            </div>
                        </div>

                        {hasSignupFee === "Yes" && (
                            <div className="mt-4">
                                {checkingBankDetails ? (
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <p className="text-sm">Checking bank details...</p>
                                    </div>
                                ) : bankDetails ? (
                                    <>
                                        <div className="bg-green-50 border border-green-200 p-4 rounded-xl mb-4">
                                            <p className="text-sm font-medium text-green-800 mb-2">Your Bank Details:</p>
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                                                <div>
                                                    <p className="text-green-600">Bank Name</p>
                                                    <p className="font-medium text-green-900">{bankDetails.bank_name}</p>
                                                </div>
                                                <div>
                                                    <p className="text-green-600">Account Number</p>
                                                    <p className="font-medium text-green-900">****{bankDetails.account_number.slice(-4)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-green-600">Account Name</p>
                                                    <p className="font-medium text-green-900">{bankDetails.account_name}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm mb-1">Enrollment Fee Amount (₦) *</p>
                                            <input
                                                value={signupfee}
                                                className={`px-4 py-3 rounded-lg border placeholder:text-xs w-full text-sm ${fieldErrors.signupFee ? 'border-red-500 bg-red-50' : ''}`}
                                                placeholder="Enter enrollment fee amount"
                                                type="number"
                                                min="1"
                                                onChange={(e) => setsignupfee(e.target.value)}
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                                        <p className="font-medium text-amber-800 mb-3">
                                            Bank details required to collect enrollment fees
                                        </p>
                                        {showBankForm ? (
                                            <InlineBankDetailsForm
                                                userId={user.id}
                                                onSuccess={(details) => {
                                                    setBankDetails(details);
                                                    setShowBankForm(false);
                                                }}
                                                onCancel={() => setShowBankForm(false)}
                                            />
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => setShowBankForm(true)}
                                                className="bg-amber-600 hover:bg-amber-700 text-white py-2.5 px-4 rounded-lg font-medium text-sm transition-colors"
                                            >
                                                Add Bank Details
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Extra Section */}
                    <div className="bg-white border-2 border-gray-100 rounded-2xl px-4 py-6 lg:p-8 mb-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-[#14B8A6]/10 rounded-full p-3">
                                <GraduationCap className="text-[#14B8A6]" size={24} />
                            </div>
                            <h2 className="text-xl font-semibold text-[#0A1F44]">Additional Benefits</h2>
                        </div>

                        {/* Certificate Question - Skip if has Prentis Accreditation */}
                        {hasPrentisAccreditation ? (
                            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                    <p className="font-medium text-green-800">Prentis Accreditation Included</p>
                                </div>
                                <p className="text-sm text-green-700 mt-1">
                                    Your subscription includes Prentis-accredited certificates for all apprentices.
                                </p>
                            </div>
                        ) : (
                            <div className="mb-4">
                                <p className="font-[550] text-lg mb-2">Will you provide a certificate? *</p>
                                <p className="text-xs text-gray-500 mb-3">Will apprentices receive a certificate upon completion?</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setProvidesCertificate(true)}
                                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                                            providesCertificate === true
                                                ? 'border-[#14B8A6] bg-[#14B8A6]/5'
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        <p className="font-medium text-gray-900 text-sm">Yes</p>
                                        <p className="text-xs text-gray-500 mt-1">Certificate will be provided</p>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setProvidesCertificate(false)}
                                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                                            providesCertificate === false
                                                ? 'border-[#14B8A6] bg-[#14B8A6]/5'
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        <p className="font-medium text-gray-900 text-sm">No</p>
                                        <p className="text-xs text-gray-500 mt-1">No certificate provided</p>
                                    </button>
                                </div>
                                {fieldErrors.providesCertificate && (
                                    <p className="text-xs text-red-500 mt-2">Please specify if you provide certification</p>
                                )}
                            </div>
                        )}

                        <div>
                            <p className="font-[550] text-lg mb-2">Will you provide accommodation?</p>
                            <p className="text-xs text-gray-500 mb-3">Will apprentices have access to housing during training?</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setaccomodation("Yes")}
                                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                                        accomodation === "Yes"
                                            ? 'border-[#14B8A6] bg-[#14B8A6]/5'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    <p className="font-medium text-gray-900 text-sm">Yes</p>
                                    <p className="text-xs text-gray-500 mt-1">Housing is provided</p>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setaccomodation("No")}
                                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                                        accomodation === "No"
                                            ? 'border-[#14B8A6] bg-[#14B8A6]/5'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    <p className="font-medium text-gray-900 text-sm">No</p>
                                    <p className="text-xs text-gray-500 mt-1">Apprentices arrange their own</p>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Description & Company Info Section */}
                    <div className="bg-white border-2 border-gray-100 rounded-2xl px-4 py-6 lg:p-8 mb-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-[#0A1F44]/10 rounded-full p-3">
                                <FileText className="text-[#0A1F44]" size={24} />
                            </div>
                            <h2 className="text-xl font-semibold text-[#0A1F44]">Description & Company Info</h2>
                        </div>
                        <div className="flex flex-col gap-2 my-4">
                            <TextAreaInput
                                label="Description"
                                value={desc}
                                onChange={(e) => setdesc(e.target.value)}
                                required
                                showCharCount
                                minChars={300}
                                rows={8}
                                placeholder="What will apprentices learn and do? Be specific and inspiring."
                                error={fieldErrors.description ? "Description must be at least 300 characters" : undefined}
                                helperText="Provide a captivating description of this training opportunity"
                            />

                            <TextAreaInput
                                label="About us / Company profile"
                                value={wya}
                                onChange={(e) => setwya(e.target.value)}
                                required
                                showCharCount
                                minChars={300}
                                rows={8}
                                placeholder="Introduce your company. Describe your mission, values, and what makes you special."
                                error={fieldErrors.whoWeAre ? "Company profile must be at least 300 characters" : undefined}
                                helperText="Help potential apprentices understand your company culture"
                            />
                        </div>
                    </div>

                    {/* Training Details Section */}
                    <div className="bg-white border-2 border-gray-100 rounded-2xl px-4 py-6 lg:p-8 mb-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-[#14B8A6]/10 rounded-full p-3">
                                <GraduationCap className="text-[#14B8A6]" size={24} />
                            </div>
                            <h2 className="text-xl font-semibold text-[#0A1F44]">Training Details</h2>
                        </div>
                        <div className="flex flex-col gap-2 my-4">
                            <div className="my-2">
                                <div className="flex justify-between items-center">
                                    <p className="font-[550] text-lg my-1">Teaching Method *</p>
                                    <span className="text-xs text-gray-500">{teachingMethod.length}</span>
                                </div>
                                <textarea
                                    value={teachingMethod}
                                    rows={4}
                                    className={`px-4 py-3 rounded-lg border placeholder:text-xs w-full text-xs ${fieldErrors.teachingMethod ? 'border-red-500 bg-red-50' : ''}`}
                                    placeholder="Explain your teaching method—will it be hands-on, theory-based, project-focused, or a mix? Mention if learners will work on real-world projects, receive one-on-one mentoring, or have group sessions."
                                    onChange={(e) => setTeachingMethod(e.target.value)}
                                ></textarea>
                                {teachingMethod.length < 300 && (
                                    <p className="text-xs mt-1 text-red-500">Minimum 300 characters</p>
                                )}
                            </div>

                            <div className="my-2">
                                <div className="flex justify-between items-center">
                                    <p className="font-[550] text-lg my-1">What You Will Learn *</p>
                                    <span className="text-xs text-gray-500">{learningOutcomes.length}</span>
                                </div>
                                <textarea
                                    value={learningOutcomes}
                                    rows={7}
                                    className={`px-4 py-3 rounded-lg border placeholder:text-xs w-full text-xs ${fieldErrors.learningOutcomes ? 'border-red-500 bg-red-50' : ''}`}
                                    placeholder={`List the technical and practical skills your apprentices will develop. For example:

•  How to safely use hand and power tools
•  Measuring, cutting, and assembling wood
•  Creating furniture from scratch
•  Applying finishes like paint and varnish
•  Understanding different types of wood and their uses`}
                                    onChange={(e) => setLearningOutcomes(e.target.value)}
                                ></textarea>
                                {learningOutcomes.length < 300 && (
                                    <p className="text-xs mt-1 text-red-500">Minimum 300 characters</p>
                                )}
                            </div>

                            <div className="my-2">
                                <div className="flex justify-between items-center">
                                    <p className="font-[550] text-lg my-1">Scheduling and Delivery *</p>
                                    <span className="text-xs text-gray-500">{scheduling.length}</span>
                                </div>
                                <textarea
                                    value={scheduling}
                                    rows={4}
                                    className={`px-4 py-3 rounded-lg border placeholder:text-xs w-full text-xs ${fieldErrors.scheduling ? 'border-red-500 bg-red-50' : ''}`}
                                    placeholder="How long will the apprenticeship last? What's the weekly/daily schedule? Mention any breaks or holidays."
                                    onChange={(e) => setScheduling(e.target.value)}
                                ></textarea>
                                {scheduling.length < 300 && (
                                    <p className="text-xs mt-1 text-red-500">Minimum 300 characters</p>
                                )}
                            </div>

                            <div className="my-2">
                                <div className="flex justify-between items-center">
                                    <p className="font-[550] text-lg my-1">Career Outcomes *</p>
                                    <span className="text-xs text-gray-500">{outcomes.length}</span>
                                </div>
                                <textarea
                                    value={outcomes}
                                    rows={4}
                                    className={`px-4 py-3 rounded-lg border placeholder:text-xs w-full text-xs ${fieldErrors.outcomes ? 'border-red-500 bg-red-50' : ''}`}
                                    placeholder="Explain how this apprenticeship will help learners in their careers or business. What kind of jobs or opportunities will they be prepared for?"
                                    onChange={(e) => setOutcomes(e.target.value)}
                                ></textarea>
                                {outcomes.length < 300 && (
                                    <p className="text-xs mt-1 text-red-500">Minimum 300 characters</p>
                                )}
                            </div>

                            <div className="my-2">
                                <div className="flex justify-between items-center">
                                    <p className="font-[550] text-lg my-1">Trainer Credentials *</p>
                                    <span className="text-xs text-gray-500">{trainerCredentials.length}</span>
                                </div>
                                <textarea
                                    value={trainerCredentials}
                                    rows={4}
                                    className={`px-4 py-3 rounded-lg border placeholder:text-xs w-full text-xs ${fieldErrors.trainerCredentials ? 'border-red-500 bg-red-50' : ''}`}
                                    placeholder="Share your experience, training, achievements, or anything else that shows why you're qualified to teach others in this field. Be as thorough as possible."
                                    onChange={(e) => setTrainerCredentials(e.target.value)}
                                ></textarea>
                                {trainerCredentials.length < 300 && (
                                    <p className="text-xs mt-1 text-red-500">Minimum 300 characters</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Submit Section */}
                    {errorMessage && (
                        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6">
                            <p className="text-red-600 text-sm font-medium">{errorMessage}</p>
                            {errorMessage.includes("bank details") && (
                                <button
                                    onClick={() => router.push('/recruiter/bank-details')}
                                    className="text-[#14B8A6] text-sm underline mt-2"
                                >
                                    Add Bank Details
                                </button>
                            )}
                        </div>
                    )}

                    {successMessage && (
                        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 mb-6">
                            <p className="text-green-600 text-sm font-medium">{successMessage}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        className={`w-full bg-[#14B8A6] hover:bg-[#0D9488] text-white py-4 px-6 rounded-xl font-semibold text-base transition-colors shadow-lg shadow-[#14B8A6]/30 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? "Posting..." : "Post Apprenticeship"}
                    </button>
                </div>
            </div>
        </div>
    )
}