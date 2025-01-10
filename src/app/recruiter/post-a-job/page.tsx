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

export default function Post(props) {
    const [title, settitle] = useState("")
    const [desc, setdesc] = useState("")
    const [type, settype] = useState("")
    const [category, setcategory] = useState("")
    const [loc, setloc] = useState("")
    const [res, setres] = useState("")
    const [wya, setwya] = useState("")
    const [extras, setextras] = useState("")
    // const [deadline, setdeadline] = useState("")
    const [minsalary, setminsalary] = useState("")
    const [maxsalary, setmaxsalary] = useState("")
    const [skills, setskills] = useState([])
    const [duration, setduration] = useState("")
    const [paymenttype, setpaymenttype] = useState("")
    const [signupfee, setsignupfee] = useState("")
    const [accomodation, setaccomodation] = useState("")
    const [hasSignupFee, setHasSignupFee] = useState("")

    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [showAgreements, setShowAgreements] = useState(false);

    const [bankDetails, setBankDetails] = useState<any>(null);
    const [checkingBankDetails, setCheckingBankDetails] = useState(false);

    const supabase = createClientComponentClient()
    const router = useRouter()

    const categories = [
        "Agriculture & Farming",
        "Building & Construction",
        "Education & Tutoring",
        "Hospitality & Lodging",
        "Electronics Repair & Sales",
        "Mechanical Services & Repairs",
        "Textiles & Tailoring",
        "Transport & Logistics",
        "Information Technology & Mobile Services",
        "Handicrafts & Manufacturing",
        "Retail & Street Vending",
        "Automotive Repair & Services",
        "Energy & Solar Solutions",
        "Media & Entertainment",
        "Food & Beverage",
        "Community & Social Services",
        "Environmental & Recycling Services",
        "Creative Arts & Craftsmanship",
        "Sports & Recreation Services",
        "Chemical & Soap Making",
        "Biotechnology & Herbal Products",
        "Mining & Quarrying",
        "Fishing & Aquaculture",
        "Beauty & Cosmetology"
    ];

    async function postJob(agreement_id: string) {
        setLoading(true);
        try {
            const { data: recruiterdata, error: recruitererror } = await supabase
                .from('Recruiters')
                .select()
                .eq('uniqueid', props.user.id)
                .single()

            const { data: job, error: jobError } = await supabase
                .from('Jobs')
                .upsert({ title, description: desc, type, category, location: loc, responsibilities: res, who_we_are: wya, minsalary: minsalary, maxsalary: maxsalary, skills, duration, company_logo: recruiterdata.logo, payment_type: paymenttype, accomodation: accomodation, signup_fee: signupfee })
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
                setres("");
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
        // Check if any required parameter is empty
        if (!title || !desc || !type || !category || !loc || !res || !wya || !skills || !duration) {
            setErrorMessage("Please fill in all required fields");
            toast.error("Please fill in all required fields");
            return;
        }

        // Validate signup fee if "Yes" is selected
        if (hasSignupFee === "Yes" && (!signupfee || signupfee === "0")) {
            setErrorMessage("Please enter a signup fee amount");
            toast.error("Please enter a signup fee amount");
            return;
        }

        // If signup fee is entered, check for bank details
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

    // Sample Data Function
    function fillSampleData() {
        settitle("Software Development Engineer");
        setdesc("We are looking for a passionate Software Engineer to design, develop and install software solutions.");
        settype("Full Time");
        setcategory("Technology");
        setloc("Lagos, Nigeria");
        setres("Design, develop, and maintain software applications.");
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
        <div className='flex flex-col border-gray-300 border-[1px]  w-full rounded-t-xl bg-white lg:pt-7 lg:px-8 pt-5 overflow-scroll '>
            
            <AgreementModal handleAgreement={handleAgreement} showAgreements={showAgreements} setShowAgreements={setShowAgreements} />
            <p onClick={() => { props.handleChangeTabIndex(3) }} className="mb-4 hover:underline cursor-pointer text-sm lg:flex items-center gap-1 hidden"><IoMdArrowRoundBack className="text-xl" />Back to job listing</p>
            <p onClick={() => { }} className="my-4 px-4 lg:hidden hover:underline cursor-pointer text-xl font-semibold flex items-center gap-4">Post a Job</p>
            <hr className="h-px lg:hidden bg-gray-200 border-0 dark:bg-gray-700 p-0"></hr>
            <div className='mb-10'>
                <div className="bg-white rounded-xl p-6 lg:mt-6">

                    <div className="flex gap-4">
                        <h1 className="text-2xl font-semibold text-[#4A2C84]">General</h1>
                        <button className="text-sm text-[#4A2C84] py-1 px-4 rounded-xl border" onClick={fillSampleData}>Sample data</button>
                    </div>

                    <div className="flex flex-col gap-2 my-4">
                        <div className="mb-1">
                            <p className="font-[550] text-lg my-1">Job Title *</p>
                            <input value={title} className="px-4 py-3 rounded-lg border placeholder:text-xs w-full text-xs" type="text" placeholder="e.g. Software Engineer" onChange={(e) => { settitle(e.target.value) }} />
                        </div>

                        <div className="my-2">
                            <p className="font-[550] text-lg my-1">Job Description *</p>
                            <textarea value={desc} rows={8} className="px-4 py-3 rounded-lg border placeholder:text-xs w-full text-xs" placeholder="Enter Job Description" onChange={(e) => { setdesc(e.target.value) }}></textarea>
                        </div>


                        <div className="my-2">
                            <p className="font-[550] text-lg my-1">Job Responsibilities *</p>
                            <textarea value={res} rows={8} className="px-4 py-3 rounded-lg border placeholder:text-xs w-full text-xs" placeholder="Enter Job Responsibilities" onChange={(e) => { setres(e.target.value) }}></textarea>
                        </div>

                        <div className="my-2">
                            <p className="font-[550] text-lg my-1">About us / Company profile *</p>
                            <textarea value={wya} rows={8} className="px-4 py-3 rounded-lg border placeholder:text-xs w-full text-xs" placeholder="Briefly introduce your company to potential job applicants. Describe your mission, values, and what sets your company apart.

Highlight why potential employees would want to join your team." onChange={(e) => { setwya(e.target.value) }}></textarea>
                        </div>
                    </div>
                    {/* <div className="my-1">
                            <p className="font-semibold text-lg my-1">Job Type *</p>
                            <input value="" className="px-4 py-3 rounded-lg border placeholder:text-xs w-full text-xs" type="text" placeholder="Select Job Type" onChange={(e) => { settype(e.target.value) }} />
                        </div> */}

                    <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700 p-0"></hr>

                    <h1 className="text-2xl font-semibold text-[#4A2C84]">Information</h1>


                    <div className="grid gap-y-2 lg:grid-cols-2 items-center gap-x-4">
                        <div className="my-2">
                            <p className="font-[550] text-lg my-1">Job Category *</p>
                            <select value={category} onChange={(e) => {
                                setcategory(e.target.value)
                            }} className="bg-white px-4 py-3 rounded-lg border placeholder:text-xs text-xs w-full">
                                <option>Select category</option>
                                {
                                    categories.map((category) => {
                                        return <option key={category} value={category}>{category}</option>
                                    })
                                }
                            </select>
                        </div>
                        <div className="my-2">
                            <p className="font-[550] text-lg my-1">Do you provide accomodation?</p>
                            <select value={accomodation} onChange={(e) => {
                                setaccomodation(e.target.value)
                            }} className="bg-white px-4 py-3 rounded-lg border placeholder:text-xs text-xs w-full">
                                <option>Select</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                        </div>
                        <div className="my-2">
                            <p className="font-[550] text-lg my-1">Type *</p>
                            <select value={type} onChange={(e) => {
                                settype(e.target.value)
                            }} className="bg-white px-4 py-3 rounded-lg border placeholder:text-xs text-xs w-full">
                                <option>Select type</option>
                                <option value="Full Time">Full Time</option>
                                <option value="Part Time">Part Time</option>
                            </select>
                        </div>
                        <div className="my-2">
                            <p className="font-[550] text-lg my-1">Job Location *</p>
                            <input value={loc} className="px-4 py-3 rounded-lg border placeholder:text-xs w-full text-xs" placeholder="Enter Job Location" type="text" onChange={(e) => { setloc(e.target.value) }} />
                        </div>
                        <div className="mt-2">
                            <p className="font-[550] text-lg my-1">Duration *</p>
                            <input value={duration} className="px-4 py-3 rounded-lg border placeholder:text-xs w-full text-xs" placeholder="Enter Job Duration" type="text" onChange={(e) => { setduration(e.target.value) }} />
                        </div>
                        <div className="my-2">
                            <p className="font-[550] text-lg my-1">Payment Type *</p>
                            <select value={paymenttype} onChange={(e) => {
                                setpaymenttype(e.target.value)
                            }} className="bg-white px-4 py-3 rounded-lg border placeholder:text-xs text-xs w-full">
                                <option>Select payment type</option>
                                <option value="Settlement">Settlement</option>
                                <option value="Monthly">Monthly</option>
                                <option value="Unpaid">Unpaid</option>
                            </select>
                        </div>
                        {(paymenttype == "Settlement" || paymenttype == "Monthly") ?
                            <>
                                <div className="mt-2">
                                    <p className="font-[550] text-lg my-1">Minimum Salary {"(optional)"}</p>
                                    <input value={minsalary} className="px-4 py-3 rounded-lg border placeholder:text-xs w-full text-xs" placeholder="Enter Minimum Salary" type="number" onChange={(e) => { setminsalary(e.target.value) }} />
                                </div>
                                <div className="mt-2">
                                    <p className="font-[550] text-lg my-1">Maximum Salary {"(optional)"}</p>
                                    <input value={maxsalary} className="px-4 py-3 rounded-lg border placeholder:text-xs w-full text-xs" placeholder="Enter Maximum Salary" type="number" onChange={(e) => { setmaxsalary(e.target.value) }} />
                                </div>
                            </>
                            : ""}
                        <div className="my-2">
                            <p className="font-[550] text-lg my-1">Do you have a signup fee?</p>
                            <select
                                value={hasSignupFee}
                                onChange={async (e) => {
                                    const value = e.target.value;
                                    setHasSignupFee(value);

                                    if (value === "Yes") {
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
                                    } else {
                                        setBankDetails(null);
                                        setsignupfee("");
                                        setErrorMessage("");
                                    }
                                }}
                                className="bg-white px-4 py-3 rounded-lg border placeholder:text-xs text-xs w-full"
                            >
                                <option value="">Select</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                        </div>
                        <div className="mt-2">
                            <p className="font-[550] text-lg my-1">Required Skills*</p>
                            <TagsInput
                                value={skills}
                                onChange={setskills}
                                name="Skills"
                                placeHolder="Enter Required Skills"
                                classNames={{
                                    input: '!text-xs bg-white py-1 rounded-lg !border placeholder:text-xs text-xs w-full',
                                    tag: 'text-xs'
                                }}
                            />
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
                    className={`border rounded-full py-3  mx-4 lg:mx-0 text-sm font-semibold px-16 lg:my-4 mb-7 text-white bg-[#4A2C84] ${loading ? "cursor-not-allowed" : ""}`}
                    onClick={handleSubmit}
                    disabled={loading}
                    style={{ pointerEvents: loading ? "none" : "auto" }}>
                    {loading ? "Posting..." : "Post Apprenticeship"}
                </button>
                {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}
            </div>
        </div>
    )
}