import { useState } from "react";
import { MdOutlineEmail } from "react-icons/md";
import { MdPhoneIphone } from "react-icons/md";

export default function ApplicantDisplay(props) {
    const [currTabIndex, setcurrTabIndex] = useState(0)

    return (
        <div className="lg:flex items-start gap-6 h-full">
            <div className="lg:w-[30%] bg-white p-4 pb-2 px-6">
                <div>
                    <h1 className="text-xl text-[#25324B]">{props.applicant?.name}</h1>
                    <p className="text-[#7C8493] text-sm mt-2">Experience</p>
                </div>
                <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700"></hr>
                <div>
                    <h1 className="font-semibold text-lg">Contact</h1>
                    <div className="flex gap-2 my-2 items-stretch text-[#7C8493]">
                        <MdOutlineEmail className="text-xl pt-[2px]" />
                        <div className="text-sm">
                            <div className="mb-1">Email</div>
                            <a href={`mailto:${props.applicant?.email}`} className=" text-[#25324B]">{props.applicant?.email}</a>
                        </div>
                    </div>
                    <div className="flex gap-2 my-2 items-stretch text-[#7C8493]">
                        <MdPhoneIphone className="text-lg pt-[2px]" />
                        <div className="text-sm">
                            <div className="mb-1">Phone</div>
                            <a href={`mailto:${props.applicant?.number}`} className="mt-1 text-[#25324B]">{props.applicant?.number}</a>
                        </div>
                    </div>
                </div>
            </div>
            <hr className="h-px my-3 bg-gray-200 border-0 dark:bg-gray-700 p-0"></hr>
            <div className="bg-white lg:w-[70%]">
                <div className="flex gap-10  text-sm">
                    <div onClick={() => { setcurrTabIndex(0) }} className={`cursor-pointer pb-3 pt-5 px-5 font-semibold ${currTabIndex == 0 ? "border-b-[3px] border-[#4640DE]  text-black" : "text-[#7C8493]"} `}>Applicant Profile</div>
                    <div onClick={() => { setcurrTabIndex(1) }} className={`cursor-pointer pb-3 pt-5 px-5 font-semibold ${currTabIndex == 1 ? "border-b-[3px] border-[#4640DE] text-black" : "text-[#7C8493]"} `}>Resume</div>
                </div>
                <hr className="h-px bg-gray-200 border-0 dark:bg-gray-700"></hr>
                {currTabIndex == 0 ?
                    <div className="px-6 py-6">
                        <div className="">
                            <h1 className="font-semibold text-lg mb-6">Personal Info</h1>
                            <div className="grid grid-cols-2 gap-y-4">
                                <div>
                                    <p className="text-[#7C8493] text-sm">Full Name</p>
                                    <p className="text-sm mt-1 font-medium">{props.applicant?.name}</p>
                                </div>
                                <div>
                                    <p className="text-[#7C8493] text-sm">Gender</p>
                                    <p className="text-sm mt-1 font-medium">{props.applicant?.gender}</p>
                                </div>
                                <div>
                                    <p className="text-[#7C8493] text-sm">Date of Birth</p>
                                    <p className="text-sm mt-1 font-medium">{props.applicant?.dob}</p>
                                </div>
                                <div>
                                    <p className="text-[#7C8493] text-sm">Language</p>
                                    <p className="text-sm mt-1 font-medium">English, Hindi</p>
                                </div>
                                <div>
                                    <p className="text-[#7C8493] text-sm">Address</p>
                                    <p className="text-sm mt-1 font-medium">{props.applicant?.state},  {props.applicant?.country}</p>
                                </div>
                            </div>
                        </div>
                        <hr className="h-px my-6 bg-gray-200 border-0 dark:bg-gray-700"></hr>
                        <div>
                            <h1 className="font-semibold text-lg mb-4">Professional Info</h1>
                            <div>
                                <p className="text-[#7C8493] text-sm">About me</p>
                                <p className="text-sm mt-1 font-[450] leading-6">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Doloremque est eveniet explicabo aliquam nam suscipit repellendus totam rem modi libero blanditiis rerum quas, ipsam architecto error iusto at cum eligendi!</p>
                            </div>
                            <div className="grid mt-4 grid-cols-2 gap-y-4">
                                <div>
                                    <p className="text-[#7C8493] text-sm">Current Job</p>
                                    <p className="text-sm mt-1 font-medium">Product Designer</p>
                                </div>
                                <div>
                                    <p className="text-[#7C8493] text-sm">Experience in Years</p>
                                    <p className="text-sm mt-1 font-medium">$ Years</p>
                                </div>
                                <div>
                                    <p className="text-[#7C8493] text-sm">Highest Qualification</p>
                                    <p className="text-sm mt-1 font-medium">Bachelors</p>
                                </div>
                                <div>
                                    <p className="text-[#7C8493] text-sm">Skills</p>
                                    <p className="text-sm mt-1 font-medium">English, Hindi</p>
                                </div>
                            </div>
                        </div>
                    </div> :
                    <div className="px-6 py-6">
                        <div className="flex gap-4 items-baseline">
                            <p className="font-semibold text-[#515B6F]">Resume/CV</p>
                            <div className="flex gap-4 text-sm font-semibold">
                                <a href={props.experience?.cv} target="_blank" className="text-[#897DD3]">View</a>
                            </div>
                        </div>
                        <hr className="h-px my-6 bg-gray-200 border-0 dark:bg-gray-700"></hr>
                        <div>
                            <p className="mb-4 font-semibold text-[#515B6F]">Cover Letter</p>
                            <div className="flex gap-4 text-sm font-semibold">
                                <p className="text-[#897DD3]">View</p>
                                <p>Download</p>
                            </div>
                        </div>
                    </div>}
            </div>
        </div>
    )
}