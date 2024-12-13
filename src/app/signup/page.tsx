import { Suspense } from "react";
import SignIn from "./SignIn";
import { Metadata } from "next";
import ClientWrapper from "./ClientWrapper"

export const metadata: Metadata = {
    title: 'Sign Up | Bloom'
}

export default function Page() {
    return <ClientWrapper />
}