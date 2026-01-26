'use client'

import Image from "next/image"
import { MapPin, Monitor, Award, Clock, DollarSign, Image as ImageIcon, Calendar, GraduationCap } from 'lucide-react'

type JobProps = {
    uid: string;
    title: string;
    type: string;
    location: string;
    category: string;
    description: string;
    duration?: string;
    signup_fee?: number;
    company_name?: string;
    isVerified?: boolean;
    provides_certificate?: boolean;
    training_mode?: string;
    deadline?: string;
    start_date?: string;
    apprenticeship_level?: string;
    Recruiters?: {
        CompanyInfo?: {
            name: string;
            logo: string;
        }
    }
}

interface Props {
    job: JobProps;
    onClick: () => void;
}

export default function CompanyGridCard({ job, onClick }: Props) {
    const companyName = job.Recruiters?.CompanyInfo?.name || job.company_name || "Unknown"
    const companyLogo = job.Recruiters?.CompanyInfo?.logo
    const fee = job.signup_fee && job.signup_fee > 0
        ? `₦${Number(job.signup_fee).toLocaleString('en-NG')}`
        : "Free"

    const formatDate = (dateString?: string) => {
        if (!dateString) return null
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    return (
        <div
            onClick={onClick}
            className="
                flex flex-col bg-white border border-gray-200 rounded-xl cursor-pointer
                transition-all duration-200 hover:border-[#14B8A6] hover:shadow-lg
                overflow-hidden h-full
            "
        >
            {/* Header: Logo + Company */}
            <div className="flex items-center gap-3 p-4 border-b border-gray-100">
                <div className="flex-shrink-0 w-12 h-12 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden">
                    {companyLogo ? (
                        <Image
                            src={companyLogo}
                            alt={companyName}
                            width={48}
                            height={48}
                            className="object-contain w-full h-full"
                        />
                    ) : (
                        <ImageIcon className="w-6 h-6 text-gray-400" />
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{companyName}</p>
                    {job.isVerified && (
                        <span className="text-xs text-[#14B8A6] bg-[#14B8A6]/10 px-2 py-0.5 rounded-full inline-flex items-center gap-1 mt-1">
                            <svg width="10" height="10" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8 0L9.86593 1.86593L12.364 1.13407L13.0959 3.63204L15.5939 4.36391L14.862 6.86187L16.728 8.72781L14.862 10.5937L15.5939 13.0917L13.0959 13.8236L12.364 16.3215L9.86593 15.5897L8 17.4556L6.13407 15.5897L3.63611 16.3215L2.90424 13.8236L0.40628 13.0917L1.13815 10.5937L-0.727783 8.72781L1.13815 6.86187L0.40628 4.36391L2.90424 3.63204L3.63611 1.13407L6.13407 1.86593L8 0Z" fill="#14B8A6"/>
                                <path d="M11.0625 6.125L7.0625 10.125L5 8.0625" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Verified
                        </span>
                    )}
                </div>
            </div>

            {/* Job Title & Location */}
            <div className="px-4 pt-4 pb-3">
                <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2">
                    {job.title}
                </h3>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                        <MapPin size={14} className="text-gray-400" />
                        <span className="truncate">{job.location}</span>
                    </div>
                    {job.training_mode && (
                        <>
                            <span className="text-gray-300">|</span>
                            <div className="flex items-center gap-1">
                                <Monitor size={14} className="text-gray-400" />
                                <span>{job.training_mode}</span>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Description Preview */}
            <div className="px-4 pb-3 flex-1">
                <p className="text-sm text-gray-600 line-clamp-2">
                    {job.description}
                </p>
            </div>

            {/* Badges Row */}
            <div className="px-4 pb-3">
                <div className="flex gap-1.5 flex-wrap">
                    <span className="rounded-md text-xs px-2 py-1 bg-green-100 text-green-800 font-medium">
                        {job.type}
                    </span>
                    <span className="rounded-md text-xs px-2 py-1 border border-[#14B8A6]/30 bg-[#14B8A6]/10 text-[#14B8A6] font-medium">
                        {job.category}
                    </span>
                    {job.apprenticeship_level && (
                        <span className="rounded-md text-xs px-2 py-1 border border-[#0A1F44]/30 bg-[#0A1F44]/10 text-[#0A1F44] font-medium flex items-center gap-1">
                            <GraduationCap size={10} />
                            {job.apprenticeship_level}
                        </span>
                    )}
                    {job.provides_certificate && (
                        <span className="rounded-md text-xs px-2 py-1 border border-[#14B8A6]/30 bg-[#14B8A6]/10 text-[#14B8A6] font-medium flex items-center gap-1">
                            <Award size={10} />
                            Certificate
                        </span>
                    )}
                </div>
            </div>

            {/* Dates Row */}
            {(job.deadline || job.start_date) && (
                <div className="px-4 pb-3">
                    <div className="flex items-center gap-4 text-xs text-gray-600">
                        {job.deadline && (
                            <div className="flex items-center gap-1">
                                <Calendar size={12} className="text-orange-500" />
                                <span className="text-gray-500">Apply by:</span>
                                <span className="font-medium text-gray-700">{formatDate(job.deadline)}</span>
                            </div>
                        )}
                        {job.start_date && (
                            <div className="flex items-center gap-1">
                                <Calendar size={12} className="text-[#14B8A6]" />
                                <span className="text-gray-500">Starts:</span>
                                <span className="font-medium text-gray-700">{formatDate(job.start_date)}</span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Footer: Fee & Duration */}
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 mt-auto">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                        <DollarSign size={14} className="text-[#14B8A6]" />
                        <span className={`text-sm font-semibold ${fee === "Free" ? "text-[#14B8A6]" : "text-gray-900"}`}>
                            {fee}
                        </span>
                    </div>
                    {job.duration && (
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Clock size={14} className="text-gray-400" />
                            <span>{job.duration}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
