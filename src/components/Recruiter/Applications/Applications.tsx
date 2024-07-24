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

export default function Applications(props: any) {
    const [seekerChatId, setseekerChatId] = useState<string | null>(null);
    const supabase = createClientComponentClient();
    const [applications, setapplications] = useState([])
    const router = useRouter()

    async function updateStatus(status: string, id: string) {
        const { data, error } = await supabase
            .from('Applicants')
            .update({ status: status })
            .eq('unique_id', id);

        if (error) {
            console.error('Error updating status:', error);
        } else {
            console.log('Status updated:', data);
        }
        props.ApplicationsForSelectedJob(props.applications[0].job_id);
        router.refresh()
    }

    const acceptedApplications = props.applications?.filter((app: any) => app.status === 'accepted') || [];
    const rejectedApplications = props.applications?.filter((app: any) => app.status === 'rejected') || [];

    return (
        <div className="px-4 my-6 lg:m-0">
            <p onClick={() => { props.setshowJobApplications(false); }} className="mb-4 hover:underline cursor-pointer text-sm flex items-center gap-1">
                <IoMdArrowRoundBack className="text-xl" />Back to Job listings
            </p>
            <p className="lg:hidden text-lg font-semibold">All Applicant</p>
            <div className="lg:hidden my-4 flex flex-col gap-4">
                {props.applications && props.applications.map((app: any) => {
                    return (
                        <div className="border rounded-md px-5 py-4 bg-white" key={app.seeker_id}>
                            <div className="">
                                <p className="font-semibold ">{app?.name}</p>
                                <div className="text-sm my-1 text-[#4A2C84] flex item gap-1">Product Designer</div>
                                <div className="text-sm text-[#7C8493] flex item gap-1">Yaba, Lagos</div>
                            </div>
                            <hr className="h-px my-3 bg-gray-200 border-0 dark:bg-gray-700 p-0"></hr>
                            <div className="text-[#7C8493] text-sm">Date Applied</div>
                            <div>{app.created_at.substring(0, app.created_at.indexOf('T'))}</div>
                            <hr className="h-px my-3 bg-gray-200 border-0 dark:bg-gray-700 p-0"></hr>
                            <div className="flex gap-2">
                                <button onClick={() => { props.fetchApplicantDetails(app.seeker_id); }} className="text-sm text-white px-4 rounded-full py-2 bg-[#4A2C84]">View Application</button>
                                <DialogDemo seeker_id={app.seeker_id} name={app.name} user_id={props.user.id} />
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="rounded-xl pt-6 hidden lg:block">
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
