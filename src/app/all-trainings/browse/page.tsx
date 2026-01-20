import type { Metadata } from "next";
import SeekerNavbar from "./seekerNavbar";
import getUser from "@/lib/getUser/getUser";
import Search from "./Search";
import DesktopViewJobs from "./DesktopViewJobs";
import MobileViewJobs from "./MobileViewJobs";

export const metadata: Metadata = {
    title: 'Browse Individual & Artisan Programs | Prentis'
}

export default async function BrowseIndividualPrograms({ params,
    searchParams,
}: {
    params: { slug: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) {

    const user = await getUser()
    const search = searchParams?.search ? searchParams?.search : ''
    const location = searchParams?.location ? searchParams?.location : ''

    return (
        <div>
            <SeekerNavbar user={user || null} />
            <div className="flex flex-col items-center py-0 lg:pb-20 mx-auto justify-center">
                <div className="flex flex-col w-full items-center gap-7 pb-15">
                    <Search />
                </div>

                {/* Mobile view */}
                <MobileViewJobs
                    user={user || null}
                    search={search}
                    location={location}
                />

                {/* Desktop view */}
                <DesktopViewJobs
                    user={user || null}
                    search={search}
                    location={location}
                />
            </div>
        </div>
    )
}
