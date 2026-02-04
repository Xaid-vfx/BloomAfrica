import StickyHeadTable from "@/components/seeker/tables/Table";
import { useState, useRef, useEffect } from "react";
import { MoonLoader } from "react-spinners";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import MobileApplicationCard from "./MobileApplicationCard";
import { toast } from "sonner";
import { deleteJob } from "@/lib/jobs/jobUtils";
import { MoreVertical, Trash2, AlertTriangle, ArrowLeft, MapPin, Briefcase, Users, Send } from "lucide-react";

export default function Applications(props: any) {
    const [seekerChatId, setseekerChatId] = useState<string | null>(null);
    const supabase = createClientComponentClient();
    const router = useRouter()
    const [showMenu, setShowMenu] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showBroadcastModal, setShowBroadcastModal] = useState(false);
    const [broadcastMessage, setBroadcastMessage] = useState('');
    const [isSendingBroadcast, setIsSendingBroadcast] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const jobDetails = props.jobDetails;

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    async function updateStatus(status: string, id: string) {
        const { data, error } = await supabase
            .from('Applicants')
            .update({ status: status })
            .eq('unique_id', id);

        if (error) {
            console.error('Error updating status:', error);
        } else {
            toast.success(status)
        }
        props.ApplicationsForSelectedJob(jobDetails.uid);
        router.refresh()
    }

    async function handleDeleteJob() {
        setIsDeleting(true);
        try {
            await deleteJob(jobDetails.uid);
            props.setshowJobApplications(false);
            toast.success("Listing deleted successfully");
        } catch (error) {
            console.error('Error deleting job:', error);
            toast.error("Failed to delete listing");
        }
        setIsDeleting(false);
        setShowDeleteConfirm(false);
    }

    async function handleBroadcastMessage() {
        if (!broadcastMessage.trim() || !props.applications?.length) return;

        setIsSendingBroadcast(true);
        let successCount = 0;

        try {
            for (const applicant of props.applications) {
                try {
                    // Check if any conversation exists between this seeker and recruiter
                    const { data: existingConvo, error: queryError } = await supabase
                        .from('conversation_participants')
                        .select('conversation_id')
                        .eq('seeker', applicant.seeker_id)
                        .eq('recruiter', props.user.id)
                        .maybeSingle();

                    if (queryError) {
                        console.error('Error querying conversation:', queryError);
                        continue;
                    }

                    let conversationId;

                    if (existingConvo) {
                        conversationId = existingConvo.conversation_id;
                    } else {
                        // Create new conversation
                        const { data: newConvo, error: convoError } = await supabase
                            .from('conversations')
                            .insert([{ last_message: broadcastMessage }])
                            .select('id')
                            .single();

                        if (convoError) {
                            console.error('Error creating conversation:', convoError);
                            continue;
                        }

                        if (newConvo) {
                            conversationId = newConvo.id;

                            // Add participants with job info
                            const { error: participantError } = await supabase
                                .from('conversation_participants')
                                .insert([{
                                    seeker: applicant.seeker_id,
                                    recruiter: props.user.id,
                                    conversation_id: conversationId,
                                    job_id: jobDetails.uid,
                                    job_title: jobDetails.title
                                }]);

                            if (participantError) {
                                console.error('Error adding participants:', participantError);
                                continue;
                            }
                        }
                    }

                    if (conversationId) {
                        // Send the message
                        const { data: messageData, error: messageError } = await supabase
                            .from('messages')
                            .insert([{
                                text: broadcastMessage,
                                sender_id: props.user.id,
                                conversation_id: conversationId,
                                receiver_id: applicant.seeker_id
                            }])
                            .select();

                        console.log('Message insert result:', { messageData, messageError, conversationId });

                        if (messageError) {
                            console.error('Error sending message:', messageError);
                            continue;
                        }

                        // Update last message and timestamp
                        const { data: updateData, error: updateError } = await supabase
                            .from('conversations')
                            .update({
                                last_message: broadcastMessage,
                                last_message_timestamp: new Date().toISOString()
                            })
                            .eq('id', conversationId)
                            .select();

                        console.log('Conversation update result:', { updateData, updateError, conversationId });

                        if (updateError) {
                            console.error('Error updating conversation:', updateError);
                        }

                        successCount++;
                    }
                } catch (err) {
                    console.error('Error processing applicant:', applicant.seeker_id, err);
                }
            }

            if (successCount > 0) {
                toast.success(`Message sent to ${successCount} applicant(s)`);
                setBroadcastMessage('');
                setShowBroadcastModal(false);
            } else {
                toast.error("Failed to send messages");
            }
        } catch (error) {
            console.error('Error sending broadcast:', error);
            toast.error("Failed to send message to all applicants");
        }
        setIsSendingBroadcast(false);
    }

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex-shrink-0 px-4 py-4 lg:px-6 lg:py-5 border-b border-gray-100">
                <button
                    onClick={() => props.setshowJobApplications(false)}
                    className="flex items-center gap-2 text-[#14B8A6] hover:text-[#0D9488] font-medium text-sm mb-4 transition-colors"
                >
                    <ArrowLeft size={18} />
                    Back to Apprenticeships
                </button>

                {/* Job Card */}
                <div className="bg-gradient-to-r from-[#0A1F44] to-[#1a3a6e] rounded-xl p-4 lg:p-5 text-white">
                    {/* Title and Actions Row */}
                    <div className="flex justify-between items-center mb-3">
                        <h1 className="text-lg lg:text-xl font-semibold truncate flex-1 min-w-0 mr-3">
                            {jobDetails?.title}
                        </h1>
                        <div className="flex items-center gap-2 flex-shrink-0">
                            {props.applications?.length > 0 && (
                                <button
                                    onClick={() => setShowBroadcastModal(true)}
                                    className="px-3 py-1.5 text-xs sm:text-sm font-medium text-white bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                                >
                                    Message All
                                </button>
                            )}
                            <div className="relative" ref={menuRef}>
                                <button
                                    onClick={() => setShowMenu(!showMenu)}
                                    className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    <MoreVertical size={20} />
                                </button>
                            {showMenu && (
                                <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-50 min-w-[160px]">
                                    <button
                                        onClick={() => {
                                            setShowMenu(false);
                                            setShowDeleteConfirm(true);
                                        }}
                                        className="w-full flex items-center gap-2 px-4 py-2.5 text-red-600 hover:bg-red-50 text-sm font-medium transition-colors"
                                    >
                                        <Trash2 size={16} />
                                        Delete Listing
                                    </button>
                                </div>
                            )}
                            </div>
                        </div>
                    </div>

                    {/* Job Details Row */}
                    <div className="flex flex-wrap gap-3 text-sm text-white/80">
                        {jobDetails?.type && (
                            <div className="flex items-center gap-1.5">
                                <Briefcase size={14} />
                                {jobDetails.type}
                            </div>
                        )}
                        {jobDetails?.location && (
                            <div className="flex items-center gap-1.5">
                                <MapPin size={14} />
                                {jobDetails.location}
                            </div>
                        )}
                        <div className="flex items-center gap-1.5">
                            <Users size={14} />
                            {props.applications?.length || 0} applicants
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
                {props.loading ? (
                    <div className="flex justify-center items-center h-[300px]">
                        <MoonLoader color="#14B8A6" size={40} />
                    </div>
                ) : props.applications?.length > 0 ? (
                    <>
                        {/* Mobile View */}
                        <div className="lg:hidden p-4">
                            <MobileApplicationCard
                                type="All"
                                status=""
                                updateStatus={updateStatus}
                                applications={props.applications}
                                fetchApplicantDetails={props.fetchApplicantDetails}
                                id={props.user.id}
                            />
                        </div>

                        {/* Desktop View */}
                        <div className="hidden lg:block p-6">
                            <StickyHeadTable
                                updateStatus={updateStatus}
                                user={props.user}
                                seekerChatId={setseekerChatId}
                                fetchApplicantDetails={props.fetchApplicantDetails}
                                applications={props.applications}
                            />
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-[300px] text-center px-4">
                        <div className="bg-gray-100 rounded-full p-4 mb-4">
                            <Users className="text-gray-400" size={32} />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">No applications yet</h3>
                        <p className="text-gray-500 text-sm">
                            When apprentices apply to this listing, they'll appear here.
                        </p>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => !isDeleting && setShowDeleteConfirm(false)}
                    />
                    <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-red-100 rounded-full p-3">
                                <AlertTriangle className="text-red-600" size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Delete Apprenticeship</h3>
                                <p className="text-sm text-gray-500">This action cannot be undone</p>
                            </div>
                        </div>
                        <p className="text-gray-700 mb-6">
                            Are you sure you want to delete <span className="font-semibold">"{jobDetails?.title}"</span>? All applications will also be removed.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors"
                                disabled={isDeleting}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteJob}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors flex items-center gap-2"
                                disabled={isDeleting}
                            >
                                {isDeleting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <Trash2 size={16} />
                                        Delete
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Broadcast Message Modal */}
            {showBroadcastModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => !isSendingBroadcast && setShowBroadcastModal(false)}
                    />
                    <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4">
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Message All Applicants</h3>
                            <p className="text-sm text-gray-500">
                                Send a message to all {props.applications?.length} applicant(s) for this listing
                            </p>
                        </div>
                        <textarea
                            value={broadcastMessage}
                            onChange={(e) => setBroadcastMessage(e.target.value)}
                            className="w-full text-sm rounded-xl p-4 border border-gray-200 outline-none focus:border-[#14B8A6] focus:ring-1 focus:ring-[#14B8A6] transition-colors resize-none mb-4"
                            rows={5}
                            placeholder="Write your message..."
                            disabled={isSendingBroadcast}
                        />
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setShowBroadcastModal(false)}
                                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors"
                                disabled={isSendingBroadcast}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleBroadcastMessage}
                                className="px-4 py-2 bg-[#0A1F44] hover:bg-[#081832] text-white rounded-xl font-medium transition-colors flex items-center gap-2"
                                disabled={isSendingBroadcast || !broadcastMessage.trim()}
                            >
                                {isSendingBroadcast ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send size={16} />
                                        Send to All
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
