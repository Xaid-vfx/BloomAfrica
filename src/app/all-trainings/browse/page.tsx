import type { Metadata } from "next";
import SeekerNavbar from "./seekerNavbar";
import getUser from "@/lib/getUser/getUser";
import Search from "./Search";
import TrackSwitcher from "./TrackSwitcher";
import DesktopViewJobs from "./DesktopViewJobs";
import MobileViewJobs from "./MobileViewJobs";
import Footer from "@/components/Footer/Footer";

export const metadata: Metadata = {
    title: 'Browse Apprenticeship Programs | Prentis'
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
    const track = (searchParams?.track as 'artisan' | 'company') || 'artisan'

    return (
        <div>
            <SeekerNavbar user={user || null} />
            <div className="flex flex-col items-center py-0 lg:pb-20 mx-auto justify-center">
                <div className="flex flex-col w-full items-center gap-7 pb-8">
                    <Search />
                    <TrackSwitcher initialTrack={track} />
                </div>

                {/* Mobile view */}
                <MobileViewJobs
                    user={user || null}
                    search={search}
                    location={location}
                    track={track}
                />

                {/* Desktop view */}
                <DesktopViewJobs
                    user={user || null}
                    search={search}
                    location={location}
                    track={track}
                />
            </div>
            <Footer />
        </div>
    )
}
