'use client'
import TextInput from "@/components/Input/Text";
import { AgreementModal } from "@/components/Modal/AgreementModal";
import Header from "@/components/Recruiter/Header/Header";
import Sidebar from "@/components/Recruiter/Sidebar/Sidebar";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import useDeviceDetection from "@/hooks/useDeviceDetection";
import getIP from "@/lib/getIP/getIP";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { DocumentReference } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { IoMdArrowRoundBack } from "react-icons/io";
import { TagsInput } from "react-tag-input-component";
import { toast } from "sonner";
import UAParser from "ua-parser-js";
import CountryList from "@/lib/CountryList/CountryList";
import { getStatesWithCache } from "@/lib/StateList/StateList";
import { getCitiesWithCache } from "@/lib/CityList/CityList";

export default function Post(props) {
    console.log(props);

    const [title, settitle] = useState("")
    const [desc, setdesc] = useState("")
    const [type, settype] = useState("")
    const [category, setcategory] = useState("")
    const [loc, setloc] = useState("")
    const [wya, setwya] = useState("")
    const [extras, setextras] = useState("")
    const [limit, setlimit] = useState("")
    const [deadline, setdeadline] = useState("")
    const [minsalary, setminsalary] = useState("")
    const [maxsalary, setmaxsalary] = useState("")
    const [skills, setskills] = useState([])
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
    const router = useRouter()

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
                .eq('uniqueid', props.user.id)
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
                    minsalary: minsalary,
                    maxsalary: maxsalary,
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
                        onClick: () => props.handleChangeTabIndex(3),
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
                setminsalary("");
                setmaxsalary("");
                setextras("");
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
                value: !!skills && skills.length > 0,
                message: "Please enter at least one required skill"
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
                        onClick: () => props.handleChangeTabIndex(6),
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
        setminsalary("100000");
        setmaxsalary("200000");
        setextras("Remote work available.");
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
        <div className="lg:py-8 lg:px-8 lg:bg-[#F5F5F5] h-[95%] w-full">
            <button
                onClick={() => props.handleChangeTabIndex(0)}
                className="lg:hidden flex items-center gap-2 text-[#4A2C84] hover:underline px-4 mb-6"
            >
                <IoMdArrowRoundBack className="text-xl" />
                <span>Back to Dashboard</span>
            </button>

            <div className="flex flex-col border-gray-300 border-[1px] h-full w-full rounded-xl bg-white p-5 lg:p-8 overflow-scroll">
                <AgreementModal handleAgreement={handleAgreement} type={1} showAgreements={showAgreements} setShowAgreements={setShowAgreements} />
                <p onClick={() => { props.handleChangeTabIndex(3) }} className="mb-4 hover:underline cursor-pointer text-sm lg:flex items-center gap-1 hidden"><IoMdArrowRoundBack className="text-xl" />Back to your Apprenticeships</p>
                <p onClick={() => { }} className="my-4 px-4 lg:hidden hover:underline cursor-pointer text-xl font-semibold flex items-center gap-4">Post an Apprenticeship</p>
                <hr className="h-px lg:hidden bg-gray-200 border-0 dark:bg-gray-700 p-0"></hr>
                <div className='mb-10'>

                    <div className="bg-white rounded-xl p-6 lg:mt-6">

                        <div className="flex gap-4">
                            <h1 className="text-2xl font-semibold text-[#4A2C84]">General</h1>
                            {/* <button className="text-sm text-[#4A2C84] py-1 px-4 rounded-xl border" onClick={fillSampleData}>Sample data</button> */}
                        </div>
                        <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700 p-0"></hr>

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
                            <div className="mt-2">
                                <p className="font-[550] text-lg my-1">Required Skills*</p>
                                <TagsInput
                                    value={skills}
                                    onChange={setskills}
                                    name="Skills"
                                    placeHolder="Enter Required Skills"
                                    classNames={{
                                        input: `!text-xs bg-white py-1 rounded-lg !border placeholder:text-xs text-xs w-full ${fieldErrors.skills ? '!border-red-500 !bg-red-50' : ''
                                            }`,
                                        tag: 'text-xs'
                                    }}
                                />
                            </div>
                        </div>


                        <div className="flex gap-4 mt-10 sm:mt-16">
                            <h1 className="text-2xl font-semibold text-[#4A2C84]">Deadline and Opening</h1>
                        </div>
                        <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700 p-0"></hr>
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


                        <div className="flex gap-4 mt-10 sm:mt-16">
                            <h1 className="text-2xl font-semibold text-[#4A2C84]">Location</h1>
                        </div>
                        <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700 p-0"></hr>
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


                        <div className="flex gap-4 mt-10 sm:mt-16">
                            <h1 className="text-2xl font-semibold text-[#4A2C84]">Compensation and Fees</h1>
                        </div>
                        <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700 p-0"></hr>
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
                            {(paymenttype == "Settlement" || paymenttype == "Monthly") ?
                                <>
                                    <div className="mt-2">
                                        <p className="font-[550] text-lg my-1">Minimum Salary {"(optional)"}</p>
                                        <input value={minsalary} className="px-4 py-3 rounded-lg border placeholder:text-xs w-full text-sm" placeholder="Enter Minimum Salary" type="number" onChange={(e) => { setminsalary(e.target.value) }} />
                                    </div>
                                    <div className="mt-2">
                                        <p className="font-[550] text-lg my-1">Maximum Salary {"(optional)"}</p>
                                        <input value={maxsalary} className="px-4 py-3 rounded-lg border placeholder:text-xs w-full text-sm" placeholder="Enter Maximum Salary" type="number" onChange={(e) => { setmaxsalary(e.target.value) }} />
                                    </div>
                                </>
                                : ""}
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
                                            onClick={() => props.handleChangeTabIndex(6)}
                                            className="text-xs text-[#4A2C84] underline"
                                        >
                                            Add Bank Details
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}



                        <div className="flex gap-4 mt-10 sm:mt-16">
                            <h1 className="text-2xl font-semibold text-[#4A2C84]">Extra</h1>
                        </div>
                        <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700 p-0"></hr>
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

                        <div className="flex gap-4 mt-10 sm:mt-16">
                            <h1 className="text-2xl font-semibold text-[#4A2C84]">Description & Company Info</h1>
                        </div>
                        <hr className="h-px sm:my-4 bg-gray-200 border-0 dark:bg-gray-700 p-0"></hr>
                        <div className="flex flex-col gap-2 my-4">
                            <div className="my-2">
                                <div className="flex justify-between items-center">
                                    <p className="font-[550] text-lg my-1">Description *</p>
                                    <span className="text-xs text-gray-500">{desc.length}</span>
                                </div>
                                <textarea
                                    value={desc}
                                    rows={8}
                                    className={`px-4 py-3 rounded-lg border placeholder:text-xs w-full text-xs ${fieldErrors.description ? 'border-red-500 bg-red-50' : ''}`}
                                    placeholder="Provide a general but captivating description of what this training is about."
                                    onChange={(e) => { setdesc(e.target.value) }}
                                ></textarea>
                                {desc.length < 300 && (
                                    <p className="text-xs mt-1 text-red-500">Minimum 300 characters</p>
                                )}
                            </div>

                            <div className="my-2">
                                <div className="flex justify-between items-center">
                                    <p className="font-[550] text-lg my-1">About us / Company profile *</p>
                                    <span className="text-xs text-gray-500">{wya.length}</span>
                                </div>
                                <textarea
                                    value={wya}
                                    rows={8}
                                    className={`px-4 py-3 rounded-lg border placeholder:text-xs w-full text-xs ${fieldErrors.whoWeAre ? 'border-red-500 bg-red-50' : ''}`}
                                    placeholder="Briefly introduce your company to potential applicants. Describe your mission, values, and what sets your company apart. Highlight why potential employees would want to join your team."
                                    onChange={(e) => { setwya(e.target.value) }}
                                ></textarea>
                                {wya.length < 300 && (
                                    <p className="text-xs mt-1 text-red-500">Minimum 300 characters</p>
                                )}
                            </div>
                        </div>


                        <div className="flex gap-4 mt-10 sm:mt-16">
                            <h1 className="text-2xl font-semibold text-[#4A2C84]">Training Details</h1>
                        </div>
                        <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700 p-0"></hr>
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
                    {errorMessage && (
                        <div className="text-red-500 text-sm mt-4">
                            {errorMessage}
                            {errorMessage.includes("bank details") && (
                                <button
                                    onClick={() => props.handleChangeTabIndex(6)}
                                    className="text-[#4A2C84] ml-2 underline"
                                >
                                    Add Bank Details
                                </button>
                            )}
                        </div>
                    )}
                    <button
                        type="submit"
                        className={`border rounded-2xl py-3  mx-4 lg:mx-0 text-sm font-semibold px-16 lg:my-4 mb-7 text-white bg-[#4A2C84] ${loading ? "cursor-not-allowed" : ""}`}
                        onClick={handleSubmit}
                        disabled={loading}
                        style={{ pointerEvents: loading ? "none" : "auto" }}>
                        {loading ? "Posting..." : "Post Apprenticeship"}
                    </button>
                    {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}
                </div>
            </div>
        </div>
    )
}