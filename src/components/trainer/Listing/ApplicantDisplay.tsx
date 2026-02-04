import { useState } from "react";
import { Mail, Phone, MapPin, Calendar, User, FileText, Download, ExternalLink } from "lucide-react";

export default function ApplicantDisplay(props) {
    const [currTabIndex, setcurrTabIndex] = useState(0)

    const tabs = [
        { label: "Profile", index: 0 },
        { label: "Resume", index: 1 }
    ];

    return (
        <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Sidebar - Contact Card */}
            <div className="lg:w-[280px] flex-shrink-0">
                <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                    {/* Header with Avatar */}
                    <div className="bg-gradient-to-r from-[#0A1F44] to-[#1a3a6e] p-6 text-center">
                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="text-3xl font-bold text-white">
                                {props.applicant?.name?.charAt(0)?.toUpperCase() || "?"}
                            </span>
                        </div>
                        <h2 className="text-xl font-semibold text-white">{props.applicant?.name || "Applicant"}</h2>
                        <p className="text-white/70 text-sm mt-1">Apprentice Applicant</p>
                    </div>

                    {/* Contact Details */}
                    <div className="p-5">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Contact Info</h3>

                        <div className="space-y-4">
                            <a
                                href={`mailto:${props.applicant?.email}`}
                                className="flex items-start gap-3 group"
                            >
                                <div className="w-9 h-9 bg-[#14B8A6]/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#14B8A6]/20 transition-colors">
                                    <Mail size={16} className="text-[#14B8A6]" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs text-gray-500">Email</p>
                                    <p className="text-sm font-medium text-gray-900 truncate group-hover:text-[#14B8A6] transition-colors">
                                        {props.applicant?.email || "Not provided"}
                                    </p>
                                </div>
                            </a>

                            <a
                                href={`tel:${props.applicant?.number}`}
                                className="flex items-start gap-3 group"
                            >
                                <div className="w-9 h-9 bg-[#14B8A6]/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#14B8A6]/20 transition-colors">
                                    <Phone size={16} className="text-[#14B8A6]" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs text-gray-500">Phone</p>
                                    <p className="text-sm font-medium text-gray-900 group-hover:text-[#14B8A6] transition-colors">
                                        {props.applicant?.number || "Not provided"}
                                    </p>
                                </div>
                            </a>

                            {(props.applicant?.state || props.applicant?.country) && (
                                <div className="flex items-start gap-3">
                                    <div className="w-9 h-9 bg-[#14B8A6]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <MapPin size={16} className="text-[#14B8A6]" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs text-gray-500">Location</p>
                                        <p className="text-sm font-medium text-gray-900">
                                            {[props.applicant?.state, props.applicant?.country].filter(Boolean).join(", ") || "Not provided"}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
                <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                    {/* Tabs */}
                    <div className="flex border-b border-gray-200">
                        {tabs.map((tab) => (
                            <button
                                key={tab.index}
                                onClick={() => setcurrTabIndex(tab.index)}
                                className={`px-6 py-4 text-sm font-medium transition-colors relative ${
                                    currTabIndex === tab.index
                                        ? "text-[#14B8A6]"
                                        : "text-gray-500 hover:text-gray-700"
                                }`}
                            >
                                {tab.label}
                                {currTabIndex === tab.index && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#14B8A6]" />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {currTabIndex === 0 ? (
                            <div className="space-y-8">
                                {/* Personal Info Section */}
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <User size={18} className="text-[#14B8A6]" />
                                        <h3 className="text-lg font-semibold text-[#0A1F44]">Personal Information</h3>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <InfoCard label="Full Name" value={props.applicant?.name} />
                                        <InfoCard label="Gender" value={props.applicant?.gender} />
                                        <InfoCard label="Date of Birth" value={props.applicant?.dob} />
                                        <InfoCard
                                            label="Location"
                                            value={[props.applicant?.state, props.applicant?.country].filter(Boolean).join(", ")}
                                        />
                                    </div>
                                </div>

                                {/* About Section */}
                                {props.applicant?.bio && (
                                    <div>
                                        <div className="flex items-center gap-2 mb-4">
                                            <FileText size={18} className="text-[#14B8A6]" />
                                            <h3 className="text-lg font-semibold text-[#0A1F44]">About</h3>
                                        </div>
                                        <div className="bg-gray-50 rounded-xl p-4">
                                            <p className="text-gray-700 leading-relaxed">{props.applicant?.bio}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Resume/CV Section */}
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <FileText size={18} className="text-[#14B8A6]" />
                                        <h3 className="text-lg font-semibold text-[#0A1F44]">Resume / CV</h3>
                                    </div>

                                    {props.experience?.cv ? (
                                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-[#14B8A6]/10 rounded-lg flex items-center justify-center">
                                                    <FileText size={20} className="text-[#14B8A6]" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">Resume Document</p>
                                                    <p className="text-sm text-gray-500">Click to view or download</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <a
                                                    href={props.experience?.cv}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1.5 px-4 py-2 bg-[#14B8A6] hover:bg-[#0D9488] text-white text-sm font-medium rounded-lg transition-colors"
                                                >
                                                    <ExternalLink size={14} />
                                                    View
                                                </a>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-8 text-center">
                                            <FileText size={32} className="text-gray-400 mx-auto mb-2" />
                                            <p className="text-gray-500">No resume uploaded</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

// Helper component for info cards
function InfoCard({ label, value }: { label: string; value?: string }) {
    return (
        <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{label}</p>
            <p className="text-sm font-medium text-gray-900">{value || "Not provided"}</p>
        </div>
    );
}
