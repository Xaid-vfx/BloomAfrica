import Footer from "@/components/Footer/Footer";
import Navbar from "@/components/Navbar/Navbar";
import Image from "next/image";
import Logo from '../../../assets/images/Jobs/Company Logo.png'
import getAJob from "@/lib/api/getAJob";
import Button from "@/components/Button/Button";
import getUser from "@/lib/api/getUser";
import SaveButton from "@/components/Button/SaveButton";
import SeekerNavbar from "../_components/SeekerNavbar";
import TestComp from "./TestComp";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import JobDescription from "./JobDescription";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Job | Prentis'
}

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