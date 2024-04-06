import { useState } from "react"

export default function EditInput(props) {
    const [value, setvalue] = useState(props.value)

    return (
        <div className="w-1/2">
            <h2 className="mb-1 font-medium ">{props.title}</h2>
            <input onChange={(e) => { setvalue(e.target.value); props.onChange() }} value={value} type="text" className="w-full border rounded-lg px-4 py-2 text-sm" />
        </div>
    )
}