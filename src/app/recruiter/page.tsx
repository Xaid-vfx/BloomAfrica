import RecruiterContent from "@/components/Recruiter/RecruiterContent/RecruiterContent";
import getCompany from "@/lib/getCompany/getCompany";
import getUser from "@/lib/getUser/getUser";


export default async function Recruiter() {
    const user = await getUser();
    const company = await getCompany(user?.id)

    return (
        <div>
            <RecruiterContent user={user} company={company} />
        </div>
    )
}