import { Suspense } from "react";
import SignIn from "./SignIn";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Sign Up | Bloom'
}

export default function Page() {
    return (
        <Suspense>
            <SignIn />
        </Suspense>
    )
}