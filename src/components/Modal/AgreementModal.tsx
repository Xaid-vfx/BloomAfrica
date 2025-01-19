import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";
import { MoonLoader } from "react-spinners";

export function AgreementModal(props) {

    const [agreementCheckbox, setAgreementCheckbox] = useState(false)
    const [numPages, setNumPages] = useState<number>();
    const [loading, setloading] = useState(true);
    const handleClick = () => {
        if (agreementCheckbox) {
            const status = props.handleAgreement()
            if (status) {
                setAgreementCheckbox(false)
            }
        }
    }
    function onDocumentLoadSuccess({ numPages: nextNumPages }: PDFDocumentProxy): void {
        setNumPages(nextNumPages);
    }

    return (
        <Dialog open={props.showAgreements} onOpenChange={props.setShowAgreements}>
            <DialogContent className="block lg:w-[80%] h-[90%] w-[80%] max-w-none">
                <DialogHeader>
                    <DialogTitle>{props.type == 1 ? "Employers" : "Apprentice"} Agreement</DialogTitle>
                </DialogHeader>

                <div className="w-full h-[85%] py-4 overflow-x-hidden overflow-y-auto">
                    {loading &&
                        <div className="flex justify-center items-center h-full w-full absolute">
                            <MoonLoader />
                        </div>}
                    <iframe
                        className="w-full h-full"
                        onLoad={() => {
                            setloading(false)
                        }}
                        src={props.type == 1 ? "https://chfxemferwohrffljtjv.supabase.co/storage/v1/object/public/Docs/Agreement/Oga_Trainer%20Agreement.pdf" : "https://chfxemferwohrffljtjv.supabase.co/storage/v1/object/public/Docs/Agreement/Apprentice%20Agreement.pdf"}
                        style={{ border: 'none' }}
                    />
                </div>
                <div className="flex gap-2 mb-2">
                    <input onChange={(e) => { setAgreementCheckbox(e.target.checked) }} type="checkbox" />
                    <p className="text-xs md:text-sm">I agree to the following terms and conditions</p>
                </div>
                <Button disabled={!agreementCheckbox} onClick={handleClick} className={`bg-[#4A2C84] px-16 w-full md:w-auto ${agreementCheckbox ? "" : "cursor-not-allowed"}`} type="submit">
                    {props.type == 1 ? "Post" : "Apply"}
                </Button>
            </DialogContent>
        </Dialog>
    )
}