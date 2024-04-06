type Props = {
    name: string
}

export default function Header(props: Props) {
    return (
        <div>
            <div className="px-8 py-4 flex justify-between items-center">
                <div>
                    <p className="text-sm">Good Morning</p>
                    <p className="font-semibold">{props.name}</p>
                </div>
                <a href="/all-jobs"><button className="text-xs text-white bg-[#4A2C84] py-3 px-6 rounded-xl font-semibold">Explore Jobs</button></a>
            </div>
            <hr className="h-px bg-gray-200 border-0"></hr>
        </div>
    )
}