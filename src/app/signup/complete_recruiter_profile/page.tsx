import LeftColomn from "@/components/SignUp/LeftColomn/LeftColomn";
import RightColomnRecruiter from "./RightColumnRecruiter";


export default function CompleteRecruiterProfile() {
    return (
        <div>
            <div className="flex h-screen">
                <LeftColomn />
                <RightColomnRecruiter />
            </div>
        </div>
    )
}