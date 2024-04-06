'use client'
import AppliedTable from "@/components/General/AppliedTable";

export default function Applied(props) {
    return (
        <div className="pt-8 px-8 bg-[#F5F5F5] h-[95%] w-full">

            <div className="bg-white rounded-xl">
                <h1 className="font-semibold text-2xl px-10 pt-6 pb-3">Recent Applications</h1>
                <AppliedTable jobs={props.appliedjobs} />
            </div>
        </div>
    )
}