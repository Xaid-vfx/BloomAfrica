'use client'
import { useEffect, useState } from "react";
import Header from "../Header/Header";
import Listing from "../Listing/Listing";
import Sidebar from "../Sidebar/Sidebar";
import Dashboard from "../Dashboard/Dashboard";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

type Props = {
    user: any
    company: any
    recruiter: any
}

export default function RecruiterContent(props: Props) {
    console.log(props.user);

    const supabase = createClientComponentClient()
    const [jobs, setjobs]: any = useState([])

    const [currTabIndex, setcurrTabIndex] = useState(0);
    function handleChangeTabIndex(index: any) {
        setcurrTabIndex(index)
    }


    useEffect(() => {
        async function fetchJobs() {
            const { data, error } = await supabase
                .from('Jobs')
                .select()
                .eq('recruiter', props.user.id)

            return data;
        }
        fetchJobs().then(data => {
            setjobs(data)
        })
    }, [])
    return (
        <div className="flex">
            <Sidebar handleChangeTabIndex={(e: any) => {
                handleChangeTabIndex(e)
            }} currTabIndex={currTabIndex} />

            <div className="w-full flex flex-col h-screen">
                <Header name={props.company ? props.company[0]?.name : ""} />

                {currTabIndex == 0 ?
                    <Dashboard user={props.user} company={props.company} jobs={jobs} recruiter={props.recruiter} /> : ""}
                {currTabIndex == 1 ?
                    <div className="border h-screen p-20">Messages</div>
                    : ""}
                {currTabIndex == 2 ?
                    <div className="border h-screen p-20">Company Profile</div>
                    : ""}
                {currTabIndex == 3 ?
                    <Listing user={props.user} jobs={jobs} />
                    : ""}
            </div>
        </div>
    )
}