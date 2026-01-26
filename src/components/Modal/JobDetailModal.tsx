'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import JobDetailPanel from "@/components/Jobs/JobDetailPanel/JobDetailPanel"

interface JobDetailModalProps {
    isOpen: boolean
    onClose: () => void
    jobId: string | null
    user: any
}

export function JobDetailModal({ isOpen, onClose, jobId, user }: JobDetailModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="w-[95vw] max-w-[1200px] h-[90vh] overflow-y-auto p-0 rounded-xl bg-white border-gray-200">
                {/* Visually hidden title and description for accessibility */}
                <DialogHeader className="sr-only">
                    <DialogTitle>Job Details</DialogTitle>
                    <DialogDescription>View job details and enroll</DialogDescription>
                </DialogHeader>
                <div className="p-6 bg-white text-gray-900">
                    <JobDetailPanel jobId={jobId} user={user} />
                </div>
            </DialogContent>
        </Dialog>
    )
}
