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

export default function JobListCard({ job, onClick }: Props) {
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
                flex items-start gap-4 p-4 bg-white border border-gray-200 rounded-xl cursor-pointer
                transition-all duration-200 hover:border-[#14B8A6] hover:shadow-md
            "
        >
            {/* Logo */}
            <div className="flex-shrink-0 w-14 h-14 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden">
                {companyLogo ? (
                    <Image
                        src={companyLogo}
                        alt={companyName}
                        width={56}
                        height={56}
                        className="object-contain w-full h-full"
                    />
                ) : (
                    <ImageIcon className="w-7 h-7 text-gray-400" />
                )}
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
                {/* Header Row */}
                <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-base font-semibold text-gray-900 truncate">
                                {job.title}
                            </h3>
                            {job.isVerified && (
                                <span className="text-xs text-[#14B8A6] bg-[#14B8A6]/10 px-2 py-0.5 rounded-full inline-flex items-center gap-1 flex-shrink-0">
                                    <svg width="10" height="10" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M8 0L9.86593 1.86593L12.364 1.13407L13.0959 3.63204L15.5939 4.36391L14.862 6.86187L16.728 8.72781L14.862 10.5937L15.5939 13.0917L13.0959 13.8236L12.364 16.3215L9.86593 15.5897L8 17.4556L6.13407 15.5897L3.63611 16.3215L2.90424 13.8236L0.40628 13.0917L1.13815 10.5937L-0.727783 8.72781L1.13815 6.86187L0.40628 4.36391L2.90424 3.63204L3.63611 1.13407L6.13407 1.86593L8 0Z" fill="#14B8A6"/>
                                        <path d="M11.0625 6.125L7.0625 10.125L5 8.0625" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    Verified
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-gray-600">{companyName}</p>
                    </div>

                    {/* Fee */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                        <DollarSign size={14} className="text-[#14B8A6]" />
                        <span className={`text-sm font-semibold ${fee === "Free" ? "text-[#14B8A6]" : "text-gray-900"}`}>
                            {fee}
                        </span>
                    </div>
                </div>

                {/* Meta Row */}
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3 flex-wrap">
                    <div className="flex items-center gap-1">
                        <MapPin size={14} className="text-gray-400" />
                        <span>{job.location}</span>
                    </div>
                    {job.training_mode && (
                        <div className="flex items-center gap-1">
                            <Monitor size={14} className="text-gray-400" />
                            <span>{job.training_mode}</span>
                        </div>
                    )}
                    {job.duration && (
                        <div className="flex items-center gap-1">
                            <Clock size={14} className="text-gray-400" />
                            <span>{job.duration}</span>
                        </div>
                    )}
                    {job.start_date && (
                        <div className="flex items-center gap-1">
                            <Calendar size={12} className="text-[#14B8A6]" />
                            <span>Starts: {formatDate(job.start_date)}</span>
                        </div>
                    )}
                    {job.deadline && (
                        <div className="flex items-center gap-1">
                            <Calendar size={12} className="text-orange-500" />
                            <span>Apply by: {formatDate(job.deadline)}</span>
                        </div>
                    )}
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 line-clamp-1 mb-3">
                    {job.description}
                </p>

                {/* Badges */}
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
        </div>
    )
}
