'use client'

import { useSearchParams } from "next/navigation";

export default function TestComp(props) {
    const search = useSearchParams()
    console.log(search.get('id'));

    console.log(props.pr);
    console.log(props.job);
    return (
        <div></div>
    )
}