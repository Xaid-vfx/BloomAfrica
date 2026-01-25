'use client'
import TextInput from "@/components/Input/Text";
import { AgreementModal } from "@/components/Modal/AgreementModal";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { TagsInput } from "react-tag-input-component";
import { toast } from "sonner";
import UAParser from "ua-parser-js";
import CountryList from "@/lib/CountryList/CountryList";
import { getStatesWithCache } from "@/lib/StateList/StateList";
import { getCitiesWithCache } from "@/lib/CityList/CityList";
import getIP from "@/lib/getIP/getIP";
import { useRecruiter } from "@/context/RecruiterContext";
import { Briefcase, MapPin, DollarSign, FileText, GraduationCap, Clock, Lock, AlertTriangle } from "lucide-react";
import { useLocalStorageAutoSave } from "@/hooks/useAutoSave";
import AutoSaveIndicator from "@/components/Recruiter/AutoSaveIndicator/AutoSaveIndicator";
import SkillsInput from "@/components/Recruiter/SkillsInput/SkillsInput";
import TextAreaInput from "@/components/Recruiter/Forms/TextAreaInput";

export default function Post() {
    const { user, recruiter, company, subscriptionStatus, hasActiveSubscription, canPostApprenticeships, isAccountApproved, accountStatus } = useRecruiter();
    const router = useRouter();

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

    const [title, settitle] = useState("")
    const [desc, setdesc] = useState("")
    const [type, settype] = useState("")
    const [category, setcategory] = useState("")
    const [loc, setloc] = useState("")
    const [wya, setwya] = useState("")
    const [extras, setextras] = useState("")
    const [limit, setlimit] = useState("")
    const [deadline, setdeadline] = useState("")
    const [settlement, setSettlement] = useState("")
    const [skills, setskills] = useState<string[]>([])
    const [duration, setduration] = useState("")
    const [paymenttype, setpaymenttype] = useState("")
    const [signupfee, setsignupfee] = useState("")
    const [accomodation, setaccomodation] = useState("")
    const [hasSignupFee, setHasSignupFee] = useState("")
    const [startDate, setStartDate] = useState("")
    const [trainingMode, setTrainingMode] = useState("")
    const [providesCertificate, setProvidesCertificate] = useState<boolean | null>(null)
    const [teachingMethod, setTeachingMethod] = useState("")
    const [learningOutcomes, setLearningOutcomes] = useState<string>("")
    const [scheduling, setScheduling] = useState("")
    const [outcomes, setOutcomes] = useState("")
    const [trainerCredentials, setTrainerCredentials] = useState("")

    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [showAgreements, setShowAgreements] = useState(false);

    const [bankDetails, setBankDetails] = useState<any>(null);
    const [checkingBankDetails, setCheckingBankDetails] = useState(false);

    const [country, setCountry] = useState("");
    const [state, setState] = useState("");
    const [stateList, setStateList] = useState<string[]>([]);
    const [isLoadingStates, setIsLoadingStates] = useState(false);

    const [city, setCity] = useState("");
    const [cityList, setCityList] = useState<string[]>([]);
    const [isLoadingCities, setIsLoadingCities] = useState(false);

    const countryList = CountryList();

    const supabase = createClientComponentClient()

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

    // Add this state for tracking which fields have errors
    const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({});

    // Auto-save form data to localStorage
    const formData = {
        title, desc, type, category, wya, settlement, skills, duration,
        paymenttype, accomodation, signupfee, limit, deadline, startDate,
        trainingMode, providesCertificate, teachingMethod, learningOutcomes,
        scheduling, outcomes, trainerCredentials, country, state, city
    };
    const { status: autoSaveStatus, lastSaved } = useLocalStorageAutoSave(
        `post-job-draft-${user?.id}`,
        formData,
        2000
    );

    async function fetchStates(countryName: string) {
        setIsLoadingStates(true);
        setState(""); // Reset state
        setCity(""); // Reset city
        setCityList([]); // Reset city list
        try {
            const states = await getStatesWithCache(countryName);
            setStateList(states);
        } catch (error) {
            console.error('Error fetching states:', error);
            toast.error("Failed to load states");
        } finally {
            setIsLoadingStates(false);
        }
    }

    async function fetchCities(countryName: string, stateName: string) {
        setIsLoadingCities(true);
        setCity(""); // Reset city when state changes
        try {
            const cities = await getCitiesWithCache(countryName, stateName);
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
                    provides_certificate: providesCertificate,
                    teaching_method: teachingMethod,
                    learning_outcomes: learningOutcomes,
                    scheduling: scheduling,
                    outcomes: outcomes,
                    trainer_credentials: trainerCredentials,
                })
                .select('uid')
                .single()

            if (jobError) {
                setErrorMessage("An error occurred while posting the job.");
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
                toast.success("Job posted", {
                    description: "Click here to view",
                    action: {
                        label: "View",
                        onClick: () => router.push('/recruiter/listings'),
                    },
                })
                setSuccessMessage("Job posted successfully!");
                setErrorMessage("");
                settitle("");
                setdesc("");
                settype("");
                setcategory("");
                setloc("");
                setwya("");
                setskills([]);
                setduration("");
                setSettlement("");
                setpaymenttype("");
                setsignupfee("");
                setaccomodation("");
                setHasSignupFee("");
                setdeadline("");
                setStartDate("");
                setTrainingMode("");
                setProvidesCertificate(null);
                setTeachingMethod("");
                setLearningOutcomes("");
                setScheduling("");
                setOutcomes("");
                setTrainerCredentials("");
                router.refresh();
            }
        } catch (error) {
            setErrorMessage("An error occurred while posting the job.");
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
                value: !!duration,
                message: "Please enter duration"
            },
            limit: {
                value: !!limit,
                message: "Please enter number of apprentices"
            },
            startDate: {
                value: !!startDate,
                message: "Please select start date"
            },
            trainingMode: {
                value: !!trainingMode,
                message: "Please select training mode"
            },
            providesCertificate: {
                value: providesCertificate !== null,
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
                toast.error("Please add your bank details before posting a job with signup fee", {
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
        const hasBankDetails = await checkBankDetails();
        if (hasBankDetails) {
            const { data } = await supabase
                .from('RecruiterBankDetails')
                .select('*')
                .eq('recruiter_id', props.user.id)
                .single();
            setBankDetails(data);
        } else {
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
        const supabase = createClientComponentClient();
        const { data, error } = await supabase
            .from('RecruiterBankDetails')
            .select('*')
            .eq('recruiter_id', props.user.id)
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
            <div className="flex-shrink-0 p-6 lg:p-8 border-b border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                    <div className="bg-[#14B8A6]/10 rounded-full p-3">
                        <Briefcase className="text-[#14B8A6]" size={28} />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-[#0A1F44]">Post an Apprenticeship</h1>
                </div>
                <p className="text-gray-600">Create a new apprenticeship opportunity and find talented individuals</p>
            </div>

            {/* Scrollable Content */}
            <div className='flex-1 overflow-y-auto p-6 lg:p-8'>
                <div className='mb-10'>
                    {/* General Section */}
                    <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 lg:p-8 mb-6 shadow-sm hover:shadow-md transition-shadow">
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
                                <p className="font-[550] text-lg my-1">Job Category *</p>
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


                            <div className='flex flex-col  gap-x-5'>
                                <div className="my-2 w-full">
                                    <p className="font-[550] text-lg my-1">Training Mode *</p>
                                    <div className={`flex space-x-2 text-black ${fieldErrors.trainingMode ? 'border border-red-500 rounded-lg p-1 bg-red-50' : ''
                                        }`}>
                                        <button
                                            className={`bg-gray-300 px-4 py-3 rounded-lg border placeholder:text-xs text-sm min-w-max w-full ${trainingMode === "In-Person" ? "bg-green-500 text-white" : ""}`}
                                            onClick={() => setTrainingMode("In-Person")}
                                        >
                                            In-Person
                                        </button>
                                        <button
                                            className={`bg-gray-300 px-4 py-3 rounded-lg border placeholder:text-xs text-sm w-full ${trainingMode === "Online" ? "bg-green-500 text-white" : ""}`}
                                            onClick={() => setTrainingMode("Online")}
                                        >
                                            Online
                                        </button>
                                        <button
                                            className={`bg-gray-300 px-4 py-3 rounded-lg border placeholder:text-xs text-sm w-full ${trainingMode === "Hybrid" ? "bg-green-500 text-white" : ""}`}
                                            onClick={() => setTrainingMode("Hybrid")}
                                        >
                                            Hybrid
                                        </button>
                                    </div>
                                </div>
                                <div className="my-2 w-full">
                                    <p className="font-[550] text-lg my-1">Type *</p>
                                    <div className="flex space-x-2">
                                        <button
                                            className={`bg-gray-300 px-4 py-3 rounded-lg border placeholder:text-xs text-sm w-full ${type === "Full Time" ? "bg-green-500 text-white" : ""}`}
                                            onClick={() => settype("Full Time")}
                                        >
                                            Full Time
                                        </button>
                                        <button
                                            className={`bg-gray-300 px-4 py-3 rounded-lg border placeholder:text-xs text-sm w-full ${type === "Part Time" ? "bg-green-500 text-white" : ""}`}
                                            onClick={() => settype("Part Time")}
                                        >
                                            Part Time
                                        </button>
                                    </div>
                                </div>
                            </div>


                            <div className="mt-2">
                                <p className="font-[550] text-lg my-1">Duration *</p>
                                <input value={duration} className="px-4 py-3 rounded-lg border placeholder:text-xs w-full text-xs" placeholder="Enter Job Duration" type="text" onChange={(e) => { setduration(e.target.value) }} />
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

                    {/* Deadline and Opening Section */}
                    <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 lg:p-8 mb-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-[#0A1F44]/10 rounded-full p-3">
                                <Clock className="text-[#0A1F44]" size={24} />
                            </div>
                            <h2 className="text-xl font-semibold text-[#0A1F44]">Deadline and Opening</h2>
                        </div>
                        <div className="flex flex-col gap-2 my-4">
                            <div className="mb-1">
                                <p className="font-[550] text-lg my-1">Maximum Number of Applicants? *</p>
                                <input
                                    value={limit}
                                    className="px-4 py-3 rounded-lg border placeholder:text-xs w-full text-xs"
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

                            <div className="mb-1">
                                <p className="font-[550] text-lg my-1">Application Deadline (Optional)</p>
                                <input
                                    value={deadline}
                                    className="px-4 py-3 rounded-lg border placeholder:text-xs w-full text-xs"
                                    type="date"
                                    placeholder="Select deadline date"
                                    onChange={(e) => setdeadline(e.target.value)}
                                />
                            </div>
                            <div className="my-2">
                                <p className="font-[550] text-lg my-1">What date does training start? *</p>
                                <input
                                    value={startDate}
                                    className="px-4 py-3 rounded-lg border placeholder:text-xs w-full text-xs"
                                    type="date"
                                    min={new Date().toISOString().split('T')[0]}
                                    placeholder="Select start date"
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Location Section */}
                    <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 lg:p-8 mb-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-[#14B8A6]/10 rounded-full p-3">
                                <MapPin className="text-[#14B8A6]" size={24} />
                            </div>
                            <h2 className="text-xl font-semibold text-[#0A1F44]">Location</h2>
                        </div>
                        <div className=' flex flex-col sm:flex-row gap-x-5'>
                            <div className="my-2 w-full">
                                <p className="font-[550] text-lg my-1">Country *</p>
                                <select
                                    value={country}
                                    onChange={(e) => {
                                        setCountry(e.target.value);
                                        fetchStates(e.target.value);
                                    }}
                                    className="bg-white px-4 py-3 rounded-lg border placeholder:text-xs text-xs w-full"
                                >
                                    <option value="">Select country</option>
                                    {countryList.map((countryName, index) => (
                                        <option key={index} value={countryName}>
                                            {countryName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="my-2 w-full">
                                <p className="font-[550] text-lg my-1">State *</p>
                                <select
                                    value={state}
                                    onChange={(e) => {
                                        setState(e.target.value);
                                        if (e.target.value) {
                                            fetchCities(country, e.target.value);
                                        }
                                    }}
                                    disabled={isLoadingStates || !country}
                                    className="bg-white px-4 py-3 rounded-lg border placeholder:text-xs text-xs w-full"
                                >
                                    <option value="">
                                        {isLoadingStates
                                            ? "Loading states..."
                                            : country
                                                ? "Select state"
                                                : "Select a country first"
                                        }
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
                                    className="bg-white px-4 py-3 rounded-lg border placeholder:text-xs text-xs w-full"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Compensation and Fees Section */}
                    <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 lg:p-8 mb-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-[#0A1F44]/10 rounded-full p-3">
                                <DollarSign className="text-[#0A1F44]" size={24} />
                            </div>
                            <h2 className="text-xl font-semibold text-[#0A1F44]">Compensation and Fees</h2>
                        </div>
                        <div className="flex flex-col gap-2 my-4">
                            <div className="my-2">
                                <p className="font-[550] text-lg my-1">Payment Type *</p>
                                <div className="flex space-x-2">
                                    <button
                                        className={`bg-gray-300 px-4 py-3 rounded-lg border placeholder:text-xs text-sm w-full ${paymenttype === "Unpaid" ? "bg-green-500 text-white" : ""}`}
                                        onClick={() => setpaymenttype("Unpaid")}
                                    >
                                        Unpaid
                                    </button>
                                    <button
                                        className={`bg-gray-300 px-4 py-3 rounded-lg border placeholder:text-xs text-sm w-full ${paymenttype === "Monthly" ? "bg-green-500 text-white" : ""}`}
                                        onClick={() => setpaymenttype("Monthly")}
                                    >
                                        Monthly
                                    </button>
                                    <button
                                        className={`bg-gray-300 px-4 py-3 rounded-lg border placeholder:text-xs text-sm w-full ${paymenttype === "Settlement" ? "bg-green-500 text-white" : ""}`}
                                        onClick={() => setpaymenttype("Settlement")}
                                    >
                                        Settlement
                                    </button>
                                </div>
                            </div>
                            {paymenttype === "Settlement" && (
                                <div className="mt-2">
                                    <p className="font-[550] text-lg my-1">Settlement Details</p>
                                    <input 
                                        value={settlement} 
                                        className="px-4 py-3 rounded-lg border placeholder:text-xs w-full text-sm" 
                                        placeholder="e.g. A toolbox, Complete set of equipment, $500" 
                                        type="text" 
                                        onChange={(e) => setSettlement(e.target.value)} 
                                    />
                                </div>
                            )}
                            {paymenttype === "Monthly" && (
                                <div className="mt-2">
                                    <p className="font-[550] text-lg my-1">Monthly Compensation</p>
                                    <input 
                                        value={settlement} 
                                        className="px-4 py-3 rounded-lg border placeholder:text-xs w-full text-sm" 
                                        placeholder="e.g. $200 - $300, ₦50,000 - ₦100,000" 
                                        type="text" 
                                        onChange={(e) => setSettlement(e.target.value)} 
                                    />
                                </div>
                            )}
                            <div className="my-2">
                                <p className="font-[550] text-lg my-1">Do you have a signup fee?</p>
                                <div className="flex space-x-2">
                                    <button
                                        className={`bg-gray-300 px-4 py-3 rounded-lg border placeholder:text-xs text-sm w-full ${hasSignupFee === "Yes" ? "bg-green-500 text-white" : ""}`}
                                        onClick={(e) => {
                                            setHasSignupFee("Yes")
                                            fetchBankDetails()
                                            setsignupfee(e.target.value)
                                        }
                                        }
                                    >
                                        Yes
                                    </button>
                                    <button
                                        className={`bg-gray-300 px-4 py-3 rounded-lg border placeholder:text-xs text-sm w-full ${hasSignupFee === "No" ? "bg-green-500 text-white" : ""}`}
                                        onClick={() => {
                                            setHasSignupFee("No")
                                            setsignupfee("")
                                        }}
                                    >
                                        No
                                    </button>
                                </div>

                            </div>
                        </div>
                        {hasSignupFee === "Yes" && (
                            <div className="mt-4">
                                {checkingBankDetails ? (
                                    <p className="text-xs text-gray-500">Checking bank details...</p>
                                ) : bankDetails ? (
                                    <>
                                        <div className="bg-gray-50 p-4 rounded-lg mb-4">
                                            <p className="text-sm font-medium mb-2">Your Bank Details:</p>
                                            <div className="grid grid-cols-2 gap-2 text-xs">
                                                <div>
                                                    <p className="text-gray-500">Bank Name</p>
                                                    <p className="font-medium">{bankDetails.bank_name}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500">Account Number</p>
                                                    <p className="font-medium">****{bankDetails.account_number.slice(-3)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500">Account Name</p>
                                                    <p className="font-medium">{bankDetails.account_name}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="font-[550] text-lg my-1">Signup Fee Amount *</p>
                                            <input
                                                value={signupfee}
                                                className="px-4 py-3 rounded-lg border placeholder:text-xs w-full text-xs"
                                                placeholder="Enter Signup Fee"
                                                type="number"
                                                min="0"
                                                onChange={(e) => setsignupfee(e.target.value)}
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex items-center gap-2 text-red-500">
                                        <p className="text-xs">
                                            Bank details are required for jobs with signup fees.
                                        </p>
                                        <button
                                            onClick={() => router.push('/recruiter/bank-details')}
                                            className="text-xs text-[#14B8A6] underline"
                                        >
                                            Add Bank Details
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Extra Section */}
                    <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 lg:p-8 mb-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-[#14B8A6]/10 rounded-full p-3">
                                <GraduationCap className="text-[#14B8A6]" size={24} />
                            </div>
                            <h2 className="text-xl font-semibold text-[#0A1F44]">Additional Benefits</h2>
                        </div>
                        <div className="flex flex-col gap-2 my-4">
                            <div className="my-2">
                                <p className="font-[550] text-lg my-1">Will you provide a certificate? *</p>
                                <div className="flex space-x-2">
                                    <button
                                        className={`bg-gray-300 px-4 py-3 rounded-lg border placeholder:text-xs text-sm w-full ${providesCertificate === true ? "bg-green-500 text-white" : ""}`}
                                        onClick={() => setProvidesCertificate(true)}
                                    >
                                        Yes
                                    </button>
                                    <button
                                        className={`bg-gray-300 px-4 py-3 rounded-lg border placeholder:text-xs text-sm w-full ${providesCertificate === false ? "bg-green-500 text-white" : ""}`}
                                        onClick={() => setProvidesCertificate(false)}
                                    >
                                        No
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="my-2">
                            <p className="font-[550] text-lg my-1"> Will you provide accommodation?</p>
                            <div className="flex space-x-2">
                                <button
                                    className={`bg-gray-300 px-4 py-3 rounded-lg border placeholder:text-xs text-sm w-full ${accomodation === "Yes" ? "bg-green-500 text-white" : ""}`}
                                    onClick={() => setaccomodation("Yes")}
                                >
                                    Yes
                                </button>
                                <button
                                    className={`bg-gray-300 px-4 py-3 rounded-lg border placeholder:text-xs text-sm w-full ${accomodation === "No" ? "bg-green-500 text-white" : ""}`}
                                    onClick={() => setaccomodation("No")}
                                >
                                    No
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Description & Company Info Section */}
                    <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 lg:p-8 mb-6 shadow-sm hover:shadow-md transition-shadow">
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
                    <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 lg:p-8 mb-6 shadow-sm hover:shadow-md transition-shadow">
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