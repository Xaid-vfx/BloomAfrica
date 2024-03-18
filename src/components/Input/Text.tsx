'use client'

type Props = {
    field: string;
    type: string;
    handleChange: any;
    placeholder: string;
    value: string;
    extra: string
}

export default function TextInput(props: Props) {
    return (
        <div>
            <p className="font-semibold text-xs my-1 text-[#515B6F]">{props.field}</p>
            {props.extra != "read" ?
                <input value={props.value} className="px-4 py-3 rounded-lg border placeholder:text-xs w-full text-xs" type={props.type} placeholder={props.placeholder} onChange={(e) => { props.handleChange(e) }} /> :
                <input value={props.value} className="px-4 py-3 rounded-lg border placeholder:text-xs w-full text-xs" type={props.type} placeholder={props.placeholder} onChange={(e) => { props.handleChange(e) }} readOnly />}
        </div>
    )
}