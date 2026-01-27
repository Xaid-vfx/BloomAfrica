'use client'
import SavedTable from "@/components/seeker/tables/SavedTable";
import MobileCard from "@/components/Jobs/MobileCard/MobileCard";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner"
import { Bookmark, Heart, Search } from "lucide-react"

export default function Saved(props) {

    const router = useRouter()
    console.log(props.savedjobs);

    async function deleteJob(id: string) {
        console.log(id);
        const job = props.savedjobs.find((obj: any) => obj.id === id);
        console.log(job.uid);
        const supabase = createClientComponentClient()
        const { data, error } = await supabase
            .from('Saved')
            .delete()
            .eq('job_id', job.uid)


        console.log(data);
        console.log(error);
        if (error) {
            console.log(error);
        }
        else {
            toast.success("Removed from saved!")
            router.refresh()
        }

    }

    return (
        <div className="relative min-h-screen">
            {/* Decorative Blobs */}
            <svg viewBox="0 0 500 500" className="absolute top-0 right-0 w-[400px] h-[400px] opacity-[0.04] pointer-events-none -z-10" style={{ transform: 'translate(30%, -20%)' }}>
                <path fill="#14B8A6" d="M432.7,219.4c-15.4,59.7-61.3,105.6-121,121c-59.7,15.4-121.9-5.6-164.1-55.3c-42.2-49.7-56.6-117.7-37.7-179.2C129,44.4,175,2.5,231.2,0.2c56.2-2.3,114.8,35.6,144.8,93.8C406,152.2,448.1,159.7,432.7,219.4z"/>
            </svg>
            <svg viewBox="0 0 400 400" className="absolute bottom-0 left-0 w-[350px] h-[350px] opacity-[0.05] pointer-events-none -z-10" style={{ transform: 'translate(-25%, 25%)' }}>
                <path fill="#0A1F44" d="M340.5,175.5c-12.3,47.8-49,84.5-96.8,96.8c-47.8,12.3-97.5-4.5-131.3-44.2c-33.8-39.8-45.3-94.2-30.2-143.4c15.1-49.2,51.2-84.5,94.2-86.2c43-1.8,91.8,28.5,115.8,75C316.2,121,352.8,127.7,340.5,175.5z"/>
            </svg>

            {/* Header Section */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                    <div className="bg-[#14B8A6]/10 rounded-full p-3">
                        <Bookmark className="text-[#14B8A6]" size={28} />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-[#0A1F44]">Saved Apprenticeships</h1>
                </div>
                <p className="text-gray-600 ml-16">
                    {props.savedjobs.length > 0
                        ? `You have ${props.savedjobs.length} saved ${props.savedjobs.length === 1 ? 'apprenticeship' : 'apprenticeships'}`
                        : "Start saving apprenticeships to build your collection"}
                </p>
            </div>

            {/* Content */}
            {props.savedjobs.length > 0 ? (
                <>
                    {/* Desktop View */}
                    <div className="hidden lg:block">
                        <SavedTable delete={deleteJob} jobs={props.savedjobs} />
                    </div>

                    {/* Mobile View */}
                    <div className="lg:hidden">
                        <div className="flex flex-col gap-4">
                            {props.savedjobs.map((job, index) => (
                                <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                                    <MobileCard
                                        id={job.uid}
                                        logo={job.logo}
                                        title={job.title}
                                        location={job.location}
                                        type={job.type}
                                        category={job.category}
                                    />
                                    <div className="px-4 pb-4 pt-2 border-t border-gray-100 bg-gray-50">
                                        <button
                                            onClick={() => { deleteJob(job.id) }}
                                            className="w-full py-2.5 border-2 border-red-200 text-red-600 rounded-xl font-medium hover:bg-red-50 transition-colors"
                                        >
                                            Remove from Saved
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            ) : (
                // Empty State
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 md:p-16">
                    <div className="max-w-md mx-auto text-center">
                        <div className="flex justify-center mb-6">
                            <div className="relative">
                                <div className="bg-[#14B8A6]/10 rounded-full p-8">
                                    <Bookmark className="text-[#14B8A6]" size={64} strokeWidth={1.5} />
                                </div>
                                <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg">
                                    <Heart className="text-gray-400" size={24} />
                                </div>
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-[#0A1F44] mb-3">
                            No Saved Apprenticeships Yet
                        </h2>

                        <p className="text-gray-600 mb-8 leading-relaxed">
                            Start exploring apprenticeships and save the ones you're interested in.
                            Click the bookmark icon on any listing to add it to your saved collection.
                        </p>

                        <a
                            href="/all-trainings"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-[#14B8A6] text-white rounded-xl font-medium hover:bg-[#0D9488] transition-colors shadow-lg shadow-[#14B8A6]/30"
                        >
                            <Search size={20} />
                            Explore Apprenticeships
                        </a>
                    </div>
                </div>
            )}
        </div>
    )
}
