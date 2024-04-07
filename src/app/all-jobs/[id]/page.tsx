import Footer from "@/components/Footer/Footer";
import Navbar from "@/components/navbar/Navbar";
import Image from "next/image";
import Logo from '../../../assets/images/Jobs/Company Logo.png'
import getAJob from "@/lib/getAJob/getAJob";
import Button from "@/components/Button/Button";
import getUser from "@/lib/getUser/getUser";
import SaveButton from "@/components/Button/SaveButton";
import SeekerNavbar from "../seekerNavbar";
import TestComp from "./TestComp";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import JobDescription from "./JobDescription";

export default async function Page({ params,
    searchParams,
}: {
    params: { slug: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) {

    const job = await getAJob(searchParams?.id)
    const user = await getUser()

    return (
        <div>
            <SeekerNavbar user={user} />
            <TestComp job={job} pr={searchParams?.id} />
            <JobDescription user={user} />
            <Footer />
        </div>
    )
}