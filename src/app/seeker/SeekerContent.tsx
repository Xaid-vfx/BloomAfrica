import Header from "./Header"
import Sidebar from "./Sidebar"

type Props = {
    user: any
    company: any
    seeker: any
    children?: React.ReactNode
}

export default function SeekerContent(props: Props) {
    return (
        <div className="flex w-full">
            <Sidebar />
            <div className="w-full flex flex-col h-screen">
                <Header name={props.seeker?.name} />
                {props.children}
            </div>
        </div>
    )
}