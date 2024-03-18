'use client'

type Props = {
    field: string;
    type: string;
    handleChange: any;
    placeholder: string;
}

export default function OptionsInput(props: Props) {
    return (
        <div>
            <p className="font-semibold text-xs my-1 text-[#515B6F]">{props.field}</p>
            <select className="bg-white px-4 py-3 rounded-lg border placeholder:text-xs text-xs w-full">
                <option>Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
            </select>
        </div>
    )
}