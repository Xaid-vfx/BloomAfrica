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
        <div className="flex flex-col bg-[#F5F5F5] h-screen   ">
            <div>
                <Header name={props.seeker?.name} />
            </div>
            <div className='flex flex-row lg:gap-5 mx-5 h-full '>
                <div className="h-full w-[20%]">
                    <Sidebar />
                </div>
                <div className="w-[80%] flex flex-col max-h-[calc(100vh-95px)]">
                    {props.children}
                </div>
            </div>
            
        </div>
    )
}