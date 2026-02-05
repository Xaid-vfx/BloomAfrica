import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

interface AgreementModalProps {
    handleAgreement: () => boolean | void;
    type: number; // 1 = Employer/Trainer, 2 = Apprentice
    showAgreements: boolean;
    setShowAgreements: (show: boolean) => void;
}

const TRAINER_TERMS = [
    "I will provide quality training as described in my apprenticeship posting",
    "I will maintain a safe and respectful learning environment",
    "I will honor all commitments regarding compensation, certificates, and support",
    "I understand Prentis may review my profile and apprenticeship postings",
    "I agree to Prentis' Terms of Service and Privacy Policy"
];

const APPRENTICE_TERMS = [
    "I understand the terms of this apprenticeship program",
    "I commit to attending and participating actively in the training",
    "I will respect the trainer's guidelines and workspace",
    "I understand any fees or commitments outlined in this program",
    "I agree to Prentis' Terms of Service and Privacy Policy"
];

export function AgreementModal({ handleAgreement, type, showAgreements, setShowAgreements }: AgreementModalProps) {
    const [agreementCheckbox, setAgreementCheckbox] = useState(false);

    const handleClick = () => {
        if (agreementCheckbox) {
            const status = handleAgreement();
            if (status) {
                setAgreementCheckbox(false);
            }
        }
    };

    const terms = type === 1 ? TRAINER_TERMS : APPRENTICE_TERMS;
    const title = type === 1 ? "Confirm Your Apprenticeship" : "Confirm Enrollment";
    const buttonText = type === 1 ? "Post Apprenticeship" : "Enroll Now";

    return (
        <Dialog open={showAgreements} onOpenChange={setShowAgreements}>
            <DialogContent className="max-w-sm !bg-white dark:!bg-white p-6 rounded-2xl !border-0 shadow-xl mx-4 w-[calc(100%-2rem)]">
                <div className="text-center mb-4">
                    <h2 className="text-lg font-semibold text-[#1a1a1a]">{title}</h2>
                    <p className="text-xs text-[#666] mt-1">Please review and accept</p>
                </div>

                <div className="space-y-2.5">
                    {terms.map((term, index) => (
                        <div key={index} className="flex items-start gap-2">
                            <CheckCircle2 size={14} className="text-[#14B8A6] flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-[#444] leading-relaxed">{term}</p>
                        </div>
                    ))}
                </div>

                <label className="flex items-center gap-2.5 mt-5 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={agreementCheckbox}
                        onChange={(e) => setAgreementCheckbox(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-[#14B8A6] focus:ring-[#14B8A6] bg-white"
                    />
                    <span className="text-xs text-[#333]">I agree to these terms</span>
                </label>

                <div className="flex gap-2 mt-4">
                    <button
                        onClick={() => setShowAgreements(false)}
                        className="flex-1 py-2.5 text-xs font-medium text-[#666] hover:text-[#333] transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        disabled={!agreementCheckbox}
                        onClick={handleClick}
                        className={`flex-1 py-2.5 text-xs font-medium rounded-lg transition-colors ${
                            agreementCheckbox
                                ? 'bg-[#14B8A6] text-white hover:bg-[#0D9488]'
                                : 'bg-[#f3f3f3] text-[#999] cursor-not-allowed'
                        }`}
                    >
                        {buttonText}
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
