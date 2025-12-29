'use client'

type JobProps = {
    uid: string;
    title: string;
    type: string;
    location: string;
    category: string;
    company_name?: string;
    isVerified?: boolean;
}

interface Props {
    job: JobProps;
    isSelected: boolean;
    onClick: () => void;
}

export default function CompactJobListItem({ job, isSelected, onClick }: Props) {
    return (
        <div
            onClick={onClick}
            className={`
                flex flex-col p-4 gap-2 border rounded-xl cursor-pointer transition-all
                ${isSelected
                    ? 'border-l-4 border-l-[#0A1F44] bg-[#0A1F44]/5 border-[#0A1F44]/30 shadow-sm'
                    : 'border-gray-200 hover:bg-gray-50 hover:shadow-sm'
                }
            `}
        >
            {/* Verified Badge */}
            {job.isVerified && (
                <span className="text-xs text-[#0A1F44] bg-[#0A1F44]/10 px-2 py-1 rounded-full flex items-center gap-1 w-fit">
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 0L9.86593 1.86593L12.364 1.13407L13.0959 3.63204L15.5939 4.36391L14.862 6.86187L16.728 8.72781L14.862 10.5937L15.5939 13.0917L13.0959 13.8236L12.364 16.3215L9.86593 15.5897L8 17.4556L6.13407 15.5897L3.63611 16.3215L2.90424 13.8236L0.40628 13.0917L1.13815 10.5937L-0.727783 8.72781L1.13815 6.86187L0.40628 4.36391L2.90424 3.63204L3.63611 1.13407L6.13407 1.86593L8 0Z" fill="#0A1F44"/>
                        <path d="M11.0625 6.125L7.0625 10.125L5 8.0625" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Verified
                </span>
            )}

            {/* Job Title */}
            <h3 className="text-base font-semibold text-[#0A1F44] truncate">
                {job.title}
            </h3>

            {/* Company and Location */}
            <div className="flex items-center gap-2 text-sm text-[#515B6F]">
                <span>{job.company_name || "Unknown"}</span>
                <span className="text-gray-400">•</span>
                <div className="flex items-center gap-1">
                    <svg width="14" height="14" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-500">
                        <path d="M10 0C6.13 0 3 3.13 3 7c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/>
                    </svg>
                    <span>{job.location}</span>
                </div>
            </div>

            {/* Badges */}
            <div className="flex gap-2 flex-wrap">
                <div className="rounded-md text-xs px-2 py-1 bg-green-100 text-green-800 font-medium">
                    {job.type}
                </div>
                <div className="rounded-md text-xs px-2 py-1 border border-[#14B8A6]/30 bg-[#14B8A6]/10 text-[#14B8A6] font-medium">
                    {job.category}
                </div>
            </div>
        </div>
    )
}
