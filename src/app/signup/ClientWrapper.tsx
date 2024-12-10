'use client'

import { Suspense } from "react"
import SignIn from "./SignIn"

export default function ClientWrapper() {
    return (
        <Suspense>
            <SignIn />
        </Suspense>
    )
} 