import StickyHeadTable from "@/components/General/Table";
import { DialogDemo } from "@/components/Modal/Modal";
import { useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { MoonLoader } from "react-spinners";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import AcceptedTable from "@/components/General/AcceptedTable";
import RejectedTable from "@/components/General/RejectedTable";
import { useRouter } from "next/navigation";
import MobileApplicationCard from "./MobileApplicationCard";
import { toast } from "sonner";
import { BsBriefcase } from "react-icons/bs";
import { IoLocationOutline } from "react-icons/io5";
import { HiOutlineCurrencyRupee } from "react-icons/hi";

export default function Applications(props: any) {
    const [seekerChatId, setseekerChatId] = useState<string | null>(null);
    const supabase = createClientComponentClient();
    const [applications, setapplications] = useState([])
    const router = useRouter()

    const jobDetails = props.jobDetails;
    const acceptedApplications = props.applications?.filter((app: any) => app.status === 'accepted') || [];
    const rejectedApplications = props.applications?.filter((app: any) => app.status === 'rejected') || [];

    async function updateStatus(status: string, id: string) {
        const { data, error } = await supabase
            .from('Applicants')
            .update({ status: status })
            .eq('unique_id', id);

        if (error) {
            console.error('Error updating status:', error);
        } else {
            console.log('Status updated:', data);
            toast.success(status)
        }
        props.ApplicationsForSelectedJob(jobDetails.uid);
        router.refresh()
    }

    return (
        <div className="px-2 sm:px-4 my-4 lg:my-6 lg:m-0">
            <p onClick={() => { props.setshowJobApplications(false); }}
                className="mb-3 lg:mb-4 hover:underline cursor-pointer text-sm flex items-center gap-1 mx-2 sm:mx-4">
                <IoMdArrowRoundBack className="text-xl" />Back to Job listings
            </p>

            {/* Job Details Header - responsive adjustments */}
            <div className="bg-white rounded-lg lg:rounded-xl p-3 lg:p-4 mb-4 lg:mb-6 border border-gray-100 mx-2 sm:mx-4">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 sm:gap-0">
                    <div>
                        <h1 className="text-base lg:text-lg font-medium text-gray-900 mb-1">
                            {jobDetails?.title}
                        </h1>
                        <div className="flex flex-wrap gap-2 text-xs sm:text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                                <BsBriefcase className="text-sm" />
                                {jobDetails?.type}
                            </div>
                            <div className="flex items-center gap-1">
                                <IoLocationOutline className="text-sm" />
                                {jobDetails?.location}
                            </div>
                            {jobDetails?.salary && (
                                <div className="flex items-center gap-1">
                                    <HiOutlineCurrencyRupee className="text-sm" />
                                    {jobDetails.salary}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="bg-[#E9EBFD] text-[#4A2C84] px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium w-fit">
                        {props.applications?.length} Applications
                    </div>
                </div>
            </div>

            {/* Existing Tabs Structure */}
            <Tabs defaultValue="all" className="lg:hidden">
                <TabsList className="bg-white flex justify-start max-h-none py-8 ">
                    <TabsTrigger value="all" className="mr-2 px-1 text-xs text-left data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 border-[#4A2C84]">
                        All
                        <span className="px-2 m-1 bg-[#4A2C84] text-white rounded-full text-[.55rem]">{props.applications?.length}</span>
                    </TabsTrigger>
                    <TabsTrigger value="accepted" className="mx-2 px-1 text-xs data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 border-[#4A2C84]">
                        Accepted
                        <span className="px-2 m-1 bg-[#4A2C84] text-white rounded-full text-[.55rem]">{acceptedApplications.length}</span>
                    </TabsTrigger>
                    <TabsTrigger value="rejected" className="mx-2 px-1 text-xs data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 border-[#4A2C84]">
                        Rejected
                        <span className="px-2 m-1 bg-[#4A2C84] text-white rounded-full text-[.55rem]">{rejectedApplications.length}</span>
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="">
                    {props.loading ? (
                        <div className="flex justify-center items-center h-[300px]">
                            <MoonLoader color="#4A2C84" />
                        </div>
                    ) : props.applications?.length > 0 ? (
                        <MobileApplicationCard type="All" status="" updateStatus={updateStatus} applications={props.applications} fetchApplicantDetails={props.fetchApplicantDetails} id={props.user.id} />
                    ) : (
                        <div className="flex justify-center items-center h-[200px]">
                            No applications found!
                        </div>
                    )}
                </TabsContent>
                <TabsContent value="accepted">
                    {props.loading ? (
                        <div className="flex justify-center items-center h-[300px]">
                            <MoonLoader color="#4A2C84" />
                        </div>
                    ) : acceptedApplications.length > 0 ? (
                        <MobileApplicationCard type="Accepted" status="paid" updateStatus={updateStatus} applications={acceptedApplications} fetchApplicantDetails={props.fetchApplicantDetails} id={props.user.id} />
                    ) : (
                        <div className="flex justify-center items-center h-[200px]">
                            No accepted applications found!
                        </div>
                    )}
                </TabsContent>
                <TabsContent value="rejected">
                    {props.loading ? (
                        <div className="flex justify-center items-center h-[300px]">
                            <MoonLoader color="#4A2C84" />
                        </div>
                    ) : rejectedApplications.length > 0 ? (
                        <MobileApplicationCard type="Rejected" status="unpaid" updateStatus={updateStatus} applications={rejectedApplications} fetchApplicantDetails={props.fetchApplicantDetails} id={props.user.id} />
                    ) : (
                        <div className="flex justify-center items-center h-[200px]">
                            No rejected applications found!
                        </div>
                    )}
                </TabsContent>
            </Tabs>


            <div className="rounded-xl pt-0 hidden lg:block">
                <Tabs defaultValue="all" className="mx-4">
                    <TabsList className="bg-white flex justify-start w-full max-h-none py-8 px-4">
                        <TabsTrigger value="all" className="mx-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 border-[#4A2C84]">
                            All applicants
                            <span className="px-2 m-1 bg-[#4A2C84] text-white rounded-full text-[.60rem]">{props.applications?.length}</span>
                        </TabsTrigger>
                        <TabsTrigger value="accepted" className="mx-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 border-[#4A2C84]">
                            Accepted
                            <span className="px-2 m-1 bg-[#4A2C84] text-white rounded-full text-[.60rem]">{acceptedApplications.length}</span>
                        </TabsTrigger>
                        <TabsTrigger value="rejected" className="mx-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 border-[#4A2C84]">
                            Rejected
                            <span className="px-2 m-1 bg-[#4A2C84] text-white rounded-full text-[.60rem]">{rejectedApplications.length}</span>
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="all" className="">
                        {props.loading ? (
                            <div className="flex justify-center items-center h-[300px]">
                                <MoonLoader color="#4A2C84" />
                            </div>
                        ) : props.applications?.length > 0 ? (
                            <StickyHeadTable updateStatus={updateStatus} user={props.user} seekerChatId={setseekerChatId} fetchApplicantDetails={props.fetchApplicantDetails} applications={props.applications} />
                        ) : (
                            <div className="flex justify-center items-center h-[200px]">
                                No applications found!
                            </div>
                        )}
                    </TabsContent>
                    <TabsContent value="accepted">
                        {props.loading ? (
                            <div className="flex justify-center items-center h-[300px]">
                                <MoonLoader color="#4A2C84" />
                            </div>
                        ) : acceptedApplications.length > 0 ? (
                            <AcceptedTable updateStatus={updateStatus} user={props.user} seekerChatId={setseekerChatId} fetchApplicantDetails={props.fetchApplicantDetails} applications={acceptedApplications} />
                        ) : (
                            <div className="flex justify-center items-center h-[200px]">
                                No accepted applications found!
                            </div>
                        )}
                    </TabsContent>
                    <TabsContent value="rejected">
                        {props.loading ? (
                            <div className="flex justify-center items-center h-[300px]">
                                <MoonLoader color="#4A2C84" />
                            </div>
                        ) : rejectedApplications.length > 0 ? (
                            <RejectedTable updateStatus={updateStatus} user={props.user} seekerChatId={setseekerChatId} fetchApplicantDetails={props.fetchApplicantDetails} applications={rejectedApplications} />
                        ) : (
                            <div className="flex justify-center items-center h-[200px]">
                                No rejected applications found!
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
