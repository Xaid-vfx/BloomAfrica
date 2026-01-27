type JobListingCardProps = {
    title: string;
    location: string;
    salary: string;
}

export default function JobListingCard(props: JobListingCardProps) {
    return (
        <div className="px-10 py-8 flex justify-between items-center border rounded-lg">
            <div className="">
                <div className="text-xl font-semibold">{props.title}</div>
                <div className="text-sm">{props.location}</div>
            </div>
            <div>
                {props.salary}
            </div>
        </div>
    )
}