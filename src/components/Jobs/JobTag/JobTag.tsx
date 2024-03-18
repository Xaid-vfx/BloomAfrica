type JobProps = {
    name: string;
    border: string;
    bg: string;
    color: string;
}

export default function JobTag(props: JobProps) {
    return (
        <div className={`text-xs rounded-3xl p-1 ${props.bg} ${props.color} ${props.border == "yes" ? `border border-[${props.color}]` : ""}`}>
            {props.name}
        </div>
    )
}